# 🔗 CF URL Shortener

A powerful, open-source URL shortening service built on Cloudflare Workers and Pages. Fast, secure, and easy to deploy!

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange.svg)

## ✨ Features

- **⚡ Lightning Fast** - Powered by Cloudflare's global edge network
- **🔒 Secure** - Optional password protection for links
- **📊 Analytics** - Track visits and statistics for each short URL
- **🎨 Beautiful UI** - Modern, responsive web interface
- **🔧 Custom Codes** - Create memorable short links with custom codes
- **👑 Admin Panel** - Manage all your links from one place
- **🌍 Global CDN** - Fast redirects from anywhere in the world
- **💾 KV Storage** - Reliable data storage using Cloudflare KV
- **🆓 Free to Deploy** - Works on Cloudflare's free tier

## 🚀 Quick Start

### Prerequisites

- A [Cloudflare account](https://dash.cloudflare.com/sign-up)
- [Node.js](https://nodejs.org/) installed (v16 or later)
- [Git](https://git-scm.com/) installed

### Installation

1. **Clone this repository**
   ```bash
   git clone https://github.com/yourusername/cf-url-shortener.git
   cd cf-url-shortener
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a KV namespace**
   ```bash
   npx wrangler kv:namespace create "URL_DB"
   npx wrangler kv:namespace create "URL_DB" --preview
   ```

4. **Update `wrangler.toml`**
   
   Copy the namespace IDs from the previous command and update `wrangler.toml`:
   ```toml
   [[kv_namespaces]]
   binding = "URL_DB"
   id = "your_kv_namespace_id"
   preview_id = "your_preview_kv_namespace_id"
   ```

5. **Set your admin token**
   
   Update the `ADMIN_TOKEN` in `wrangler.toml` or use environment variables:
   ```toml
   [vars]
   ADMIN_TOKEN = "your_secret_admin_token_change_this"
   BASE_URL = "https://your-domain.workers.dev"
   ```

6. **Deploy to Cloudflare Workers**
   ```bash
   npm run deploy
   ```

### Deploy Frontend to Cloudflare Pages

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Cloudflare Pages**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to **Pages** > **Create a project**
   - Connect your GitHub repository
   - Set build settings:
     - **Build command**: (leave empty)
     - **Build output directory**: `public`
   - Click **Save and Deploy**

3. **Update API endpoint**
   
   After deploying the Worker, update the `API_BASE` constant in your HTML files to point to your Worker URL.

## 📖 Usage

### Creating Short URLs

1. Visit your deployed Pages site
2. Enter a long URL
3. (Optional) Set a custom short code
4. (Optional) Add password protection
5. Click "Shorten URL"
6. Copy and share your short link!

### Admin Panel

1. Navigate to `/admin.html`
2. Enter your admin token (set in `wrangler.toml`)
3. View all URLs, statistics, and manage links

### API Endpoints

#### Create Short URL
```bash
POST /api/shorten
Content-Type: application/json

{
  "url": "https://example.com/very/long/url",
  "customCode": "my-link",  // optional
  "password": "secret123"    // optional
}
```

#### Get URL Statistics
```bash
GET /api/stats/:code
```

#### List All URLs (Admin)
```bash
GET /api/list
Authorization: Bearer your_admin_token
```

#### Delete URL (Admin)
```bash
DELETE /api/delete/:code
Authorization: Bearer your_admin_token
```

#### Redirect to Long URL
```bash
GET /:code
```

## 🛠️ Configuration

### Environment Variables

Configure in `wrangler.toml`:

- `ADMIN_TOKEN` - Secret token for admin access
- `BASE_URL` - Your Worker's public URL

### KV Storage

The application uses Cloudflare KV to store:
- Short URL mappings
- Visit statistics
- URL metadata
- Password hashes (if protected)

## 🏗️ Project Structure

```
cf-url-shortener/
├── src/
│   └── index.js          # Worker backend code
├── public/
│   ├── index.html        # Main URL shortener page
│   ├── admin.html        # Admin panel
│   └── stats.html        # Statistics page
├── package.json          # Dependencies
├── wrangler.toml         # Cloudflare Workers config
├── README.md             # Documentation
└── LICENSE               # MIT License
```

## 🔧 Development

### Local Development

```bash
# Start development server
npm run dev
```

Visit `http://localhost:8787` to test locally.

### Testing

Test the API with curl:

```bash
# Create a short URL
curl -X POST http://localhost:8787/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'

# Get statistics
curl http://localhost:8787/api/stats/abc123

# List all URLs (admin)
curl http://localhost:8787/api/list \
  -H "Authorization: Bearer your_admin_token"
```

## 🌟 Advanced Features

### Custom Domains

1. Add your domain to Cloudflare
2. In Workers settings, add a custom domain
3. Update `BASE_URL` in `wrangler.toml`

### Rate Limiting

Add rate limiting to prevent abuse:

```javascript
// In src/index.js, add rate limiting logic
const rateLimiter = await env.RATE_LIMITER.get(clientIP);
if (rateLimiter > 10) {
  return new Response('Too many requests', { status: 429 });
}
```

### Analytics

Integrate with Cloudflare Analytics or Google Analytics for deeper insights.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Cloudflare Workers](https://workers.cloudflare.com/)
- Deployed on [Cloudflare Pages](https://pages.cloudflare.com/)
- Inspired by the need for a simple, fast, and free URL shortener

## 📧 Support

If you have any questions or issues, please:
- Open an issue on GitHub
- Check existing issues for solutions
- Read the [Cloudflare Workers documentation](https://developers.cloudflare.com/workers/)

## 🔐 Security

- Never commit your `ADMIN_TOKEN` to public repositories
- Use strong, unique tokens for production
- Consider adding rate limiting for production use
- Regularly update dependencies

## 🚦 Status

This project is actively maintained. Feel free to star ⭐ the repository to show your support!

---

Made with ❤️ using Cloudflare Workers and Pages

