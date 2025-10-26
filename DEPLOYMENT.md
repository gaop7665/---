# 部署指南 / Deployment Guide

本指南将帮助你一步步将 CF URL Shortener 部署到 Cloudflare。

This guide will help you deploy CF URL Shortener to Cloudflare step by step.

---

## 📋 前提条件 / Prerequisites

1. ✅ Cloudflare 账户 / Cloudflare account
2. ✅ GitHub 账户 / GitHub account
3. ✅ 已安装 Node.js (v16+) / Node.js installed (v16+)
4. ✅ 已安装 Git / Git installed

---

## 🚀 部署步骤 / Deployment Steps

### Step 1: 准备仓库 / Prepare Repository

```bash
# 1. 克隆或下载项目 / Clone or download the project
git clone https://github.com/yourusername/cf-url-shortener.git
cd cf-url-shortener

# 2. 安装依赖 / Install dependencies
npm install

# 3. 登录到 Cloudflare / Login to Cloudflare
npx wrangler login
```

### Step 2: 创建 KV 命名空间 / Create KV Namespace

```bash
# 创建生产环境 KV / Create production KV
npx wrangler kv:namespace create "URL_DB"

# 创建预览环境 KV / Create preview KV
npx wrangler kv:namespace create "URL_DB" --preview
```

你会看到类似这样的输出 / You will see output like this:

```
{ binding = "URL_DB", id = "xxxxxxxxxxxxx" }
```

### Step 3: 配置 wrangler.toml

复制上一步的 ID，编辑 `wrangler.toml`:
Copy the IDs from the previous step and edit `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "URL_DB"
id = "xxxxxxxxxxxxx"              # 替换为你的 ID / Replace with your ID
preview_id = "yyyyyyyyyyyyyyy"     # 替换为你的预览 ID / Replace with your preview ID

[vars]
ADMIN_TOKEN = "your_secure_token_here_change_this"  # 设置强密码 / Set a strong password
BASE_URL = "https://your-worker-name.workers.dev"   # 稍后更新 / Update later
```

### Step 4: 部署 Worker / Deploy Worker

```bash
# 部署到 Cloudflare Workers
npm run deploy
```

部署成功后，你会看到 Worker URL:
After successful deployment, you will see the Worker URL:

```
Published cf-url-shortener (1.23 sec)
  https://cf-url-shortener.your-account.workers.dev
```

### Step 5: 更新 BASE_URL

将上面的 URL 更新到 `wrangler.toml` 中的 `BASE_URL`，然后重新部署:
Update the `BASE_URL` in `wrangler.toml` with the URL above, then redeploy:

```bash
npm run deploy
```

### Step 6: 部署前端到 Cloudflare Pages / Deploy Frontend to Cloudflare Pages

#### 方法 1: 通过 GitHub (推荐) / Method 1: Via GitHub (Recommended)

1. **将代码推送到 GitHub / Push code to GitHub**
   ```bash
   git remote add origin https://github.com/yourusername/cf-url-shortener.git
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```

2. **连接到 Cloudflare Pages / Connect to Cloudflare Pages**
   - 访问 / Visit: https://dash.cloudflare.com/
   - 点击 **Pages** > **Create a project**
   - 选择 **Connect to Git**
   - 选择你的仓库 / Select your repository
   - 配置构建设置 / Configure build settings:
     - **Build command**: (留空 / leave empty)
     - **Build output directory**: `public`
   - 点击 **Save and Deploy**

3. **更新前端 API 地址 / Update Frontend API URL**
   
   编辑 `public/index.html`, `public/admin.html`, `public/stats.html`:
   Edit `public/index.html`, `public/admin.html`, `public/stats.html`:
   
   ```javascript
   // 将这行 / Change this line:
   const API_BASE = window.location.origin;
   
   // 改为你的 Worker URL / To your Worker URL:
   const API_BASE = 'https://cf-url-shortener.your-account.workers.dev';
   ```
   
   提交并推送更改 / Commit and push changes:
   ```bash
   git add .
   git commit -m "Update API endpoint"
   git push
   ```
   
   Cloudflare Pages 会自动重新部署 / Cloudflare Pages will automatically redeploy.

#### 方法 2: 直接部署 / Method 2: Direct Deploy

```bash
# 使用 Wrangler 部署 Pages
npx wrangler pages deploy public --project-name=cf-url-shortener
```

---

## 🔧 配置管理员访问 / Configure Admin Access

1. 记住你在 `wrangler.toml` 中设置的 `ADMIN_TOKEN`
   Remember the `ADMIN_TOKEN` you set in `wrangler.toml`

2. 访问 `https://your-pages-url/admin.html`
   Visit `https://your-pages-url/admin.html`

3. 输入你的 ADMIN_TOKEN
   Enter your ADMIN_TOKEN

---

## 🌐 自定义域名 (可选) / Custom Domain (Optional)

### 为 Worker 添加自定义域名 / Add Custom Domain to Worker

1. 在 Cloudflare 中添加你的域名 / Add your domain to Cloudflare
2. 进入 Workers & Pages > 你的 Worker
   Go to Workers & Pages > your Worker
3. 点击 **Settings** > **Triggers** > **Add Custom Domain**
4. 输入子域名，如 `short.yourdomain.com`
   Enter subdomain, e.g., `short.yourdomain.com`

### 为 Pages 添加自定义域名 / Add Custom Domain to Pages

1. 进入 Pages > 你的项目 > **Custom domains**
   Go to Pages > your project > **Custom domains**
2. 点击 **Set up a custom domain**
3. 输入域名，如 `links.yourdomain.com`
   Enter domain, e.g., `links.yourdomain.com`

---

## ✅ 验证部署 / Verify Deployment

### 测试 Worker API

```bash
# 创建短链接 / Create short URL
curl -X POST https://your-worker-url/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.cloudflare.com"}'

# 应该返回 / Should return:
# {"success":true,"shortCode":"abc123","shortUrl":"https://your-worker-url/abc123",...}

# 测试重定向 / Test redirect
curl -I https://your-worker-url/abc123
```

### 测试前端 / Test Frontend

1. 访问你的 Pages URL
   Visit your Pages URL
2. 尝试创建一个短链接
   Try creating a short URL
3. 访问管理面板
   Visit the admin panel
4. 检查统计页面
   Check the statistics page

---

## 🔄 更新部署 / Update Deployment

### 更新 Worker

```bash
# 修改代码后 / After modifying code
npm run deploy
```

### 更新 Pages

如果使用 Git 集成 / If using Git integration:
```bash
git add .
git commit -m "Update"
git push
```

如果直接部署 / If direct deploy:
```bash
npx wrangler pages deploy public --project-name=cf-url-shortener
```

---

## 🐛 故障排除 / Troubleshooting

### 问题 1: KV namespace not found

**解决方案 / Solution:**
- 确保 `wrangler.toml` 中的 KV ID 正确
  Ensure KV IDs in `wrangler.toml` are correct
- 运行 `npx wrangler kv:namespace list` 查看你的命名空间
  Run `npx wrangler kv:namespace list` to see your namespaces

### 问题 2: CORS 错误 / CORS errors

**解决方案 / Solution:**
- 确保前端的 API_BASE 指向正确的 Worker URL
  Ensure API_BASE in frontend points to correct Worker URL
- 检查 Worker 代码中的 CORS headers
  Check CORS headers in Worker code

### 问题 3: 401 Unauthorized in admin panel

**解决方案 / Solution:**
- 确认 `ADMIN_TOKEN` 在 `wrangler.toml` 中正确设置
  Confirm `ADMIN_TOKEN` is correctly set in `wrangler.toml`
- 检查浏览器控制台是否有错误
  Check browser console for errors

---

## 📊 监控 / Monitoring

### 查看日志 / View Logs

```bash
# 实时查看 Worker 日志 / View Worker logs in real-time
npm run tail
```

### 查看分析 / View Analytics

访问 Cloudflare Dashboard:
Visit Cloudflare Dashboard:
- Workers & Pages > 你的 Worker > Analytics
- Pages > 你的项目 > Analytics

---

## 🔐 安全建议 / Security Recommendations

1. ✅ 使用强 ADMIN_TOKEN (至少 32 字符)
   Use strong ADMIN_TOKEN (at least 32 characters)

2. ✅ 不要将 ADMIN_TOKEN 提交到公开仓库
   Don't commit ADMIN_TOKEN to public repositories

3. ✅ 定期更换 ADMIN_TOKEN
   Regularly rotate ADMIN_TOKEN

4. ✅ 考虑添加速率限制
   Consider adding rate limiting

5. ✅ 启用 Cloudflare WAF (如果有付费计划)
   Enable Cloudflare WAF (if you have a paid plan)

---

## 🎉 完成! / Done!

你的 URL 短链接服务现在已经部署完成！
Your URL shortener service is now deployed!

- 🌐 前端 / Frontend: https://your-pages-url
- 🔗 API: https://your-worker-url
- 👑 管理面板 / Admin: https://your-pages-url/admin.html

享受使用吧! / Enjoy!

