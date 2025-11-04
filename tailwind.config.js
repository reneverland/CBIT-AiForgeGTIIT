/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // 启用深色模式
  theme: {
    extend: {
      colors: {
        // 主色调 - 蓝色系
        primary: '#0066CC',
        secondary: '#00A650',
        // GTIIT 广以配色
        cuhk: {
          purple: '#0066CC', // 主蓝色（科技蓝）
          gold: '#FFD700',   // 金色点缀
          dark: '#003366',   // 深蓝色
          light: '#3399FF',  // 浅蓝色
        },
        // ChatGPT 风格配色 - 增强夜间模式对比度
        gpt: {
          light: {
            bg: '#FFFFFF',
            'bg-alt': '#F7F7F8',
            text: '#343541',
            'text-secondary': '#6B7280',
            border: '#E5E7EB',
          },
          dark: {
            bg: '#1a1a2e',        // 更深的背景色
            'bg-alt': '#2d2d44',  // 消息背景色
            text: '#FFFFFF',      // 纯白主文本
            'text-secondary': '#E5E5E5', // 更亮的次要文本
            border: '#3d3d5c',    // 边框色
          }
        }
      },
      borderRadius: {
        'button': '8px',
      },
      fontFamily: {
        'pacifico': ['Pacifico', 'cursive'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}

