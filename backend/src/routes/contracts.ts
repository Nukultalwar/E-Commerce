import { z } from 'zod';

/**
 * SmartDeal AI - API response/contract scaffolding (scaffolding-first).
 *
 * NOTE: These are runtime-validatable schemas using zod so frontend/backends
 * can converge on stable payload structures before full AI wiring.
 *
 * Endpoints may be implemented in separate routes while this file keeps
 * the response contracts consistent.
 */

// ---------- AI Assistant (streaming-ready contract) ----------

export const AiAssistantRequestSchema = z.object({
  prompt: z.string().min(1),
  context: z.record(z.unknown()).optional(),
});

export const AiAssistantRecommendationSchema = z.object({
  title: z.string(),
  rationale: z.string().optional(),
  confidence: z.number().min(0).max(1).optional(),
  compatibilityHints: z.array(z.string()).optional(),
  dealHints: z.array(z.string()).optional(),
});

export const AiAssistantResponseSchema = z.object({
  prompt: z.string(),
  recommendations: z.array(AiAssistantRecommendationSchema),
  insights: z.array(z.string()),
  followUp: z.string().optional(),
  // streaming-ready (if/when we add SSE)
  stream: z
    .object({
      enabled: z.boolean().optional(),
      chunkCountEstimate: z.number().optional(),
    })
    .optional(),
});

export type AiAssistantRequest = z.infer<typeof AiAssistantRequestSchema>;
export type AiAssistantResponse = z.infer<typeof AiAssistantResponseSchema>;

// ---------- Intent Search Contract ----------

export const IntentSearchRequestSchema = z.object({
  query: z.string().min(1),
  location: z.string().optional(),
  language: z.string().optional(),
});

export const IntentParsedSchema = z.object({
  intentType: z.enum(['buy', 'compare', 'bundle', 'deal', 'browse']).default('buy'),
  budgetMax: z.number().optional(),
  categoryHint: z.string().optional(),
  useCaseHints: z.array(z.string()).optional(),
  constraints: z.array(z.string()).optional(),
});

export const IntentSearchRefinementSchema = z.object({
  label: z.string(),
  facet: z.string(),
  value: z.string(),
});

export const ProductSearchResultSchema = z.object({
  slug: z.string(),
  title: z.string(),
  category: z.string().optional(),
  currentPrice: z.number().optional(),
  rating: z.number().optional(),
  sellerTrustScore: z.number().optional(),
  shortDescription: z.string().optional(),
});

export const IntentSearchResponseSchema = z.object({
  query: z.string(),
  parsedIntent: IntentParsedSchema,
  refinements: z.array(IntentSearchRefinementSchema),
  results: z.array(ProductSearchResultSchema),
  trace: z
    .object({
      model: z.string().optional(),
      strategy: z.string().optional(),
      confidence: z.number().min(0).max(1).optional(),
    })
    .optional(),
});

export type IntentSearchRequest = z.infer<typeof IntentSearchRequestSchema>;
export type IntentSearchResponse = z.infer<typeof IntentSearchResponseSchema>;

// ---------- Price History Contract ----------

export const PriceHistoryPointSchema = z.object({
  timestamp: z.coerce.date(),
  price: z.number(),
});

export const PriceHistoryResponseSchema = z.object({
  slug: z.string(),
  granularity: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  points: z.array(PriceHistoryPointSchema),
});

export type PriceHistoryResponse = z.infer<typeof PriceHistoryResponseSchema>;

// ---------- Deal Analyzer Contract ----------

export const DealDecisionSchema = z.enum(['buy_now', 'wait', 'alternative']);

export const DealAnalyzerResponseSchema = z.object({
  slug: z.string(),
  decision: DealDecisionSchema,
  confidence: z.number().min(0).max(1),
  currentPrice: z.number(),
  averageHistoricalPrice: z.number(),
  sellerTrust: z.number().optional(),
  reasons: z.array(z.string()),
  nextStep: z.string().optional(),
  suggestedAlternativeSlugs: z.array(z.string()).optional(),
});

export type DealAnalyzerResponse = z.infer<typeof DealAnalyzerResponseSchema>;

// ---------- Security / Sessions Contracts ----------

export const SessionInfoSchema = z.object({
  sessionId: z.string().optional(),
  device: z.string(),
  ip: z.string().optional(),
  location: z.string().optional(),
  startedAt: z.coerce.date(),
  lastSeenAt: z.coerce.date().optional(),
  suspicious: z.boolean(),
});

export const SecurityAlertSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  type: z.enum(['new_device', 'velocity', 'geo_mismatch', '2fa_required', 'password_change']).optional(),
  severity: z.enum(['low', 'medium', 'high']).default('medium'),
  message: z.string(),
  relatedSessionDevice: z.string().optional(),
});

export const ActiveSessionsResponseSchema = z.object({
  email: z.string(),
  sessions: z.array(SessionInfoSchema),
  alerts: z.array(SecurityAlertSchema),
});

export type ActiveSessionsResponse = z.infer<typeof ActiveSessionsResponseSchema>;

