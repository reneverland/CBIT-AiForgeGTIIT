<template>
  <footer class="text-center py-3 space-y-1.5 theme-transition"
          :class="isDark ? 'bg-gpt-dark-bg text-gpt-dark-text' : 'bg-white text-gray-800'">
    <div class="flex items-center justify-center flex-wrap gap-x-6 gap-y-1 text-xs"
         :class="isDark ? 'text-gray-400' : 'text-gray-500'">
      <a href="https://sites.gtiit.edu.cn/admissions/" 
         target="_blank"
         rel="noopener noreferrer"
         class="flex items-center space-x-1.5 hover:text-blue-500 transition-colors duration-200">
        <i class="ri-home-4-line"></i>
        <span>广以本科招生网</span>
      </a>
      <a href="https://sites.gtiit.edu.cn/admissions/contact-student-recruitment-group/" 
         target="_blank"
         rel="noopener noreferrer"
         class="flex items-center space-x-1.5 hover:text-blue-500 transition-colors duration-200">
        <i class="ri-phone-line"></i>
        <span>招生小组联系方式</span>
      </a>
      <a href="https://gtiit.mike-x.com/4fjVW" 
         target="_blank"
         rel="noopener noreferrer"
         class="flex items-center space-x-1.5 hover:text-blue-500 transition-colors duration-200">
        <i class="ri-qq-line"></i>
        <span>招生咨询群</span>
      </a>
    </div>
    <p class="text-xs"
       :class="isDark ? 'text-gray-500' : 'text-gray-400'">
      © 2025 GTIIT Admissions AI
    </p>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.theme === 'dark')
</script>

