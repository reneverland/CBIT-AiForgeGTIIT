<template>
  <div class="flex flex-col h-screen transition-colors duration-200"
       :class="isDark ? 'bg-gpt-dark-bg' : 'bg-white'">
    <!-- 顶部导航栏 -->
    <Header />

    <!-- 主内容区域 -->
    <main class="flex-1 overflow-hidden" :class="{'pt-16': true}">
      <!-- 欢迎屏幕（未选择应用时） -->
      <WelcomeScreen v-if="!currentApp" />

      <!-- 聊天区域 -->
      <div v-else class="h-full flex flex-col">
        <!-- 消息列表 -->
        <div ref="messagesContainer" 
             class="flex-1 overflow-y-auto"
             :class="isDark ? 'bg-gpt-dark-bg' : 'bg-white'">
          
          <!-- 空状态 - 显示欢迎信息 -->
          <div v-if="!hasMessages" class="h-full flex items-center justify-center px-4">
            <div class="max-w-2xl w-full text-center space-y-8 animate-fade-in">
              <!-- 大标题 -->
              <div class="space-y-3">
                <h1 class="text-3xl sm:text-4xl font-bold transition-colors duration-200"
                    :class="isDark ? 'text-gpt-dark-text' : 'text-gray-900'">
                  广东以色列理工学院
                </h1>
                <p class="text-2xl font-light gradient-text">
                  GTIIT AI Assistant - 您的智能助手
                </p>
              </div>

              <!-- 示例问题卡片 -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
                <button
                  v-for="(question, idx) in exampleQuestions"
                  :key="idx"
                  @click.stop="handleExampleClick(question)"
                  class="p-4 rounded-xl border-2 text-left transition-transform duration-200 hover:scale-105"
                  :class="isDark 
                    ? 'bg-gpt-dark-bg-alt border-gpt-dark-border hover:border-cuhk-light' 
                    : 'bg-white border-gray-200 hover:border-cuhk-purple hover:shadow-md'"
                >
                  <div class="flex items-start gap-3">
                    <svg class="w-5 h-5 flex-shrink-0 mt-0.5 transition-colors duration-200"
                         :class="isDark ? 'text-cuhk-light' : 'text-cuhk-purple'"
                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="text-sm transition-colors duration-200"
                          :class="isDark ? 'text-gpt-dark-text' : 'text-gray-700'">
                      {{ question }}
                    </span>
                  </div>
                </button>
              </div>

              <!-- 提示信息 -->
              <p class="text-xs transition-colors duration-200"
                 :class="isDark ? 'text-gpt-dark-text-secondary' : 'text-gray-400'">
                点击上方问题快速开始，或在下方输入您的问题
              </p>
            </div>
          </div>

          <!-- 消息列表 -->
          <div v-else class="max-w-4xl mx-auto px-4 py-4 space-y-4 animate-fade-in">
            <ChatMessage
              v-for="(message, idx) in messages"
              :key="idx"
              :message="message"
            />

            <!-- 建议问题卡片 - 优化版 -->
            <div v-if="needsConfirmation && pendingSuggestions.length > 0"
                 class="w-full border-b transition-colors duration-200"
                 :class="isDark ? 'border-gpt-dark-border' : 'border-gray-100'">
              <div class="max-w-3xl mx-auto px-4 py-6">
                <div class="p-6 rounded-2xl shadow-lg transition-colors duration-200"
                     :class="isDark ? 'bg-gpt-dark-bg-alt border-2 border-cuhk-purple/50' : 'bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-300'">
                  <!-- 标题区域 -->
                  <div class="flex items-start gap-3 mb-4">
                    <div class="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                         :class="isDark ? 'bg-cuhk-purple/30' : 'bg-cuhk-purple/20'">
                      <i class="ri-lightbulb-line text-lg"
                         :class="isDark ? 'text-cuhk-light' : 'text-cuhk-purple'"></i>
                    </div>
                    <div class="flex-1">
                      <h3 class="text-base font-bold mb-1 transition-colors duration-200"
                          :class="isDark ? 'text-gpt-dark-text' : 'text-gray-900'">
                        💡 找到相关问题
                      </h3>
                      <p class="text-sm transition-colors duration-200"
                         :class="isDark ? 'text-gpt-dark-text-secondary' : 'text-gray-600'">
                        以下问题可能与您的疑问相关，请选择一个查看详细答案：
                      </p>
                    </div>
                  </div>
                  
                  <!-- 建议问题列表 -->
                  <div class="space-y-2 mb-4">
                    <button
                      v-for="(suggestion, idx) in pendingSuggestions"
                      :key="idx"
                      @click="handleSuggestionSelect(suggestion)"
                      class="w-full p-4 rounded-xl text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-md group"
                      :class="isDark 
                        ? 'bg-gpt-dark-bg hover:bg-gpt-dark-border text-gpt-dark-text border-2 border-gpt-dark-border hover:border-cuhk-purple' 
                        : 'bg-white hover:bg-blue-50 text-gray-800 border-2 border-gray-200 hover:border-cuhk-purple shadow-sm'"
                    >
                      <div class="flex items-start gap-3">
                        <span class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                              :class="isDark 
                                ? 'bg-cuhk-purple/30 text-cuhk-light' 
                                : 'bg-cuhk-purple/10 text-cuhk-purple group-hover:bg-cuhk-purple group-hover:text-white'">
                          {{ idx + 1 }}
                        </span>
                        <div class="flex-1">
                          <p class="font-medium group-hover:text-cuhk-purple transition-colors duration-200">
                            {{ suggestion.question }}
                          </p>
                          <p class="text-xs mt-1 transition-colors duration-200"
                             :class="isDark ? 'text-gpt-dark-text-secondary' : 'text-gray-500'">
                            相似度: {{ (suggestion.similarity * 100).toFixed(1) }}%
                          </p>
                        </div>
                        <i class="ri-arrow-right-line text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                           :class="isDark ? 'text-cuhk-light' : 'text-cuhk-purple'"></i>
                      </div>
                    </button>
                  </div>
                  
                  <!-- 分隔线 -->
                  <div class="border-t my-4 transition-colors duration-200"
                       :class="isDark ? 'border-gpt-dark-border' : 'border-gray-300'"></div>
                  
                  <!-- 继续思考按钮 -->
                  <div class="flex items-center justify-center">
                    <button
                      @click.stop.prevent="handleContinueThinking"
                      type="button"
                      class="px-6 py-3 text-sm font-bold rounded-xl transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
                      :class="isDark 
                        ? 'bg-gradient-to-r from-cuhk-purple to-cuhk-dark text-white hover:from-cuhk-dark hover:to-cuhk-purple' 
                        : 'bg-gradient-to-r from-cuhk-purple to-purple-600 text-white hover:from-purple-600 hover:to-cuhk-purple'"
                    >
                      <i class="ri-braces-line mr-2"></i>
                      继续深度思考
                    </button>
                  </div>
                  
                  <p class="text-xs text-center mt-3 transition-colors duration-200"
                     :class="isDark ? 'text-gpt-dark-text-secondary' : 'text-gray-500'">
                    💭 跳过建议问题，让AI基于知识库深度分析您的问题
                  </p>
                </div>
              </div>
            </div>

            <!-- 联网搜索授权 -->
            <div v-if="needsWebSearchAuth"
                 class="w-full border-b transition-colors duration-200"
                 :class="isDark ? 'border-gpt-dark-border' : 'border-gray-100'">
              <div class="max-w-3xl mx-auto px-4 py-6">
                <div class="p-4 rounded-xl transition-colors duration-200"
                     :class="isDark ? 'bg-gpt-dark-bg-alt border border-gpt-dark-border' : 'bg-yellow-50 border border-yellow-200'">
                  <h3 class="text-sm font-semibold mb-2 transition-colors duration-200"
                      :class="isDark ? 'text-gpt-dark-text' : 'text-gray-900'">
                    需要联网搜索
                  </h3>
                  <p class="text-sm mb-3 transition-colors duration-200"
                     :class="isDark ? 'text-gpt-dark-text-secondary' : 'text-gray-600'">
                    知识库中未找到相关信息，是否授权使用网络搜索？
                  </p>
                  <div class="flex gap-2">
                    <button
                      @click="handleWebSearchAuth"
                      class="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200 hover:scale-105"
                      :class="isDark ? 'bg-cuhk-purple hover:bg-cuhk-dark' : 'bg-cuhk-purple hover:bg-cuhk-dark'"
                    >
                      授权搜索
                    </button>
                    <button
                      @click="needsWebSearchAuth = false"
                      class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                      :class="isDark ? 'bg-gpt-dark-bg text-gpt-dark-text hover:bg-gpt-dark-border' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
                    >
                      取消
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- 输入框 -->
        <ChatInput />
      </div>
    </main>

    <!-- 底部 -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useAppStore } from '@/stores/app'
import { useThemeStore } from '@/stores/theme'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import WelcomeScreen from '@/components/WelcomeScreen.vue'
import ChatMessage from '@/components/ChatMessage.vue'
import ChatInput from '@/components/ChatInput.vue'

const chatStore = useChatStore()
const appStore = useAppStore()
const themeStore = useThemeStore()

const messagesContainer = ref<HTMLElement>()
const lastUserMessage = ref<string>('')

const isDark = computed(() => themeStore.theme === 'dark')
const currentApp = computed(() => chatStore.currentApp)
const messages = computed(() => chatStore.messages)
const hasMessages = computed(() => chatStore.hasMessages)
const needsConfirmation = computed(() => chatStore.needsConfirmation)
const pendingSuggestions = computed(() => chatStore.pendingSuggestions)
const needsWebSearchAuth = computed(() => chatStore.needsWebSearchAuth)

// 监听消息变化，自动更新最后一条用户消息
watch(messages, (newMessages) => {
  // 找到最后一条用户消息
  for (let i = newMessages.length - 1; i >= 0; i--) {
    if (newMessages[i].role === 'user') {
      lastUserMessage.value = newMessages[i].content
      break
    }
  }
}, { deep: true })

// 示例问题（动态加载热门问题）
const exampleQuestions = ref([
  '广东以色列理工学院有哪些专业？',
  'GTIIT 的教学语言是什么？',
  '学校的师资力量如何？',
  '国际交流与合作项目有哪些？'
])

// 加载预设问题（从后台管理配置的常见问题）
async function loadHotQuestions() {
  const currentApp = chatStore.currentApp
  if (!currentApp) return
  
  try {
    // 优先加载预设问题
    const presetResponse = await fetch(`/api/applications/${currentApp.id}/preset-questions`)
    const presetData = await presetResponse.json()
    
    if (presetData.questions && presetData.questions.length > 0) {
      // 只显示启用的问题，最多4个
      const activeQuestions = presetData.questions
        .filter((q: any) => q.is_active)
        .slice(0, 4)
        .map((q: any) => q.question)
      
      if (activeQuestions.length > 0) {
        exampleQuestions.value = activeQuestions
        console.log('✅ 加载预设问题:', activeQuestions.length, '个')
        return
      }
    }
    
    // 如果没有预设问题，尝试加载热门问题（基于统计）
    const hotResponse = await fetch(`/api/apps/${currentApp.endpoint_path}/hot-questions?limit=4`)
    const hotData = await hotResponse.json()
    
    if (hotData.questions && hotData.questions.length > 0) {
      exampleQuestions.value = hotData.questions
      console.log('✅ 加载热门问题:', hotData.questions, '真实数据:', hotData.is_real_data)
    }
  } catch (error) {
    console.warn('⚠️ 获取问题失败，使用默认问题', error)
    // 使用默认的备选问题（已在初始化时设置）
  }
}

// 页面加载时获取热门问题
onMounted(() => {
  loadHotQuestions()
})

// 监听应用切换，重新加载热门问题
watch(() => chatStore.currentApp, (newApp) => {
  if (newApp) {
    loadHotQuestions()
  }
})

// 示例问题点击
function handleExampleClick(question: string) {
  lastUserMessage.value = question
  chatStore.sendMessage(question)
}

// 选择建议问题
function handleSuggestionSelect(suggestion: any) {
  if (suggestion.qa_id) {
    chatStore.selectSuggestion(suggestion.qa_id, suggestion.question)
  }
}

// 继续思考
function handleContinueThinking() {
  console.log('🔄 继续思考按钮被点击')
  console.log('📝 lastUserMessage:', lastUserMessage.value)
  
  if (!lastUserMessage.value) {
    console.warn('⚠️ lastUserMessage为空，尝试从消息历史中查找')
    // 备用方案：从消息历史中找最后一条用户消息
    const userMessages = messages.value.filter(m => m.role === 'user')
    if (userMessages.length > 0) {
      const lastMsg = userMessages[userMessages.length - 1].content
      console.log('✅ 从历史中找到用户消息:', lastMsg)
      chatStore.continueThinking(lastMsg)
      return
    }
    console.error('❌ 无法找到用户消息')
    return
  }
  
  chatStore.continueThinking(lastUserMessage.value)
}

// 联网搜索授权
function handleWebSearchAuth() {
  if (lastUserMessage.value) {
    chatStore.authorizeWebSearch(lastUserMessage.value)
  }
}

// 滚动到底部
function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// 监听消息变化
watch(() => messages.value.length, () => {
  scrollToBottom()
})

// 初始化
onMounted(async () => {
  // 加载应用列表并自动选择默认应用
  const defaultApp = await appStore.loadApplications()
  if (defaultApp) {
    chatStore.setCurrentApp(defaultApp)
    console.log('🎯 已自动选择应用:', defaultApp.name)
  }
})
</script>

<style scoped>
/* 🌈 幻彩渐变文字效果 */
.gradient-text {
  background: linear-gradient(90deg, 
    #6366f1 0%,    /* 靛蓝 */
    #8b5cf6 20%,   /* 紫色 */
    #ec4899 40%,   /* 粉红 */
    #f59e0b 60%,   /* 橙色 */
    #10b981 80%,   /* 绿色 */
    #3b82f6 100%   /* 蓝色 */
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-shift 4s ease infinite;
}

@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% center;
  }
  50% {
    background-position: 100% center;
  }
}

/* 深色模式下的渐变效果更亮 */
:deep(.dark) .gradient-text {
  background: linear-gradient(90deg, 
    #818cf8 0%,
    #a78bfa 20%,
    #f472b6 40%,
    #fbbf24 60%,
    #34d399 80%,
    #60a5fa 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
