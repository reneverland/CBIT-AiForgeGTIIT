# 🔍 问题排查指南

## 问题 1：还是显示旧的设计

### 可能原因：
1. **Docker 容器未重新构建** - 最常见的问题
2. **浏览器缓存** - 浏览器缓存了旧的 JS/CSS
3. **容器未启动** - 服务没有正常运行

### 解决方案：

#### 步骤 1: 重新构建 Docker 容器
```bash
cd /home/dell/workspace_links/wwwroot/CBIT-FrontAiForgeGTIIT

# 停止并删除旧容器
docker-compose down

# 完全重新构建（不使用缓存）
docker-compose build --no-cache

# 启动新容器（内网）
docker-compose --env-file .env.local up -d

# 查看日志确认启动成功
docker-compose logs -f
```

#### 步骤 2: 清除浏览器缓存
- **Chrome/Edge**: Ctrl + Shift + Delete → 清除缓存
- **Firefox**: Ctrl + Shift + Delete → 清除缓存
- **或使用隐身模式测试**: Ctrl + Shift + N

#### 步骤 3: 强制刷新页面
- **Windows**: Ctrl + F5
- **Mac**: Cmd + Shift + R

#### 步骤 4: 验证容器状态
```bash
# 查看容器是否运行
docker ps | grep gtiit

# 查看容器日志
docker logs cbit_frontaiforge_gtiit

# 进入容器检查文件
docker exec -it cbit_frontaiforge_gtiit sh
ls -la /usr/share/nginx/html/
```

---

## 问题 2：来源（references）没有显示

### 可能原因：
1. **后端没有返回 metadata.references**
2. **GTIIT 知识库未配置或为空**
3. **API 连接不正确**
4. **前端未正确解析 metadata**

### 解决方案：

#### 步骤 1: 检查后端 API 连接
```bash
# 测试后端 API 是否可访问
curl http://10.120.30.200:5173/api/applications/_public

# 应该能看到 gtiit 应用的配置
```

#### 步骤 2: 检查后端 GTIIT 应用配置
访问后端管理界面，确认：
- GTIIT 应用是否已创建
- GTIIT 知识库是否有内容
- API 密钥是否正确
- 应用是否启用了 RAG 检索

#### 步骤 3: 测试 GTIIT API 端点
```bash
# 测试聊天 API
curl -X POST http://10.120.30.200:5173/api/apps/gtiit/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer app_VHeKeeo5xnzb8OIipb9kp1jXIre63v9Z" \
  -d '{
    "messages": [{"role": "user", "content": "广东以色列理工学院有哪些专业？"}],
    "stream": false
  }'

# 检查返回的 JSON 中是否包含 metadata.references
```

#### 步骤 4: 检查前端控制台
1. 打开浏览器开发者工具（F12）
2. 切换到 Console 标签
3. 发送一条消息
4. 查看是否有错误信息
5. 检查 Network 标签，查看 API 响应内容

#### 步骤 5: 检查前端代码
```bash
# 确认 chat.ts 中是否正确保存了 metadata
grep -n "metadata" src/stores/chat.ts

# 确认 ChatMessage.vue 中是否正确显示 references
grep -n "references" src/components/ChatMessage.vue
```

---

## 快速诊断脚本

### 一键诊断
```bash
#!/bin/bash
echo "🔍 GTIIT 前端诊断"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "1. 检查 Docker 容器状态"
docker ps | grep gtiit || echo "❌ 容器未运行！"

echo ""
echo "2. 检查后端连接"
curl -s http://10.120.30.200:5173/api/applications/_public | grep -q gtiit && echo "✅ 后端可访问" || echo "❌ 后端无法访问"

echo ""
echo "3. 检查文件修改"
grep -q "GTIIT AI Assistant" src/components/Header.vue && echo "✅ Header 已修改" || echo "❌ Header 未修改"
grep -q "广东以色列理工学院" src/components/ChatInput.vue && echo "✅ 免责声明已修改" || echo "❌ 免责声明未修改"
grep -q "0066CC" tailwind.config.js && echo "✅ 颜色主题已修改" || echo "❌ 颜色主题未修改"

echo ""
echo "4. 检查最近构建时间"
docker inspect cbit_frontaiforge_gtiit 2>/dev/null | grep -i created || echo "❌ 容器不存在"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
```

保存为 `diagnose.sh` 并运行：
```bash
chmod +x diagnose.sh
./diagnose.sh
```

---

## 完整重建流程（推荐）

如果以上方法都不行，执行完全重建：

```bash
cd /home/dell/workspace_links/wwwroot/CBIT-FrontAiForgeGTIIT

# 1. 停止并删除所有相关容器和镜像
docker-compose down
docker rmi $(docker images | grep frontaiforge | awk '{print $3}')

# 2. 清理 node_modules（可选）
# rm -rf node_modules

# 3. 验证文件修改
./FINAL_CHECK.sh

# 4. 完全重新构建
docker-compose build --no-cache

# 5. 启动（内网）
docker-compose --env-file .env.local up -d

# 6. 查看日志
docker-compose logs -f

# 7. 等待 30 秒后访问
sleep 30
echo "访问: http://127.0.0.1:9400"
```

---

## 验证清单

### 前端显示验证
访问 http://127.0.0.1:9400 后检查：

- [ ] 顶部 Logo 是蓝色/方形（aboutlogo.png）
- [ ] 页面主色调是蓝色（不是紫色）
- [ ] 欢迎页面显示 "GTIIT AI Assistant"
- [ ] 底部显示 "广东以色列理工学院"
- [ ] AI 助理名称是 "GTIIT AI Assistant"（不是 SME）
- [ ] 示例问题是 GTIIT 相关

### 功能验证
- [ ] 能够发送消息
- [ ] AI 能够正常回复
- [ ] 如果有知识库内容，应显示"参考来源"按钮
- [ ] 点击"参考来源"能展开显示具体引用

---

## 调试技巧

### 1. 实时查看容器日志
```bash
docker-compose logs -f
```

### 2. 查看 Nginx 配置
```bash
docker exec -it cbit_frontaiforge_gtiit cat /etc/nginx/conf.d/default.conf
```

### 3. 查看前端文件
```bash
docker exec -it cbit_frontaiforge_gtiit ls -la /usr/share/nginx/html/assets/
```

### 4. 测试 API 连接
```bash
# 从容器内部测试后端
docker exec -it cbit_frontaiforge_gtiit wget -O- http://10.120.30.200:5173/api/applications/_public
```

---

## 联系支持

如果以上方法都无法解决问题，请提供以下信息：

1. 容器日志：`docker-compose logs > logs.txt`
2. 浏览器控制台截图
3. Network 标签中 API 请求/响应
4. `./FINAL_CHECK.sh` 的输出

---

**更新时间**: 2025-10-30  
**作者**: Ren CBIT
