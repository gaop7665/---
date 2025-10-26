# 项目结构 / Project Structure

```
cf-url-shortener/
│
├── 📁 src/                          # 后端代码 / Backend code
│   └── index.js                    # Cloudflare Workers 主文件 / Main Worker file
│
├── 📁 public/                       # 前端静态文件 / Frontend static files
│   ├── index.html                  # 主页面 - 创建短链接 / Home page - Create short URLs
│   ├── admin.html                  # 管理员面板 / Admin panel
│   ├── stats.html                  # 统计页面 / Statistics page
│   └── _headers                    # Cloudflare Pages 安全头 / Security headers
│
├── 📁 .github/                      # GitHub 配置 / GitHub configuration
│   └── workflows/
│       └── deploy.yml              # 自动部署工作流 / Auto-deployment workflow
│
├── 📄 package.json                  # Node.js 依赖配置 / Dependencies
├── 📄 wrangler.toml                 # Cloudflare Workers 配置 / Worker configuration
├── 📄 .gitignore                    # Git 忽略文件 / Git ignore rules
├── 📄 .npmrc                        # NPM 配置 / NPM configuration
├── 📄 .editorconfig                 # 编辑器配置 / Editor configuration
├── 📄 .dev.vars.example             # 环境变量示例 / Environment variables example
│
├── 📖 README.md                     # 项目文档 (英文) / Documentation (English)
├── 📖 README_CN.md                  # 项目文档 (中文) / Documentation (Chinese)
├── 📖 DEPLOYMENT.md                 # 部署指南 / Deployment guide
├── 📖 CONTRIBUTING.md               # 贡献指南 / Contributing guide
├── 📖 CHANGELOG.md                  # 更新日志 / Changelog
├── 📖 STRUCTURE.md                  # 项目结构说明 (本文件) / Project structure (this file)
│
└── 📄 LICENSE                       # MIT 开源协议 / MIT License
```

## 🗂️ 主要文件说明 / Main Files Description

### 后端 / Backend

#### `src/index.js`
Cloudflare Workers 的核心代码，处理所有 API 请求和 URL 重定向。

Core Cloudflare Workers code that handles all API requests and URL redirections.

**主要功能 / Main Features:**
- ✅ URL 短链接创建 / Short URL creation
- ✅ URL 重定向 / URL redirection
- ✅ 统计追踪 / Statistics tracking
- ✅ 管理员 API / Admin API
- ✅ CORS 支持 / CORS support

### 前端 / Frontend

#### `public/index.html`
用户主界面，用于创建短链接。

Main user interface for creating short URLs.

**功能 / Features:**
- 输入长 URL / Enter long URL
- 自定义短代码（可选）/ Custom short code (optional)
- 密码保护（可选）/ Password protection (optional)
- 复制短链接 / Copy short URL
- 查看统计 / View statistics

#### `public/admin.html`
管理员控制面板。

Administrator control panel.

**功能 / Features:**
- 查看所有 URL / View all URLs
- 统计概览 / Statistics overview
- 删除 URL / Delete URLs
- 令牌认证 / Token authentication

#### `public/stats.html`
查看单个短链接的详细统计。

View detailed statistics for individual short URLs.

**显示信息 / Displays:**
- 访问次数 / Visit count
- 创建时间 / Creation time
- 最后访问 / Last visit
- 原始 URL / Original URL

### 配置文件 / Configuration Files

#### `wrangler.toml`
Cloudflare Workers 的配置文件。

Cloudflare Workers configuration file.

**配置项 / Configuration:**
- Workers 名称 / Worker name
- KV 命名空间绑定 / KV namespace bindings
- 环境变量 / Environment variables
- 兼容性日期 / Compatibility date

#### `package.json`
Node.js 项目配置和依赖管理。

Node.js project configuration and dependency management.

**脚本命令 / Scripts:**
- `npm run dev` - 本地开发 / Local development
- `npm run deploy` - 部署到生产环境 / Deploy to production
- `npm run tail` - 查看日志 / View logs

### 文档文件 / Documentation Files

#### `README.md` / `README_CN.md`
完整的项目文档，包含功能介绍、安装步骤、使用说明等。

Complete project documentation including features, installation, and usage.

#### `DEPLOYMENT.md`
详细的部署指南，手把手教你如何部署到 Cloudflare。

Step-by-step deployment guide for Cloudflare.

#### `CONTRIBUTING.md`
贡献指南，欢迎社区参与项目开发。

Contribution guidelines for community participation.

## 🔄 数据流 / Data Flow

```
用户浏览器 / User Browser
         ↓
  前端界面 / Frontend (Cloudflare Pages)
         ↓
  API 请求 / API Request
         ↓
  Workers / Worker (src/index.js)
         ↓
  KV 存储 / KV Storage
         ↓
  返回结果 / Return Result
```

## 🗄️ KV 存储结构 / KV Storage Structure

```
KV Key Pattern:
├── {shortCode}              → 长 URL / Long URL
├── {shortCode}:meta         → 元数据 (JSON) / Metadata (JSON)
├── {shortCode}:pass         → 密码哈希 / Password hash
└── {shortCode}:visits       → 访问计数 / Visit count
```

## 🚀 工作流程 / Workflow

### 创建短链接 / Creating Short URL

1. 用户在前端输入长 URL / User enters long URL in frontend
2. 前端发送 POST 请求到 `/api/shorten` / Frontend sends POST to `/api/shorten`
3. Worker 生成或使用自定义短代码 / Worker generates or uses custom code
4. 保存到 KV 存储 / Saves to KV storage
5. 返回短链接给用户 / Returns short URL to user

### 访问短链接 / Visiting Short URL

1. 用户访问短链接 / User visits short URL
2. Worker 从 KV 读取长 URL / Worker reads long URL from KV
3. 增加访问计数 / Increments visit counter
4. 302 重定向到长 URL / 302 redirect to long URL

### 管理操作 / Admin Operations

1. 管理员登录 / Admin logs in
2. 使用 Bearer token 认证 / Authenticates with Bearer token
3. 执行管理操作 (列表、删除) / Performs admin operations (list, delete)
4. Worker 验证令牌并执行操作 / Worker validates token and executes

## 📦 依赖关系 / Dependencies

### 开发依赖 / Dev Dependencies
- `wrangler` (v3.0.0+) - Cloudflare 开发工具 / Cloudflare development tool

### 运行时依赖 / Runtime Dependencies
- 无需外部依赖 / No external dependencies
- 使用 Cloudflare Workers 内置 API / Uses Cloudflare Workers built-in APIs

## 🔐 安全层 / Security Layers

1. **CORS 保护** / CORS Protection
   - 配置在 `src/index.js` / Configured in `src/index.js`

2. **管理员认证** / Admin Authentication
   - Bearer Token 验证 / Bearer Token validation

3. **密码哈希** / Password Hashing
   - SHA-256 加密 / SHA-256 encryption

4. **安全头** / Security Headers
   - 配置在 `public/_headers` / Configured in `public/_headers`

## 📊 性能优化 / Performance Optimization

- ✅ 边缘计算 - 全球分布 / Edge computing - Global distribution
- ✅ KV 缓存 - 快速读取 / KV caching - Fast reads
- ✅ 最小化代码 - 快速加载 / Minimized code - Fast loading
- ✅ 无需数据库 - 零冷启动 / No database - Zero cold start

---

更多信息请查看项目文档 / For more information, see project documentation.

