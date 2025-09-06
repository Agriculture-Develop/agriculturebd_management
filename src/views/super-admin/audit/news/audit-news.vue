<template>
  <div class="audit-news-container">
    <el-page-header @back="goBack" title="返回" content="新闻审核">
      <template #extra>
        <div class="header-actions">
          <el-button type="success" :style="{ backgroundColor: primaryColor }" @click="handleApprove">通过</el-button>
          <el-button type="danger" @click="handleReject">驳回</el-button>
        </div>
      </template>
    </el-page-header>

    <div class="news-content" v-if="newsDetail">
      <h1 class="news-title">{{ newsDetail.title }}</h1>

      <div class="news-meta">
        <span>作者：{{ newsDetail.author }}</span>
        <span>提交时间：{{ newsDetail.submitTime }}</span>
        <span>分类：{{ newsDetail.category }}</span>
        <el-tag :type="getStatusType(newsDetail.status)">{{ newsDetail.status }}</el-tag>
      </div>

      <div class="news-body">
        <div v-html="newsDetail.content"></div>
      </div>

      <div class="attachment-section" v-if="newsDetail.attachments && newsDetail.attachments.length > 0">
        <h3>附件</h3>
        <div class="attachment-list">
          <div v-for="(item, index) in newsDetail.attachments" :key="index" class="attachment-item">
            <el-icon>
              <Document />
            </el-icon>
            <span>{{ item.name }}</span>
            <el-button type="primary" :style="{ backgroundColor: primaryColor }" size="small"
              @click="previewAttachment(item)">预览</el-button>
          </div>
        </div>
      </div>

      <div class="audit-section">
        <h3>审核意见</h3>
        <el-input v-model="auditComment" type="textarea" :rows="4" placeholder="请输入审核意见..."></el-input>
      </div>
    </div>

    <!-- 审核确认对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="30%">
      <div>{{ dialogContent }}</div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" :style="{ backgroundColor: primaryColor }" @click="confirmAudit">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { Document } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 定义农产品相关的主题绿色
const primaryColor = '#2e8b57'; // 海绿色
// const secondaryColor = '#3cb371'; // 中等海绿色

// 当前审核的新闻详情
const newsDetail = ref({
  id: 1,
  title: '农产品价格走势分析',
  author: 'admin',
  submitTime: '2023-11-15 14:30:45',
  category: '科学技术',
  status: '审核中',
  content: `
    <p>近年来，随着市场需求的不断变化和农业生产技术的提高，农产品价格呈现出了一些新的变化趋势。</p>
    <h3>一、价格波动因素</h3>
    <p>1. 季节性因素：农产品生产具有明显的季节性，这直接导致了市场供应量的变化，进而影响价格。</p>
    <p>2. 气候条件：极端天气事件如干旱、洪涝等会直接影响农产品产量，从而影响价格。</p>
    <p>3. 政策因素：农业补贴政策、进出口政策等会对农产品价格形成支撑或抑制作用。</p>
    <h3>二、主要农产品价格走势</h3>
    <p>1. 粮食类：整体呈现稳中有升的态势，尤其是优质粮食品种价格上涨明显。</p>
    <p>2. 果蔬类：季节性波动较大，但总体上受到物流改善和储存技术提高的影响，价格波动幅度有所减小。</p>
    <p>3. 肉禽蛋类：受饲料价格和疫情影响，价格波动较大，但总体保持在较高水平。</p>
    <h3>三、未来展望</h3>
    <p>1. 随着农业科技的发展，预计农产品产量将进一步提高，但优质化、特色化农产品将更具价格优势。</p>
    <p>2. 气候变化可能导致极端天气事件增加，增加农产品价格的不确定性。</p>
    <p>3. "互联网+"农业模式的推广，将优化农产品供应链，减少中间环节，有利于农产品价格稳定。</p>
  `,
  attachments: [
    { id: 1, name: '价格走势数据表.xlsx', url: 'https://example.com/file1.xlsx' },
    { id: 2, name: '相关政策文件.pdf', url: 'https://example.com/file2.pdf' }
  ]
})

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
  dialogTitle.value = '确认通过审核'
  dialogContent.value = '确定要通过该新闻的审核吗？'
  auditAction.value = 'approve'
  dialogVisible.value = true
}

// 驳回审核
const handleReject = () => {
  if (!auditComment.value.trim()) {
    ElMessage.warning('驳回时必须填写审核意见')
    return
  }

  dialogTitle.value = '确认驳回审核'
  dialogContent.value = '确定要驳回该新闻的审核吗？'
  auditAction.value = 'reject'
  dialogVisible.value = true
}

// 确认审核操作
const confirmAudit = () => {
  if (auditAction.value === 'approve') {
    // 执行通过操作
    newsDetail.value.status = '已通过'
    ElMessage.success('审核已通过')
  } else {
    // 执行驳回操作
    newsDetail.value.status = '已拒绝'
    ElMessage.success('审核已驳回')
  }

  dialogVisible.value = false
  // 可以跳转回列表页
  // router.push('/super-admin/audit/list')
}

// 预览附件
const previewAttachment = (item: any) => {
  window.open(item.url, '_blank')
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
