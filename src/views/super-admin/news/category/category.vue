<script setup lang="ts">
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import { useRequest } from 'alova/client'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'

// 主题色
const primaryColor = '#2e8b57'
// 次要按钮色
const secondaryColor = '#409EFF'

// 表单对话框可见性
const dialogVisible = ref(false)
// 表单模式：新增或编辑
const formMode = ref('add')
// 当前编辑的分类ID
const currentId = ref(0)

// 分类表单
const categoryForm = reactive({
  name: '',
  description: '',
  sort: 0,
})

// 表单规则
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' },
  ],
  sort: [{ required: true, message: '请输入排序值', trigger: 'blur' }],
})

const categoryFormRef = ref<FormInstance>()

// 分类列表数据
const categoryList = ref<any[]>([])

// 打开添加分类对话框
const openAddDialog = () => {
  formMode.value = 'add'
  resetForm()
  dialogVisible.value = true
}

// 打开编辑分类对话框
const openEditDialog = (row: any) => {
  formMode.value = 'edit'
  currentId.value = row.id
  categoryForm.name = row.name
  categoryForm.description = row.description
  categoryForm.sort = row.sort
  dialogVisible.value = true
}

// 重置表单
const resetForm = () => {
  if (categoryFormRef.value) {
    categoryFormRef.value.resetFields()
  }
  categoryForm.name = ''
  categoryForm.description = ''
  categoryForm.sort = 0
}
//get表单数据
const { send: getCategoryList } = useRequest(
  () => Apis.newsCategories.get_admin_news_categories_list({ cache: 'no-cache', cacheFor: 0 }),
  { immediate: true, initialData: [] },
).onSuccess((res) => (categoryList.value = res.data.data.list))

// 提交表单
const submitForm = async () => {
  if (!categoryFormRef.value) return
  const valid = await categoryFormRef.value.validate()
  if (!valid) return

  if (formMode.value === 'add') {
    // 调用添加API
    const res = await Apis.newsCategories.post_admin_news_categories({
      data: { name: categoryForm.name, description: categoryForm.description },
    })
    console.log(res)
    await getCategoryList()
    console.log('添加分类:', categoryForm)
    ElMessage({
      type: 'success',
      message: '添加成功',
    })
  } else {
    // 调用更新API
    const { send } = useRequest(() =>
      Apis.newsCategories.put_admin_news_categories_id({
        data: { name: categoryForm.name, description: categoryForm.description },
        pathParams: { id: String(currentId.value) },
      }),
    )
    send()
    await Apis.newsCategories.put_admin_news_categories_id({
      data: { name: categoryForm.name, description: categoryForm.description },
      pathParams: { id: String(currentId.value) },
    })
    await getCategoryList()
    console.log('更新分类:', categoryForm, '分类ID:', currentId.value)

    ElMessage({
      type: 'success',
      message: '更新成功',
    })
  }
  dialogVisible.value = false
}

// 删除分类
const deleteCategory = async (row: any) => {
  // ElMessageBox.confirm('确认删除此分类？删除后将无法恢复', '提示', {
  //   confirmButtonText: '确认',
  //   cancelButtonText: '取消',
  //   type: 'warning',
  //   center: true,
  // })
  // 用户确认后执行删除
  const res = await Apis.newsCategories.delete_admin_news_categories_id({
    pathParams: { id: String(row.id) },
  })
  console.log(res, '删除结果')

  // 刷新列表
  await getCategoryList()
  console.log('删除分类:', row)

  ElMessage({
    type: 'success',
    message: '删除成功',
  })
  // })
  // .catch(() => {
  //   ElMessage({
  //     type: 'info',
  //     message: '已取消删除',
  //   })
  // })
}

onMounted(() => {
  // 加载分类数据
})
</script>

<template>
  {{ categoryList }}
  <div class="category-container">
    <h1>分类管理</h1>

    <el-card class="category-card">
      <template #header>
        <div class="card-header">
          <el-button
            type="primary"
            :style="{ backgroundColor: primaryColor }"
            @click="openAddDialog"
          >
            <el-icon> <Plus /> </el-icon>添加分类
          </el-button>
        </div>
      </template>

      <div class="table-wrapper">
        <el-table :data="categoryList" style="width: 100%" border stripe>
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="分类名称" min-width="120" />
          <el-table-column prop="description" label="分类描述" min-width="200" />
          <el-table-column prop="sort" label="排序" width="80" />
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column label="操作" width="150">
            <template #default="scope">
              <el-button
                :style="{ backgroundColor: secondaryColor, color: '#fff' }"
                circle
                size="small"
                @click="openEditDialog(scope.row)"
              >
                <el-icon>
                  <Edit />
                </el-icon>
              </el-button>
              <el-button type="danger" circle size="small" @click="deleteCategory(scope.row)">
                <el-icon>
                  <Delete />
                </el-icon>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!-- 添加/编辑分类对话框 -->
    <el-dialog
      :title="formMode === 'add' ? '添加分类' : '编辑分类'"
      v-model="dialogVisible"
      width="500px"
    >
      <el-form
        :model="categoryForm"
        :rules="rules"
        ref="categoryFormRef"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="categoryForm.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="分类描述" prop="description">
          <el-input
            v-model="categoryForm.description"
            type="textarea"
            placeholder="请输入分类描述"
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="categoryForm.sort" :min="0" :max="999" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" :style="{ backgroundColor: primaryColor }" @click="submitForm">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.category-container {
  padding: 20px;

  h1 {
    margin-bottom: 20px;
    color: #2e8b57; // 主题绿色
    font-size: 22px;
    font-weight: 600;
  }

  .category-card {
    margin-bottom: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .table-wrapper {
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

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
