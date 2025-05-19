import router from '@/router'
import { LoginByPwdSvc } from '@/service/modules/users/auth'
import type { ILoginByPwdRequest } from '@/service/modules/users/types'
import { localCache } from '@/utils/cache/cache'
import { Account_TOKEN, User_ROLE } from '@/utils/cache/keys'
import { defineStore } from 'pinia'

// 指定store的类型
interface ILoginState {
  token: string
  userInfo: any
  role: number
}

const useLoginStore = defineStore('login', {
  state: (): ILoginState => ({
    token: localCache.getCache(Account_TOKEN) ?? '',
    userInfo: {},
    role: localCache.getCache(User_ROLE) ?? [],
  }),

  actions: {
    async loginByPwdAction(account: ILoginByPwdRequest) {
      const loginResult = await LoginByPwdSvc(account)
      // 处理请求结果

      // token缓存
      this.token = loginResult.data.token
      localCache.setCache(Account_TOKEN, loginResult.data.token)

      // 动态添加路由
      // const routes = mapMenusToRoutes(this.userMenus)
      // routes.forEach((route) => router.addRoute('main', route))

      // 获取列表数据
      const listDataStore = useDataListStore()
      listDataStore.fetchEntireDataAction()

      // 根据权限进行跳转
      if (this.role === 1) {
        router.push('/super-admin/dashboard')
      } else {
        router.push('/admin/dashboard')
      }

      return loginResult
    },
  },
})

export default useLoginStore
