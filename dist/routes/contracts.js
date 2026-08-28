"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveSessionsResponseSchema = exports.SecurityAlertSchema = exports.SessionInfoSchema = exports.DealAnalyzerResponseSchema = exports.DealDecisionSchema = exports.PriceHistoryResponseSchema = exports.PriceHistoryPointSchema = exports.IntentSearchResponseSchema = exports.ProductSearchResultSchema = exports.IntentSearchRefinementSchema = exports.IntentParsedSchema = exports.IntentSearchRequestSchema = exports.AiAssistantResponseSchema = exports.AiAssistantRecommendationSchema = exports.AiAssistantRequestSchema = void 0;
const zod_1 = require("zod");
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
exports.AiAssistantRequestSchema = zod_1.z.object({
    prompt: zod_1.z.string().min(1),
    context: zod_1.z.record(zod_1.z.unknown()).optional(),
});
exports.AiAssistantRecommendationSchema = zod_1.z.object({
    title: zod_1.z.string(),
    rationale: zod_1.z.string().optional(),
    confidence: zod_1.z.number().min(0).max(1).optional(),
    compatibilityHints: zod_1.z.array(zod_1.z.string()).optional(),
    dealHints: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.AiAssistantResponseSchema = zod_1.z.object({
    prompt: zod_1.z.string(),
    // matches current backend + frontend payload shape
    recommendation: zod_1.z.string(),
    insights: zod_1.z.array(zod_1.z.string()),
    followUp: zod_1.z.string().optional(),
    // streaming-ready (if/when we add SSE)
    stream: zod_1.z
        .object({
        enabled: zod_1.z.boolean().optional(),
        chunkCountEstimate: zod_1.z.number().optional(),
    })
        .optional(),
});
// ---------- Intent Search Contract ----------
exports.IntentSearchRequestSchema = zod_1.z.object({
    query: zod_1.z.string().min(1),
    location: zod_1.z.string().optional(),
    language: zod_1.z.string().optional(),
});
exports.IntentParsedSchema = zod_1.z.object({
    intentType: zod_1.z.enum(['buy', 'compare', 'bundle', 'deal', 'browse']).default('buy'),
    budgetMax: zod_1.z.number().optional(),
    categoryHint: zod_1.z.string().optional(),
    useCaseHints: zod_1.z.array(zod_1.z.string()).optional(),
    constraints: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.IntentSearchRefinementSchema = zod_1.z.object({
    label: zod_1.z.string(),
    facet: zod_1.z.string(),
    value: zod_1.z.string(),
});
exports.ProductSearchResultSchema = zod_1.z.object({
    slug: zod_1.z.string(),
    title: zod_1.z.string(),
    category: zod_1.z.string().optional(),
    currentPrice: zod_1.z.number().optional(),
    rating: zod_1.z.number().optional(),
    sellerTrustScore: zod_1.z.number().optional(),
    shortDescription: zod_1.z.string().optional(),
});
exports.IntentSearchResponseSchema = zod_1.z.object({
    query: zod_1.z.string(),
    parsedIntent: exports.IntentParsedSchema,
    refinements: zod_1.z.array(exports.IntentSearchRefinementSchema),
    results: zod_1.z.array(exports.ProductSearchResultSchema),
    trace: zod_1.z
        .object({
        model: zod_1.z.string().optional(),
        strategy: zod_1.z.string().optional(),
        confidence: zod_1.z.number().min(0).max(1).optional(),
    })
        .optional(),
});
// ---------- Price History Contract ----------
exports.PriceHistoryPointSchema = zod_1.z.object({
    timestamp: zod_1.z.coerce.date(),
    price: zod_1.z.number(),
});
exports.PriceHistoryResponseSchema = zod_1.z.object({
    slug: zod_1.z.string(),
    granularity: zod_1.z.enum(['daily', 'weekly', 'monthly', 'yearly']),
    points: zod_1.z.array(exports.PriceHistoryPointSchema),
});
// ---------- Deal Analyzer Contract ----------
exports.DealDecisionSchema = zod_1.z.enum(['buy_now', 'wait', 'alternative']);
exports.DealAnalyzerResponseSchema = zod_1.z.object({
    slug: zod_1.z.string(),
    decision: exports.DealDecisionSchema,
    confidence: zod_1.z.number().min(0).max(1),
    currentPrice: zod_1.z.number(),
    averageHistoricalPrice: zod_1.z.number(),
    sellerTrust: zod_1.z.number().optional(),
    reasons: zod_1.z.array(zod_1.z.string()),
    nextStep: zod_1.z.string().optional(),
    suggestedAlternativeSlugs: zod_1.z.array(zod_1.z.string()).optional(),
});
// ---------- Security / Sessions Contracts ----------
exports.SessionInfoSchema = zod_1.z.object({
    sessionId: zod_1.z.string().optional(),
    device: zod_1.z.string(),
    ip: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    startedAt: zod_1.z.coerce.date(),
    lastSeenAt: zod_1.z.coerce.date().optional(),
    suspicious: zod_1.z.boolean(),
});
exports.SecurityAlertSchema = zod_1.z.object({
    id: zod_1.z.string(),
    createdAt: zod_1.z.coerce.date(),
    type: zod_1.z.enum(['new_device', 'velocity', 'geo_mismatch', '2fa_required', 'password_change']).optional(),
    severity: zod_1.z.enum(['low', 'medium', 'high']).default('medium'),
    message: zod_1.z.string(),
    relatedSessionDevice: zod_1.z.string().optional(),
});
exports.ActiveSessionsResponseSchema = zod_1.z.object({
    email: zod_1.z.string(),
    sessions: zod_1.z.array(exports.SessionInfoSchema),
    alerts: zod_1.z.array(exports.SecurityAlertSchema),
});
