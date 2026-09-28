import { supabase } from '@/lib/supabase';

export const analyticsService = {
  /**
   * Fetch NPS summary metrics & calculate Net Promoter Score
   */
  async getNpsAnalytics() {
    try {
      const { data, error } = await supabase
        .from('vw_nps_summary')
        .select('*')
        .maybeSingle();

      if (error || !data) {
        // Fallback Javascript aggregation
        const { data: responses } = await supabase.from('survey_responses').select('response_json');
        let promoters = 0;
        let passives = 0;
        let detractors = 0;
        let total = responses?.length || 0;

        (responses || []).forEach((r: any) => {
          const score = r.response_json?.npsScore ?? r.response_json?.nps;
          if (score !== undefined && score !== null) {
            if (score >= 9) promoters++;
            else if (score >= 7) passives++;
            else detractors++;
          }
        });

        const npsScore = total > 0 ? Math.round(((promoters / total) - (detractors / total)) * 100) : 0;
        return { promoters, passives, detractors, total_responses: total, nps_score: npsScore };
      }

      const total = Number(data.total_responses) || 0;
      const promoters = Number(data.promoters) || 0;
      const detractors = Number(data.detractors) || 0;
      const passives = Number(data.passives) || 0;
      const npsScore = total > 0 ? Math.round(((promoters / total) - (detractors / total)) * 100) : 0;

      return {
        promoters,
        passives,
        detractors,
        total_responses: total,
        nps_score: npsScore,
      };
    } catch (err) {
      console.error('[AnalyticsService] Error fetching NPS analytics:', err);
      return { promoters: 0, passives: 0, detractors: 0, total_responses: 0, nps_score: 0 };
    }
  },

  /**
   * Fetch Funnel Performance Metrics (Generated -> Opened -> Completed)
   */
  async getFunnelMetrics() {
    try {
      const { data, error } = await supabase
        .from('vw_funnel_summary')
        .select('*')
        .maybeSingle();

      if (!error && data) {
        const genCount = Number(data.generated) || 0;
        const openCount = Number(data.opened) || 0;
        const compCount = Number(data.completed) || 0;

        const openRate = genCount > 0 ? Math.round((openCount / genCount) * 100) : 0;
        const completionRate = openCount > 0 ? Math.round((compCount / openCount) * 100) : 0;

        return {
          generated_links: genCount,
          opened_links: openCount,
          completed_responses: compCount,
          open_rate: openRate,
          completion_rate: completionRate,
        };
      }

      // Fallback if view doesn't exist yet
      const { count: generatedLinks } = await supabase.from('survey_tokens').select('*', { count: 'exact', head: true });
      const { count: openedLinks } = await supabase.from('survey_tokens').select('*', { count: 'exact', head: true }).in('status', ['opened', 'completed']);
      const { count: completedResponses } = await supabase.from('survey_tokens').select('*', { count: 'exact', head: true }).eq('status', 'completed');

      const genCount = generatedLinks || 0;
      const openCount = openedLinks || 0;
      const compCount = completedResponses || 0;

      const openRate = genCount > 0 ? Math.round((openCount / genCount) * 100) : 0;
      const completionRate = openCount > 0 ? Math.round((compCount / openCount) * 100) : 0;

      return {
        generated_links: genCount,
        opened_links: openCount,
        completed_responses: compCount,
        open_rate: openRate,
        completion_rate: completionRate,
      };
    } catch (err) {
      console.error('[AnalyticsService] Error fetching funnel metrics:', err);
      return { generated_links: 0, opened_links: 0, completed_responses: 0, open_rate: 0, completion_rate: 0 };
    }
  },
};
