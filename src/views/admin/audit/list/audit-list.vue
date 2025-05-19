<template>
  <div class="audit-list-container">
    <h1>审核列表</h1>

    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" ref="searchFormRef">
        <el-form-item label="新闻标题">
          <el-input v-model="searchForm.title" placeholder="请输入新闻标题"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择审核状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="审核中" value="审核中"></el-option>
            <el-option label="已通过" value="已通过"></el-option>
            <el-option label="已拒绝" value="已拒绝"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :style="{ backgroundColor: primaryColor }" @click="searchAuditList">搜索</el-button>
          <el-button @click="resetSearch(searchFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card">
      <div class="table-wrapper">
        <el-table :data="auditList" style="width: 100%" border>
          <el-table-column prop="title" label="新闻标题" width="280" />
          <el-table-column prop="author" label="作者" width="120" />
          <el-table-column prop="category" label="新闻分类" width="120" />
          <el-table-column prop="submitTime" label="提交时间" width="180" />
          <el-table-column prop="status" label="审核状态" width="120">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="200">
            <template #default="scope">
              <el-button size="small" :style="{ backgroundColor: secondaryColor, color: '#fff' }"
                @click="viewDetail(scope.row)">
                查看详情
              </el-button>
              <el-button v-if="scope.row.status === '审核中'" size="small" type="danger" @click="cancelAudit(scope.row)">
                撤销审核
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
  </div>
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus';
import { ElMessage, ElMessageBox } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

// 定义农产品相关的主题绿色
const primaryColor = '#2e8b57'; // 海绿色
// 次要按钮色
const secondaryColor = '#409EFF';

const router = useRouter();

// 搜索表单
const searchForm = reactive({
  title: '',
  status: ''
});
const searchFormRef = ref<FormInstance>();

// 分页相关
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(100);

// 审核列表数据
const auditList = ref([
  {
    id: 1,
    title: '农产品价格走势分析',
    author: 'admin',
    category: '科学技术',
    submitTime: '2023-11-15 14:30:45',
    status: '审核中'
  },
  {
    id: 2,
    title: '新型农业技术应用',
    author: 'admin',
    category: '科学技术',
    submitTime: '2023-11-14 09:20:15',
    status: '已通过'
  },
  {
    id: 3,
    title: '有机蔬菜种植方法',
    author: 'editor01',
    category: '种植方法',
    submitTime: '2023-11-13 16:45:30',
    status: '已拒绝'
  },
  {
    id: 4,
    title: '农产品市场发展趋势',
    author: 'editor02',
    category: '市场分析',
    submitTime: '2023-11-12 11:10:25',
    status: '审核中'
  },
  {
    id: 5,
    title: '农作物病虫害防治技术',
    author: 'admin',
    category: '种植方法',
    submitTime: '2023-11-10 15:35:40',
    status: '已通过'
  }
]);

// 获取状态标签类型
const getStatusType = (status: string) => {
  switch (status) {
    case '审核中':
      return 'warning';
    case '已通过':
      return 'success';
    case '已拒绝':
      return 'danger';
    default:
      return 'info';
  }
};

// 查看详情
const viewDetail = (row: any) => {
  console.log('查看详情:', row);
  router.push(`/admin/audit/detail?id=${row.id}`);
};

// 撤销审核
const cancelAudit = (row: any) => {
  ElMessageBox.confirm('确认撤销此审核?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    console.log('撤销审核:', row);
    // 这里应该调用API撤销审核
    ElMessage({
      type: 'success',
      message: '撤销成功'
    });
    // 更新状态（示例）
    row.status = '已撤销';
  }).catch(() => { });
};

// 搜索审核列表
const searchAuditList = () => {
  console.log('搜索条件:', searchForm);
  // 这里应该调用API，获取符合条件的数据
  // 现在使用模拟数据，仅展示效果
};

// 重置搜索
const resetSearch = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  // 重置后重新加载数据
};

// 处理页码变化
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
});
</script>

<style scoped lang="less">
.audit-list-container {
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
