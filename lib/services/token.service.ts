import { supabase } from '@/lib/supabase';

export interface TokenValidationResult {
  valid: boolean;
  status: 'pending' | 'opened' | 'completed' | 'expired' | 'invalid';
  message?: string;
  tokenData?: any;
}

export const tokenService = {
  /**
   * Validate token existence and status in survey_tokens table
   */
  async validateToken(token: string): Promise<TokenValidationResult> {
    if (!token) {
      return { valid: false, status: 'invalid', message: 'No survey token provided.' };
    }

    try {
      const { data, error } = await supabase
        .from('survey_tokens')
        .select('*')
        .eq('token', token)
        .maybeSingle();

      if (error || !data) {
        return { valid: false, status: 'invalid', message: 'The survey link is invalid or no longer available.' };
      }

      if (data.status === 'completed') {
        return {
          valid: false,
          status: 'completed',
          message: 'This survey has already been completed.',
          tokenData: data,
        };
      }

      if (data.status === 'expired') {
        return {
          valid: false,
          status: 'expired',
          message: 'This survey link has expired.',
          tokenData: data,
        };
      }

      // Valid token (status === 'pending' or 'opened')
      return {
        valid: true,
        status: data.status,
        tokenData: data,
      };
    } catch (err: any) {
      console.error('[TokenService] Validation error:', err);
      return { valid: false, status: 'invalid', message: 'Error validating survey link.' };
    }
  },

  /**
   * Mark token as opened (if currently 'pending') and update opened_at timestamp
   */
  async markOpened(token: string): Promise<boolean> {
    try {
      const { data } = await supabase
        .from('survey_tokens')
        .select('status')
        .eq('token', token)
        .maybeSingle();

      if (data && data.status === 'pending') {
        const { error } = await supabase
          .from('survey_tokens')
          .update({
            status: 'opened',
            opened_at: new Date().toISOString(),
          })
          .eq('token', token);

        if (error) {
          console.error('[TokenService] Failed to mark token as opened:', error);
          return false;
        }
      }
      return true;
    } catch (err) {
      console.error('[TokenService] Unexpected error marking token as opened:', err);
      return false;
    }
  },
};
