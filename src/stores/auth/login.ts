import router from '@/router'
import { LoginByPwdSvc } from '@/service/modules/users/auth'

import { localCache } from '@/utils/cache/cache'
import { Account_TOKEN, User_ROLE } from '@/utils/cache/keys'
import { useRequest } from 'alova/client'
import { defineStore } from 'pinia'

import { ref } from 'vue'
export const useLoginStore = defineStore('login', () => {
  // 状态
  const token = ref(localCache.getCache(Account_TOKEN) ?? '')
  const userInfo = ref<any>({})
  const role = ref(localCache.getCache(User_ROLE) ?? [])
  const { send } = useRequest(Apis.general.post_auth_login_pwd, {
    immediate: false,
  })

  const loginByPwd = async (account: { phone: string; password: string }) => {
    console.log(account)

    const res = await send({ data: account }) // 返回类型自动是 LoginData
    console.log(res.data.token)
    localCache.setCache('token', res.data.token)
    router.push('/super-admin/dashboard')

    // if (role.value === 1) {
    //   router.push('/super-admin/dashboard')
    // } else {
    //   router.push('/admin/dashboard')
    // }
  }
  // const loginByPwd = async (account: {}) => {
  //   const loginResult = await LoginByPwdSvc(account)
  //   token.value = loginResult.data.token
  //   localCache.setCache(Account_TOKEN, loginResult.data.token)

  // 获取列表数据
  // const listDataStore = useDataListStore()
  // listDataStore.fetchEntireDataAction()

  // 根据权限跳转
  // if (role.value === 1) {
  //   router.push('/super-admin/dashboard')
  // } else {
  //   router.push('/admin/dashboard')
  // }
  // return loginResult
  // }

  return {
    token,
    userInfo,
    role,
    loginByPwd,
  }
})

export default useLoginStore
