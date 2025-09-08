<template>
  <div class="audit-list-container">
    <h1>审核列表</h1>

    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" ref="searchFormRef">
        <el-form-item label="新闻标题">
          <el-input v-model="searchForm.title" placeholder="请输入新闻标题"></el-input>
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="searchForm.author" placeholder="请输入作者"></el-input>
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
          <el-button
            type="primary"
            :style="{ backgroundColor: primaryColor }"
            @click="searchAuditList"
            >搜索</el-button
          >
          <el-button @click="resetSearch(searchFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card">
      <div class="table-header">
        <div class="title">审核列表</div>
        <el-button type="success" :style="{ backgroundColor: secondaryColor }" @click="batchApprove"
          >批量通过</el-button
        >
      </div>

      <el-table
        :data="auditList"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="title" label="新闻标题" width="280" />
        <el-table-column prop="author" label="作者" width="120" />
        <el-table-column prop="category" label="新闻分类" width="120" />
        <el-table-column prop="submitTime" label="提交时间" width="180" />
        <el-table-column prop="status" label="审核状态" width="120">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              :style="{ backgroundColor: primaryColor }"
              @click="viewDetail(scope.row)"
            >
              查看
            </el-button>
            <el-button
              size="small"
              type="success"
              :style="{ backgroundColor: secondaryColor }"
              @click="approveNews(scope.row)"
              :disabled="scope.row.status === '已通过'"
            >
              通过
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="rejectNews(scope.row)"
              :disabled="scope.row.status === '已拒绝'"
            >
              驳回
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 驳回对话框 -->
    <el-dialog v-model="rejectDialogVisible" title="驳回原因" width="500px">
      <el-form :model="rejectForm" label-width="80px">
        <el-form-item label="驳回原因">
          <el-input
            v-model="rejectForm.reason"
            type="textarea"
            :rows="4"
            placeholder="请输入驳回原因"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="rejectDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            :style="{ backgroundColor: primaryColor }"
            @click="confirmReject"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

// 定义农产品相关的主题绿色
const primaryColor = '#2e8b57' // 海绿色
const secondaryColor = '#3cb371' // 中等海绿色

const router = useRouter()

// 定义类型
interface NewsItem {
  id: number
  title: string
  author: string
  category: string
  submitTime: string
  status: string
}

// 搜索表单
const searchForm = reactive({
  title: '',
  author: '',
  status: '',
})
const searchFormRef = ref<FormInstance>()

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 选中的行
const multipleSelection = ref<NewsItem[]>([])

// 审核列表数据
const auditList = ref<NewsItem[]>([
  {
    id: 1,
    title: '农产品价格走势分析',
    author: 'admin',
    category: '科学技术',
    submitTime: '2023-11-15 14:30:45',
    status: '审核中',
  },
  {
    id: 2,
    title: '新型农业技术应用',
    author: 'admin',
    category: '科学技术',
    submitTime: '2023-11-14 09:20:15',
    status: '已通过',
  },
  {
    id: 3,
    title: '有机蔬菜种植方法',
    author: 'editor01',
    category: '种植方法',
    submitTime: '2023-11-13 16:45:30',
    status: '已拒绝',
  },
  {
    id: 4,
    title: '农产品市场发展趋势',
    author: 'editor02',
    category: '市场分析',
    submitTime: '2023-11-12 11:10:25',
    status: '审核中',
  },
  {
    id: 5,
    title: '农作物病虫害防治技术',
    author: 'admin',
    category: '种植方法',
    submitTime: '2023-11-10 15:35:40',
    status: '已通过',
  },
])

// 驳回相关
const rejectDialogVisible = ref(false)
const currentRejectItem = ref<NewsItem | null>(null)
const rejectForm = reactive({
  reason: '',
})

// 获取状态标签类型
const getStatusType = (status: string) => {
  switch (status) {
    case '审核中':
      return 'warning'
    case '已通过':
      return 'success'
    case '已拒绝':
      return 'danger'
    default:
      return 'info'
  }
}

// 处理表格选择变化
const handleSelectionChange = (val: any[]) => {
  multipleSelection.value = val
}

// 查看详情
const viewDetail = (row: any) => {
  router.push(`/super-admin/audit/news?id=${row.id}`)
}

// 搜索审核列表
const searchAuditList = () => {
  console.log('搜索条件:', searchForm)
  // 这里应该调用API，获取符合条件的数据
  currentPage.value = 1
}

// 重置搜索
const resetSearch = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  // 重置后重新加载数据
}

// 批量通过
const batchApprove = () => {
  if (multipleSelection.value.length === 0) {
    ElMessage.warning('请先选择要通过的新闻')
    return
  }

  const pendingItems = multipleSelection.value.filter((item) => item.status === '审核中')
  if (pendingItems.length === 0) {
    ElMessage.warning('所选项中没有待审核的新闻')
    return
  }

  ElMessageBox.confirm('确定要批量通过所选的新闻吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 执行批量通过操作
      pendingItems.forEach((item) => {
        const found = auditList.value.find((news) => news.id === item.id)
        if (found) {
          found.status = '已通过'
        }
      })
      ElMessage.success(`已批量通过 ${pendingItems.length} 条新闻`)
    })
    .catch(() => {
      // 取消操作
    })
}

// 通过单条新闻
const approveNews = (row: any) => {
  ElMessageBox.confirm('确定要通过该新闻吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      row.status = '已通过'
      ElMessage.success('新闻已通过审核')
    })
    .catch(() => {
      // 取消操作
    })
}

// 驳回单条新闻
const rejectNews = (row: any) => {
  currentRejectItem.value = row
  rejectForm.reason = ''
  rejectDialogVisible.value = true
}

// 确认驳回
const confirmReject = () => {
  if (!rejectForm.reason.trim()) {
    ElMessage.warning('请输入驳回原因')
    return
  }

  if (currentRejectItem.value) {
    currentRejectItem.value.status = '已拒绝'
    ElMessage.success('新闻已驳回')
    rejectDialogVisible.value = false
  }
}

// 处理分页变化
const handleSizeChange = (val: number) => {
  pageSize.value = val
  // 加载数据
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  // 加载数据
}

onMounted(() => {
  // 初始加载数据
  total.value = auditList.value.length
})
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
