# GTIIT Logo 文件说明

## 📁 需要的 Logo 文件

请将广东以色列理工学院的 Logo 文件放置到 `public/` 目录下：

### 1. **gtiitlogo.png** 
- **用途**: 左上角导航栏 Logo
- **建议尺寸**: 高度 48px，宽度自适应（推荐宽高比 3:1 或 4:1）
- **格式**: PNG（支持透明背景）
- **当前状态**: ⚠️ 使用临时占位符，请替换为真实的 GTIIT Logo

### 2. **aboutlogo.png**
- **用途**: 浏览器标签页 Favicon（网站图标）
- **建议尺寸**: 32x32px 或 64x64px（正方形）
- **格式**: PNG 或 ICO
- **当前状态**: ⚠️ 使用临时占位符，请替换为真实的 GTIIT 图标

---

## 🔄 如何替换 Logo

### 方式一：直接替换文件（推荐）

```bash
# 进入项目 public 目录
cd /home/dell/workspace_links/wwwroot/CBIT-FrontAiForgeGTIIT/public

# 备份旧文件（可选）
cp gtiitlogo.png gtiitlogo.png.bak
cp aboutlogo.png aboutlogo.png.bak

# 复制您的新 Logo 文件到这里
# 将您的文件重命名为 gtiitlogo.png 和 aboutlogo.png
```

### 方式二：使用命令行

```bash
# 从其他位置复制 Logo 文件
cp /path/to/your/gtiit-logo.png /home/dell/workspace_links/wwwroot/CBIT-FrontAiForgeGTIIT/public/gtiitlogo.png
cp /path/to/your/favicon.png /home/dell/workspace_links/wwwroot/CBIT-FrontAiForgeGTIIT/public/aboutlogo.png
```

---

## ✅ 替换后重新构建

替换 Logo 文件后，需要重新构建 Docker 容器：

```bash
cd /home/dell/workspace_links/wwwroot/CBIT-FrontAiForgeGTIIT

# 内网环境
./start-local-gtiit.sh

# 或外网环境
./start-production-gtiit.sh
```

---

## 🎨 Logo 设计建议

### gtiitlogo.png（导航栏 Logo）
- 使用横向版本的 GTIIT Logo
- 包含学校英文或中文名称
- 白色或浅色设计（因为导航栏是深色背景）
- 推荐尺寸：200x50px 左右

### aboutlogo.png（Favicon）
- 使用 GTIIT 学校徽章或图标
- 简洁设计，在小尺寸下清晰可辨
- 正方形
- 推荐尺寸：64x64px

---

## 📞 需要帮助？

如果您有 Logo 文件但不确定如何处理，可以：
1. 将 Logo 文件发送给开发者
2. 或将文件上传到服务器的 `/tmp` 目录，然后告知路径

---

**作者**: Ren CBIT  
**更新时间**: 2025-10-30

