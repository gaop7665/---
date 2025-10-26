# 🚀 快速开始指南 / Quick Start Guide

## 5 分钟部署 / Deploy in 5 Minutes

### ⚡ 超快速部署（推荐）/ Super Quick Deploy (Recommended)

```bash
# 1. 克隆项目 / Clone project
git clone https://github.com/yourusername/cf-url-shortener.git
cd cf-url-shortener

# 2. 安装依赖 / Install dependencies
npm install

# 3. 登录 Cloudflare / Login to Cloudflare
npx wrangler login

# 4. 创建 KV 数据库 / Create KV database
npx wrangler kv:namespace create "URL_DB"
npx wrangler kv:namespace create "URL_DB" --preview

# 5. 编辑 wrangler.toml，填入上一步的 ID / Edit wrangler.toml with IDs from step 4
# 修改 ADMIN_TOKEN 为你的密码 / Change ADMIN_TOKEN to your password

# 6. 部署！/ Deploy!
npm run deploy

# 🎉 完成！你的 Worker 已经部署好了
# 🎉 Done! Your Worker is now deployed
```

### 📦 部署前端到 Cloudflare Pages / Deploy Frontend to Pages

**选项 A: 通过 GitHub (最简单) / Via GitHub (Easiest)**

```bash
# 1. 推送到 GitHub / Push to GitHub
git remote add origin https://github.com/yourusername/cf-url-shortener.git
git add .
git commit -m "Initial commit"
git push -u origin main

# 2. 访问 Cloudflare Dashboard / Visit Cloudflare Dashboard
# https://dash.cloudflare.com/

# 3. Pages > Create a project > Connect to Git
# 选择你的仓库，构建目录设为 public / Select your repo, set build directory to public

# 4. 部署完成！/ Deploy complete!
```

**选项 B: 直接部署 / Direct Deploy**

```bash
npx wrangler pages deploy public --project-name=cf-url-shortener
```

## 🔑 配置管理员令牌 / Configure Admin Token

在 `wrangler.toml` 中设置:
Set in `wrangler.toml`:

```toml
[vars]
ADMIN_TOKEN = "your_super_secret_token_here_make_it_strong"
```

**生成强密码 / Generate Strong Password:**

```bash
# 使用 Node.js / Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 或在线生成 / Or generate online
# https://randomkeygen.com/
```

## 📝 更新 API 地址 / Update API Endpoint

部署 Worker 后，你会得到一个 URL，例如:
After deploying Worker, you'll get a URL like:

```
https://cf-url-shortener.your-account.workers.dev
```

在前端文件中更新 `API_BASE`:
Update `API_BASE` in frontend files:

```javascript
// public/index.html, public/admin.html, public/stats.html
const API_BASE = 'https://cf-url-shortener.your-account.workers.dev';
```

然后重新推送到 GitHub 或重新部署 Pages。
Then push to GitHub again or redeploy Pages.

## ✅ 测试部署 / Test Deployment

### 测试 API / Test API

```bash
# 创建短链接 / Create short URL
curl -X POST https://your-worker-url/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.cloudflare.com"}'

# 应该返回 / Should return:
# {"success":true,"shortCode":"xyz123","shortUrl":"..."}
```

### 测试重定向 / Test Redirect

在浏览器访问 / Visit in browser:
```
https://your-worker-url/xyz123
```

应该重定向到 Cloudflare 官网。
Should redirect to Cloudflare website.

### 测试管理面板 / Test Admin Panel

1. 访问 / Visit: `https://your-pages-url/admin.html`
2. 输入你的 ADMIN_TOKEN / Enter your ADMIN_TOKEN
3. 查看所有链接 / View all links

## 🎯 使用示例 / Usage Examples

### 创建简单短链接 / Create Simple Short URL

访问你的 Pages 网站:
Visit your Pages site:

1. 输入长 URL: `https://www.example.com/very/long/url/path`
2. 点击 "Shorten URL"
3. 复制生成的短链接

### 创建自定义短链接 / Create Custom Short URL

1. 输入长 URL
2. 点击 "Advanced Options"
3. 输入自定义代码: `my-link`
4. 点击 "Shorten URL"
5. 得到: `https://your-domain/my-link`

### 创建受密码保护的链接 / Create Password-Protected Link

1. 输入长 URL
2. 点击 "Advanced Options"
3. 设置密码
4. 点击 "Shorten URL"

## 🔧 常见问题 / Common Issues

### 问题 1: "KV namespace not found"

**解决方案 / Solution:**
```bash
# 确保创建了 KV 命名空间 / Ensure KV namespace is created
npx wrangler kv:namespace list

# 检查 wrangler.toml 中的 ID / Check IDs in wrangler.toml
```

### 问题 2: "Unauthorized" 在管理面板 / "Unauthorized" in admin panel

**解决方案 / Solution:**
1. 确认 `wrangler.toml` 中的 ADMIN_TOKEN 已设置
2. 重新部署: `npm run deploy`
3. 在管理面板输入相同的 token

### 问题 3: CORS 错误 / CORS errors

**解决方案 / Solution:**
1. 确保 API_BASE 指向正确的 Worker URL
2. 检查浏览器控制台的错误信息
3. 确认 Worker 已部署成功

### 问题 4: 前端无法连接到 API / Frontend can't connect to API

**解决方案 / Solution:**
1. 更新前端文件中的 `API_BASE`
2. 重新部署 Pages
3. 清除浏览器缓存

## 📊 监控和日志 / Monitoring and Logs

### 查看实时日志 / View Real-time Logs

```bash
npm run tail
```

### 查看分析数据 / View Analytics

访问 Cloudflare Dashboard:
Visit Cloudflare Dashboard:
- Workers & Pages > 你的 Worker > Metrics
- Pages > 你的项目 > Analytics

## 🌟 下一步 / Next Steps

✅ **添加自定义域名 / Add Custom Domain**
- 让短链接更专业
- Make short links more professional

✅ **设置 GitHub Actions / Setup GitHub Actions**
- 自动部署
- Automatic deployment

✅ **监控使用情况 / Monitor Usage**
- 追踪链接点击
- Track link clicks

✅ **分享你的项目 / Share Your Project**
- 给仓库加星 ⭐
- Star the repo ⭐

## 💡 提示 / Tips

- 🔒 使用强 ADMIN_TOKEN (至少 32 字符)
  Use strong ADMIN_TOKEN (at least 32 chars)

- 🌍 添加自定义域名让链接更短更专业
  Add custom domain for shorter, more professional links

- 📊 定期检查统计数据了解使用情况
  Regularly check statistics to understand usage

- 🔄 定期更新依赖保持安全
  Regularly update dependencies for security

- 💾 考虑备份 KV 数据
  Consider backing up KV data

## 🆘 需要帮助? / Need Help?

- 📖 阅读完整文档 / Read full docs: [README.md](README.md)
- 🐛 报告问题 / Report issues: GitHub Issues
- 💬 加入讨论 / Join discussion: GitHub Discussions
- 📧 查看部署指南 / Check deployment guide: [DEPLOYMENT.md](DEPLOYMENT.md)

## 🎉 完成! / Done!

恭喜！你的 URL 短链接服务现在已经上线了！
Congratulations! Your URL shortener service is now live!

开始创建和分享你的短链接吧！
Start creating and sharing your short links!

---

Made with ❤️ using Cloudflare Workers

