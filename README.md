# CBIT-AiForge GTIIT Intelligent Assistant | GTIIT 智能助手

[![Build Status](https://github.com/reneverland/CBIT-AiForgeGTIIT/actions/workflows/deploy.yml/badge.svg)](https://github.com/reneverland/CBIT-AiForgeGTIIT/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)
[![Vue.js](https://img.shields.io/badge/vue-3.4.21-4FC08D.svg?logo=vue.js)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/typescript-5.4.5-3178C6.svg?logo=typescript)](https://www.typescriptlang.org)
[![Docker](https://img.shields.io/badge/docker-supported-2496ED.svg?logo=docker)](https://www.docker.com)

[English](#english) | [中文](#chinese)

---

<a name="english"></a>

## 📖 Overview

**CBIT-AiForge GTIIT Intelligent Assistant** is an advanced AI-powered knowledge assistant built for Guangdong Technion - Israel Institute of Technology (GTIIT). Leveraging RAG (Retrieval-Augmented Generation) technology, it transforms unstructured knowledge into structured, reliable reasoning models, providing intelligent Q&A services for students, faculty, and staff.

### Key Features

- **Modern UI/UX Design**: Clean, intuitive interface optimized for academic environments
- **Intelligent Conversation**: Powered by large language models for natural, context-aware dialogues
- **RAG Technology**: Precise knowledge retrieval from institutional documents and databases
- **Real-time Feedback**: Support for answer evaluation and user feedback collection
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **Docker Deployment**: Containerized architecture for easy deployment and scalability
- **Internationalization**: Multi-language support (English/Chinese)
- **Institutional Branding**: GTIIT-themed interface with custom logos and styling

## 🏗️ Architecture

### Technology Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Vue 3.4.21 (Composition API) |
| **Language** | TypeScript 5.4.5 |
| **Build Tool** | Vite 5.2.8 |
| **State Management** | Pinia 2.1.7 |
| **Router** | Vue Router 4.3.0 |
| **HTTP Client** | Axios 1.6.8 |
| **Styling** | TailwindCSS 3.4.3 |
| **Markdown** | marked 12.0.2 + DOMPurify 3.1.0 |
| **Icons** | Lucide Icons |
| **Container** | Docker + Nginx |

### Project Structure

```
CBIT-FrontAiForgeGTIIT/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD pipeline configuration
├── src/
│   ├── api/                    # API integration layer
│   │   └── chat.ts            # Chat API endpoints
│   ├── components/             # Reusable Vue components
│   │   ├── AppSelector.vue    # Application selector
│   │   ├── ChatInput.vue      # Chat input interface
│   │   ├── ChatMessage.vue    # Message display component
│   │   ├── DisclaimerModal.vue # Disclaimer modal
│   │   ├── Footer.vue         # Application footer
│   │   ├── Header.vue         # Application header (GTIIT branding)
│   │   ├── LoadingDots.vue    # Loading animation
│   │   ├── SuggestionCard.vue # Suggestion cards
│   │   ├── WebSearchAuth.vue  # Web search authentication
│   │   └── WelcomeScreen.vue  # Welcome screen
│   ├── i18n/                   # Internationalization
│   │   └── index.ts           # Language configuration
│   ├── stores/                 # Pinia state management
│   │   ├── app.ts             # Application state
│   │   ├── chat.ts            # Chat state
│   │   └── theme.ts           # Theme state
│   ├── types/                  # TypeScript type definitions
│   │   └── chat.ts            # Chat-related types
│   ├── views/                  # Page views
│   │   └── ChatView.vue       # Main chat view
│   ├── App.vue                 # Root component
│   ├── main.ts                 # Application entry point
│   └── style.css              # Global styles
├── public/                     # Static assets
│   ├── gtiitlogo.png          # GTIIT logo
│   ├── aboutlogo.png          # About page logo
│   ├── cbit-logo.png          # CBIT logo
│   └── favicon.png            # Favicon
├── docker-compose.yml          # Docker Compose configuration
├── Dockerfile.host             # Docker image definition
├── nginx.conf.template         # Nginx configuration template
├── package.json                # Node.js dependencies
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite build configuration
└── tailwind.config.js         # TailwindCSS configuration
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 18 or higher
- **npm** or **yarn**: Package manager
- **Docker** & **Docker Compose**: For containerized deployment (optional)

### Local Development

```bash
# Clone the repository
git clone https://github.com/reneverland/CBIT-AiForgeGTIIT.git
cd CBIT-AiForgeGTIIT

# Install dependencies
npm install

# Start development server (port 9301)
npm run dev

# Access the application
# Local: http://localhost:9301
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Docker Deployment

#### Quick Start (Default Configuration)

```bash
# Clone repository
git clone https://github.com/reneverland/CBIT-AiForgeGTIIT.git
cd CBIT-AiForgeGTIIT

# Deploy with default configuration (backend: http://127.0.0.1:9300)
docker-compose up -d

# Or use the quick deployment script
bash quick-deploy.sh
```

#### Custom Configuration

```bash
# 1. Create environment configuration
cp .env.example .env.local

# 2. Edit configuration (update BACKEND_API_URL)
nano .env.local

# 3. Deploy
docker-compose up -d
```

#### Management Commands

```bash
# View logs
docker-compose logs -f frontaiforge

# Stop containers
docker-compose down

# Restart containers
docker-compose restart

# Rebuild containers
docker-compose build --no-cache
docker-compose up -d
```

## ⚙️ Configuration

### Environment Variables

Create `.env.local` file in the project root:

```env
# Backend API Configuration
BACKEND_API_URL=http://127.0.0.1:9300

# Application Settings
VITE_APP_TITLE=GTIIT Intelligent Assistant
VITE_APP_VERSION=1.0.0
```

### Backend API Configuration

The application communicates with a backend service. Ensure the backend API is running and accessible at the configured URL.

Default backend endpoint: `http://127.0.0.1:9300`

### Port Configuration

The application runs on port **9400** in production (Docker deployment).

To change the port, modify `docker-compose.yml` and `Dockerfile.host`:

```yaml
# docker-compose.yml
services:
  frontaiforge:
    # ... existing configuration ...
```

```dockerfile
# Dockerfile.host
EXPOSE 9400
```

## 🔄 CI/CD Pipeline

The project includes a GitHub Actions workflow for continuous integration and deployment:

### Workflow Stages

1. **Build**: Compile TypeScript and build production assets
2. **Test**: Run linting and type checking
3. **Docker Build**: Create and push Docker images to GitHub Container Registry
4. **Deploy**: Deploy to production server (configurable)

### Triggering Deployments

- **Automatic**: Push to `main` branch triggers full pipeline
- **Manual**: Use GitHub Actions "Run workflow" button
- **Pull Request**: Builds and tests without deployment

### Container Registry

Docker images are published to: `ghcr.io/reneverland/cbit-aiforgegtiit`

## 🌐 Access URLs

### Production

- **Internal Network**: http://127.0.0.1:9400
- **External Network**: http://YOUR_SERVER_IP:9400

### Development

- **Local Dev Server**: http://localhost:9301

## 🛡️ Best Practices

### Code Quality

- **TypeScript**: Strict type checking enabled
- **Vue Best Practices**: Composition API, `<script setup>` syntax
- **Component Structure**: Single File Components (SFC)

### Performance Optimization

- **Code Splitting**: Vite automatic code splitting
- **Lazy Loading**: Route-based lazy loading
- **Asset Optimization**: Image and asset optimization
- **Tree Shaking**: Unused code elimination

### Security

- **XSS Protection**: DOMPurify for HTML sanitization
- **CORS**: Configured in backend API
- **Environment Variables**: Sensitive data in `.env` files (not committed)

## 🐛 Troubleshooting

### Cache Issues

If changes are not reflected after deployment:

```bash
# Clear browser cache
Ctrl + F5 (Windows/Linux)
Cmd + Shift + R (macOS)

# Clear Docker build cache
docker system prune -a
```

### Port Conflicts

If port 9400 is in use:

```bash
# Check port usage
sudo lsof -i :9400

# Kill process using port
sudo kill -9 <PID>
```

### Docker Build Failures

```bash
# Remove old containers and images
docker-compose down -v
docker system prune -a

# Rebuild from scratch
docker-compose build --no-cache
```

## 👥 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

© 2025 CBIT-AiForge GTIIT Intelligent Assistant. All rights reserved.

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Developer**: [Ren CBIT](https://github.com/reneverland/) - Lead Developer & Maintainer
- **Institution**: Guangdong Technion - Israel Institute of Technology (GTIIT)
- **Collaboration**: The Chinese University of Hong Kong, Shenzhen (CUHK-Shenzhen)

## ⚠️ Disclaimer

Content generated by large language models does not represent the official views of Guangdong Technion - Israel Institute of Technology or The Chinese University of Hong Kong, Shenzhen.

---

<a name="chinese"></a>

## 📖 项目概述

**CBIT-AiForge GTIIT 智能助手**是专为广东以色列理工学院（GTIIT）打造的先进人工智能知识助手。利用 RAG（检索增强生成）技术，将非结构化知识转化为结构化、可靠的推理模型，为学生、教师和员工提供智能问答服务。

### 核心特性

- **现代化 UI/UX 设计**：简洁直观的界面，专为学术环境优化
- **智能对话系统**：基于大语言模型的自然、上下文感知对话
- **RAG 技术**：从机构文档和数据库中精准检索知识
- **实时反馈机制**：支持答案评价和用户反馈收集
- **响应式设计**：桌面、平板和移动设备无缝体验
- **Docker 容器化部署**：易于部署和扩展的容器化架构
- **国际化支持**：多语言支持（英文/中文）
- **机构品牌**：GTIIT 主题界面，包含自定义 Logo 和样式

## 🏗️ 系统架构

### 技术栈

| 类别 | 技术 |
|------|------|
| **框架** | Vue 3.4.21 (组合式 API) |
| **开发语言** | TypeScript 5.4.5 |
| **构建工具** | Vite 5.2.8 |
| **状态管理** | Pinia 2.1.7 |
| **路由管理** | Vue Router 4.3.0 |
| **HTTP 客户端** | Axios 1.6.8 |
| **样式框架** | TailwindCSS 3.4.3 |
| **Markdown 渲染** | marked 12.0.2 + DOMPurify 3.1.0 |
| **图标库** | Lucide Icons |
| **容器化** | Docker + Nginx |

### 项目结构

```
CBIT-FrontAiForgeGTIIT/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD 流水线配置
├── src/
│   ├── api/                    # API 集成层
│   │   └── chat.ts            # 聊天 API 端点
│   ├── components/             # 可复用 Vue 组件
│   │   ├── AppSelector.vue    # 应用选择器
│   │   ├── ChatInput.vue      # 聊天输入界面
│   │   ├── ChatMessage.vue    # 消息展示组件
│   │   ├── DisclaimerModal.vue # 免责声明弹窗
│   │   ├── Footer.vue         # 应用底部
│   │   ├── Header.vue         # 应用头部（GTIIT 品牌）
│   │   ├── LoadingDots.vue    # 加载动画
│   │   ├── SuggestionCard.vue # 建议卡片
│   │   ├── WebSearchAuth.vue  # 网络搜索认证
│   │   └── WelcomeScreen.vue  # 欢迎界面
│   ├── i18n/                   # 国际化
│   │   └── index.ts           # 语言配置
│   ├── stores/                 # Pinia 状态管理
│   │   ├── app.ts             # 应用状态
│   │   ├── chat.ts            # 聊天状态
│   │   └── theme.ts           # 主题状态
│   ├── types/                  # TypeScript 类型定义
│   │   └── chat.ts            # 聊天相关类型
│   ├── views/                  # 页面视图
│   │   └── ChatView.vue       # 主聊天视图
│   ├── App.vue                 # 根组件
│   ├── main.ts                 # 应用入口
│   └── style.css              # 全局样式
├── public/                     # 静态资源
│   ├── gtiitlogo.png          # GTIIT Logo
│   ├── aboutlogo.png          # 关于页面 Logo
│   ├── cbit-logo.png          # CBIT Logo
│   └── favicon.png            # 网站图标
├── docker-compose.yml          # Docker Compose 配置
├── Dockerfile.host             # Docker 镜像定义
├── nginx.conf.template         # Nginx 配置模板
├── package.json                # Node.js 依赖
├── tsconfig.json              # TypeScript 配置
├── vite.config.ts             # Vite 构建配置
└── tailwind.config.js         # TailwindCSS 配置
```

## 🚀 快速开始

### 环境要求

- **Node.js**：版本 18 或更高
- **npm** 或 **yarn**：包管理器
- **Docker** 和 **Docker Compose**：用于容器化部署（可选）

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/reneverland/CBIT-AiForgeGTIIT.git
cd CBIT-AiForgeGTIIT

# 安装依赖
npm install

# 启动开发服务器（端口 9301）
npm run dev

# 访问应用
# 本地: http://localhost:9301
```

### 生产构建

```bash
# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

### Docker 部署

#### 快速开始（默认配置）

```bash
# 克隆仓库
git clone https://github.com/reneverland/CBIT-AiForgeGTIIT.git
cd CBIT-AiForgeGTIIT

# 使用默认配置部署（后端: http://127.0.0.1:9300）
docker-compose up -d

# 或使用快速部署脚本
bash quick-deploy.sh
```

#### 自定义配置

```bash
# 1. 创建环境配置文件
cp .env.example .env.local

# 2. 编辑配置（更新 BACKEND_API_URL）
nano .env.local

# 3. 部署
docker-compose up -d
```

#### 管理命令

```bash
# 查看日志
docker-compose logs -f frontaiforge

# 停止容器
docker-compose down

# 重启容器
docker-compose restart

# 重新构建容器
docker-compose build --no-cache
docker-compose up -d
```

## ⚙️ 配置说明

### 环境变量

在项目根目录创建 `.env.local` 文件：

```env
# 后端 API 配置
BACKEND_API_URL=http://127.0.0.1:9300

# 应用设置
VITE_APP_TITLE=GTIIT 智能助手
VITE_APP_VERSION=1.0.0
```

### 后端 API 配置

应用与后端服务通信。确保后端 API 正在运行并可通过配置的 URL 访问。

默认后端端点：`http://127.0.0.1:9300`

### 端口配置

应用在生产环境（Docker 部署）中运行在 **9400** 端口。

修改端口，编辑 `docker-compose.yml` 和 `Dockerfile.host`。

## 🔄 CI/CD 流水线

项目包含 GitHub Actions 工作流，用于持续集成和部署：

### 工作流阶段

1. **构建**：编译 TypeScript 并构建生产资源
2. **测试**：运行代码检查和类型检查
3. **Docker 构建**：创建并推送 Docker 镜像到 GitHub Container Registry
4. **部署**：部署到生产服务器（可配置）

### 触发部署

- **自动触发**：推送到 `main` 分支触发完整流水线
- **手动触发**：使用 GitHub Actions "Run workflow" 按钮
- **拉取请求**：构建和测试，但不部署

### 容器镜像仓库

Docker 镜像发布到：`ghcr.io/reneverland/cbit-aiforgegtiit`

## 🌐 访问地址

### 生产环境

- **内网访问**：http://127.0.0.1:9400
- **外网访问**：http://YOUR_SERVER_IP:9400

### 开发环境

- **本地开发服务器**：http://localhost:9301

## 🛡️ 最佳实践

### 代码质量

- **TypeScript**：启用严格类型检查
- **Vue 最佳实践**：组合式 API、`<script setup>` 语法
- **组件结构**：单文件组件 (SFC)

### 性能优化

- **代码分割**：Vite 自动代码分割
- **懒加载**：基于路由的懒加载
- **资源优化**：图片和资源优化
- **Tree Shaking**：消除未使用的代码

### 安全性

- **XSS 防护**：使用 DOMPurify 进行 HTML 清理
- **CORS**：在后端 API 中配置
- **环境变量**：敏感数据存储在 `.env` 文件中（不提交到版本控制）

## 🐛 故障排除

### 缓存问题

如果部署后更改未生效：

```bash
# 清除浏览器缓存
Ctrl + F5 (Windows/Linux)
Cmd + Shift + R (macOS)

# 清除 Docker 构建缓存
docker system prune -a
```

### 端口冲突

如果端口 9400 已被占用：

```bash
# 检查端口占用
sudo lsof -i :9400

# 终止占用端口的进程
sudo kill -9 <PID>
```

### Docker 构建失败

```bash
# 删除旧容器和镜像
docker-compose down -v
docker system prune -a

# 从头开始重新构建
docker-compose build --no-cache
```

## 👥 贡献指南

欢迎贡献！请遵循以下准则：

1. Fork 仓库
2. 创建特性分支（`git checkout -b feature/AmazingFeature`）
3. 提交更改（`git commit -m 'Add some AmazingFeature'`）
4. 推送到分支（`git push origin feature/AmazingFeature`）
5. 开启拉取请求

## 📄 许可证

© 2025 CBIT-AiForge GTIIT 智能助手。保留所有权利。

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

## 🙏 致谢

- **开发者**：[Ren CBIT](https://github.com/reneverland/) - 首席开发者与维护者
- **机构**：广东以色列理工学院 (GTIIT)
- **合作机构**：香港中文大学（深圳）

## ⚠️ 免责声明

大语言模型生成的内容不代表广东以色列理工学院或香港中文大学（深圳）的官方观点。

---

**Repository**: https://github.com/reneverland/CBIT-AiForgeGTIIT

**Maintainer**: [Ren CBIT](https://github.com/reneverland/)

**Contact**: cooledward@outlook.com
