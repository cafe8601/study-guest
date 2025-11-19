/**
 * Simple in-memory rate limiter
 * For production, use Redis-based rate limiting (Upstash, Vercel KV, etc.)
 */

interface RateLimitEntry {
    count: number
    resetTime: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

// Cleanup old entries every 10 minutes
setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of rateLimitMap.entries()) {
        if (now > entry.resetTime) {
            rateLimitMap.delete(key)
        }
    }
}, 10 * 60 * 1000)

export interface RateLimitConfig {
    maxRequests: number
    windowMs: number
}

export interface RateLimitResult {
    success: boolean
    limit: number
    remaining: number
    reset: number
}

/**
 * Check if a request is within rate limits
 * @param identifier - Unique identifier (e.g., IP address, user ID)
 * @param config - Rate limit configuration
 * @returns Rate limit result
 */
export function rateLimit(
    identifier: string,
    config: RateLimitConfig
): RateLimitResult {
    const now = Date.now()
    const entry = rateLimitMap.get(identifier)

    if (!entry || now > entry.resetTime) {
        // First request or window expired
        const resetTime = now + config.windowMs
        rateLimitMap.set(identifier, { count: 1, resetTime })
        return {
            success: true,
            limit: config.maxRequests,
            remaining: config.maxRequests - 1,
            reset: resetTime,
        }
    }

    if (entry.count >= config.maxRequests) {
        // Rate limit exceeded
        return {
            success: false,
            limit: config.maxRequests,
            remaining: 0,
            reset: entry.resetTime,
        }
    }

    // Increment count
    entry.count++
    rateLimitMap.set(identifier, entry)

    return {
        success: true,
        limit: config.maxRequests,
        remaining: config.maxRequests - entry.count,
        reset: entry.resetTime,
    }
}

/**
 * Get client IP address from request headers
 */
export function getClientIp(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')

    if (forwarded) {
        return forwarded.split(',')[0].trim()
    }

    if (realIp) {
        return realIp
    }

    return 'unknown'
}
