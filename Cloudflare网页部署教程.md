# 🌐 Cloudflare 网页部署教程（无需本地操作）

## 准备工作

✅ 确保你的代码已经上传到 GitHub
✅ 确保你有 Cloudflare 账户并已登录

---

## 第一步：部署 Worker（后端 API）

### 1. 在当前页面选择部署方式

你现在看到的页面有几个选项，点击 **"导入存储库"（从 Git）** 旁边的 **"开始使用"** 按钮。

### 2. 连接 GitHub 账户

- 授权 Cloudflare 访问你的 GitHub
- 选择你的仓库：`cf-url-shortener`
- 点击"开始设置"

### 3. 配置项目设置

填写以下信息：

```
项目名称: cf-url-shortener
生产分支: main
根目录: / (默认)
```

### 4. 配置构建设置

```
构建命令: (留空)
构建输出目录: / (默认)
```

### 5. **重要：添加环境变量**

在"环境变量"部分，点击"添加变量"，添加：

```
变量名: ADMIN_TOKEN
值: 你的管理员密码（例如：MySecurePassword123456）
类型: Text
```

### 6. **创建 KV 命名空间**

在部署之前，需要先创建 KV 数据库：

1. **打开新标签页**，访问：
   ```
   https://dash.cloudflare.com/
   ```

2. 在左侧菜单找到 **Workers & Pages**

3. 点击 **KV** 选项卡

4. 点击 **"Create a namespace"**（创建命名空间）

5. 输入名称：
   ```
   URL_DB
   ```

6. 点击"添加"

7. **记住这个命名空间的 ID**（会显示在列表中）

### 7. 绑定 KV 到 Worker

返回 Worker 部署页面：

1. 找到 **"KV 命名空间绑定"** 部分

2. 点击"添加绑定"

3. 填写：
   ```
   变量名: URL_DB
   KV 命名空间: 选择刚才创建的 URL_DB
   ```

### 8. 部署

点击 **"保存并部署"** 按钮

等待部署完成（通常 1-2 分钟）

### 9. 获取 Worker URL

部署完成后，你会看到 Worker 的 URL，例如：
```
https://cf-url-shortener.你的用户名.workers.dev
```

**复制这个 URL！后面会用到。**

---

## 第二步：部署 Pages（前端界面）

### 1. 更新前端 API 地址

⚠️ **重要：** 在部署 Pages 之前，需要先更新前端代码中的 API 地址。

在 GitHub 上编辑以下三个文件：

#### 编辑 `public/index.html`

1. 在 GitHub 仓库中打开 `public/index.html`
2. 点击"编辑"按钮（铅笔图标）
3. 找到这一行（大约在第 213 行）：
   ```javascript
   const API_BASE = window.location.origin;
   ```
4. 改为：
   ```javascript
   const API_BASE = 'https://cf-url-shortener.你的用户名.workers.dev';
   ```
   （替换为你的 Worker URL）
5. 点击"Commit changes"

#### 同样编辑 `public/admin.html`

找到相同的代码行（大约在第 150 行），做相同的修改。

#### 同样编辑 `public/stats.html`

找到相同的代码行（大约在第 87 行），做相同的修改。

### 2. 创建 Pages 项目

1. 在 Cloudflare Dashboard 中，点击左侧 **Workers & Pages**

2. 点击 **"创建应用程序"**

3. 选择 **Pages** 选项卡

4. 点击 **"连接到 Git"**

5. 选择你的 GitHub 账户

6. 选择 `cf-url-shortener` 仓库

7. 点击 **"开始设置"**

### 3. 配置 Pages 构建设置

```
项目名称: cf-url-shortener
生产分支: main
框架预设: None
构建命令: (留空)
构建输出目录: public
```

### 4. 部署 Pages

点击 **"保存并部署"**

等待部署完成（通常 1-2 分钟）

### 5. 获取 Pages URL

部署完成后，你会得到一个 URL：
```
https://cf-url-shortener.pages.dev
```

---

## 第三步：测试你的短链接服务

### 1. 访问前端

在浏览器打开：
```
https://cf-url-shortener.pages.dev
```

### 2. 创建第一个短链接

- 输入一个长 URL，比如：`https://www.cloudflare.com`
- 点击"Shorten URL"
- 复制生成的短链接

### 3. 测试短链接

访问生成的短链接，应该会跳转到原始 URL

### 4. 测试管理面板

访问：
```
https://cf-url-shortener.pages.dev/admin.html
```

输入你设置的 `ADMIN_TOKEN`，应该能看到所有链接

---

## 🎉 完成！

你的 URL 短链接服务现在已经完全部署好了！

### 你的服务地址：

- 🌐 **主页**：https://cf-url-shortener.pages.dev
- 🔗 **API**：https://cf-url-shortener.你的用户名.workers.dev
- 👑 **管理后台**：https://cf-url-shortener.pages.dev/admin.html

---

## 📝 常见问题

### Q1: 部署 Worker 时提示"配置文件错误"

**原因：** `wrangler.toml` 中有需要替换的占位符

**解决方案：**

在 GitHub 上编辑 `wrangler.toml` 文件：

1. 找到这两行：
   ```toml
   id = "your_kv_namespace_id"
   preview_id = "your_preview_kv_namespace_id"
   ```

2. 改为：
   ```toml
   id = ""
   preview_id = ""
   ```
   
3. 或者直接删除 `[[kv_namespaces]]` 这整个部分，因为我们在网页上手动绑定了 KV

### Q2: 前端无法创建短链接

**原因：** API_BASE 地址未更新

**解决方案：** 确保你已经更新了三个 HTML 文件中的 `API_BASE`

### Q3: Worker 部署后访问显示 "KV namespace not found"

**原因：** KV 命名空间未正确绑定

**解决方案：**

1. 进入 Worker 的设置页面
2. 找到"绑定" > "KV 命名空间绑定"
3. 确保有一个绑定：
   - 变量名：`URL_DB`
   - KV 命名空间：选择你创建的命名空间

### Q4: 如何添加自定义域名？

1. 进入 Worker 的设置
2. 点击"触发器"选项卡
3. 点击"添加自定义域"
4. 输入你的域名（域名需要已在 Cloudflare 托管）

对 Pages 也是类似的操作。

---

## 🔧 后续优化

### 更新代码

当你需要更新代码时：
1. 在 GitHub 上修改文件
2. 提交更改
3. Cloudflare 会自动重新部署

### 查看日志

- Worker：Workers & Pages > 你的 Worker > 日志
- Pages：Workers & Pages > 你的 Pages 项目 > 部署日志

### 监控使用情况

- 访问 Workers & Pages
- 查看"分析"选项卡
- 可以看到请求数、错误率等数据

---

## ✅ 核心要点

1. ✅ Worker 需要绑定 KV 命名空间（变量名必须是 `URL_DB`）
2. ✅ 环境变量 `ADMIN_TOKEN` 要设置好
3. ✅ 前端的 `API_BASE` 必须指向 Worker URL
4. ✅ Pages 的构建输出目录是 `public`

---

## 🎊 享受你的短链接服务吧！

如果遇到任何问题，可以：
- 查看 Worker 日志
- 查看浏览器控制台（F12）
- 检查 GitHub 仓库中的文档

