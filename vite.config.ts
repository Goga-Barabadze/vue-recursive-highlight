/// <reference types="vitest" />

import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

// https://vitejs.dev/config/
// TODO: Add shuffle to tests
export default defineConfig({
  plugins: [vue()],
  test: {
    includeSource: ["src/**/*.{js,ts}"],
  },
})
