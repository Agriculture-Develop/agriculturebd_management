<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue';
import type { FormInstance } from 'element-plus';
import { ElMessage, ElMessageBox } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

// 主题色
const primaryColor = '#2e8b57';
// 次要按钮色
const secondaryColor = '#409EFF';

const router = useRouter();

// 搜索表单
const searchForm = reactive({
  title: '',
  createTime: ''
});
const searchFormRef = ref<FormInstance>();

// 分页相关
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(100);

// 草稿列表数据
const draftsList = ref([
  {
    id: 1,
    title: '农产品价格趋势分析',
    createTime: '2023-11-15 14:30:45',
    updateTime: '2023-11-16 09:20:15'
  },
  {
    id: 2,
    title: '新型有机肥料应用技术',
    createTime: '2023-11-14 10:25:30',
    updateTime: '2023-11-15 11:30:45'
  },
  {
    id: 3,
    title: '冬季蔬菜大棚管理技巧',
    createTime: '2023-11-13 16:45:30',
    updateTime: '2023-11-14 08:15:20'
  },
  {
    id: 4,
    title: '农产品电商营销策略',
    createTime: '2023-11-12 11:10:25',
    updateTime: '2023-11-13 14:40:35'
  }
]);

// 查询草稿列表
const searchDrafts = () => {
  console.log('搜索条件:', searchForm);
  // 这里应该调用API获取数据
};

// 重置搜索
const resetSearch = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  // 重置后重新加载数据
};

// 处理分页
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  // 重新加载数据
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  // 重新加载数据
};

// 编辑草稿
const editDraft = (row: any) => {
  console.log('编辑草稿:', row);
  router.push(`/super-admin/news/edit?id=${row.id}`);
};

// 删除草稿
const deleteDraft = (row: any) => {
  ElMessageBox.confirm('确认删除此草稿?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 调用删除API
    console.log('删除草稿:', row);
    ElMessage({
      type: 'success',
      message: '删除成功'
    });
  }).catch(() => { });
};

// 提交审核
const submitForReview = (row: any) => {
  ElMessageBox.confirm('确认提交此草稿进行审核?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    // 调用提交API
    console.log('提交审核:', row);
    ElMessage({
      type: 'success',
      message: '提交成功'
    });
  }).catch(() => { });
};

onMounted(() => {
  // 初始加载数据
});
</script>

<template>
  <div class="drafts-container">
    <h1>草稿箱</h1>

    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" ref="searchFormRef">
        <el-form-item label="标题">
          <el-input v-model="searchForm.title" placeholder="请输入草稿标题"></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker v-model="searchForm.createTime" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :style="{ backgroundColor: primaryColor }" @click="searchDrafts">搜索</el-button>
          <el-button @click="resetSearch(searchFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card">
      <div class="table-operations">
        <el-button type="success" :style="{ backgroundColor: primaryColor }"
          @click="router.push('/super-admin/news/create')">
          <el-icon>
            <Plus />
          </el-icon>新建草稿
        </el-button>
      </div>

      <div class="table-wrapper">
        <el-table :data="draftsList" style="width: 100%" border>
          <el-table-column prop="title" label="草稿标题" min-width="250" />
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column prop="updateTime" label="更新时间" width="180" />
          <el-table-column label="操作" width="280">
            <template #default="scope">
              <el-button size="small" :style="{ backgroundColor: secondaryColor, color: '#fff' }"
                @click="editDraft(scope.row)">
                编辑
              </el-button>
              <el-button size="small" type="danger" @click="deleteDraft(scope.row)">
                删除
              </el-button>
              <el-button size="small" type="warning" @click="submitForReview(scope.row)">
                提交审核
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

<style lang="less" scoped>
.drafts-container {
  padding: 20px;

  h1 {
    margin-bottom: 20px;
    color: #2e8b57; // 主题绿色
  }

  .search-card {
    margin-bottom: 20px;
  }

  .table-card {
    margin-bottom: 20px;
  }

  .table-operations {
    margin-bottom: 15px;
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
    background-color: #2e8b57;
    border-color: #2e8b57;
  }

  :deep(.el-button--primary:hover) {
    background-color: #3cb371;
    border-color: #3cb371;
  }
}
</style>