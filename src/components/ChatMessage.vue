<template>
  <div class="w-full transition-colors duration-200 message-animation py-4"
       :class="isDark ? 'bg-gpt-dark-bg' : 'bg-white'">
    <div class="max-w-3xl mx-auto px-4">
      <div class="flex gap-3"
           :class="message.role === 'user' ? 'flex-row-reverse' : 'flex-row'">
        <!-- 头像 -->
        <div class="flex-shrink-0">
          <div v-if="message.role === 'assistant'" 
               class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-md overflow-hidden"
               :class="isDark ? 'bg-gradient-to-br from-blue-600 to-blue-700' : 'bg-gradient-to-br from-blue-500 to-blue-600'">
            <img src="/aboutlogo.png" alt="GTIIT AI" class="w-full h-full object-cover" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <i class="ri-robot-2-line text-white text-lg hidden"></i>
          </div>
          <div v-else
               class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-md"
               :class="isDark ? 'bg-gradient-to-br from-purple-600 to-indigo-600' : 'bg-gradient-to-br from-purple-500 to-indigo-500'">
            <i class="ri-user-line text-white text-lg"></i>
          </div>
        </div>

        <!-- 消息内容气泡 -->
        <div class="flex-1 min-w-0 max-w-[85%]">
          <!-- 消息头部 -->
          <div class="flex items-center gap-2 mb-1.5"
               :class="message.role === 'user' ? 'justify-end' : 'justify-start'">
            <span class="text-xs font-medium transition-colors duration-200"
                  :class="isDark ? 'text-gpt-dark-text-secondary' : 'text-gray-500'">
              {{ message.role === 'assistant' ? 'GTIIT AI Assistant' : '您' }}
            </span>
            <span class="text-xs transition-colors duration-200"
                  :class="isDark ? 'text-gpt-dark-text-secondary' : 'text-gray-400'">
              {{ formatTime(message.timestamp) }}
            </span>
          </div>

          <!-- 消息气泡 -->
          <div v-if="message.content"
               class="message-bubble rounded-2xl px-4 py-3 shadow-sm transition-all duration-200 relative"
               :class="[
                 message.role === 'user' 
                   ? (isDark 
                       ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white ml-auto' 
                       : 'bg-gradient-to-br from-purple-500 to-indigo-500 text-white ml-auto')
                   : (isDark 
                       ? 'bg-gpt-dark-bg-alt text-gpt-dark-text' 
                       : 'bg-gray-50 text-gray-800 border border-gray-200'),
                 message.content === '思考中...' ? 'thinking-bubble' : ''
               ]"
          >
            <div class="prose prose-sm max-w-none"
                 :class="[
                   message.role === 'user' ? 'prose-invert' : (isDark ? 'prose-invert' : ''),
                   'message-content'
                 ]"
                 v-html="renderedContent">
            </div>
            <!-- 🔥 打字机光标效果（仅在流式生成时显示） -->
            <span v-if="message.role === 'assistant' && isStreaming" 
                  class="typing-cursor"
                  :class="isDark ? 'typing-cursor-dark' : 'typing-cursor-light'"></span>
          </div>

          
          <!-- 参考文献 (折叠) -->
          <div v-if="message.role === 'assistant' && metadata && metadata.references && metadata.references.length > 0" 
               class="mt-3">
            <button 
              @click="showReferences = !showReferences"
              class="text-xs flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 hover:shadow-md"
              :class="isDark 
                ? 'bg-gpt-dark-bg-alt text-gpt-dark-text-secondary hover:bg-gpt-dark-border border border-gpt-dark-border' 
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'"
            >
              <i class="ri-book-line text-sm"></i>
              <span class="font-medium">参考来源 ({{ metadata.references.length }})</span>
              <i :class="showReferences ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'"></i>
            </button>
            
            <div v-if="showReferences" class="mt-2 space-y-2 animate-slide-up">
              <div 
                v-for="(ref, idx) in metadata.references.slice(0, 3)" 
                :key="idx"
                class="text-xs p-3 rounded-xl border transition-all duration-200 hover:shadow-md"
                :class="isDark 
                  ? 'bg-gpt-dark-bg-alt border-gpt-dark-border' 
                  : 'bg-white border-gray-200 shadow-sm'"
              >
                <div class="flex items-center gap-2 mb-1.5">
                  <span class="px-2 py-0.5 rounded-md text-xs font-bold"
                        :class="isDark 
                          ? 'bg-blue-600/30 text-blue-300' 
                          : 'bg-blue-100 text-blue-700'">
                    {{ ref.source_type === 'fixed_qa' ? 'Q&A' : 'KB' }}
                  </span>
                  <span class="font-semibold transition-colors duration-200"
                        :class="isDark ? 'text-gpt-dark-text' : 'text-gray-900'">
                    {{ ref.source_type === 'fixed_qa' ? 'Q&A' : ref.kb_name }}
                  </span>
                </div>
                <div class="line-clamp-2 leading-relaxed transition-colors duration-200"
                     :class="isDark ? 'text-gpt-dark-text-secondary' : 'text-gray-600'">
                  {{ ref.content || ref.question }}
                </div>
              </div>
            </div>
          </div>

          <!-- 反馈按钮 (仅AI消息) -->
          <div v-if="message.role === 'assistant'" class="mt-3 flex items-center gap-2">
            <button 
              @click="submitFeedback('thumbs_up')"
              class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all duration-200 hover:shadow-md"
              :class="feedbackRating === 'thumbs_up' 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                : (isDark ? 'text-gpt-dark-text-secondary hover:bg-gpt-dark-bg-alt' : 'text-gray-500 hover:bg-gray-100')"
              title="有帮助"
            >
              <i class="ri-thumb-up-line text-sm"></i>
              <span v-if="feedbackRating === 'thumbs_up'" class="font-medium">已反馈</span>
            </button>
            
            <button 
              @click="submitFeedback('thumbs_down')"
              class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all duration-200 hover:shadow-md"
              :class="feedbackRating === 'thumbs_down' 
                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                : (isDark ? 'text-gpt-dark-text-secondary hover:bg-gpt-dark-bg-alt' : 'text-gray-500 hover:bg-gray-100')"
              title="没帮助"
            >
              <i class="ri-thumb-down-line text-sm"></i>
              <span v-if="feedbackRating === 'thumbs_down'" class="font-medium">已反馈</span>
            </button>

            <button 
              @click="copyMessage"
              class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all duration-200 hover:shadow-md"
              :class="copied 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                : (isDark ? 'text-gpt-dark-text-secondary hover:bg-gpt-dark-bg-alt' : 'text-gray-500 hover:bg-gray-100')"
              title="复制"
            >
              <i v-if="!copied" class="ri-file-copy-line text-sm"></i>
              <i v-else class="ri-check-line text-sm"></i>
              <span v-if="copied" class="font-medium">已复制</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 反馈对话框 -->
  <div v-if="showFeedbackDialog" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slide-up"
         :class="isDark ? 'bg-gpt-dark-bg-alt border border-gpt-dark-border' : 'bg-white'">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold" :class="isDark ? 'text-gpt-dark-text' : 'text-gray-900'">
          感谢您的反馈
        </h3>
        <button 
          @click="cancelFeedback"
          class="w-8 h-8 flex items-center justify-center rounded-full transition-all hover:scale-110"
          :class="isDark ? 'hover:bg-gpt-dark-border text-gpt-dark-text-secondary' : 'hover:bg-gray-100 text-gray-500'"
        >
          <i class="ri-close-line text-xl"></i>
        </button>
      </div>

      <p class="text-sm mb-4" :class="isDark ? 'text-gpt-dark-text-secondary' : 'text-gray-600'">
        为了帮助我们改进，您可以填写正确答案（可选）：
      </p>

      <textarea
        v-model="correctAnswer"
        placeholder="请输入您认为的正确答案..."
        class="w-full h-32 px-4 py-3 border rounded-xl resize-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        :class="isDark 
          ? 'bg-gpt-dark-bg border-gpt-dark-border text-gpt-dark-text placeholder-gpt-dark-text-secondary' 
          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'"
      ></textarea>

      <div class="flex items-center gap-3 mt-4">
        <button
          @click="submitFeedbackWithAnswer"
          class="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:shadow-lg"
        >
          提交反馈
        </button>
        <button
          @click="cancelFeedback"
          class="px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:shadow-md"
          :class="isDark 
            ? 'bg-gpt-dark-bg hover:bg-gpt-dark-border text-gpt-dark-text-secondary border border-gpt-dark-border' 
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'"
        >
          取消
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { useThemeStore } from '@/stores/theme'
import { useChatStore } from '@/stores/chat'
import type { ChatMessage } from '@/types/chat'

interface Props {
  message: ChatMessage
  showMetadata?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showMetadata: true
})

const themeStore = useThemeStore()
const chatStore = useChatStore()
const showReferences = ref(false)
const copied = ref(false)
const feedbackRating = ref<'thumbs_up' | 'thumbs_down' | null>(null)
const showFeedbackDialog = ref(false)
const correctAnswer = ref('')

const isDark = computed(() => themeStore.theme === 'dark')
const metadata = computed(() => props.message.metadata)

// 🔥 检测是否正在流式生成
const isStreaming = computed(() => {
  return props.message.role === 'assistant' && 
         chatStore.isLoading && 
         props.message.content !== '思考中...'
})

// 格式化时间
function formatTime(timestamp?: number): string {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

// 优化的Markdown渲染 - 增强视觉效果
const renderedContent = computed(() => {
  if (!props.message.content) return ''
  
  try {
    // 配置Markdown渲染器
    marked.setOptions({
      breaks: true,
      gfm: true
    })
    
    // 🔗 设置链接在新窗口打开
    const renderer = new marked.Renderer()
    renderer.link = (href: string, title: string | null | undefined, text: string) => {
      const titleAttr = title ? ` title="${title}"` : ''
      return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer" class="chat-link">${text}</a>`
    }
    marked.use({ renderer })
    
    let content = props.message.content
    
    // 1. 识别并美化百分比数据（添加进度条）
    content = content.replace(/(\d+\.?\d*)%/g, (match, num) => {
      const percentage = parseFloat(num)
      return `<span class="percentage-badge" data-value="${percentage}">${match}</span>`
    })
    
    // 2. 识别并美化金额数据
    content = content.replace(/(\d+\.?\d*万元|￥\d+\.?\d*)/g, (match) => {
      return `<span class="money-badge">${match}</span>`
    })
    
    // 3. 识别关键词并高亮
    const keywords = ['整体去向', '就业薪资', '行业分布', '升学情况', '地域分布', '建议行动']
    keywords.forEach(keyword => {
      const regex = new RegExp(`(${keyword})[：:]`, 'g')
      content = content.replace(regex, `<strong class="section-title">$1：</strong>`)
    })
    
    // 4. 识别列表项（中文顿号、逗号分隔）
    content = content.replace(/([^。！？\n]+)[、，]([^。！？\n]+)[、，]([^。！？\n]+)/g, (match) => {
      // 如果包含冒号，可能是列表
      if (match.includes('：') || match.includes(':')) {
        return match // 保持原样
      }
      return match
    })
    
    // 5. 渲染Markdown
    const html = marked(content) as string
    
    // 6. 后处理：百分比数字样式（去掉进度条，保留数字）
    let processedHtml = html.replace(/<span class="percentage-badge" data-value="([\d.]+)">([^<]+)<\/span>/g, 
      (_match, value, text) => {
        const percentage = parseFloat(value)
        const color = percentage >= 80 ? '#10b981' : percentage >= 60 ? '#3b82f6' : '#f59e0b'
        return `<span class="percentage-text font-bold" style="color: ${color}">${text}</span>`
      }
    )
    
    return DOMPurify.sanitize(processedHtml, {
      ADD_ATTR: ['style', 'data-value'],
      ADD_TAGS: ['span']
    })
  } catch (error) {
    console.error('Markdown渲染失败:', error)
    return props.message.content
  }
})

// 复制消息
function copyMessage() {
  navigator.clipboard.writeText(props.message.content).then(() => {
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  })
}

// 提交反馈
async function submitFeedback(rating: 'thumbs_up' | 'thumbs_down') {
  if (feedbackRating.value === rating) return // 防止重复点击
  
  // 如果是差评，弹出对话框让用户填写正确答案
  if (rating === 'thumbs_down') {
    showFeedbackDialog.value = true
    return
  }
  
  // 好评直接提交
  feedbackRating.value = rating
  await chatStore.submitFeedback(props.message, rating)
  console.log(`反馈已提交: ${rating}`)
}

// 提交带正确答案的反馈
async function submitFeedbackWithAnswer() {
  if (!correctAnswer.value.trim() && showFeedbackDialog.value) {
    // 如果没填写正确答案，询问是否仅提交差评
    if (!confirm('您未填写正确答案，是否仅提交"不满意"反馈？')) {
      return
    }
  }
  
  feedbackRating.value = 'thumbs_down'
  await chatStore.submitFeedback(props.message, 'thumbs_down', correctAnswer.value.trim())
  
  showFeedbackDialog.value = false
  correctAnswer.value = ''
  console.log('反馈已提交（含正确答案）')
}

// 取消反馈对话框
function cancelFeedback() {
  showFeedbackDialog.value = false
  correctAnswer.value = ''
}
</script>

<style scoped>
/* ========== 消息气泡样式 ========== */
.message-bubble {
  position: relative;
  word-wrap: break-word;
  max-width: 100%;
}

/* 思考中气泡动画 */
.thinking-bubble {
  animation: thinking-pulse 1.5s ease-in-out infinite;
}

@keyframes thinking-pulse {
  0%, 100% {
    opacity: 0.7;
    transform: scale(0.99);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}

/* 🔥 打字机光标效果 */
.typing-cursor {
  display: inline-block;
  width: 2px;
  height: 1.2em;
  margin-left: 4px;
  vertical-align: text-bottom;
  animation: blink 1s step-end infinite;
}

.typing-cursor-light {
  background-color: #1f2937;
}

.typing-cursor-dark {
  background-color: #e5e5e5;
}

@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  50.1%, 100% {
    opacity: 0;
  }
}

/* 消息内容样式增强 */
.message-content {
  line-height: 1.6;
}

/* 用户消息气泡的文字样式 */
:deep(.message-content p) {
  color: inherit;
}

:deep(.message-content strong) {
  font-weight: 600;
}

:deep(.message-content code) {
  font-size: 0.9em;
}
</style>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.message-animation {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slideUp 0.2s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ========== 增强的内容样式 ========== */

/* 段落标题样式 */
:deep(.section-title) {
  display: inline-block;
  font-size: 1.1em;
  font-weight: 700;
  color: #7c3aed;
  margin-top: 1em;
  margin-bottom: 0.5em;
  padding-bottom: 0.3em;
  border-bottom: 2px solid #7c3aed;
}

.dark :deep(.section-title) {
  color: #60a5fa;
  border-bottom-color: #60a5fa;
}

/* 百分比徽章 */
:deep(.percentage-text) {
  font-size: 1.1em;
  font-weight: 700;
}

/* 迷你进度条 */
:deep(.progress-bar-mini) {
  display: inline-block;
  width: 60px;
  height: 6px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  position: relative;
  overflow: hidden;
}

.dark :deep(.progress-bar-mini) {
  background: rgba(255, 255, 255, 0.1);
}

:deep(.progress-bar-mini)::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: var(--percentage);
  background: var(--color);
  border-radius: 3px;
  transition: width 0.3s ease;
}

/* 金额徽章 */
:deep(.money-badge) {
  display: inline-block;
  padding: 0.2em 0.6em;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
  border-radius: 0.5em;
  font-weight: 600;
  font-size: 0.95em;
  box-shadow: 0 2px 4px rgba(251, 191, 36, 0.3);
}

/* Prose样式增强 */
:deep(.prose) {
  max-width: none;
}

:deep(.prose p) {
  margin-bottom: 1em;
  line-height: 1.8;
}

:deep(.prose strong) {
  font-weight: 600;
  color: #1f2937;
}

.dark :deep(.prose strong) {
  color: #FFFFFF;
  font-weight: 700;
}

:deep(.prose ul),
:deep(.prose ol) {
  margin-left: 1.5em;
  margin-bottom: 1em;
}

:deep(.prose li) {
  margin-bottom: 0.5em;
  padding-left: 0.5em;
}

:deep(.prose ul li) {
  list-style-type: disc;
}

:deep(.prose ol li) {
  list-style-type: decimal;
}

/* 代码块样式 */
:deep(.prose code) {
  background: rgba(124, 58, 237, 0.1);
  color: #7c3aed;
  padding: 0.2em 0.4em;
  border-radius: 0.3em;
  font-size: 0.9em;
  font-family: 'Monaco', 'Courier New', monospace;
}

.dark :deep(.prose code) {
  background: rgba(96, 165, 250, 0.2);
  color: #93c5fd;
  font-weight: 500;
}

:deep(.prose pre) {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5em;
  padding: 1em;
  overflow-x: auto;
  margin: 1em 0;
}

.dark :deep(.prose pre) {
  background: #1e293b;
  border-color: #334155;
}

:deep(.prose pre code) {
  background: none;
  color: inherit;
  padding: 0;
}

/* 引用样式 */
:deep(.prose blockquote) {
  border-left: 4px solid #7c3aed;
  padding-left: 1em;
  margin: 1em 0;
  font-style: italic;
  color: #6b7280;
}

.dark :deep(.prose blockquote) {
  border-left-color: #a78bfa;
  color: #9ca3af;
}

/* 表格样式 */
:deep(.prose table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1em 0;
  font-size: 0.9em;
}

:deep(.prose th),
:deep(.prose td) {
  padding: 0.75em;
  border: 1px solid #e2e8f0;
  text-align: left;
}

.dark :deep(.prose th),
.dark :deep(.prose td) {
  border-color: #334155;
}

:deep(.prose th) {
  background: #f8fafc;
  font-weight: 600;
}

.dark :deep(.prose th) {
  background: #1e293b;
}

:deep(.prose tr:hover) {
  background: #f8fafc;
}

.dark :deep(.prose tr:hover) {
  background: #1e293b;
}

/* 🔗 链接样式 - 醒目的蓝色 */
:deep(.chat-link),
:deep(.prose a) {
  color: #2563eb !important;
  text-decoration: underline;
  text-underline-offset: 2px;
  font-weight: 500;
  transition: all 0.2s ease;
}

:deep(.chat-link):hover,
:deep(.prose a):hover {
  color: #1d4ed8 !important;
  text-decoration-thickness: 2px;
}

.dark :deep(.chat-link),
.dark :deep(.prose a) {
  color: #60a5fa !important;
}

.dark :deep(.chat-link):hover,
.dark :deep(.prose a):hover {
  color: #93c5fd !important;
}
</style>
