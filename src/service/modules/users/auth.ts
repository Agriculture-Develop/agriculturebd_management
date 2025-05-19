import createSvcRequest from '@/service/request'
import type NetResponse from '@/service/request/response'
import { userPath } from '@/service/request/types'
import type { ILoginByPwdRequest, ILoginResponse } from './types'

// 创建 auth 实例
const authSvc = createSvcRequest(userPath)

export function LoginByPwdSvc(account: ILoginByPwdRequest) {
  return authSvc.POST<NetResponse<ILoginResponse>>({
    url: '/login',
    data: account,
  })
}
