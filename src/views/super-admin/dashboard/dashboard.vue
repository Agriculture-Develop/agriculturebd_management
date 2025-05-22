<template>
  <div class="dashboard-container">
    <h2 class="page-title">超级管理员控制台</h2>

    <!-- 概览数据卡片 -->
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="data-card" shadow="hover">
          <div class="data-card-body">
            <div class="data-card-icon bg-primary">
              <el-icon :size="24" color="#fff">
                <User />
              </el-icon>
            </div>
            <div class="data-card-content">
              <div class="data-card-value">10</div>
              <div class="data-card-label">总用户数</div>
            </div>
          </div>
          <div class="data-card-footer">
            <span>管理员：8名 | 超管：2名</span>
            <el-button link type="primary" @click="$router.push('/super-admin/user')">管理</el-button>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="data-card" shadow="hover">
          <div class="data-card-body">
            <div class="data-card-icon bg-success">
              <el-icon :size="24" color="#fff">
                <Document />
              </el-icon>
            </div>
            <div class="data-card-content">
              <div class="data-card-value">42</div>
              <div class="data-card-label">已发布新闻</div>
            </div>
          </div>
          <div class="data-card-footer">
            <span>本周新增：<span class="text-success">+5篇</span></span>
            <el-button link type="primary" @click="$router.push('/super-admin/news/list')">查看</el-button>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="data-card" shadow="hover">
          <div class="data-card-body">
            <div class="data-card-icon bg-warning">
              <el-icon :size="24" color="#fff">
                <EditPen />
              </el-icon>
            </div>
            <div class="data-card-content">
              <div class="data-card-value">15</div>
              <div class="data-card-label">草稿箱</div>
            </div>
          </div>
          <div class="data-card-footer">
            <span>待审核：<span class="text-warning">8篇</span></span>
            <el-button link type="primary" @click="$router.push('/super-admin/news/drafts')">查看</el-button>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="data-card" shadow="hover">
          <div class="data-card-body">
            <div class="data-card-icon bg-danger">
              <el-icon :size="24" color="#fff">
                <View />
              </el-icon>
            </div>
            <div class="data-card-content">
              <div class="data-card-value">9,862</div>
              <div class="data-card-label">总访问量</div>
            </div>
          </div>
          <div class="data-card-footer">
            <span>同比增长：<span class="text-success">+23.5%</span></span>
            <!-- <el-button link type="primary" @click="$router.push('/super-admin/statistics')">详情</el-button> -->
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="16">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">系统流量概览</span>
              <div class="card-actions">
                <el-radio-group v-model="dataPeriod" size="small">
                  <el-radio-button label="week">近一周</el-radio-button>
                  <el-radio-button label="month">近一月</el-radio-button>
                  <el-radio-button label="year">全年</el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </template>
          <div class="chart-area">
            <!-- 折线图 -->
            <div class="trend-chart">
              <div class="trend-chart-header">
                <div class="trend-chart-title">访问量/新闻发布量趋势</div>
                <div class="trend-data">
                  <div class="trend-item">
                    <div class="trend-dot" style="background-color: #409EFF"></div>
                    <div class="trend-label">访问量</div>
                    <div class="trend-value">1,523</div>
                    <div class="trend-change positive">+12.5%</div>
                  </div>
                  <div class="trend-item">
                    <div class="trend-dot" style="background-color: #67C23A"></div>
                    <div class="trend-label">发布量</div>
                    <div class="trend-value">132</div>
                    <div class="trend-change positive">+8.2%</div>
                  </div>
                </div>
              </div>
              <div class="chart-container" style="height: 300px">
                <!-- 模拟折线图 -->
                <div class="line-chart-placeholder">
                  <svg viewBox="0 0 800 300" class="line-chart-svg">
                    <path
                      d="M50,250 L100,220 L150,240 L200,180 L250,190 L300,150 L350,170 L400,120 L450,140 L500,90 L550,110 L600,70 L650,80 L700,40 L750,60"
                      fill="none" stroke="#409EFF" stroke-width="3"></path>
                    <path
                      d="M50,270 L100,260 L150,265 L200,250 L250,255 L300,230 L350,240 L400,220 L450,225 L500,210 L550,215 L600,200 L650,205 L700,190 L750,195"
                      fill="none" stroke="#67C23A" stroke-width="3"></path>
                  </svg>
                  <div class="chart-grid"></div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">新闻分类统计</span>
              <el-button link type="primary" @click="$router.push('/super-admin/news/category')">
                分类管理
              </el-button>
            </div>
          </template>
          <div class="chart-container" style="height: 300px">
            <div class="donut-chart-placeholder">
              <div class="donut-chart">
                <div class="donut-segment segment1"></div>
                <div class="donut-segment segment2"></div>
                <div class="donut-segment segment3"></div>
                <div class="donut-segment segment4"></div>
                <div class="donut-hole">
                  <div class="donut-hole-text">42</div>
                  <div class="donut-hole-subtext">总篇数</div>
                </div>
              </div>
            </div>
            <div class="chart-legend">
              <div class="legend-item">
                <div class="legend-color" style="background-color: #409EFF"></div>
                <div class="legend-text">科学技术</div>
                <div class="legend-value">15篇 (35.7%)</div>
              </div>
              <div class="legend-item">
                <div class="legend-color" style="background-color: #67C23A"></div>
                <div class="legend-text">市场分析</div>
                <div class="legend-value">12篇 (28.6%)</div>
              </div>
              <div class="legend-item">
                <div class="legend-color" style="background-color: #E6A23C"></div>
                <div class="legend-text">种植方法</div>
                <div class="legend-value">9篇 (21.4%)</div>
              </div>
              <div class="legend-item">
                <div class="legend-color" style="background-color: #F56C6C"></div>
                <div class="legend-text">政策法规</div>
                <div class="legend-value">6篇 (14.3%)</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 审核任务和快捷操作 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="16">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">待处理审核任务</span>
              <el-tag type="warning" effect="dark">{{ pendingTasks.length }}个待处理</el-tag>
            </div>
          </template>
          <el-table :data="pendingTasks" style="width: 100%" :show-header="false" size="large">
            <el-table-column width="50">
              <template #default="scope">
                <el-avatar :size="32" :style="{ backgroundColor: getStatusColor(scope.row.type) }">
                  {{ scope.row.type.substring(0, 1) }}
                </el-avatar>
              </template>
            </el-table-column>
            <el-table-column>
              <template #default="scope">
                <div class="task-item">
                  <div class="task-title">{{ scope.row.title }}</div>
                  <div class="task-info">
                    <span>{{ scope.row.author }}</span>
                    <span>{{ scope.row.time }}</span>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="right" width="120">
              <template #default="scope">
                <el-button size="small" :style="{ backgroundColor: primaryColor, color: '#fff' }"
                  @click="$router.push(`/super-admin/audit/news?id=${scope.row.id}`)">
                  立即审核
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="table-footer" v-if="pendingTasks.length > 0">
            <el-button type="primary" :style="{ backgroundColor: primaryColor }"
              @click="$router.push('/super-admin/audit/news')">
              查看全部审核任务
            </el-button>
          </div>
          <el-empty v-else description="暂无待处理审核任务"></el-empty>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="hover" class="quick-action-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">快捷操作</span>
            </div>
          </template>
          <div class="quick-actions">
            <div class="quick-action-row">
              <el-button :style="{ backgroundColor: primaryColor, color: '#fff' }" class="quick-action-btn">
                <el-icon>
                  <Plus />
                </el-icon>
                <span>创建用户</span>
              </el-button>
              <el-button :style="{ backgroundColor: secondaryColor, color: '#fff' }" class="quick-action-btn">
                <el-icon>
                  <Edit />
                </el-icon>
                <span>撰写新闻</span>
              </el-button>
            </div>
            <div class="quick-action-row">
              <el-button type="warning" class="quick-action-btn">
                <el-icon>
                  <Setting />
                </el-icon>
                <span>系统设置</span>
              </el-button>
              <el-button type="info" class="quick-action-btn">
                <el-icon>
                  <DataAnalysis />
                </el-icon>
                <span>数据统计</span>
              </el-button>
            </div>
          </div>

          <el-divider>系统信息</el-divider>

          <div class="system-info">
            <div class="system-info-item">
              <span class="info-label">系统版本:</span>
              <span class="info-value">v1.2.5</span>
            </div>
            <div class="system-info-item">
              <span class="info-label">上次更新:</span>
              <span class="info-value">2023-11-15</span>
            </div>
            <div class="system-info-item">
              <span class="info-label">服务器状态:</span>
              <span class="info-value">
                <el-tag type="success" size="small">运行正常</el-tag>
              </span>
            </div>
            <div class="system-info-item">
              <span class="info-label">数据库状态:</span>
              <span class="info-value">
                <el-tag type="success" size="small">运行正常</el-tag>
              </span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import {
  DataAnalysis,
  Document,
  Edit,
  EditPen,
  Plus,
  Setting,
  User,
  View
} from '@element-plus/icons-vue';
import { ref } from 'vue';

// 主题色
const primaryColor = '#2e8b57'; // 主绿色
const secondaryColor = '#409EFF'; // 蓝色

// 数据周期选择
const dataPeriod = ref('week');

// 待处理审核任务
const pendingTasks = ref([
  {
    id: 1,
    title: '农产品价格趋势分析',
    type: '新闻',
    author: '张三',
    time: '2023-11-20 14:30'
  },
  {
    id: 2,
    title: '有机农业技术指南',
    type: '新闻',
    author: '李四',
    time: '2023-11-20 11:05'
  },
  {
    id: 3,
    title: '智能农业物联网应用',
    type: '新闻',
    author: '王五',
    time: '2023-11-19 16:42'
  }
]);

// 获取状态颜色
const getStatusColor = (type: string) => {
  switch (type) {
    case '新闻':
      return '#409EFF';
    case '用户':
      return '#67C23A';
    case '评论':
      return '#E6A23C';
    default:
      return '#909399';
  }
};
</script>

<style scoped lang="less">
.dashboard-container {
  padding: 20px;

  .page-title {
    margin-bottom: 24px;
    font-size: 22px;
    font-weight: 600;
    color: #303133;
  }

  // 数据卡片样式
  .data-card {
    margin-bottom: 20px;
    border-radius: 8px;

    .data-card-body {
      display: flex;
      align-items: center;
      padding: 10px 0;
    }

    .data-card-icon {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 15px;
    }

    .bg-primary {
      background-color: #409EFF;
    }

    .bg-success {
      background-color: #2e8b57;
    }

    .bg-warning {
      background-color: #E6A23C;
    }

    .bg-danger {
      background-color: #F56C6C;
    }

    .data-card-content {
      flex-grow: 1;
    }

    .data-card-value {
      font-size: 24px;
      font-weight: 600;
      color: #303133;
      line-height: 1.2;
    }

    .data-card-label {
      font-size: 14px;
      color: #909399;
      margin-top: 4px;
    }

    .data-card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid #ebeef5;
      font-size: 13px;
      color: #909399;
    }
  }

  // 图表卡片
  .chart-card {
    margin-bottom: 20px;
    border-radius: 8px;
    height: 100%;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 20px;
      border-bottom: 1px solid #ebeef5;
    }

    .card-title {
      font-weight: 600;
      font-size: 16px;
    }

    .chart-container {
      padding: 20px;
    }
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  // 趋势图样式
  .trend-chart {
    height: 100%;
    display: flex;
    flex-direction: column;

    .trend-chart-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      padding: 0 10px;
    }

    .chart-container {
      flex: 1;
      min-height: 0;
    }
  }

  // 折线图占位
  .line-chart-placeholder {
    position: relative;
    height: 100%;
    width: 100%;

    .line-chart-svg {
      width: 100%;
      height: 100%;
      position: relative;
      z-index: 2;
    }
  }

  // 环形图样式
  .donut-chart-placeholder {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 20px 0;

    .donut-chart {
      position: relative;
      width: 180px;
      height: 180px;
      border-radius: 50%;
      background-color: #eee;
    }

    .donut-segment {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      clip: rect(0px, 180px, 180px, 90px);
    }

    .segment1 {
      background-color: #409EFF;
      clip-path: polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%, 50% 0%);
      transform: rotate(0deg);
    }

    .segment2 {
      background-color: #67C23A;
      clip-path: polygon(50% 0%, 100% 0%, 100% 50%, 50% 50%, 50% 0%);
      transform: rotate(130deg);
    }

    .segment3 {
      background-color: #E6A23C;
      clip-path: polygon(50% 0%, 100% 0%, 100% 40%, 50% 40%, 50% 0%);
      transform: rotate(230deg);
    }

    .segment4 {
      background-color: #F56C6C;
      clip-path: polygon(50% 0%, 100% 0%, 100% 30%, 50% 30%, 50% 0%);
      transform: rotate(310deg);
    }

    .donut-hole {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 60%;
      height: 60%;
      border-radius: 50%;
      background-color: white;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    .donut-hole-text {
      font-size: 28px;
      font-weight: 600;
      color: #303133;
      line-height: 1;
    }

    .donut-hole-subtext {
      font-size: 12px;
      color: #909399;
      margin-top: 4px;
    }
  }

  // 图表图例
  .chart-legend {
    margin-top: 20px;
    padding: 0 20px;

    .legend-item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }

    .legend-color {
      width: 12px;
      height: 12px;
      border-radius: 3px;
      margin-right: 10px;
    }

    .legend-text {
      flex: 1;
      font-size: 14px;
      color: #606266;
    }

    .legend-value {
      font-size: 13px;
      color: #303133;
      font-weight: 500;
    }
  }

  // 审核任务表格
  .task-item {
    .task-title {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 4px;
    }

    .task-info {
      font-size: 13px;
      color: #909399;

      span {
        margin-right: 15px;

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }

  .table-footer {
    margin-top: 15px;
    text-align: center;
  }

  // 快捷操作区
  .quick-action-card {
    height: 100%;
  }

  .quick-actions {
    margin-bottom: 20px;

    .quick-action-row {
      display: flex;
      gap: 10px;
      margin-bottom: 10px;

      .quick-action-btn {
        flex: 1;
        height: 70px;
        font-size: 14px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .el-icon {
          font-size: 20px;
          margin-bottom: 6px;
        }
      }
    }
  }

  // 系统信息样式
  .system-info {
    .system-info-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      font-size: 14px;

      .info-label {
        color: #606266;
      }

      .info-value {
        font-weight: 500;
        color: #303133;
      }
    }
  }

  // 颜色样式
  .text-success {
    color: #67C23A;
  }

  .text-warning {
    color: #E6A23C;
  }

  .text-danger {
    color: #F56C6C;
  }
}
</style>
