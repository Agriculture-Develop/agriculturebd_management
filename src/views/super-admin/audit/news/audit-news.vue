<template>
  <div class="audit-news-container">
    <el-page-header
      @back="goBack"
      title="返回"
      :content="newsModel === 'publish' ? '新闻发布' : '新闻审核'"
    >
      <template #extra>
        <div class="header-actions">
          <el-button
            type="success"
            :style="{ backgroundColor: primaryColor }"
            @click="handleApprove"
            >{{ newsModel === 'publish' ? '发布' : '通过' }}</el-button
          >
          <el-button type="danger" @click="handleReject">{{
            newsModel === 'publish' ? '下线' : '驳回'
          }}</el-button>
        </div>
      </template>
    </el-page-header>

    <div class="news-content" v-if="newsForm">
      <h1 class="news-title">{{ newsForm.title }}</h1>

      <div class="news-meta">
        <span>作者：{{ newsForm.source }}</span>
        <span>提交时间：{{ newsForm.created_at }}</span>
        <span>分类：{{ newsForm.category }}</span>
        <!-- <el-tag :type="getStatusType(newsForm.status)">{{ newsForm.status }}</el-tag> -->
        <span style="display: flex; gap: 20px; width: 80px; height: 30px">
          <el-tag size="large" type="success" v-for="item in newsForm.keyword" :key="item">{{
            item
          }}</el-tag>
        </span>
      </div>

      <div class="images-wrapper">
        <div class="image-container" v-for="item in newsForm.files_url" :key="item">
          <el-image :src="newsImg(item)" fit="contain" class="preview-img" />
        </div>
      </div>
      <div class="news-body">
        <div v-html="newsForm.content"></div>
      </div>

      <div style="display: flex; gap: 20px; width: 80px; height: 30px">
        <el-tag size="large" type="success" v-for="item in newsForm.keyword" :key="item">{{
          item
        }}</el-tag>
      </div>
    </div>

    <!-- 审核确认对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="30%">
      <div>{{ dialogContent }}</div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" :style="{ backgroundColor: primaryColor }" @click="confirmAudit"
            >确认</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useNewsStore } from '@/stores/news/news'
import { newsImg } from '@/utils/imges'
const store = useNewsStore()
const route = useRoute()
const router = useRouter()
const newsId = ref<string>()
const newsModel = ref<string>()
type Inews = {
  id: number
  title: string
  keyword: string[]
  source: string
  content: string
  cover_url: string
  files_url: string[]
  status: string
  author: string
  created_at: string
  category: string
}
const loadDetail = async (id: string) => {
  console.log(' id:', id)
  // TODO: 接口获取数据并填充表单
  newsId.value = id
  const res = await store.getNewsID(String(id))
  newsForm.value = res
  console.log(res)
}

onMounted(() => {
  if (route.query.id) {
    console.log('编辑模式，id:', route.query.id)
    loadDetail(route.query.id as string)
  }
  if (route.query.type) {
    newsModel.value = route.query.type as string
  }
})
// 定义农产品相关的主题绿色
const primaryColor = '#2e8b57' // 海绿色
// const secondaryColor = '#3cb371'; // 中等海绿色

// 当前审核的新闻详情
const newsForm = ref<Inews>()

// 审核意见
const auditComment = ref('')

// 对话框相关
const dialogVisible = ref(false)
const dialogTitle = ref('')
const dialogContent = ref('')
const auditAction = ref('')

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

// 返回上一页
const goBack = () => {
  router.back()
}

// 通过审核
const handleApprove = () => {
  if (newsModel.value !== 'publish') {
    dialogTitle.value = '确认通过审核'
    dialogContent.value = '确定要通过该新闻的审核吗？'
    auditAction.value = 'approve'
    dialogVisible.value = true
  } else {
    dialogTitle.value = '确认发布'
    dialogContent.value = '确定要发布该新闻吗？'
    auditAction.value = 'approve'
    dialogVisible.value = true
  }
}
// 驳回审核
const handleReject = () => {
  if (newsModel.value !== 'publish') {
    dialogTitle.value = '确认驳回审核'
    dialogContent.value = '确定要驳回该新闻的审核吗？'
    auditAction.value = 'reject'
    dialogVisible.value = true
  } else {
    dialogTitle.value = '确认下线'
    dialogContent.value = '确定下线发布该新闻吗？'
    auditAction.value = 'reject'
    dialogVisible.value = true
  }
}

// 确认审核操作
const confirmAudit = async () => {
  console.log(auditAction.value)

  if (auditAction.value === 'approve') {
    // 执行通过操作

    await Apis.news.put_admin_news_status_id({
      pathParams: { id: String(newsForm.value?.id) },
      data: { status: newsModel.value !== 'publish' ? '审核已通过' : '已发布' },
    })
    loadDetail(route.query.id as string)
    ElMessage.success('审核已通过')
  } else {
    // 执行驳回操作
    await Apis.news.put_admin_news_status_id({
      pathParams: { id: String(newsForm.value?.id) },
      data: { status: newsModel.value !== 'publish' ? '审核已驳回' : '已下线' },
    })
    ElMessage.success('审核已驳回')
  }

  dialogVisible.value = false
  loadDetail(route.query.id as string)

  // 可以跳转回列表页
  router.push('/super-admin/audit/list')
}
</script>

<style scoped lang="less">
.audit-news-container {
  padding: 20px;

  .header-actions {
    display: flex;
    gap: 10px;
  }

  .news-content {
    margin-top: 20px;
    background-color: #fff;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .news-title {
      font-size: 24px;
      text-align: center;
      margin-bottom: 20px;
      color: #2e8b57; // 海绿色主题
    }

    .news-meta {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 20px;
      color: #666;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #eee;
    }

    .news-body {
      line-height: 1.8;
      color: #333;
    }

    h3 {
      color: #2e8b57; // 海绿色
      margin: 15px 0 10px;
    }

    .attachment-section {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px dashed #eee;

      .attachment-list {
        display: flex;
        flex-direction: column;
        gap: 10px;

        .attachment-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          background-color: #f5f7fa;
          border-radius: 4px;

          span {
            flex: 1;
          }
        }
      }
    }

    .audit-section {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px dashed #eee;
    }
  }
  .images-wrapper {
    display: flex;
    flex-wrap: wrap; /* 超出自动换行，如果不想换行可去掉 */
    gap: 40px; /* 图片之间的间距 */
    align-items: center;
    justify-content: center;
  }
  .image-container {
    width: 200px;
    height: 150px;
    display: flex;
    align-items: center; /* 垂直居中 */
    justify-content: center; /* 水平居中 */
    overflow: hidden; /* 避免图片溢出 */
    border: 1px solid #eee;
    border-radius: 6px;
  }
  .preview-img {
    width: 100%;
    height: 100%;
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
    background-color: #2e8b57; // 海绿色
    border-color: #2e8b57;
  }

  :deep(.el-button--success:hover) {
    background-color: #3cb371; // 中等海绿色
    border-color: #3cb371;
  }
}
</style>
