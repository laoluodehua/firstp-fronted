import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 80, // 将前端应用程序的端口设置为 80
  },
})
