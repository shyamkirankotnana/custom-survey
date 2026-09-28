import { supabase } from '@/lib/supabase';

export interface ResponseRecord {
  id: string;
  token_id: string;
  response_json: Record<string, any>;
  submitted_at: string;
  survey_tokens?: {
    token: string;
    status: string;
    generated_at?: string;
    opened_at?: string;
    completed_at?: string;
  } | null;
}

export const responseService = {
  /**
   * Fetch response summary metrics from vw_response_summary
   */
  async getSummaryMetrics() {
    try {
      const { data, error } = await supabase
        .from('vw_response_summary')
        .select('*')
        .maybeSingle();

      if (error || !data) {
        const { count: totalResponses } = await supabase.from('survey_responses').select('*', { count: 'exact', head: true });
        const { count: totalTokens } = await supabase.from('survey_tokens').select('*', { count: 'exact', head: true });
        const { count: totalCompleted } = await supabase.from('survey_tokens').select('*', { count: 'exact', head: true }).eq('status', 'completed');
        const { count: totalOpened } = await supabase.from('survey_tokens').select('*', { count: 'exact', head: true }).eq('status', 'opened');

        return {
          total_responses: totalResponses || 0,
          total_tokens: totalTokens || 0,
          total_opened: totalOpened || 0,
          total_completed: totalCompleted || 0,
          completed_today: 0,
        };
      }

      return data;
    } catch (err) {
      console.error('[ResponseService] Summary metrics error:', err);
      return { total_responses: 0, total_tokens: 0, total_opened: 0, total_completed: 0, completed_today: 0 };
    }
  },

  /**
   * Fetch all survey responses joined with token metadata
   */
  async getAllResponses(limit: number = 200): Promise<ResponseRecord[]> {
    try {
      const { data, error } = await supabase
        .from('survey_responses')
        .select(`
          id,
          token_id,
          response_json,
          submitted_at,
          survey_tokens ( token, status, generated_at, opened_at, completed_at )
        `)
        .order('submitted_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('[ResponseService] Error fetching responses:', error);
        return [];
      }

      return (data as any[]) || [];
    } catch (err) {
      console.error('[ResponseService] Unexpected error:', err);
      return [];
    }
  },

  /**
   * Fetch a single response by UUID
   */
  async getResponseById(id: string): Promise<ResponseRecord | null> {
    try {
      const { data, error } = await supabase
        .from('survey_responses')
        .select(`
          id,
          token_id,
          response_json,
          submitted_at,
          survey_tokens ( token, status, generated_at, opened_at, completed_at )
        `)
        .eq('id', id)
        .maybeSingle();

      if (error || !data) return null;
      return data as any;
    } catch (err) {
      console.error('[ResponseService] Error fetching response by ID:', err);
      return null;
    }
  },
};
