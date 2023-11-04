import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import vue from "@vitejs/plugin-vue";
import path from "path";
import viteCompression from "vite-plugin-compression";
import legacy from '@vitejs/plugin-legacy'
import browserslistToEsbuild from 'browserslist-to-esbuild'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // PWA
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /(.*?)\.(woff2|woff|ttf)/,
            handler: "CacheFirst",
            options: {
              cacheName: "file-cache",
            },
          },
          {
            urlPattern: /(.*?)\.(webp|png|jpe?g|svg|gif|bmp|psd|tiff|tga|eps)/,
            handler: "CacheFirst",
            options: {
              cacheName: "image-cache",
            },
          },
        ],
      },
      manifest: {
        name: "Snavigation",
        short_name: "Snavigation",
        description: "一个极致简约的导航页",
        display: "standalone",
        start_url: "/",
        theme_color: "#fff",
        background_color: "#efefef",
        icons: [
          {
            src: "/icon/logo-144.png",
            sizes: "144x144",
            type: "image/png",
          },
        ],
      },
    }),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
    // viteCompression
    viteCompression({
      // 可选配置项
      ext: '.gz', // 压缩文件的扩展名，默认为 .gz
      algorithm: 'gzip', // 压缩算法，可以是 'gzip' 或 'brotliCompress'
      threshold: 10240, // 超过多少字节的文件才会被压缩，默认为 0
      deleteOriginFile: false, // 是否删除原始文件，默认为 false
      verbose: true, // 是否在控制台输出压缩结果，默认为 false
      filter: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i, // 指定哪些资源不被压缩，默认为 /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i
      disable: false, // 是否禁用插件，默认为 false
    }),
  ],
  server: {
    port: 5588,
    open: true,
  },
  resolve: {
    // 配置路径别名
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    minify: "terser",
    target: browserslistToEsbuild(),
    terserOptions: {
      compress: {
        // 生产环境时移除 console
        pure_funcs: ["console.log"],
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          try {
            if (id.includes("node_modules")) {
              let name = id.split("node_modules/")[1].split("/");

              if (name[0].includes('naive-ui') ){
                return 'naive-ui'
              }else{
                return 'vendor'
              }
           }
          } catch (error) {
            console.error(error);
          }
        }
      }
    },
  },
});
