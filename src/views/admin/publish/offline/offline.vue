<template>
  <div class="offline-container">
    <h1>已下线新闻</h1>

    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" ref="searchFormRef">
        <el-form-item label="新闻标题">
          <el-input v-model="searchForm.title" placeholder="请输入新闻标题"></el-input>
        </el-form-item>
        <el-form-item label="下线时间">
          <el-date-picker v-model="searchForm.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :style="{ backgroundColor: primaryColor }" @click="searchNewsList">搜索</el-button>
          <el-button @click="resetSearch(searchFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card">
      <div class="table-wrapper">
        <el-table :data="newsList" style="width: 100%" border>
          <el-table-column prop="title" label="新闻标题" width="260" />
          <el-table-column prop="category" label="分类" width="120" />
          <el-table-column prop="author" label="作者" width="120" />
          <el-table-column prop="offlineTime" label="下线时间" width="180" />
          <el-table-column prop="offlineReason" label="下线原因" width="200" />
          <el-table-column label="操作" width="180">
            <template #default="scope">
              <el-button size="small" :style="{ backgroundColor: secondaryColor, color: '#fff' }"
                @click="viewNews(scope.row)">
                查看
              </el-button>
              <el-button size="small" type="success" :style="{ backgroundColor: primaryColor }"
                @click="republishNews(scope.row)">
                重新发布
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="pagination-container">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
    </el-card>

    <!-- 重新发布确认对话框 -->
    <el-dialog v-model="republishDialogVisible" title="重新发布确认" width="400px">
      <p>确定要重新发布这条新闻吗？重新发布后将在前台展示。</p>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="republishDialogVisible = false">取消</el-button>
          <el-button type="primary" :style="{ backgroundColor: primaryColor }" @click="confirmRepublish">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus';
import { ElMessage } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';

// 定义农产品相关的主题绿色
const primaryColor = '#2e8b57'; // 海绿色
const secondaryColor = '#3cb371'; // 中等海绿色

// 搜索表单
const searchForm = reactive({
  title: '',
  dateRange: []
});
const searchFormRef = ref<FormInstance>();

// 分页相关
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 重新发布对话框
const republishDialogVisible = ref(false);
const currentRepublishItem = ref<any>(null);

// 新闻列表数据
const newsList = ref([
  {
    id: 1,
    title: '农产品季节性价格变动分析',
    category: '市场分析',
    author: 'admin',
    offlineTime: '2023-10-20 14:30:45',
    offlineReason: '内容已过时',
    status: '已下线'
  },
  {
    id: 2,
    title: '农业机械化发展趋势',
    category: '科学技术',
    author: 'admin',
    offlineTime: '2023-10-15 09:20:15',
    offlineReason: '内容需更新',
    status: '已下线'
  },
  {
    id: 3,
    title: '提高农产品产量的种植技巧',
    category: '种植方法',
    author: 'editor01',
    offlineTime: '2023-10-10 16:45:30',
    offlineReason: '内容存在错误',
    status: '已下线'
  }
]);

// 查看新闻
const viewNews = (row: any) => {
  // 这里可以展示新闻详情，可以通过对话框或跳转到详情页
  console.log('查看下线新闻:', row);
};

// 重新发布新闻
const republishNews = (row: any) => {
  currentRepublishItem.value = row;
  republishDialogVisible.value = true;
};

// 确认重新发布
const confirmRepublish = () => {
  if (!currentRepublishItem.value) return;

  // 这里应该调用API重新发布新闻
  ElMessage.success('新闻已重新发布');
  republishDialogVisible.value = false;

  // 从列表中移除该项
  const index = newsList.value.findIndex(item => item.id === currentRepublishItem.value.id);
  if (index !== -1) {
    newsList.value.splice(index, 1);
    total.value--;
  }
};

// 搜索新闻列表
const searchNewsList = () => {
  console.log('搜索条件:', searchForm);
  // 这里应该调用API，获取符合条件的数据
  currentPage.value = 1;
};

// 重置搜索
const resetSearch = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  // 重置后重新加载数据
};

// 处理分页变化
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  // 加载数据
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  // 加载数据
};

onMounted(() => {
  // 初始加载数据
  total.value = newsList.value.length;
});
</script>

<style scoped lang="less">
.offline-container {
  padding: 20px;

  h1 {
    margin-bottom: 20px;
    color: #2e8b57; // 海绿色
    font-size: 22px;
    font-weight: 600;
  }

  .search-card {
    margin-bottom: 20px;
  }

  .table-card {
    margin-bottom: 20px;
  }

  .table-wrapper {
    display: flex;
    justify-content: center;
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }

  :deep(.el-button--primary) {
    background-color: #2e8b57; // 海绿色
    border-color: #2e8b57;
  }

  :deep(.el-button--primary:hover) {
    background-color: #3cb371; // 中等海绿色
    border-color: #3cb371;
  }
}
</style>
