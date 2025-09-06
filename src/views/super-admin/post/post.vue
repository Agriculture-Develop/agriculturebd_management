<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, ref } from 'vue'
import { usePagination } from 'alova/client'
// 主题色保持与用户页一致
const primaryColor = '#2e8b57'
const commentPage = ref(1)
const commentPageSize = ref(5)
const commentTotal = ref()
const {
  data,

  // 当前页码，改变此页码将自动触发请求
  page,

  // 每页数据条数
  pageSize,

  // 总数据量
  total,

  // [3.3.0+]
  // 移除列表项
  remove,
} = usePagination(
  // Method实例获取函数，它将接收page和pageSize，并返回一个Method实例
  (page, pageSize) =>
    Apis.goods.get_public_good_list({ params: { page: page, count: pageSize, title: '' } }),
  {
    total: (res) => res.data.total,
    data: (res) => res.data.list,
    // 请求前的初始数据（接口返回的数据格式）
    initialData: {
      total: 0,
      data: [],
    },
    initialPage: 1, // 初始页码，默认为1
    initialPageSize: 10, // 初始每页数据条数，默认为10

    // [3.3.0+]
    actions: {
      // 当remove函数被调用时,此action将被触发，并接收remove函数的参数
      remove: async (row) => {
        await Apis.goods.delete_public_good_id({
          pathParams: { id: String((row as { id: number }).id) },
        })
        ElMessage.success('删除成功')
      },
    },
  },
).onSuccess(async (res) => {
  const list = await Promise.all(
    res.data.data.list.map(async (item) => {
      const user = await Apis.user.get_public_user_id({ pathParams: { id: String(item.userid) } })

      ;(item as typeof item & { nickname: string }).nickname = user.data.nickname

      return {
        ...item,
        nickname: user.data.nickname,
      }
    }),
  )
  data.value = list
})

// 评论弹窗
const commentsDialogVisible = ref(false)
const selectedPostId = ref<number | null>(null)
const selectedPostTitle = ref('')
const selectedComments = ref<PostCommentItem[]>([])
//整合评论
function buildCommentTree(list) {
  const map: Record<number, any> = {}
  const tree: any[] = []

  // 建立映射表
  list.forEach((item) => {
    map[item.id] = { ...item, children: [] }
  })

  // 组装树结构
  list.forEach((item) => {
    if (item.reply_id === -1) {
      tree.push(map[item.id])
    } else {
      if (map[item.reply_id]) {
        map[item.reply_id].children.push(map[item.id])
      }
    }
  })

  // 递归删除空 children
  function clean(node: any) {
    if (node.children && node.children.length === 0) {
      delete node.children
    } else if (node.children) {
      node.children.forEach(clean)
    }
  }
  tree.forEach(clean)

  return tree
}

const openCommentsDialog = async (row: PostItem) => {
  selectedPostId.value = row.id
  const res = await Apis.goods.get_public_good_id_comment({
    pathParams: { id: String(selectedPostId.value) },
  })
  selectedPostTitle.value = row.title
  // 深拷贝，避免直接联动弹窗内编辑

  //整合评论
  const tree = buildCommentTree(res.data.list)
  commentTotal.value = res.data.total
  console.log(tree)
  selectedComments.value = JSON.parse(JSON.stringify(tree))

  commentsDialogVisible.value = true
}
//pagedComments分页
const pagedComments = computed(() => {
  const start = (commentPage.value - 1) * commentPageSize.value
  const end = start + commentPageSize.value
  return selectedComments.value.slice(start, end)
})

const deletePost = (row) => {
  ElMessageBox.confirm('确定要删除该帖子吗？删除后无法恢复！', {
    title: '警告',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    appendTo: document.body,
  })
    .then(async () => {
      await remove(row)
    })
    .catch(() => {})
}
//删除评论
const removeCommentFromTree = (list, targetId: number): boolean => {
  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    if (item.id === targetId) {
      list.splice(i, 1)
      return true
    }
    if (item.children && item.children.length) {
      const removed = removeCommentFromTree(item.children, targetId)
      if (removed) {
        // 如果子数组被清空，可按需移除 children 字段
        if (item.children.length === 0) delete item.children
        return true
      }
    }
  }
  return false
}

const deleteComment = async (comment) => {
  try {
    await ElMessageBox.confirm('确定要删除该评论吗？', {
      title: '提示',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      appendTo: document.body,
    })

    await Apis.goods.delete_public_good_comment_id({ pathParams: { id: comment.id } })
    console.log(selectedComments.value)

    removeCommentFromTree(selectedComments.value, comment.id)
    ElMessage.success('评论已删除')
  } catch {}
}
</script>

<template>
  <div class="post-container">
    <h1>帖子管理</h1>

    <el-card class="table-card">
      <el-table :data="data" style="width: 100%" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="nickname" label="作者" width="160" />
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              :style="{ backgroundColor: primaryColor }"
              @click="openCommentsDialog(scope.row)"
              >查看评论</el-button
            >
            <el-button size="small" type="danger" @click="deletePost(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        />
      </div>
    </el-card>

    <!-- 评论列表弹窗 -->
    <el-dialog
      v-model="commentsDialogVisible"
      :title="`评论列表 - ${selectedPostTitle}`"
      width="700px"
    >
      <el-table
        :data="pagedComments"
        row-key="id"
        :tree-props="{ children: 'children' }"
        style="width: 100%"
        border
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="publisher_name" label="发布人" width="180" />
        <el-table-column prop="user_id" label="发布人ID" width="80" />
        <el-table-column prop="comment" label="评论内容" />
        <el-table-column label="操作" width="140">
          <template #default="scope">
            <el-button size="small" type="danger" @click="deleteComment(scope.row)"
              >删除评论</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="commentPage"
        v-model:page-size="commentPageSize"
        :page-sizes="[5, 10, 20, 30]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="commentTotal"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="commentsDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="less">
.post-container {
  padding: 20px;

  h1 {
    margin-bottom: 20px;
    color: #2e8b57;
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
    background-color: #2e8b57;
    border-color: #2e8b57;
  }

  :deep(.el-button--primary:hover) {
    background-color: #3cb371;
    border-color: #3cb371;
  }

  :deep(.el-button--success) {
    background-color: #3cb371;
    border-color: #3cb371;
  }

  :deep(.el-button--success:hover) {
    background-color: #66cdaa;
    border-color: #66cdaa;
  }
}
</style>
