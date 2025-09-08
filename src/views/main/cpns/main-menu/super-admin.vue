<script setup lang="ts">
import router from '@/router'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// 处理菜单项点击
const handleItemClick = (path: string) => {
  router.push(path)
}

// 默认展开菜单
defineProps({ isFold: { type: Boolean, default: false } })

// 当前激活的菜单项
const route = useRoute()
const defaultActive = computed(() => route.path)
</script>

<template>
  <div class="main-menu">
    <div class="logo">
      <img src="@/assets/img/logo.svg" alt="" />
      <h2 class="title" v-show="!isFold">农产品后台管理系统</h2>
    </div>

    <div class="menu">
      <el-menu
        :default-active="defaultActive"
        :collapse="isFold"
        text-color="#b7bdc3"
        active-text-color="#fff"
        background-color="#001529"
      >
        <!-- 首页 -->
        <el-menu-item
          index="/super-admin/dashboard"
          @click="handleItemClick('/super-admin/dashboard')"
        >
          <el-icon>
            <House />
          </el-icon>
          <span>首页</span>
        </el-menu-item>

        <!-- 用户管理 -->
        <el-menu-item index="/super-admin/user" @click="handleItemClick('/super-admin/user')">
          <el-icon>
            <User />
          </el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/super-admin/post" @click="handleItemClick('/super-admin/post')">
          <el-icon>
            <User />
          </el-icon>
          <span>帖子管理</span>
        </el-menu-item>
        <!-- 新闻管理 -->
        <el-sub-menu index="/super-admin/news">
          <template #title>
            <el-icon>
              <Document />
            </el-icon>
            <span>新闻管理</span>
          </template>

          <!-- 撰写新闻 -->
          <el-menu-item
            index="/super-admin/news/write"
            @click="handleItemClick('/super-admin/news/write')"
          >
            撰写新闻
          </el-menu-item>

          <!-- 草稿箱 -->
          <el-menu-item
            index="/super-admin/news/drafts"
            @click="handleItemClick('/super-admin/news/drafts')"
          >
            草稿箱
          </el-menu-item>

          <!-- 新闻分类 -->
          <el-menu-item
            index="/super-admin/news/category"
            @click="handleItemClick('/super-admin/news/category')"
          >
            新闻分类
          </el-menu-item>
        </el-sub-menu>

        <!-- 审核管理 -->
        <el-sub-menu index="/super-admin/audit">
          <template #title>
            <el-icon>
              <Check />
            </el-icon>
            <span>审核管理</span>
          </template>

          <!-- 审核新闻 -->
          <!-- <el-menu-item
            index="/super-admin/audit/news"
            @click="handleItemClick('/super-admin/audit/news')"
          >
            审核新闻
          </el-menu-item> -->

          <!-- 审核列表 -->
          <el-menu-item
            index="/super-admin/audit/list"
            @click="handleItemClick('/super-admin/audit/list')"
          >
            审核列表
          </el-menu-item>
        </el-sub-menu>

        <!-- 发布管理 -->
        <el-sub-menu index="/super-admin/publish">
          <template #title>
            <el-icon>
              <Upload />
            </el-icon>
            <span>发布管理</span>
          </template>

          <!-- 未发布 -->
          <!-- <el-menu-item
            index="/super-admin/publish/unpublished"
            @click="handleItemClick('/super-admin/publish/unpublished')"
          >
            未发布
          </el-menu-item> -->

          <!-- 已发布 -->
          <!-- <el-menu-item
            index="/super-admin/publish/published"
            @click="handleItemClick('/super-admin/publish/published')"
          >
            已发布
          </el-menu-item> -->

          <!-- 已下线 -->
          <el-menu-item
            index="/super-admin/publish/offline"
            @click="handleItemClick('/super-admin/publish/offline')"
          >
            发布列表
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>
  </div>
</template>

<style lang="less" scoped>
.main-menu {
  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;

    img {
      width: 30px;
      height: 30px;
    }

    .title {
      color: #fff;
      font-size: 16px;
      line-height: 50px;
      margin-left: 10px;

      // 设置隐藏文字
      overflow: hidden;
      white-space: nowrap;
    }
  }

  .el-menu {
    border-right: none;
    user-select: none;

    .el-sub-menu {
      .el-menu-item {
        padding-left: 50px !important;
        background-color: #0c2135;
      }

      .el-menu-item:hover {
        color: #fff;
      }

      .el-menu-item.is-active {
        background-color: #0a60bd;
      }
    }
  }
}
</style>
