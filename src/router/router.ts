// 超级管理员路由，根路径为 /super-admin
export const superAdminRoutes = [
  {
    path: '/super-admin',
    name: 'super-admin',
    component: () => import('@/views/main/layout.vue'),
    redirect: '/super-admin/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'super-admin-dashboard',
        component: () => import('@/views/super-admin/dashboard/dashboard.vue'),
      },
      {
        path: 'user',
        name: 'super-admin-user',
        component: () => import('@/views/super-admin/user/user.vue'),
      },
      //帖子管理路由
      {
        path: 'post',
        name: 'super-admin-post',
        component: () => import('@/views/super-admin/post/post.vue'),
      },
      // 新闻管理路由
      {
        path: 'news',
        name: 'super-admin-news',
        redirect: '/super-admin/news/write',
        children: [
          {
            path: 'write',
            name: 'super-admin-news-write',
            component: () => import('@/views/super-admin/news/write/write.vue'),
          },
          {
            path: 'drafts',
            name: 'super-admin-news-drafts',
            component: () => import('@/views/super-admin/news/drafts/drafts.vue'),
          },
          {
            path: 'category',
            name: 'super-admin-news-category',
            component: () => import('@/views/super-admin/news/category/category.vue'),
          },
        ],
      },
      // 审核管理路由
      {
        path: 'audit',
        name: 'super-admin-audit',
        redirect: '/super-admin/audit/news',
        children: [
          {
            path: 'news',
            name: 'super-admin-audit-news',
            component: () => import('@/views/super-admin/audit/news/audit-news.vue'),
          },
          {
            path: 'list',
            name: 'super-admin-audit-list',
            component: () => import('@/views/super-admin/audit/list/audit-list.vue'),
          },
        ],
      },
      // 发布管理路由
      {
        path: 'publish',
        name: 'super-admin-publish',
        redirect: '/super-admin/publish/unpublished',
        children: [
          {
            path: 'unpublished',
            name: 'super-admin-publish-unpublished',
            component: () => import('@/views/super-admin/publish/unpublished/unpublished.vue'),
          },
          {
            path: 'published',
            name: 'super-admin-publish-published',
            component: () => import('@/views/super-admin/publish/published/published.vue'),
          },
          {
            path: 'offline',
            name: 'super-admin-publish-offline',
            component: () => import('@/views/super-admin/publish/offline/offline.vue'),
          },
        ],
      },
    ],
  },
]

// 普通管理员路由，根路径为 /admin
export const adminRoutes = [
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/views/main/layout.vue'),
    redirect: '/admin/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('@/views/admin/dashboard/dashboard.vue'),
      },
      // 新闻管理路由
      {
        path: 'news',
        name: 'admin-news',
        redirect: '/admin/news/write',
        children: [
          {
            path: 'write',
            name: 'admin-news-write',
            component: () => import('@/views/admin/news/write/write.vue'),
          },
          {
            path: 'drafts',
            name: 'admin-news-drafts',
            component: () => import('@/views/admin/news/drafts/drafts.vue'),
          },
          {
            path: 'category',
            name: 'admin-news-category',
            component: () => import('@/views/admin/news/category/category.vue'),
          },
        ],
      },
      // 审核管理路由
      {
        path: 'audit',
        name: 'admin-audit',
        redirect: '/admin/audit/list',
        children: [
          {
            path: 'list',
            name: 'admin-audit-list',
            component: () => import('@/views/admin/audit/list/audit-list.vue'),
          },
        ],
      },
      // 发布管理路由
      {
        path: 'publish',
        name: 'admin-publish',
        redirect: '/admin/publish/unpublished',
        children: [
          {
            path: 'unpublished',
            name: 'admin-publish-unpublished',
            component: () => import('@/views/admin/publish/unpublished/unpublished.vue'),
          },
          {
            path: 'published',
            name: 'admin-publish-published',
            component: () => import('@/views/admin/publish/published/published.vue'),
          },
          {
            path: 'offline',
            name: 'admin-publish-offline',
            component: () => import('@/views/admin/publish/offline/offline.vue'),
          },
        ],
      },
    ],
  },
]
