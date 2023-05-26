import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import copy from 'rollup-plugin-copy'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
// 因为vite中已经内联了postcss，所以并不需要额外的创建 postcss.config.js文件  vite.config.ts中进行配置即可
import postcsspxtoviewport from 'postcss-px-to-viewport'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()],
    }),
    copy({
      targets: [
        { src: 'node_modules/@liveqing/liveplayer-v3/dist/component/liveplayer-lib.min.js', dest: 'public/js' },
      ]
    })
  ],
  css: {
    postcss: {
      plugins: [
        postcsspxtoviewport({
          unitToConvert: 'px', // 要转化的单位
          viewportWidth: 375, // UI设计稿的宽度
          unitPrecision: 6, // 转换后的精度，即小数点位数
          minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
          mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
          replace: true, // 是否转换后直接更换属性值
          exclude: [],
          landscape: false, // 是否处理横屏情况
        }),
      ],
    },
  },

  // 配置让IP可访问项目 解决Network提示‘use `--host` to expose’
  server: {
    // proxy: {
    //   '/api': {
    //     target: 'http://124.129.136.5:18182/',  // 测试服务器
    //     // target: 'http://124.129.136.5:19191/',
    //     changeOrigin: true,
    //     // pathRewrite: {
    //     //   '^/api': '/'
    //     // }
    //     rewrite: (path) => path.replace(/^\/api/, '')
    //   },
    //   '/app': {
    //     // target: 'http://124.129.136.5:18182/',  // 测试服务器
    //     target: 'http://124.129.136.5:19191/',
    //     changeOrigin: true,
    //     // pathRewrite: {
    //     //   '^/api': '/'
    //     // }
    //     rewrite: (path) => path.replace(/^\/app/, '')
    //   },
    // },
    host: '0.0.0.0',
  },
  // 别名配置
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './'),
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
