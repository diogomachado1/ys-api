import Redis from '@lib/Redis';

class Cache {
  protected keyPrefix!: string;

  get Redis() {
    return Redis;
  }

  getKey(projectId: string) {
    return `${projectId}:${this.keyPrefix}`;
  }

  invalidatesCreateKeys(projectId: string) {
    return [{ key: `${this.getKey(projectId)}:all`, type: 'ONE' }];
  }

  invalidateUpdateKeys(projectId: string, id: string) {
    return [
      { key: `${this.getKey(projectId)}:all`, type: 'ONE' },
      { key: `${this.getKey(projectId)}:${id}`, type: 'ONE' },
    ];
  }

  async getCache(projectId: string, key: string) {
    return Redis.get(`${this.getKey(projectId)}:${key}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async setCache(projectId: string, key: string, data: any) {
    await Redis.set(`${this.getKey(projectId)}:${key}`, data);
  }

  async invalidateCreate(projectId: string) {
    return this.invalidation(this.invalidatesCreateKeys(projectId));
  }

  async invalidateUpdate(projectId: string, id: string) {
    return this.invalidation(this.invalidateUpdateKeys(projectId, id));
  }

  async invalidation(invalidateKeyArray: { key: string; type: string }[]) {
    return Promise.all(
      invalidateKeyArray.map(async ({ key, type }) => {
        if (type === 'MANY') {
          await Redis.invalidatePrefix(key);
        } else {
          await Redis.invalidate(key);
        }
      })
    );
  }
}

export default Cache;
