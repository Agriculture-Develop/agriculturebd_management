import { localCache } from '@/utils/cache/cache'
import { User_ROLE } from '@/utils/cache/keys'
import { createRouter, createWebHistory } from 'vue-router'
import { adminRoutes, superAdminRoutes } from './router'

// 基础路由配置
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/not-found/not-found.vue'),
    },
    {
      path: '/login',
      component: () => import('@/views/auth/auth.vue'),
    },
    ...superAdminRoutes,
    ...adminRoutes,
  ],
})

// TODO: 静态页面测试选择角色(1:超级管理员,2:管理员)
localCache.setCache(User_ROLE, 2)

// 导航守卫
router.beforeEach((to) => {
  // 获取用户角色
  const role = localCache.getCache(User_ROLE)

  // 如果未登录且访问的不是登录页，则重定向到登录页
  if (!role && to.path !== '/login') {
    return '/login'
  }

  // 根据角色重定向
  if (to.path === '/') {
    if (role === 1) {
      return '/super-admin/dashboard'
    } else {
      return '/admin/dashboard'
    }
  }

  // 路径权限控制
  if (role === 1 && to.path.startsWith('/admin')) {
    return '/super-admin/dashboard'
  } else if (role === 2 && to.path.startsWith('/super-admin')) {
    return '/admin/dashboard'
  }
})

export default router
