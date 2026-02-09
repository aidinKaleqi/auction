import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';
import { ConfigService } from '@nestjs/config';

enum CircuitState {
  CLOSED = 'closed',
  OPEN = 'open',
  HALF_OPEN = 'half_open',
}

@Injectable()
export class CacheRepository implements OnModuleDestroy {
  private readonly redisClient: Redis;
  private circuit: CircuitState = CircuitState.CLOSED;
  private lastFailureTime = 0;
  private readonly retryTimeout = 5000;

  constructor(private readonly config: ConfigService) {
    const options: RedisOptions = {
      host: config.get('CACHE_HOST'),
      port: Number(config.get('CACHE_PORT')),
      db: Number(config.get('CACHE_DB_NUMBER')),
    };
    if (config.get('SERVICE_MODE') == 'prod') {
      options['password'] = config.get('CACHE_PASS');
    }
    this.redisClient = new Redis(options);
    this.redisClient.on('error', (err) => {
      console.error('Redis Error:', err);
      this.openCircuit();
    });
  }

  private openCircuit() {
    if (this.circuit !== CircuitState.OPEN) {
      console.warn('Redis circuit opened');
    }
    this.circuit = CircuitState.OPEN;
    this.lastFailureTime = Date.now();
  }

  private async tryRecover(): Promise<boolean> {
    if (this.circuit !== CircuitState.OPEN) return true;
    if (Date.now() - this.lastFailureTime > this.retryTimeout) {
      this.circuit = CircuitState.HALF_OPEN;
      try {
        await this.redisClient.ping();
        this.circuit = CircuitState.CLOSED;
        console.log('Redis recovered, circuit closed');
        return true;
      } catch {
        this.lastFailureTime = Date.now();
        this.circuit = CircuitState.OPEN;
        console.warn('Redis still down, circuit remains open');
        return false;
      }
    }

    return false;
  }

  private async safeRun<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
    if (!(await this.tryRecover())) return fallback;
    try {
      return await fn();
    } catch (err) {
      this.openCircuit();
      return fallback;
    }
  }

  async set(key: string, value: string, time?: number): Promise<boolean> {
    return this.safeRun<boolean>(async () => {
      const result = time
        ? await this.redisClient.setex(key, time, value)
        : await this.redisClient.set(key, value);
      return result === 'OK';
    }, false);
  }

  async getTtl(key: string): Promise<number> {
    return this.safeRun<number>(() => this.redisClient.ttl(key), -2);
  }

  async get(key: string): Promise<string | null> {
    return this.safeRun<string | null>(() => this.redisClient.get(key), null);
  }

  async delete(key: string): Promise<boolean> {
    return this.safeRun<boolean>(
      () => this.redisClient.del(key).then(() => true),
      false,
    );
  }

  async onModuleDestroy(): Promise<void> {
    await this.redisClient.quit();
  }
}
