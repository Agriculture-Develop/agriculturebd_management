<template>
  <div class="unpublished-container">
    <h1>未发布新闻</h1>

    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" ref="searchFormRef">
        <el-form-item label="新闻标题">
          <el-input v-model="searchForm.title" placeholder="请输入新闻标题"></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
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
          <el-table-column prop="title" label="新闻标题" width="300" />
          <el-table-column prop="category" label="分类" width="150" />
          <el-table-column prop="author" label="作者" width="150" />
          <el-table-column prop="createTime" label="创建时间" width="250" />
          <el-table-column prop="updateTime" label="最近修改时间" width="250" />
          <el-table-column label="操作" width="270">
            <template #default="scope">
              <el-button size="small" type="success" :style="{ backgroundColor: primaryColor }"
                @click="publishNews(scope.row)">
                发布
              </el-button>
              <el-button size="small" :style="{ backgroundColor: secondaryColor, color: '#fff' }"
                @click="editNews(scope.row)">
                编辑
              </el-button>
              <el-button size="small" type="danger" @click="deleteNews(scope.row)">
                删除
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

    <!-- 发布确认对话框 -->
    <el-dialog v-model="publishDialogVisible" title="发布确认" width="400px">
      <p>确定要发布这条新闻吗？发布后将在前台展示。</p>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="publishDialogVisible = false">取消</el-button>
          <el-button type="primary" :style="{ backgroundColor: primaryColor }" @click="confirmPublish">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus';
import { ElMessage, ElMessageBox } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

// 定义农产品相关的主题绿色
const primaryColor = '#2e8b57'; // 海绿色
const secondaryColor = '#3cb371'; // 中等海绿色

const router = useRouter();

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

// 发布对话框
const publishDialogVisible = ref(false);
const currentPublishItem = ref<any>(null);

// 新闻列表数据
const newsList = ref([
  {
    id: 1,
    title: '农产品价格走势分析',
    category: '市场分析',
    author: 'admin',
    createTime: '2023-11-15 14:30:45',
    updateTime: '2023-11-15 16:20:10',
    status: '待发布'
  },
  {
    id: 2,
    title: '新型农业技术应用',
    category: '科学技术',
    author: 'admin',
    createTime: '2023-11-14 09:20:15',
    updateTime: '2023-11-14 10:15:30',
    status: '待发布'
  },
  {
    id: 3,
    title: '有机蔬菜种植方法',
    category: '种植方法',
    author: 'editor01',
    createTime: '2023-11-13 16:45:30',
    updateTime: '2023-11-13 16:45:30',
    status: '待发布'
  }
]);

// 发布新闻
const publishNews = (row: any) => {
  currentPublishItem.value = row;
  publishDialogVisible.value = true;
};

// 确认发布
const confirmPublish = () => {
  if (!currentPublishItem.value) return;

  // 这里应该调用API发布新闻
  ElMessage.success('新闻发布成功');
  publishDialogVisible.value = false;

  // 从列表中移除该项
  const index = newsList.value.findIndex(item => item.id === currentPublishItem.value.id);
  if (index !== -1) {
    newsList.value.splice(index, 1);
    total.value--;
  }
};

// 编辑新闻
const editNews = (row: any) => {
  router.push(`/admin/news/write?id=${row.id}`);
};

// 删除新闻
const deleteNews = (row: any) => {
  ElMessageBox.confirm('确定要删除这条新闻吗？删除后无法恢复！', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 这里应该调用API删除新闻
    const index = newsList.value.findIndex(item => item.id === row.id);
    if (index !== -1) {
      newsList.value.splice(index, 1);
      total.value--;
      ElMessage.success('删除成功');
    }
  }).catch(() => {
    // 取消操作
  });
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
.unpublished-container {
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
