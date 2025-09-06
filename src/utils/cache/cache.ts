enum CacheType {
  Local,
  Session,
}

class Cache {
  storage: Storage

  constructor(type: CacheType) {
    this.storage = type === CacheType.Local ? localStorage : sessionStorage
  }

  setCache(key: string, value: any) {
    if (typeof value === 'string') {
      this.storage.setItem(key, value)
    } else {
      this.storage.setItem(key, JSON.stringify(value))
    }
  }
  getCache<T = any>(key: string): T | null {
    const value = this.storage.getItem(key)
    if (!value) return null

    try {
      return JSON.parse(value)
    } catch {
      // 如果不是 JSON 格式，直接返回原值（说明存的是 string）
      return value as unknown as T
    }
  }

  removeCache(key: string) {
    this.storage.removeItem(key)
  }

  clear() {
    this.storage.clear()
  }
}

const localCache = new Cache(CacheType.Local) // 本地缓存
const sessionCache = new Cache(CacheType.Session) // 会话缓存(当前会话有效)

export { localCache, sessionCache }
