<template>
  <div class="flex-1 flex flex-col items-center justify-center px-4 py-12 animate-fade-in">
    <!-- 欢迎标题 -->
    <div class="text-center mb-12 space-y-4">
      <h1 class="text-3xl sm:text-4xl font-bold transition-colors duration-200"
          :class="isDark ? 'text-blue-400' : 'text-blue-600'">
        欢迎使用 GTIIT AI Assistant
      </h1>
      <p class="text-lg sm:text-xl transition-colors duration-200"
         :class="isDark ? 'text-gpt-dark-text-secondary' : 'text-gray-600'">
        广东以色列理工学院智能助手，开启您的探索之旅
      </p>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoadingApps" class="flex flex-col items-center space-y-4">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2"
           :class="isDark ? 'border-cuhk-light' : 'border-cuhk-purple'">
      </div>
      <p class="text-sm transition-colors duration-200"
         :class="isDark ? 'text-gpt-dark-text-secondary' : 'text-gray-500'">
        正在加载应用实例...
      </p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="appsError" class="max-w-md w-full p-6 rounded-lg transition-colors duration-200"
         :class="isDark ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'">
      <div class="flex items-start space-x-3">
        <svg class="w-6 h-6 flex-shrink-0" :class="isDark ? 'text-red-400' : 'text-red-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 class="font-semibold mb-1 transition-colors duration-200"
              :class="isDark ? 'text-red-400' : 'text-red-800'">
            加载失败
          </h3>
          <p class="text-sm transition-colors duration-200"
             :class="isDark ? 'text-red-300' : 'text-red-600'">
            {{ appsError }}
          </p>
          <button
            @click="loadApps"
            class="mt-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            :class="isDark ? 'bg-red-800 hover:bg-red-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'"
          >
            重试
          </button>
        </div>
      </div>
    </div>

    <!-- 应用选择 -->
    <div v-else-if="applications.length > 0" class="max-w-4xl w-full">
      <h2 class="text-xl font-semibold mb-6 text-center transition-colors duration-200"
          :class="isDark ? 'text-gpt-dark-text' : 'text-gray-800'">
        选择一个应用开始对话
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="app in applications"
          :key="app.id"
          @click="selectApp(app)"
          class="group p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg animate-slide-up"
          :class="isDark 
            ? 'bg-gpt-dark-bg-alt border-gpt-dark-border hover:border-cuhk-light' 
            : 'bg-white border-gray-200 hover:border-cuhk-purple hover:shadow-cuhk-purple/20'"
        >
          <!-- 应用图标 -->
          <div class="w-12 h-12 rounded-lg mb-4 flex items-center justify-center transition-all duration-200"
               :class="isDark 
                 ? 'bg-cuhk-dark/30 group-hover:bg-cuhk-purple/30' 
                 : 'bg-cuhk-purple/10 group-hover:bg-cuhk-purple/20'">
            <svg class="w-6 h-6 transition-colors duration-200"
                 :class="isDark ? 'text-cuhk-light' : 'text-cuhk-purple'"
                 fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
            </svg>
          </div>

          <!-- 应用名称 -->
          <h3 class="text-lg font-semibold mb-2 transition-colors duration-200"
              :class="isDark ? 'text-gpt-dark-text group-hover:text-cuhk-light' : 'text-gray-900 group-hover:text-cuhk-purple'">
            {{ app.name }}
          </h3>

          <!-- 应用描述 -->
          <p class="text-sm mb-3 line-clamp-2 transition-colors duration-200"
             :class="isDark ? 'text-gpt-dark-text-secondary' : 'text-gray-600'">
            {{ app.description || '智能对话助手' }}
          </p>

          <!-- 模式标签 -->
          <div class="flex items-center space-x-2">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-200"
                  :class="getModeClass(app.mode)">
              {{ getModeLabel(app.mode) }}
            </span>
            <span class="text-xs transition-colors duration-200"
                  :class="isDark ? 'text-gpt-dark-text-secondary' : 'text-gray-500'">
              {{ app.llm_model }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="text-center py-12">
      <svg class="mx-auto h-16 w-16 mb-4 transition-colors duration-200"
           :class="isDark ? 'text-gpt-dark-text-secondary' : 'text-gray-400'"
           fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <h3 class="text-lg font-medium mb-2 transition-colors duration-200"
          :class="isDark ? 'text-gpt-dark-text' : 'text-gray-900'">
        暂无可用应用
      </h3>
      <p class="text-sm transition-colors duration-200"
         :class="isDark ? 'text-gpt-dark-text-secondary' : 'text-gray-500'">
        请联系管理员配置应用实例
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { useChatStore } from '@/stores/chat'
import { useThemeStore } from '@/stores/theme'
import type { Application } from '@/types/chat'

const appStore = useAppStore()
const chatStore = useChatStore()
const themeStore = useThemeStore()

const isDark = computed(() => themeStore.theme === 'dark')
const applications = computed(() => appStore.applications)
const isLoadingApps = computed(() => appStore.isLoadingApps)
const appsError = computed(() => appStore.appsError)

function selectApp(app: Application) {
  chatStore.setCurrentApp(app)
}

function loadApps() {
  appStore.loadApplications()
}

function getModeLabel(mode: string): string {
  const labels: Record<string, string> = {
    safe: '🛡️ 安全模式',
    standard: '⚡ 标准模式',
    enhanced: '🌐 增强模式'
  }
  return labels[mode] || mode
}

function getModeClass(mode: string) {
  if (isDark.value) {
    const classes: Record<string, string> = {
      safe: 'bg-green-900/30 text-green-400',
      standard: 'bg-blue-900/30 text-blue-400',
      enhanced: 'bg-purple-900/30 text-purple-400'
    }
    return classes[mode] || 'bg-gray-800 text-gray-400'
  } else {
    const classes: Record<string, string> = {
      safe: 'bg-green-100 text-green-800',
      standard: 'bg-blue-100 text-blue-800',
      enhanced: 'bg-purple-100 text-purple-800'
    }
    return classes[mode] || 'bg-gray-100 text-gray-800'
  }
}
</script>

