import { createPinia } from 'pinia'
import { createApp } from 'vue'

import elIcon from '@/global/el-icons'
import 'normalize.css'
import 'element-plus/dist/index.css'
import App from './App.vue'
import './assets/css/index.less'
import router from './router'
import './api'
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(elIcon) // 注册el 图标

app.mount('#app')
