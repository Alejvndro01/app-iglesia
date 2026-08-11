import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Fallback en memoria si no existen credenciales de Upstash Redis configuradas
class MemoryRatelimit {
  private requests = new Map<string, { count: number; expiresAt: number }>();

  async limit(identifier: string, limitCount = 5, windowMs = 60000) {
    const now = Date.now();
    const record = this.requests.get(identifier);

    if (!record || now > record.expiresAt) {
      this.requests.set(identifier, { count: 1, expiresAt: now + windowMs });
      return { success: true, remaining: limitCount - 1 };
    }

    if (record.count >= limitCount) {
      return { success: false, remaining: 0 };
    }

    record.count += 1;
    return { success: true, remaining: limitCount - record.count };
  }
}

const hasRedisEnv =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

// Permite un máximo de 5 mensajes por minuto por usuario/IP
export const limiter = hasRedisEnv
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, '1 m'),
      analytics: true,
    })
  : new MemoryRatelimit();