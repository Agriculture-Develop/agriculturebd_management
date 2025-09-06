import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'
const API_BASE_URL = 'http://47.115.160.54:28080/api/v1'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools({
      componentInspector: {
        toggleComboKey: 'control-shift',
        launchEditor: 'code',
      },
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    // createStyleImportPlugin({
    //   resolves: [ElementPlusResolve()],
    //   libs: [
    //     {
    //       libraryName: 'element-plus',
    //       esModule: true,
    //       resolveStyle: (name: string) => {
    //         return `element-plus/theme-chalk/${name}.css`
    //       },
    //     },
    //   ],
    // }),
  ],

  server: {
    port: 5174,
    open: true,
    cors: true,
    // 代理配置
    proxy: {
      '^/(admin|public|auth|files)': {
        target: API_BASE_URL,
        changeOrigin: true,
        // rewrite: path => path.replace(/^\/admin/, ''),
        rewrite: (path) => path,
        configure: (proxy, options) => {
          // 代理服务器配置
          proxy.on('error', (err, req, res) => {
            console.log('代理错误', err)
          })
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('代理请求:', req.method, req.url)
          })
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('代理响应:', req.method, req.url, proxyRes.statusCode)
          })
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
