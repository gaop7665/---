# 🔗 CF URL Shortener

一个强大的开源短链接服务，基于 Cloudflare Workers 和 Pages 构建。快速、安全且易于部署！

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange.svg)

## ✨ 特性

- **⚡ 极速访问** - 基于 Cloudflare 全球边缘网络
- **🔒 安全可靠** - 可选密码保护功能
- **📊 统计分析** - 追踪每个短链接的访问数据
- **🎨 精美界面** - 现代化响应式网页设计
- **🔧 自定义代码** - 创建易记的自定义短链接
- **👑 管理面板** - 在一个地方管理所有链接
- **🌍 全球 CDN** - 全球任何地方都能快速重定向
- **💾 KV 存储** - 使用 Cloudflare KV 可靠存储数据
- **🆓 免费部署** - 可在 Cloudflare 免费套餐上运行

## 🚀 快速开始

### 前置要求

- 一个 [Cloudflare 账户](https://dash.cloudflare.com/sign-up)
- 已安装 [Node.js](https://nodejs.org/)（v16 或更高版本）
- 已安装 [Git](https://git-scm.com/)

### 安装步骤

1. **克隆此仓库**
   ```bash
   git clone https://github.com/yourusername/cf-url-shortener.git
   cd cf-url-shortener
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **创建 KV 命名空间**
   ```bash
   npx wrangler kv:namespace create "URL_DB"
   npx wrangler kv:namespace create "URL_DB" --preview
   ```

4. **更新 `wrangler.toml`**
   
   从上一条命令复制命名空间 ID 并更新 `wrangler.toml`：
   ```toml
   [[kv_namespaces]]
   binding = "URL_DB"
   id = "你的_kv_命名空间_id"
   preview_id = "你的_预览_kv_命名空间_id"
   ```

5. **设置管理员令牌**
   
   在 `wrangler.toml` 中更新 `ADMIN_TOKEN` 或使用环境变量：
   ```toml
   [vars]
   ADMIN_TOKEN = "你的秘密管理员令牌请更改此值"
   BASE_URL = "https://你的域名.workers.dev"
   ```

6. **部署到 Cloudflare Workers**
   ```bash
   npm run deploy
   ```

### 部署前端到 Cloudflare Pages

1. **将代码推送到 GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **连接到 Cloudflare Pages**
   - 访问 [Cloudflare 控制台](https://dash.cloudflare.com/)
   - 导航至 **Pages** > **创建项目**
   - 连接你的 GitHub 仓库
   - 设置构建配置：
     - **构建命令**: (留空)
     - **构建输出目录**: `public`
   - 点击 **保存并部署**

3. **更新 API 端点**
   
   部署 Worker 后，在 HTML 文件中更新 `API_BASE` 常量，指向你的 Worker URL。

## 📖 使用说明

### 创建短链接

1. 访问你部署的 Pages 网站
2. 输入长网址
3. （可选）设置自定义短代码
4. （可选）添加密码保护
5. 点击"缩短网址"
6. 复制并分享你的短链接！

### 管理面板

1. 访问 `/admin.html`
2. 输入你的管理员令牌（在 `wrangler.toml` 中设置）
3. 查看所有网址、统计数据并管理链接

### API 接口

#### 创建短链接
```bash
POST /api/shorten
Content-Type: application/json

{
  "url": "https://example.com/very/long/url",
  "customCode": "my-link",  // 可选
  "password": "secret123"    // 可选
}
```

#### 获取网址统计
```bash
GET /api/stats/:code
```

#### 列出所有网址（管理员）
```bash
GET /api/list
Authorization: Bearer 你的管理员令牌
```

#### 删除网址（管理员）
```bash
DELETE /api/delete/:code
Authorization: Bearer 你的管理员令牌
```

#### 重定向到长网址
```bash
GET /:code
```

## 🛠️ 配置

### 环境变量

在 `wrangler.toml` 中配置：

- `ADMIN_TOKEN` - 管理员访问的秘密令牌
- `BASE_URL` - 你的 Worker 公开 URL

### KV 存储

应用程序使用 Cloudflare KV 存储：
- 短链接映射
- 访问统计
- URL 元数据
- 密码哈希（如果有密码保护）

## 🏗️ 项目结构

```
cf-url-shortener/
├── src/
│   └── index.js          # Worker 后端代码
├── public/
│   ├── index.html        # 主短链接页面
│   ├── admin.html        # 管理面板
│   └── stats.html        # 统计页面
├── package.json          # 依赖配置
├── wrangler.toml         # Cloudflare Workers 配置
├── README.md             # 英文文档
├── README_CN.md          # 中文文档
└── LICENSE               # MIT 许可证
```

## 🔧 开发

### 本地开发

```bash
# 启动开发服务器
npm run dev
```

访问 `http://localhost:8787` 进行本地测试。

### 测试

使用 curl 测试 API：

```bash
# 创建短链接
curl -X POST http://localhost:8787/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'

# 获取统计
curl http://localhost:8787/api/stats/abc123

# 列出所有网址（管理员）
curl http://localhost:8787/api/list \
  -H "Authorization: Bearer 你的管理员令牌"
```

## 🌟 高级功能

### 自定义域名

1. 将你的域名添加到 Cloudflare
2. 在 Workers 设置中添加自定义域名
3. 更新 `wrangler.toml` 中的 `BASE_URL`

### 速率限制

添加速率限制以防止滥用：

```javascript
// 在 src/index.js 中添加速率限制逻辑
const rateLimiter = await env.RATE_LIMITER.get(clientIP);
if (rateLimiter > 10) {
  return new Response('请求过多', { status: 429 });
}
```

### 分析统计

集成 Cloudflare Analytics 或 Google Analytics 以获得更深入的见解。

## 🤝 贡献

欢迎贡献！请随时提交 Pull Request。

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📝 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- 使用 [Cloudflare Workers](https://workers.cloudflare.com/) 构建
- 部署在 [Cloudflare Pages](https://pages.cloudflare.com/)
- 灵感来自对简单、快速、免费短链接服务的需求

## 📧 支持

如果你有任何问题或疑问，请：
- 在 GitHub 上开启一个 issue
- 查看现有 issues 寻找解决方案
- 阅读 [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)

## 🔐 安全

- 切勿将 `ADMIN_TOKEN` 提交到公开仓库
- 在生产环境中使用强且唯一的令牌
- 考虑为生产环境添加速率限制
- 定期更新依赖

## 🚦 状态

本项目正在积极维护中。欢迎给仓库点星 ⭐ 以表示支持！

---

使用 Cloudflare Workers 和 Pages 用 ❤️ 制作

