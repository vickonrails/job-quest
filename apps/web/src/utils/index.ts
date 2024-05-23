import { env } from '@/env.mjs';

export function isAIFeatureEnabled() {
    return env.NEXT_PUBLIC_AI_FEATURES_ENABLED === 'true'
}