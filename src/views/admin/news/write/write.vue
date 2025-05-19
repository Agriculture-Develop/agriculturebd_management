<template>
  <div class="write-news-container">
    <h1>撰写新闻</h1>

    <el-card class="form-card">
      <el-form :model="newsForm" :rules="rules" ref="newsFormRef" label-width="100px">
        <el-form-item label="新闻标题" prop="title">
          <el-input v-model="newsForm.title" placeholder="请输入新闻标题"></el-input>
        </el-form-item>

        <el-form-item label="新闻分类" prop="category">
          <el-select v-model="newsForm.category" placeholder="请选择新闻分类">
            <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="封面图片" prop="coverImage">
          <el-upload class="upload-demo" action="" :http-request="uploadImage" :show-file-list="false"
            :before-upload="beforeUpload">
            <el-image v-if="newsForm.coverImage" :src="newsForm.coverImage" class="cover-image"></el-image>
            <el-button v-else type="primary" :style="{ backgroundColor: primaryColor }">点击上传封面</el-button>
            <template #tip>
              <div class="el-upload__tip">
                只能上传 jpg/png 文件，且不超过 2MB
              </div>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item label="新闻摘要" prop="summary">
          <el-input v-model="newsForm.summary" type="textarea" :rows="3" placeholder="请输入新闻摘要"></el-input>
        </el-form-item>

        <el-form-item label="新闻内容" prop="content">
          <div class="editor-container">
            <!-- 此处可以集成富文本编辑器，如TinyMCE、CKEditor等 -->
            <el-input v-model="newsForm.content" type="textarea" :rows="12" placeholder="请输入新闻内容"></el-input>
          </div>
        </el-form-item>

        <el-form-item label="附件">
          <el-upload class="upload-demo" action="" :http-request="uploadAttachment" multiple :file-list="fileList">
            <el-button type="primary" :style="{ backgroundColor: primaryColor }">上传附件</el-button>
            <template #tip>
              <div class="el-upload__tip">
                支持上传多个附件，单个文件不超过 10MB
              </div>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :style="{ backgroundColor: primaryColor }"
            @click="submitForm(newsFormRef, 'publish')">发布</el-button>
          <el-button :style="{ backgroundColor: secondaryColor, color: '#fff' }"
            @click="submitForm(newsFormRef, 'draft')">保存草稿</el-button>
          <el-button @click="resetForm(newsFormRef)">重置</el-button>
          <el-button @click="previewNews">预览</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 预览对话框 -->
    <el-dialog v-model="previewDialogVisible" title="新闻预览" width="70%">
      <div class="preview-container">
        <h2 class="preview-title">{{ newsForm.title || '未设置标题' }}</h2>

        <div class="preview-meta">
          <span>分类：{{ newsForm.category || '未选择分类' }}</span>
          <span>作者：{{ currentUser }}</span>
          <span>时间：{{ currentDate }}</span>
        </div>

        <div v-if="newsForm.coverImage" class="preview-cover">
          <el-image :src="newsForm.coverImage" fit="cover"></el-image>
        </div>

        <div class="preview-summary">
          <strong>摘要：</strong>{{ newsForm.summary || '未设置摘要' }}
        </div>

        <div class="preview-content">
          <div>{{ newsForm.content || '未输入内容' }}</div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="previewDialogVisible = false">关闭</el-button>
          <el-button type="primary" :style="{ backgroundColor: primaryColor }"
            @click="submitForm(newsFormRef, 'publish')">直接发布</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules, UploadProps, UploadUserFile } from 'element-plus';
import { ElMessage } from 'element-plus';
import { computed, reactive, ref } from 'vue';

// 定义农产品相关的主题绿色
const primaryColor = '#2e8b57'; // 海绿色
const secondaryColor = '#3cb371'; // 中等海绿色

const newsFormRef = ref<FormInstance>();
const previewDialogVisible = ref(false);

interface Attachment {
  name: string;
  url: string;
  size?: number;
}

// 新闻表单数据
const newsForm = reactive({
  title: '',
  category: '',
  summary: '',
  content: '',
  coverImage: '',
  attachments: [] as Attachment[]
});

// 附件列表
const fileList = ref<UploadUserFile[]>([]);

// 新闻分类选项
const categoryOptions = ref([
  { value: '科学技术', label: '科学技术' },
  { value: '种植方法', label: '种植方法' },
  { value: '行业动态', label: '行业动态' },
  { value: '政策法规', label: '政策法规' },
  { value: '市场分析', label: '市场分析' },
  { value: '农产品价格', label: '农产品价格' }
]);

// 当前用户（实际应用中应该从用户系统获取）
const currentUser = 'admin';

// 当前日期
const currentDate = computed(() => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
});

// 表单验证规则
const rules = reactive<FormRules>({
  title: [
    { required: true, message: '请输入新闻标题', trigger: 'blur' },
    { min: 3, max: 50, message: '标题长度应在 3 到 50 个字符之间', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择新闻分类', trigger: 'change' }
  ],
  summary: [
    { required: true, message: '请输入新闻摘要', trigger: 'blur' },
    { max: 200, message: '摘要不应超过200个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入新闻内容', trigger: 'blur' },
    { min: 10, message: '内容至少需要 10 个字符', trigger: 'blur' }
  ]
});

// 提交表单
const submitForm = async (formEl: FormInstance | undefined, type: 'publish' | 'draft') => {
  if (!formEl) return;

  await formEl.validate((valid, fields) => {
    if (valid) {
      // 构建提交的数据
      const submitData = {
        ...newsForm,
        // 如果是发布，状态为待审核；如果是保存草稿，状态为草稿
        status: type === 'publish' ? '待审核' : '草稿',
        createTime: new Date().toISOString()
      };

      console.log('提交的新闻数据:', submitData);

      // 这里可以调用API提交数据
      // ...

      // 提示成功
      ElMessage.success(type === 'publish' ? '新闻已提交审核' : '草稿已保存');

      // 重置表单
      if (type === 'publish') {
        resetForm(formEl);
      }
    } else {
      console.log('表单验证失败:', fields);
    }
  });
};

// 重置表单
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  newsForm.coverImage = '';
  newsForm.attachments = [];
  fileList.value = [];
};

// 预览新闻
const previewNews = () => {
  if (!newsForm.title || !newsForm.content) {
    ElMessage.warning('请至少填写标题和内容后再预览');
    return;
  }
  previewDialogVisible.value = true;
};

// 上传前校验图片
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const isJPG = file.type === 'image/jpeg';
  const isPNG = file.type === 'image/png';
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isJPG && !isPNG) {
    ElMessage.error('上传封面图片只能是 JPG 或 PNG 格式!');
  }
  if (!isLt2M) {
    ElMessage.error('上传封面图片大小不能超过 2MB!');
  }
  return (isJPG || isPNG) && isLt2M;
};

// 上传封面图片
const uploadImage = (options: any) => {
  // 这里应该调用实际的上传API，现在使用模拟数据
  const file = options.file;
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    // 设置预览图片
    newsForm.coverImage = reader.result as string;
    ElMessage.success('封面图片上传成功');
  };
};

// 上传附件
const uploadAttachment = (options: any) => {
  // 这里应该调用实际的上传API，现在使用模拟数据
  const file = options.file;

  // 添加到附件列表
  fileList.value.push({
    name: file.name,
    url: URL.createObjectURL(file)
  });

  // 添加到表单数据
  newsForm.attachments.push({
    name: file.name,
    url: URL.createObjectURL(file),
    size: file.size
  });

  ElMessage.success(`附件 ${file.name} 上传成功`);
};
</script>

<style scoped lang="less">
.write-news-container {
  padding: 20px;

  h1 {
    margin-bottom: 20px;
    color: #2e8b57; // 海绿色
  }

  .form-card {
    margin-bottom: 20px;
  }

  .editor-container {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    min-height: 300px;
  }

  .cover-image {
    width: 200px;
    height: 150px;
    object-fit: cover;
    margin-bottom: 10px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }

  .preview-container {
    padding: 20px;
    background-color: #fff;

    .preview-title {
      font-size: 24px;
      text-align: center;
      margin-bottom: 20px;
      color: #2e8b57; // 使用主题绿色
    }

    .preview-meta {
      display: flex;
      justify-content: center;
      gap: 20px;
      color: #666;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #eee;
    }

    .preview-cover {
      width: 100%;
      text-align: center;
      margin-bottom: 20px;

      img {
        max-width: 100%;
        max-height: 300px;
        object-fit: contain;
      }
    }

    .preview-summary {
      padding: 15px;
      background-color: #f9f9f9;
      margin-bottom: 20px;
      border-left: 4px solid #2e8b57; // 使用主题绿色
    }

    .preview-content {
      line-height: 1.8;
      color: #333;
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
}
</style>
