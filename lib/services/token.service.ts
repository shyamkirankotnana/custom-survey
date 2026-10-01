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

    // Mock bypass for testtoken testing URL
    if (token === 'testtoken') {
      return { valid: true, status: 'pending' };
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
    if (token === 'testtoken') return true;

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
   * Save survey response JSON and mark token as completed
   */
  async submitResponse(token: string, responseJson: Record<string, any>) {
    try {
      // 1. Validate token & fetch token record
      const { data: tokenRecord, error: tokenErr } = await supabase
        .from('survey_tokens')
        .select('id, status, opened_at')
        .eq('token', token)
        .maybeSingle();

      if (tokenErr || !tokenRecord) {
        return { success: false, error: 'Invalid or non-existent survey token.' };
      }

      if (tokenRecord.status === 'completed') {
        return { success: false, error: 'This survey has already been completed.' };
      }

      if (tokenRecord.status === 'expired') {
        return { success: false, error: 'This survey token has expired.' };
      }

      // 2. Insert into survey_responses table
      const { data: responseData, error: insertErr } = await supabase
        .from('survey_responses')
        .insert({
          token_id: tokenRecord.id,
          response_json: responseJson,
          submitted_at: new Date().toISOString(),
        })
        .select('id, submitted_at')
        .single();

      if (insertErr) {
        console.error('[TokenService] Insert response error:', insertErr);
        return { success: false, error: 'Failed to save survey response to database.' };
      }

      // 3. Mark token as completed & ensure opened_at is populated if previously null
      const nowIso = new Date().toISOString();
      const updatePayload: any = {
        status: 'completed',
        completed_at: nowIso,
      };
      if (!tokenRecord.opened_at) {
        updatePayload.opened_at = nowIso;
      }

      const { error: updateErr } = await supabase
        .from('survey_tokens')
        .update(updatePayload)
        .eq('token', token);

      if (updateErr) {
        console.error('[TokenService] Update completed status error:', updateErr);
      }

      return {
        success: true,
        responseId: responseData.id,
        submittedAt: responseData.submitted_at,
      };
    } catch (err: any) {
      console.error('[TokenService] Unexpected error during response submission:', err);
      return { success: false, error: err?.message || 'Error processing survey submission.' };
    }
  },

  /**
   * Batch generate survey links and store into survey_tokens (supports large batches via chunking)
   */
  async generateBatch(count: number = 100) {
    const records = Array.from({ length: count }).map(() => ({
      token: nanoid(10),
      status: 'pending',
    }));

    const CHUNK_SIZE = 1000;
    const allInserted: any[] = [];

    for (let i = 0; i < records.length; i += CHUNK_SIZE) {
      const chunk = records.slice(i, i + CHUNK_SIZE);
      const { data, error } = await supabase
        .from('survey_tokens')
        .insert(chunk)
        .select('id, token, status, generated_at');

      if (error) {
        console.error('[TokenService] Batch generation error:', error);
        throw error;
      }
      if (data) {
        allInserted.push(...data);
      }
    }

    return allInserted;
  },

  /**
   * Fetch batch generation history from SQL View vw_batch_summary
   */
  async getBatchHistory() {
    try {
      const { data, error } = await supabase
        .from('vw_batch_summary')
        .select('*');

      if (!error && data && data.length > 0) {
        return data.map((b: any, idx: number) => ({
          id: b.batch_time,
          batchNumber: data.length - idx,
          timestamp: new Date(b.batch_time).toLocaleString(),
          count: Number(b.total_links) || 0,
          pendingCount: Number(b.pending_count) || 0,
          openedCount: Number(b.opened_count) || 0,
          completedCount: Number(b.completed_count) || 0,
          sampleToken: b.sample_token || '',
        }));
      }
      return null;
    } catch (err) {
      console.error('[TokenService] Error fetching batch history:', err);
      return null;
    }
  },

  /**
   * Fetch all tokens for admin view (default limit 10,000)
   */
  async getAllTokens(limit: number = 10000) {
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
