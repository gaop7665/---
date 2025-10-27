/**
 * CF URL Shortener - Cloudflare Workers Backend
 * URL 短链接服务
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // API Routes
      if (path.startsWith('/api/')) {
        return await handleAPI(request, env, path, method, corsHeaders);
      }

      // Redirect short URLs
      if (path.length > 1) {
        const shortCode = path.substring(1);
        
        // 检查短链接是否存在
        const longUrl = await env.URL_DB.get(shortCode);
        
        if (!longUrl) {
          return new Response('Short URL not found', { 
            status: 404,
            headers: corsHeaders 
          });
        }

        // 直接重定向
        await incrementVisits(env, shortCode);
        return Response.redirect(longUrl, 302);
      }

      // Root path - return API info
      return new Response(JSON.stringify({
        message: 'CF URL Shortener API',
        version: '1.0.0',
        endpoints: {
          'POST /api/shorten': 'Create short URL',
          'GET /api/stats/:code': 'Get URL statistics',
          'GET /api/list': 'List all URLs (admin)',
          'DELETE /api/delete/:code': 'Delete URL (admin)',
          'GET /:code': 'Redirect to long URL'
        }
      }, null, 2), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (error) {
      return new Response(JSON.stringify({ 
        error: error.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};

/**
 * Handle API requests
 */
async function handleAPI(request, env, path, method, corsHeaders) {
  const headers = { ...corsHeaders, 'Content-Type': 'application/json' };

  // POST /api/shorten - Create short URL
  if (path === '/api/shorten' && method === 'POST') {
    try {
      const body = await request.json();
      const { url: longUrl, customCode } = body;

      if (!longUrl || !isValidUrl(longUrl)) {
        return jsonResponse({ error: 'Invalid URL' }, 400, headers);
      }

      // Generate or use custom short code
      let shortCode = customCode || generateShortCode();
      
      // Check if custom code already exists
      if (customCode) {
        const existing = await env.URL_DB.get(shortCode);
        if (existing) {
          return jsonResponse({ error: 'Custom code already exists' }, 409, headers);
        }
      }

      // Store URL with metadata
      const metadata = {
        longUrl,
        createdAt: new Date().toISOString(),
        visits: 0
      };

      await env.URL_DB.put(shortCode, longUrl);
      await env.URL_DB.put(`${shortCode}:meta`, JSON.stringify(metadata));

      const shortUrl = `${env.BASE_URL || request.url.split('/api')[0]}/${shortCode}`;

      return jsonResponse({
        success: true,
        shortCode,
        shortUrl,
        longUrl
      }, 200, headers);

    } catch (error) {
      return jsonResponse({ error: 'Invalid request body' }, 400, headers);
    }
  }

  // GET /api/stats/:code - Get statistics
  if (path.startsWith('/api/stats/') && method === 'GET') {
    const shortCode = path.split('/api/stats/')[1];
    const longUrl = await env.URL_DB.get(shortCode);
    
    if (!longUrl) {
      return jsonResponse({ error: 'Short URL not found' }, 404, headers);
    }

    const metaJson = await env.URL_DB.get(`${shortCode}:meta`);
    const metadata = metaJson ? JSON.parse(metaJson) : {};

    return jsonResponse({
      shortCode,
      longUrl,
      ...metadata
    }, 200, headers);
  }

  // GET /api/list - List all URLs (admin only)
  if (path === '/api/list' && method === 'GET') {
    if (!isAuthorized(request, env)) {
      return jsonResponse({ error: 'Unauthorized' }, 401, headers);
    }

    const list = await env.URL_DB.list();
    const urls = [];

    for (const key of list.keys) {
      // 只处理主链接，跳过元数据等附加数据
      if (!key.name.includes(':')) {
        const longUrl = await env.URL_DB.get(key.name);
        const metaJson = await env.URL_DB.get(`${key.name}:meta`);
        const metadata = metaJson ? JSON.parse(metaJson) : {};
        
        urls.push({
          shortCode: key.name,
          longUrl,
          ...metadata
        });
      }
    }

    return jsonResponse({ urls }, 200, headers);
  }

  // DELETE /api/delete/:code - Delete URL (admin only)
  if (path.startsWith('/api/delete/') && method === 'DELETE') {
    if (!isAuthorized(request, env)) {
      return jsonResponse({ error: 'Unauthorized' }, 401, headers);
    }

    const shortCode = path.split('/api/delete/')[1];
    
    // 删除所有相关数据
    await env.URL_DB.delete(shortCode);
    await env.URL_DB.delete(`${shortCode}:meta`);
    await env.URL_DB.delete(`${shortCode}:visits`);

    return jsonResponse({ success: true }, 200, headers);
  }

  return jsonResponse({ error: 'Endpoint not found' }, 404, headers);
}

/**
 * Helper functions
 */
function jsonResponse(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' }
  });
}

function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

function generateShortCode(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function incrementVisits(env, shortCode) {
  const visitsKey = `${shortCode}:visits`;
  const visits = parseInt(await env.URL_DB.get(visitsKey) || '0') + 1;
  await env.URL_DB.put(visitsKey, visits.toString());
  
  // Update metadata
  const metaJson = await env.URL_DB.get(`${shortCode}:meta`);
  if (metaJson) {
    const metadata = JSON.parse(metaJson);
    metadata.visits = visits;
    metadata.lastVisit = new Date().toISOString();
    await env.URL_DB.put(`${shortCode}:meta`, JSON.stringify(metadata));
  }
}

function isAuthorized(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return false;
  
  const token = authHeader.replace('Bearer ', '');
  return token === env.ADMIN_TOKEN;
}
