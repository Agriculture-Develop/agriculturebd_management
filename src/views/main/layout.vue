<script setup lang="ts">
import router from '@/router';
import { localCache } from '@/utils/cache/cache';
import { Account_USER, User_ROLE } from '@/utils/cache/keys';

import mainHeader from './cpns/main-header/header.vue';
import AdminMenu from './cpns/main-menu/admin.vue';
import SuperAdminMenu from './cpns/main-menu/super-admin.vue';

import { computed, ref } from 'vue';

const OnLoginOutBtn = () => {
  // 清缓存
  localCache.removeCache(Account_USER)

  // 跳转
  router.push('/login')
}

// 处理折叠
const isCollapse = ref(false)
const handleFoldChange = (isFold: boolean) => {
  console.log(isFold)
  isCollapse.value = isFold
}

// 从缓存里获取角色
const role = localCache.getCache(User_ROLE)

// 根据角色确定显示哪个菜单组件
const isSuperAdmin = computed(() => role === 1)
</script>



<template>
  <div class="main">

    <el-container class="main-container">
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 根据角色选择显示不同的菜单 -->
        <SuperAdminMenu v-if="isSuperAdmin" :is-fold="isCollapse" />
        <AdminMenu v-else :is-fold="isCollapse" />
      </el-aside>

      <el-container>
        <el-header height="50px">
          <main-header @fold-change="handleFoldChange"></main-header>
        </el-header>

        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>

    </el-container>

    <button @click="OnLoginOutBtn">退出按钮</button>


  </div>
</template>



<style lang="less" scoped>
.main-container {
  height: 100vh;


  .el-aside {
    overflow-x: hidden;
    overflow-y: auto;
    line-height: 200px;
    text-align: left;
    cursor: pointer;
    background-color: #001529;
    scrollbar-width: none;
    /* firefox */
    -ms-overflow-style: none;
    /* IE 10+ */

    transition: width 0.3s ease;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .el-main {
    background-color: #f0f2f5;
  }
}
</style>
