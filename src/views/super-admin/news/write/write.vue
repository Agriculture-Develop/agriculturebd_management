<template>
  <div class="write-news-container">
    <h1>撰写新闻</h1>

    <el-card class="form-card">
      <el-form :model="newsForm" :rules="rules" ref="newsFormRef" label-width="100px">
        <el-form-item label="新闻标题" prop="title">
          <el-input v-model="newsForm.title" placeholder="请输入新闻标题"></el-input>
        </el-form-item>

        <el-form-item label="新闻分类" prop="category_id">
          <el-select v-model="newsForm.category_id" placeholder="请选择新闻分类">
            <el-option
              v-for="item in newsCategories"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="发布状态" prop="status">
          <el-select v-model="newsForm.status" placeholder="请选择发布状态">
            <el-option label="审核中" value="直接发布"></el-option>
            <el-option label="直接发布" value="已发布"></el-option>
          </el-select>
          <el-tooltip content="超级管理员可以选择直接发布或提交审核" placement="right">
            <el-icon class="el-icon--right">
              <QuestionFilled />
            </el-icon>
          </el-tooltip>
        </el-form-item>

        <!-- <el-form-item label="置顶文章">
          <el-switch v-model="newsForm.isTop" />
        </el-form-item> -->
        <el-form-item label="类型" prop="types">
          <el-select v-model="newsForm.types" placeholder="请选择类型">
            <el-option label="新闻" value="新闻"></el-option>
            <el-option label="政策" value="政策"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="封面图片" prop="cover_url">
          <el-upload
            v-model:file-list="coverList"
            action="/public/files/news"
            list-type="picture-card"
            name="file"
            :rules="[{ required: true, message: '请上传封面图片', trigger: 'change' }]"
            :limit="1"
            :headers="{ Authorization: `Bearer ${localCache.getCache('token')}` }"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="新闻图片" prop="files_url">
          <el-upload
            v-model:file-list="fileList"
            action="/public/files/news"
            list-type="picture-card"
            :rules="[
              {
                type: 'array',
                required: true,
                message: '请至少上传一张新闻图片',
                trigger: 'change',
                min: 1,
              },
            ]"
            name="file"
            :limit="3"
            :headers="{ Authorization: `Bearer ${localCache.getCache('token')}` }"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>

          <el-dialog v-model="dialogVisible">
            <img w-full :src="dialogImageUrl" alt="Preview Image" />
          </el-dialog>
        </el-form-item>

        <el-form-item label="新闻内容" prop="content">
          <div class="editor-container">
            <Toolbar
              style="border-bottom: 1px solid #dcdfe6"
              :editor="editorRef"
              :defaultConfig="toolbarConfig"
              mode="default"
            />
            <Editor
              style="height: 400px; overflow-y: hidden"
              v-model="valueHtml"
              :defaultConfig="editorConfig"
              mode="default"
              @onCreated="handleCreated"
              @onChange="handleChange"
            />
          </div>
        </el-form-item>
        <el-form-item label="新闻摘要" prop="abstract">
          <el-input
            type="textarea"
            :rows="3"
            v-model="newsForm.abstract"
            placeholder="请输入新闻摘要"
          ></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="source">
          <el-input v-model="newsForm.source" placeholder="文章作者"></el-input>
        </el-form-item>
        <el-form-item label="文章类别" prop="types"
          ><el-radio-group v-model="newsForm.types" size="large">
            <el-radio-button label="政策" value="政策" />
            <el-radio-button label="新闻" value="新闻" /> </el-radio-group
        ></el-form-item>
        <el-form-item label="关键词" prop="keyword">
          <el-tag
            v-for="(tag, index) in newsForm.keyword"
            :key="index"
            closable
            :disable-transitions="false"
            @close="handleTagClose(tag)"
            class="tag-item"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="inputVisible"
            ref="tagInputRef"
            v-model="inputValue"
            class="tag-input"
            size="small"
            @keyup.enter="handleInputConfirm"
            @blur="handleInputConfirm"
          />
          <el-button
            v-else
            class="tag-button"
            :style="{ color: primaryColor }"
            size="small"
            @click="showInput"
          >
            + 添加关键词
          </el-button>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            :style="{ backgroundColor: primaryColor }"
            @click="submitForm(newsFormRef)"
            >提交</el-button
          >
          <el-button
            :style="{ backgroundColor: secondaryColor, color: '#fff' }"
            @click="submitForm(newsFormRef, 'draft')"
            >保存草稿</el-button
          >
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
          <span>分类：{{ newsForm.category_id || '未选择分类' }}</span>
          <span>作者：{{ currentUser }}</span>
          <span>时间：{{ currentDate }}</span>
        </div>

        <div v-if="newsForm.cover_url" class="preview-cover">
          <el-image :src="newsForm.cover_url" fit="cover"></el-image>
        </div>

        <div class="preview-content">
          <div>{{ newsForm.content || '未输入内容' }}</div>
        </div>

        <div class="preview-keywords" v-if="newsForm.keyword && newsForm.keyword.length > 0">
          <div class="keywords-title">关键词：</div>
          <el-tag
            v-for="(tag, index) in newsForm.keyword"
            :key="index"
            size="small"
            class="keyword-tag"
            :style="{ backgroundColor: '#e8f4ee', color: '#2e8b57', borderColor: '#2e8b57' }"
          >
            {{ tag }}
          </el-tag>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="previewDialogVisible = false">关闭</el-button>
          <el-button
            type="primary"
            :style="{ backgroundColor: primaryColor }"
            @click="submitForm(newsFormRef)"
            >提交</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { QuestionFilled } from '@element-plus/icons-vue'
import type { FormInstance, FormRules, UploadProps, UploadUserFile } from 'element-plus'
import { ElMessage } from 'element-plus'
import { computed, nextTick, reactive, ref, shallowRef, onBeforeUnmount } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { localCache } from '@/utils/cache/cache'

// 定义农产品相关的主题绿色
const primaryColor = '#2e8b57' // 海绿色
const secondaryColor = '#3cb371' // 中等海绿色

const newsFormRef = ref<FormInstance>()
const previewDialogVisible = ref(false)

// 标签相关
const inputValue = ref('')
const inputVisible = ref(false)
const tagInputRef = ref<HTMLInputElement>()

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 内容 HTML
const valueHtml = ref('<p>请输入新闻内容</p>')

// 工具栏配置
const toolbarConfig = {
  excludeKeys: ['uploadVideo', 'insertTable', 'codeBlock', 'todo'],
}

// 编辑器配置
const editorConfig = {
  placeholder: '请输入新闻内容...',
  MENU_CONF: {},
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

// 编辑器回调函数
const handleCreated = (editor: any) => {
  editorRef.value = editor
}

// 监听内容变化
const handleChange = (editor: any) => {
  newsForm.content = editor.getHtml()
}

// 新闻表单数据
const newsForm = reactive({
  title: '',
  category_id: 2,
  status: '审核中',

  content: '<p>请输入新闻内容</p>',
  cover_url: '',
  files_url: [''],
  keyword: [] as string[],
  // attachments: [] as Attachment[],
  abstract: '',
  source: '',
  types: '新闻',
})
//获取新闻分类
type InewsCategory = {
  name: string
  description: string
  id: number
  sort_order: string
  created_at: string
}
const newsCategories = ref<InewsCategory[]>([])
const getCategory = async () => {
  const res = await Apis.newsCategories.get_admin_news_categories_list()
  console.log(res)
  newsCategories.value = res.data.list
}
getCategory()
// 上传图片
const fileList = ref<UploadUserFile[]>([])
const coverList = ref<UploadUserFile[]>([])

computed(() => console.log(fileList.value))
const dialogImageUrl = ref('')
const dialogVisible = ref(false)

// 附件列表
// const fileList = ref<UploadUserFile[]>([])

// 当前用户（实际应用中应该从用户系统获取）
const currentUser = 'admin'

// 当前日期
const currentDate = computed(() => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
})

// 表单验证规则
const rules = reactive<FormRules>({
  title: [
    { required: true, message: '请输入新闻标题', trigger: 'blur' },
    { min: 3, max: 50, message: '标题长度应在 3 到 50 个字符之间', trigger: 'blur' },
  ],
  category_id: [{ required: true, message: '请选择新闻分类', trigger: 'change' }],
  status: [{ required: true, message: '请选择发布状态', trigger: 'change' }],

  content: [
    { required: true, message: '请输入新闻内容', trigger: 'blur' },
    { min: 10, message: '内容至少需要 10 个字符', trigger: 'blur' },
  ],
  abstract: [
    { required: true, message: '请输入新闻摘要', trigger: 'blur' },
    { min: 10, max: 200, message: '摘要长度应在 10 到 200 个字符之间', trigger: 'blur' },
  ],
  source: [{ required: true, message: '请输入文章作者', trigger: 'blur' }],
  types: [{ required: true, message: '请选择文章类别', trigger: 'change' }],
  keyword: [
    {
      type: 'array',
      required: true,
      message: '请至少添加一个关键词',
      trigger: 'change',
      min: 1,
    },
  ],
})

// 提交表单
const submitForm = async (formEl: FormInstance | undefined, type?: 'draft') => {
  if (!formEl) return

  try {
    await formEl.validate() // validate 返回 Promise，如果验证失败会抛出异常

    // 构建提交的数据
    newsForm.files_url = fileList.value.map((item) => {
      return (item.response as { data: { name: string } }).data.name
    })
    newsForm.cover_url = (coverList.value[0].response as { data: { name: string } }).data.name

    // const submitData = {
    //   ...newsForm,
    //   status: type === 'draft' ? '草稿' : newsForm.status,
    // }

    console.log('提交的新闻数据:', newsForm)

    // 调接口
    const res = await Apis.news.post_admin_news({ data: newsForm })
    console.log(res)

    // 成功提示 & 重置表单
    // if (type === 'draft') {
    //   ElMessage.success('草稿已保存')
    // } else if (newsForm.status === '已发布') {
    //   ElMessage.success('新闻已直接发布')
    //   resetForm(formEl)
    // } else {
    //   ElMessage.success('新闻已提交审核')
    //   resetForm(formEl)
    // }
  } catch (err) {
    // 验证失败或接口报错
    console.error(err)
    ElMessage.error('表单验证失败或提交错误')
  }
}

// 重置表单
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  newsForm.cover_url = ''
  newsForm.files_url = []
  newsForm.keyword = []
  newsForm.content = ''
  newsForm.title = ''
  newsForm.types = '新闻'
  newsForm.category_id = 2
  newsForm.status = '审核中'
  newsForm.abstract = ''
  newsForm.source = ''
  // newsForm.attachments = []
  fileList.value = []
  coverList.value = []
}

// 预览新闻
const previewNews = () => {
  if (!newsForm.title || !newsForm.content) {
    ElMessage.warning('请至少填写标题和内容后再预览')
    return
  }
  previewDialogVisible.value = true
}

// 标签处理
const handleTagClose = (tag: string) => {
  newsForm.keyword.splice(newsForm.keyword.indexOf(tag), 1)
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    tagInputRef.value?.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value && !newsForm.keyword.includes(inputValue.value)) {
    newsForm.keyword.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}

// 上传前校验图片
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const isJPG = file.type === 'image/jpeg'
  const isPNG = file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG && !isPNG) {
    ElMessage.error('上传封面图片只能是 JPG 或 PNG 格式!')
  }
  if (!isLt2M) {
    ElMessage.error('上传封面图片大小不能超过 2MB!')
  }
  return (isJPG || isPNG) && isLt2M
}

//上传图片逻辑处理
const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
  const res = (uploadFile.response as { data: { name: string } }).data.name
  console.log(res, '删除的文件名')

  Apis.general
    .delete_public_files_types_name({ pathParams: { types: 'news', name: res } })
    .then((res) => {
      console.log('删除成功', res)
    })
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}
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
    overflow: hidden;
  }

  .cover-image {
    width: 200px;
    height: 150px;
    object-fit: cover;
    margin-bottom: 10px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }

  .tag-item {
    margin-right: 6px;
    margin-bottom: 6px;
  }

  .tag-button {
    margin-bottom: 6px;
  }

  .tag-input {
    width: 120px;
    margin-right: 6px;
    margin-bottom: 6px;
    vertical-align: bottom;
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

      .top-tag {
        background-color: #f56c6c;
        color: #fff;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 12px;
      }
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
      margin-bottom: 20px;
    }

    .preview-keywords {
      margin-top: 20px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;

      .keywords-title {
        margin-right: 10px;
        color: #666;
      }

      .keyword-tag {
        margin-right: 6px;
      }
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

  :deep(.w-e-text-container) {
    min-height: 300px;
  }
}
</style>
