<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
const countdown = ref(0) // 剩余秒数
let timer: ReturnType<typeof setInterval> | null = null

// 定义农产品相关的主题绿色
const primaryColor = '#2e8b57' // 海绿色
const secondaryColor = '#3cb371' // 中等海绿色

// 搜索表单
const searchForm = reactive({
  username: '',
  role: '',
})
const searchFormRef = ref<FormInstance>()

// 用户表单
const userForm = reactive({
  id: '',
  username: '',
  password: '',
  confirmPassword: '',
  phone: '',
  role: '',
  code: '',
  status: '启用',
})
const userFormRef = ref<FormInstance>()

// 表单校验规则
const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    if (userForm.confirmPassword !== '') {
      if (!userFormRef.value) return
      userFormRef.value.validateField('confirmPassword', () => {})
    }
    callback()
  }
}
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== userForm.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const userFormRules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
  ],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { validator: validatePass, trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validatePass2, trigger: 'blur' },
  ],
  realName: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' },
  ],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
})

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 对话框相关
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')

// 表格数据
const userList = ref<
  Array<{
    id: number
    phone: string
    nickname: string
    avatar_path: string
    role: string
    status: string
    created_at: string
  }>
>([])

// 获取用户列表
const getUserList = async () => {
  const res = await Apis.user.get_admin_user_list({ cache: 'no-cache', cacheFor: 0 })
  userList.value = res.data.list
  console.log(userList.value)
}

// 搜索用户
const searchUsers = () => {
  console.log('搜索用户:', searchForm)
  currentPage.value = 1
  getUserList()
}

// 重置搜索
const resetSearch = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  getUserList()
}

// 打开添加用户对话框
const openAddDialog = () => {
  dialogType.value = 'add'
  userForm.id = ''
  userForm.username = ''
  userForm.password = ''
  userForm.confirmPassword = ''
  userForm.phone = ''
  userForm.role = ''
  dialogVisible.value = true
}

// 编辑用户
const editUser = (row: any) => {
  dialogType.value = 'edit'
  userForm.id = row.id
  userForm.username = row.nickname
  userForm.phone = row.phone
  userForm.role = row.role
  dialogVisible.value = true
}
// 点击发送验证码
const sendCode = async () => {
  // 这里调用后端API发送验证码
  await Apis.general.post_auth_code({ data: { phone: userForm.phone } })

  // 开始倒计时
  countdown.value = 60
  if (timer) clearInterval(timer) // 正确的调用
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer!)
      timer = null
    }
  }, 1000)
}
// 提交用户表单
const submitUserForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  try {
    await formEl.validate()
    if (dialogType.value === 'add') {
      // 这里应该调用添加用户API
      const res = await Apis.general.post_auth_register({
        data: { auth_code: userForm.code, password: userForm.password, phone: userForm.phone },
      })
      ElMessage.success(res.msg)
    } else {
      // 这里应该调用更新用户API
      console.log(userForm.username, userForm.role)
      const res1 = await Apis.user.put_admin_user_id({
        data: { nickname: userForm.username, role: userForm.role, status: userForm.status },
        pathParams: { id: userForm.id },
      })
      ElMessage.success(res1.msg)

      console.log(res1)

      ElMessage.success('更新用户成功')
    }
    dialogVisible.value = false
    getUserList()
  } catch (err) {
    console.log('表单验证失败', err)
  }
}
// 切换用户状态
const toggleUserStatus = (row: any) => {
  const statusText = row.status === 1 ? '禁用' : '启用'
  ElMessageBox.confirm(`确定要${statusText}该用户吗？`, {
    title: '提示',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    appendTo: document.body,
  })
    .then(() => {
      // 调用API更新状态
      row.status = row.status === 1 ? 0 : 1
      ElMessage.success(`${statusText}成功`)
    })
    .catch((err) => {
      // 取消操作
      console.error(err)
    })
}

// 删除用户
const deleteUser = (row: any) => {
  ElMessageBox.confirm('确定要删除该用户吗？删除后无法恢复！', {
    title: '警告',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    appendTo: document.body,
  })
    .then(() => {
      // 调用删除API
      const index = userList.value.findIndex((item) => item.id === row.id)
      if (index !== -1) {
        userList.value.splice(index, 1)
        total.value--
        ElMessage.success('删除成功')
      }
    })
    .catch(() => {
      // 取消操作
    })
}

// 处理分页变化
const handleSizeChange = (val: number) => {
  pageSize.value = val
  getUserList()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getUserList()
}

onMounted(() => {
  getUserList()
})
</script>

<template>
  <div class="user-container">
    <h1>用户管理</h1>
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" ref="searchFormRef">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="searchForm.role" placeholder="请选择角色">
            <el-option label="全部" value=""></el-option>
            <el-option label="超级管理员" value="超级管理员"></el-option>
            <el-option label="管理员" value="管理员"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :style="{ backgroundColor: primaryColor }" @click="searchUsers"
            >搜索</el-button
          >
          <el-button @click="resetSearch(searchFormRef)">重置</el-button>
          <el-button
            type="success"
            :style="{ backgroundColor: secondaryColor }"
            @click="openAddDialog"
            >新增用户</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card">
      <el-table :data="userList" style="width: 100%" border>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="nickname" label="用户名"></el-table-column>
        <el-table-column prop="phone" label="联系电话"></el-table-column>

        <el-table-column label="角色" prop="role"> </el-table-column>
        <el-table-column label="状态" prop="status">
          <template #default="scope">
            <el-tag :type="scope.row.status === '启用' ? 'success' : 'danger'">
              {{ scope.row.status === '启用' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180"></el-table-column>
        <el-table-column label="操作" width="240">
          <template #default="scope">
            <el-button size="small" @click="editUser(scope.row)">编辑</el-button>
            <el-button
              size="small"
              :type="scope.row.status === 1 ? 'danger' : 'success'"
              @click="toggleUserStatus(scope.row)"
            >
              {{ scope.row.status === 1 ? '禁用' : '启用' }}
            </el-button>
            <el-button size="small" type="danger" @click="deleteUser(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </el-card>

    <!-- 添加/编辑用户对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加用户' : '编辑用户'"
      width="500px"
    >
      <el-form :model="userForm" label-width="100px" :rules="userFormRules" ref="userFormRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>

        <el-form-item label="手机号码" prop="phone">
          <el-input
            v-model="userForm.phone"
            placeholder="请输入手机号码"
            :disabled="dialogType === 'edit'"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机验证码" prop="code" v-if="dialogType === 'add'">
          <el-input v-model="userForm.code" placeholder="请输入手机验证码">
            <template #append>
              <el-button @click="sendCode" :disabled="countdown > 0">
                {{ countdown > 0 ? countdown + '秒后重试' : '获取验证码' }}</el-button
              >
            </template></el-input
          >
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="dialogType === 'add'">
          <el-input
            v-model="userForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword" v-if="dialogType === 'add'">
          <el-input
            v-model="userForm.confirmPassword"
            type="password"
            placeholder="请确认密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="userForm.role" placeholder="请选择角色">
            <el-option label="超级管理员" value="超级管理员"></el-option>
            <el-option label="管理员" value="管理员"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            :style="{ backgroundColor: primaryColor }"
            @click="submitUserForm(userFormRef)"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="less">
.user-container {
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
