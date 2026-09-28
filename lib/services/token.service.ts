import { supabase } from '@/lib/supabase';
import { nanoid } from 'nanoid';

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

  /**
   * Batch generate NanoIDs and store into survey_tokens
   */
  async generateBatch(count: number = 100) {
    const records = Array.from({ length: count }).map(() => ({
      token: nanoid(10),
      status: 'pending',
    }));

    const { data, error } = await supabase
      .from('survey_tokens')
      .insert(records)
      .select('id, token, status, generated_at');

    if (error) {
      console.error('[TokenService] Batch generation error:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Fetch all tokens for admin view
   */
  async getAllTokens(limit: number = 200) {
    const { data, error } = await supabase
      .from('survey_tokens')
      .select('*')
      .order('generated_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[TokenService] Error fetching tokens:', error);
      return [];
    }

    return data || [];
  },

  /**
   * Reset test token status back to pending (for dev testing)
   */
  async resetTokenStatus(token: string) {
    const { error } = await supabase
      .from('survey_tokens')
      .update({ status: 'pending', opened_at: null, completed_at: null })
      .eq('token', token);

    return !error;
  },
};
