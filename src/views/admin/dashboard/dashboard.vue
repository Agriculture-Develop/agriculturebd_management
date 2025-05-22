<template>
  <div class="dashboard-container">
    <h2 class="page-title">管理员控制台</h2>

    <!-- 数据卡片行 -->
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="data-card" shadow="hover">
          <div class="data-card-body">
            <div class="data-card-icon" style="background-color: rgba(64, 158, 255, 0.1)">
              <el-icon :size="24" color="#409EFF">
                <Document />
              </el-icon>
            </div>
            <div class="data-card-content">
              <div class="data-card-value">12</div>
              <div class="data-card-label">已发布新闻</div>
            </div>
          </div>
          <div class="data-card-footer">
            <span>较上周 <span class="text-success">+3篇</span></span>
            <el-button link type="primary" @click="$router.push('/admin/publish/published')">查看详情</el-button>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="data-card" shadow="hover">
          <div class="data-card-body">
            <div class="data-card-icon" style="background-color: rgba(46, 139, 87, 0.1)">
              <el-icon :size="24" color="#2E8B57">
                <Edit />
              </el-icon>
            </div>
            <div class="data-card-content">
              <div class="data-card-value">5</div>
              <div class="data-card-label">草稿箱</div>
            </div>
          </div>
          <div class="data-card-footer">
            <span>较上周 <span class="text-warning">-2篇</span></span>
            <el-button link type="primary" @click="$router.push('/admin/publish/unpublished')">查看详情</el-button>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="data-card" shadow="hover">
          <div class="data-card-body">
            <div class="data-card-icon" style="background-color: rgba(230, 162, 60, 0.1)">
              <el-icon :size="24" color="#E6A23C">
                <Timer />
              </el-icon>
            </div>
            <div class="data-card-content">
              <div class="data-card-value">3</div>
              <div class="data-card-label">待审核</div>
            </div>
          </div>
          <div class="data-card-footer">
            <span>较上周 <span class="text-success">+1篇</span></span>
            <el-button link type="primary" @click="$router.push('/admin/audit/list')">审核管理</el-button>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="data-card" shadow="hover">
          <div class="data-card-body">
            <div class="data-card-icon" style="background-color: rgba(245, 108, 108, 0.1)">
              <el-icon :size="24" color="#F56C6C">
                <View />
              </el-icon>
            </div>
            <div class="data-card-content">
              <div class="data-card-value">3,576</div>
              <div class="data-card-label">本周访问量</div>
            </div>
          </div>
          <div class="data-card-footer">
            <span>较上周 <span class="text-success">+9.2%</span></span>
            <!-- <el-button link type="primary" @click="$router.push('/admin/statistics')">数据分析</el-button> -->
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表行 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :xs="24" :lg="16">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>近期新闻发布统计</span>
              <el-radio-group v-model="chartTimeRange" size="small">
                <el-radio-button label="week">本周</el-radio-button>
                <el-radio-button label="month">本月</el-radio-button>
                <el-radio-button label="year">全年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-container">
            <div class="echarts-container" style="height: 350px">
              <!-- 这里是图表组件 -->
              <div class="chart-placeholder">
                <div class="chart-bars">
                  <div class="chart-bar" style="height: 40%"></div>
                  <div class="chart-bar" style="height: 70%"></div>
                  <div class="chart-bar" style="height: 60%"></div>
                  <div class="chart-bar" style="height: 90%"></div>
                  <div class="chart-bar" style="height: 50%"></div>
                  <div class="chart-bar" style="height: 75%"></div>
                  <div class="chart-bar" style="height: 65%"></div>
                </div>
                <div class="chart-legend">
                  <span>周一</span>
                  <span>周二</span>
                  <span>周三</span>
                  <span>周四</span>
                  <span>周五</span>
                  <span>周六</span>
                  <span>周日</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="8">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>内容分类占比</span>
            </div>
          </template>
          <div class="pie-chart-container" style="height: 350px">
            <!-- 饼图占位 -->
            <div class="pie-placeholder">
              <div class="pie-slice slice1"></div>
              <div class="pie-slice slice2"></div>
              <div class="pie-slice slice3"></div>
              <div class="pie-slice slice4"></div>
              <div class="pie-center"></div>
            </div>
            <div class="pie-legend">
              <div class="pie-legend-item">
                <span class="pie-legend-color" style="background-color: #409EFF"></span>
                <span>科学技术 (35%)</span>
              </div>
              <div class="pie-legend-item">
                <span class="pie-legend-color" style="background-color: #67C23A"></span>
                <span>市场分析 (28%)</span>
              </div>
              <div class="pie-legend-item">
                <span class="pie-legend-color" style="background-color: #E6A23C"></span>
                <span>种植方法 (20%)</span>
              </div>
              <div class="pie-legend-item">
                <span class="pie-legend-color" style="background-color: #F56C6C"></span>
                <span>政策法规 (17%)</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 系统通知和快捷操作 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :xs="24" :md="16">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>系统通知</span>
              <el-button link type="primary">查看全部</el-button>
            </div>
          </template>
          <div class="notice-list">
            <div class="notice-item">
              <el-icon color="#E6A23C">
                <Bell />
              </el-icon>
              <div class="notice-content">
                <div class="notice-title">本周新闻发布提醒</div>
                <div class="notice-desc">请按时完成本周农产品市场分析报告的发布工作</div>
                <div class="notice-time">2023-11-20 09:30</div>
              </div>
            </div>
            <el-divider />
            <div class="notice-item">
              <el-icon color="#F56C6C">
                <Warning />
              </el-icon>
              <div class="notice-content">
                <div class="notice-title">系统升级通知</div>
                <div class="notice-desc">系统将于本周六凌晨2:00-4:00进行升级维护，请提前做好准备</div>
                <div class="notice-time">2023-11-19 16:45</div>
              </div>
            </div>
            <el-divider />
            <div class="notice-item">
              <el-icon color="#67C23A">
                <Promotion />
              </el-icon>
              <div class="notice-content">
                <div class="notice-title">内容推广活动</div>
                <div class="notice-desc">新一期农产品推广活动已开始，请关注相关专题内容的创建</div>
                <div class="notice-time">2023-11-18 10:20</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :md="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>快捷操作</span>
            </div>
          </template>
          <div class="quick-actions">
            <el-button type="primary" :style="{ backgroundColor: '#2e8b57' }" @click="$router.push('/admin/news/write')">
              <el-icon>
                <EditPen />
              </el-icon>撰写新闻
            </el-button>
            <el-button :style="{ backgroundColor: '#409EFF', color: '#fff' }" @click="$router.push('/admin/audit/list')">
              <el-icon>
                <Files />
              </el-icon>审核列表
            </el-button>
            <el-button type="warning" @click="$router.push('/admin/publish/published')">
              <el-icon>
                <List />
              </el-icon>已发布管理
            </el-button>
            <el-button type="info" @click="$router.push('/admin/statistics')">
              <el-icon>
                <DataLine />
              </el-icon>数据统计
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import {
  Bell,
  DataLine,
  Document, Edit,
  EditPen, Files,
  List,
  Promotion,
  Timer, View,
  Warning
} from '@element-plus/icons-vue';
import { ref } from 'vue';

// 图表时间范围
const chartTimeRange = ref('week');
</script>

<style scoped lang="less">
.dashboard-container {
  padding: 20px;

  .page-title {
    margin-bottom: 24px;
    font-size: 22px;
    color: #303133;
    font-weight: 600;
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

  // 图表卡片样式
  .chart-card {
    margin-bottom: 20px;
    border-radius: 8px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  // 通知列表样式
  .notice-list {
    .notice-item {
      display: flex;
      align-items: flex-start;
      padding: 10px 0;

      .el-icon {
        margin-top: 2px;
        margin-right: 10px;
      }

      .notice-content {
        flex-grow: 1;
      }

      .notice-title {
        font-weight: 500;
        margin-bottom: 5px;
      }

      .notice-desc {
        font-size: 13px;
        color: #606266;
        margin-bottom: 5px;
      }

      .notice-time {
        font-size: 12px;
        color: #909399;
      }
    }
  }

  // 快捷操作按钮
  .quick-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;

    .el-button {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      .el-icon {
        margin-right: 5px;
      }
    }
  }

  // 文字样式
  .text-success {
    color: #67C23A;
  }

  .text-warning {
    color: #E6A23C;
  }

  .text-danger {
    color: #F56C6C;
  }

  // 图表占位样式
  .chart-placeholder {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    .chart-bars {
      height: 90%;
      display: flex;
      align-items: flex-end;
      justify-content: space-around;

      .chart-bar {
        width: 40px;
        background-color: rgba(64, 158, 255, 0.6);
        border-radius: 4px 4px 0 0;
        transition: height 0.5s;

        &:hover {
          background-color: #409EFF;
        }
      }
    }

    .chart-legend {
      height: 10%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      color: #909399;
      font-size: 12px;
      padding-top: 10px;
    }
  }

  // 饼图占位样式
  .pie-placeholder {
    width: 200px;
    height: 200px;
    position: relative;
    border-radius: 50%;
    margin: 20px auto;
    overflow: hidden;

    .pie-slice {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .slice1 {
      background-color: #409EFF;
      clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 50% 50%);
    }

    .slice2 {
      background-color: #67C23A;
      clip-path: polygon(50% 50%, 100% 100%, 50% 100%, 50% 50%);
    }

    .slice3 {
      background-color: #E6A23C;
      clip-path: polygon(50% 50%, 50% 100%, 0% 100%, 0% 30%, 50% 50%);
    }

    .slice4 {
      background-color: #F56C6C;
      clip-path: polygon(50% 50%, 0% 30%, 0% 0%, 50% 0%, 50% 50%);
    }

    .pie-center {
      position: absolute;
      width: 60%;
      height: 60%;
      background-color: white;
      border-radius: 50%;
      top: 20%;
      left: 20%;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
  }

  .pie-legend {
    margin-top: 20px;

    .pie-legend-item {
      display: flex;
      align-items: center;
      margin-bottom: 8px;

      .pie-legend-color {
        width: 12px;
        height: 12px;
        margin-right: 8px;
        border-radius: 3px;
      }
    }
  }
}
</style>
