<template>
  <div class="published-container">
    <h1>已发布新闻</h1>

    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" ref="searchFormRef">
        <el-form-item label="新闻标题">
          <el-input v-model="searchForm.title" placeholder="请输入新闻标题"></el-input>
        </el-form-item>
        <el-form-item label="发布时间">
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
          <el-table-column prop="publishTime" label="发布时间" width="180" />
          <el-table-column prop="views" label="浏览量" width="100" />
          <el-table-column label="操作" width="220">
            <template #default="scope">
              <el-button size="small" type="primary" :style="{ backgroundColor: secondaryColor }"
                @click="viewNews(scope.row)">
                查看
              </el-button>
              <el-button size="small" :style="{ backgroundColor: tertiaryColor, color: '#fff' }"
                @click="setTopNews(scope.row)" v-if="!scope.row.isTop">
                置顶
              </el-button>
              <el-button size="small" type="info" @click="cancelTopNews(scope.row)" v-else>
                取消置顶
              </el-button>
              <el-button size="small" type="danger" @click="offlineNews(scope.row)">
                下线
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

    <!-- 下线确认对话框 -->
    <el-dialog v-model="offlineDialogVisible" title="下线确认" width="400px">
      <p>确定要下线这条新闻吗？下线后将不再在前台展示。</p>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="offlineDialogVisible = false">取消</el-button>
          <el-button type="primary" :style="{ backgroundColor: primaryColor }" @click="confirmOffline">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus';
import { ElMessage, ElMessageBox } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';

// 定义农产品相关的主题绿色
const primaryColor = '#2e8b57'; // 海绿色
const secondaryColor = '#3cb371'; // 中等海绿色
const tertiaryColor = '#556b2f'; // 深绿色

// 搜索表单
const searchForm = reactive({
  title: '',
  dateRange: []
});
const searchFormRef = ref<FormInstance>();

// 分页相关
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(100);

// 下线对话框
const offlineDialogVisible = ref(false);
const currentOfflineItem = ref<any>(null);

// 新闻列表数据
const newsList = ref([
  {
    id: 1,
    title: '农产品季度市场分析报告',
    category: '市场分析',
    author: 'admin',
    publishTime: '2023-11-10 14:30:45',
    views: 1245,
    isTop: true,
    status: '已发布'
  },
  {
    id: 2,
    title: '农业科技创新对农产品质量提升的影响',
    category: '科学技术',
    author: 'admin',
    publishTime: '2023-11-08 09:20:15',
    views: 876,
    isTop: false,
    status: '已发布'
  },
  {
    id: 3,
    title: '现代农业智能化管理系统应用案例',
    category: '科学技术',
    author: 'editor01',
    publishTime: '2023-11-05 16:45:30',
    views: 632,
    isTop: false,
    status: '已发布'
  },
  {
    id: 4,
    title: '有机农产品市场趋势预测',
    category: '市场分析',
    author: 'editor02',
    publishTime: '2023-11-01 11:10:25',
    views: 981,
    isTop: false,
    status: '已发布'
  }
]);

// 查看新闻
const viewNews = (row: any) => {
  // 这里可以用新窗口打开前台新闻页面
  window.open(`/news/detail/${row.id}`, '_blank');
};

// 置顶新闻
const setTopNews = (row: any) => {
  ElMessageBox.confirm('确定要置顶这条新闻吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 这里应该调用API置顶新闻
    row.isTop = true;
    ElMessage.success('置顶成功');
  }).catch(() => {
    // 取消操作
  });
};

// 取消置顶
const cancelTopNews = (row: any) => {
  ElMessageBox.confirm('确定要取消置顶这条新闻吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 这里应该调用API取消置顶
    row.isTop = false;
    ElMessage.success('已取消置顶');
  }).catch(() => {
    // 取消操作
  });
};

// 下线新闻
const offlineNews = (row: any) => {
  currentOfflineItem.value = row;
  offlineDialogVisible.value = true;
};

// 确认下线
const confirmOffline = () => {
  if (!currentOfflineItem.value) return;

  // 这里应该调用API下线新闻
  ElMessage.success('新闻已下线');
  offlineDialogVisible.value = false;

  // 从列表中移除该项
  const index = newsList.value.findIndex(item => item.id === currentOfflineItem.value.id);
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
.published-container {
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
