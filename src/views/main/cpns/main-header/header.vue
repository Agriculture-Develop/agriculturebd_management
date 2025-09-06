<script setup lang="ts">
import { Expand, Fold } from '@element-plus/icons-vue'
import { ref } from 'vue'

import info from './info.vue'

const emit = defineEmits(['foldChange'])
const isFold = ref(false)

const handleMenuIconClick = () => {
  isFold.value = !isFold.value

  // 发送折叠事件
  emit('foldChange', isFold.value)
}
</script>

<template>
  <div class="main-header">
    <div class="menu-icon" @click="handleMenuIconClick">
      <el-icon>
        <component :is="isFold ? Expand : Fold" size="28px" />
      </el-icon>
    </div>

    <div class="content">
      <div class="breadcrumbs">
        <!-- <el-breadcrumb separator-icon="ArrowRight">
          <template v-for="item in crumbs">
            <el-breadcrumb-item :to="{ path: item.path }">{{ item.name }}</el-breadcrumb-item>
          </template>
</el-breadcrumb> -->
      </div>

      <info />
    </div>
  </div>
</template>

<style lang="less" scoped>
.main-header {
  display: flex;
  flex: 1;
  height: 100%;
  align-items: center;

  .menu-icon {
    display: flex;
    cursor: pointer;
    padding-right: 5px;
  }

  .content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
  }
}
</style>
