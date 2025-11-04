# 🔧 GTIIT 前端问题解决方案

## 📋 问题总结

### 问题 1: 页面显示旧设计 ❌
- **原因**: Docker 容器未运行
- **状态**: 需要启动容器

### 问题 2: Favicon 未更新 ❌
- **原因**: 浏览器缓存
- **状态**: 需要清除缓存

### 问题 3: 参考来源不显示 ✅
- **原因**: 前端读取 metadata 路径错误
- **状态**: **已修复** ✅

---

## 🎯 立即执行步骤

### 步骤 1: 启动 Docker 容器（最重要！）

```bash
cd /home/dell/workspace_links/wwwroot/CBIT-FrontAiForgeGTIIT

# 方式 A: 使用快捷脚本（推荐）
./start-local-gtiit.sh

# 方式 B: 手动执行
docker-compose down
docker-compose build --no-cache
docker-compose --env-file .env.local up -d
```

**等待 30-60 秒让容器启动完成。**

### 步骤 2: 彻底清除浏览器缓存

#### Chrome/Edge 用户：
1. 按 `Ctrl + Shift + Delete`
2. 选择"全部时间"
3. 勾选"缓存的图片和文件"、"Cookie 和其他网站数据"
4. 点击"清除数据"
5. 关闭浏览器，重新打开

#### 或使用隐身模式测试：
- `Ctrl + Shift + N` (Chrome/Edge)
- `Ctrl + Shift + P` (Firefox)

#### 强制刷新 Favicon：
1. 访问：`http://127.0.0.1:9400/aboutlogo.png`
2. 按 `Ctrl + F5` 强制刷新
3. 然后访问首页：`http://127.0.0.1:9400`

### 步骤 3: 验证功能

访问 http://127.0.0.1:9400 后，发送测试问题：

```
广东以色列理工学院有哪些专业？
```

**应该看到**：
- ✅ 页面主色调为蓝色（不是紫色）
- ✅ 顶部 Logo 显示（aboutlogo.png）
- ✅ 欢迎页面显示 "GTIIT AI Assistant"
- ✅ 底部显示 "不代表广东以色列理工学院的观点"
- ✅ **AI 回复下方出现"参考来源 (2)"按钮** ⭐
- ✅ 点击按钮能看到 GTIIT 知识库的引用

---

## 🔍 问题 3 的技术修复详情

### 修复的问题
后端返回的 `references` 数据在流式输出中位于：
```json
{
  "choices": [
    {
      "message": {
        "metadata": {
          "references": [...]  ← 这里
        }
      }
    }
  ]
}
```

但前端原来只检查：
```json
{
  "metadata": {...},  ← 只检查这里
  "cbit_metadata": {...}
}
```

### 修复方案
修改 `src/api/chat.ts` 第 151-164 行，添加对 `choices[0].message.metadata` 的支持：

```typescript
const messageMetadata = json.choices?.[0]?.message?.metadata
if (messageMetadata || json.metadata || json.cbit_metadata) {
  metadata = {
    ...metadata,
    ...json.metadata,
    ...json.cbit_metadata,
    ...messageMetadata  // ← 新增
  }
}
```

**✅ 此修复已完成！重新构建容器后生效。**

---

## 📊 验证结果

### 后端测试结果 ✅
```bash
# 运行测试
./test-gtiit-api.sh

# 结果显示：
✅ GTIIT 应用已配置
✅ 知识库 "GTIIT" 有内容
✅ 返回了 2 个参考来源
✅ 相似度: 92.08%（极高）
✅ 置信度: 极高
```

### 前端预期结果 ✅
启动容器并清除缓存后：
- ✅ 蓝色主题（不是紫色）
- ✅ GTIIT 品牌标识
- ✅ **参考来源按钮显示** ⭐
- ✅ 点击展开显示知识库引用

---

## 🚨 常见问题

### Q1: 启动后还是旧设计？
**A**: 清除浏览器缓存，使用隐身模式测试

### Q2: Favicon 还是没变？
**A**: 
1. 直接访问 `http://127.0.0.1:9400/aboutlogo.png`
2. Ctrl + F5 强制刷新
3. 关闭浏览器重新打开
4. 或使用隐身模式

### Q3: 没有"参考来源"按钮？
**A**: 
1. 确保容器重新构建（`docker-compose build --no-cache`）
2. 清除浏览器缓存
3. 打开浏览器开发者工具（F12）
4. 查看 Console 标签是否有错误
5. 查看 Network 标签，检查 API 响应

### Q4: Docker 容器启动失败？
**A**:
```bash
# 查看日志
docker-compose logs

# 检查端口占用
netstat -tuln | grep 9400

# 完全重建
docker-compose down
docker system prune -f
docker-compose build --no-cache
docker-compose --env-file .env.local up -d
```

---

## 📝 修改文件清单

### 已修改的文件：
1. ✅ `src/stores/app.ts` - API 连接改为 gtiit
2. ✅ `src/components/Header.vue` - Logo 和标题
3. ✅ `src/components/ChatInput.vue` - 免责声明
4. ✅ `src/components/ChatMessage.vue` - AI 名称
5. ✅ `src/components/WelcomeScreen.vue` - 欢迎文字
6. ✅ `src/components/Footer.vue` - 版权信息
7. ✅ `src/views/ChatView.vue` - 示例问题
8. ✅ `tailwind.config.js` - 颜色主题
9. ✅ `src/api/chat.ts` - **metadata 读取路径修复** ⭐
10. ✅ `index.html` - Favicon 配置

### Logo 文件：
- ⚠️ `public/aboutlogo.png` - 当前使用占位符
- ⚠️ `public/gtiitlogo.png` - 当前使用占位符

---

## ✅ 完整验证清单

启动后测试：

- [ ] 访问 http://127.0.0.1:9400
- [ ] 页面主色调是蓝色
- [ ] 顶部 Logo 显示正确
- [ ] 浏览器标签页 Favicon 是 aboutlogo.png
- [ ] 欢迎页面显示 "GTIIT AI Assistant"
- [ ] 底部免责声明提到"广东以色列理工学院"
- [ ] 示例问题为 GTIIT 相关
- [ ] 发送消息："广东以色列理工学院有哪些专业？"
- [ ] AI 能正常回复
- [ ] **回复下方显示"参考来源 (2)"按钮** ⭐
- [ ] 点击按钮能展开显示知识库引用
- [ ] 显示"知识库「GTIIT」"来源标识

---

## 🎉 预期最终效果

### 视觉风格
- 🔵 蓝色科技风格主题
- 🏫 GTIIT 品牌标识
- 📱 现代化 UI 设计

### 功能特性
- 💬 流式对话输出
- 📚 **知识库引用显示** ⭐
- 🔍 来源追溯
- 💡 Q&A 建议
- 👍 反馈机制

---

## 🛠️ 调试命令

```bash
# 检查配置
./FINAL_CHECK.sh

# 诊断问题
./diagnose.sh

# 测试 API
./test-gtiit-api.sh

# 查看日志
docker-compose logs -f

# 进入容器
docker exec -it cbit_frontaiforge_gtiit sh
```

---

**更新时间**: 2025-10-30  
**作者**: Ren CBIT  
**状态**: ✅ 代码修复完成，等待容器重建
