<template>
  <div class="unpublished-container">
    <h1>未发布新闻</h1>

    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" ref="searchFormRef">
        <el-form-item label="新闻标题">
          <el-input v-model="searchForm.title" placeholder="请输入新闻标题"></el-input>
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="searchForm.author" placeholder="请输入作者"></el-input>
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
      <div class="table-header">
        <div class="title">未发布新闻列表</div>
        <div class="actions">
          <el-button type="success" :style="{ backgroundColor: secondaryColor }"
            @click="navigateToWriteNews">撰写新闻</el-button>
          <el-button type="primary" :style="{ backgroundColor: primaryColor }" @click="batchPublish"
            :disabled="!hasSelected">批量发布</el-button>
          <el-button type="danger" @click="batchDelete" :disabled="!hasSelected">批量删除</el-button>
        </div>
      </div>

      <el-table :data="newsList" style="width: 100%" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="title" label="新闻标题" width="260" />
        <el-table-column prop="category" label="分类" width="120" />
        <el-table-column prop="author" label="作者" width="120" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="updateTime" label="最近修改时间" width="180" />
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button size="small" type="primary" :style="{ backgroundColor: primaryColor }"
              @click="publishNews(scope.row)">
              发布
            </el-button>
            <el-button size="small" type="info" @click="editNews(scope.row)">
              编辑
            </el-button>
            <el-button size="small" type="danger" @click="deleteNews(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

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

    <!-- 批量发布确认对话框 -->
    <el-dialog v-model="batchPublishDialogVisible" title="批量发布确认" width="400px">
      <p>确定要发布选中的 {{ multipleSelection.length }} 条新闻吗？发布后将在前台展示。</p>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="batchPublishDialogVisible = false">取消</el-button>
          <el-button type="primary" :style="{ backgroundColor: primaryColor }"
            @click="confirmBatchPublish">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 批量删除确认对话框 -->
    <el-dialog v-model="batchDeleteDialogVisible" title="批量删除确认" width="400px">
      <p>确定要删除选中的 {{ multipleSelection.length }} 条新闻吗？删除后无法恢复！</p>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="batchDeleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="confirmBatchDelete">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus';
import { ElMessage, ElMessageBox } from 'element-plus';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

// 定义农产品相关的主题绿色
const primaryColor = '#2e8b57'; // 海绿色
const secondaryColor = '#3cb371'; // 中等海绿色

const router = useRouter();

// 定义类型
interface NewsItem {
  id: number;
  title: string;
  category: string;
  author: string;
  createTime: string;
  updateTime: string;
  status: string;
}

// 搜索表单
const searchForm = reactive({
  title: '',
  author: '',
  dateRange: []
});
const searchFormRef = ref<FormInstance>();

// 分页相关
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(100);

// 对话框
const publishDialogVisible = ref(false);
const batchPublishDialogVisible = ref(false);
const batchDeleteDialogVisible = ref(false);
const currentPublishItem = ref<NewsItem | null>(null);

// 表格选择
const multipleSelection = ref<NewsItem[]>([]);
const hasSelected = computed(() => multipleSelection.value.length > 0);

// 新闻列表数据
const newsList = ref<NewsItem[]>([
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
  },
  {
    id: 4,
    title: '智能农业设备的应用前景',
    category: '科学技术',
    author: 'admin',
    createTime: '2023-11-12 13:40:25',
    updateTime: '2023-11-12 14:15:20',
    status: '待发布'
  }
]);

// 处理表格选择变化
const handleSelectionChange = (val: NewsItem[]) => {
  multipleSelection.value = val;
};

// 导航到撰写新闻页面
const navigateToWriteNews = () => {
  router.push('/super-admin/news/write');
};

// 发布新闻
const publishNews = (row: NewsItem) => {
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
  const index = newsList.value.findIndex(item => item.id === currentPublishItem.value!.id);
  if (index !== -1) {
    newsList.value.splice(index, 1);
    total.value--;
  }
};

// 批量发布
const batchPublish = () => {
  if (multipleSelection.value.length === 0) return;
  batchPublishDialogVisible.value = true;
};

// 确认批量发布
const confirmBatchPublish = () => {
  // 这里应该调用API批量发布新闻
  const ids = multipleSelection.value.map(item => item.id);

  // 从列表中移除这些项
  newsList.value = newsList.value.filter(item => !ids.includes(item.id));
  total.value = newsList.value.length;

  ElMessage.success(`已成功发布 ${ids.length} 条新闻`);
  batchPublishDialogVisible.value = false;
};

// 编辑新闻
const editNews = (row: NewsItem) => {
  router.push(`/super-admin/news/write?id=${row.id}`);
};

// 删除新闻
const deleteNews = (row: NewsItem) => {
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

// 批量删除
const batchDelete = () => {
  if (multipleSelection.value.length === 0) return;
  batchDeleteDialogVisible.value = true;
};

// 确认批量删除
const confirmBatchDelete = () => {
  // 这里应该调用API批量删除新闻
  const ids = multipleSelection.value.map(item => item.id);

  // 从列表中移除这些项
  newsList.value = newsList.value.filter(item => !ids.includes(item.id));
  total.value = newsList.value.length;

  ElMessage.success(`已成功删除 ${ids.length} 条新闻`);
  batchDeleteDialogVisible.value = false;
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
  }

  .search-card {
    margin-bottom: 20px;
  }

  .table-card {
    margin-bottom: 20px;

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;

      .title {
        font-size: 18px;
        font-weight: bold;
        color: #2e8b57; // 海绿色
      }

      .actions {
        display: flex;
        gap: 10px;
      }
    }
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  :deep(.el-button--primary) {
    background-color: #2e8b57; // 海绿色
    border-color: #2e8b57;
  }

  :deep(.el-button--primary:hover) {
    background-color: #3cb371; // 中等海绿色
    border-color: #3cb371;
  }

  :deep(.el-button--success) {
    background-color: #3cb371; // 中等海绿色
    border-color: #3cb371;
  }

  :deep(.el-button--success:hover) {
    background-color: #66cdaa; // 中等碧绿色
    border-color: #66cdaa;
  }
}
</style>
