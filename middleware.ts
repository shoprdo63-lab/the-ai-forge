import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ============================================
// Security & Bot Protection Middleware
// Next.js 16 Edge Runtime
// ============================================

// Known bot user agents to filter
const BOT_USER_AGENTS = [
  'GPTBot',
  'ChatGPT-User',
  'CCBot',
  'anthropic-ai',
  'Claude-Web',
  'Google-Extended',
  'bingbot',
  'BingPreview',
  'facebookexternalhit',
  'Facebot',
  'Twitterbot',
  'LinkedInBot',
  'WhatsApp',
  'TelegramBot',
  'Slackbot',
  'Discordbot',
  'AhrefsBot',
  'MJ12bot',
  'SemrushBot',
  'DotBot',
  'PetalBot',
  'DataForSeoBot',
  'Amazonbot',
  'Applebot',
  'yandex',
  'DuckDuckBot',
];

// Allowed analytics bots (Google Analytics, etc.)
const ALLOWED_ANALYTICS_BOTS = [
  'Googlebot',
  'Googlebot-Image',
  'Googlebot-News',
  'Googlebot-Video',
  'Mediapartners-Google',
];

// Check if request is from a bot
function isBot(userAgent: string): boolean {
  const lowerUA = userAgent.toLowerCase();
  
  // Check blocked bots
  for (const bot of BOT_USER_AGENTS) {
    if (lowerUA.includes(bot.toLowerCase())) {
      // Allow if it's also an allowed analytics bot
      for (const allowed of ALLOWED_ANALYTICS_BOTS) {
        if (lowerUA.includes(allowed.toLowerCase())) {
          return false;
        }
      }
      return true;
    }
  }
  
  return false;
}

// Check if request is from allowed crawler
function isAllowedCrawler(userAgent: string): boolean {
  const lowerUA = userAgent.toLowerCase();
  return ALLOWED_ANALYTICS_BOTS.some(bot => 
    lowerUA.includes(bot.toLowerCase())
  ) || lowerUA.includes('googlebot');
}

// Generate CSP nonce for inline scripts
function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// ============================================
// Main Middleware Handler
// ============================================

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';
  const nonce = generateNonce();
  
  // ============================================
  // Bot Protection
  // ============================================
  
  // Block known AI scrapers and unwanted bots
  if (isBot(userAgent)) {
    // Log blocked bot (in production, send to analytics)
    console.log(`[Bot Blocked] ${userAgent} | Path: ${pathname}`);
    
    return new NextResponse(null, {
      status: 403,
      statusText: 'Forbidden',
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
  
  // ============================================
  // Security Headers
  // ============================================
  
  const response = NextResponse.next({
    request: {
      headers: new Headers(request.headers),
    },
  });
  
  // Content Security Policy
  // Strict policy for production with nonce support
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com https://analytics.vercel.app;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https:;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://va.vercel-scripts.com https://api.vercel.com;
    media-src 'self';
    object-src 'none';
    frame-src 'self';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s+/g, ' ').trim();
  
  response.headers.set('Content-Security-Policy', cspHeader);
  
  // Strict Transport Security (HSTS)
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );
  
  // X-Content-Type-Options
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // X-Frame-Options
  response.headers.set('X-Frame-Options', 'DENY');
  
  // X-XSS-Protection
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );
  
  // DNS Prefetch Control
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  
  // ============================================
  // Bot Analytics Header (for clean analytics)
  // ============================================
  
  if (isAllowedCrawler(userAgent)) {
    response.headers.set('X-Is-Crawler', 'true');
  }
  
  // ============================================
  // CORS Headers for API routes
  // ============================================
  
  if (pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', 'https://theaiforge.ai');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Max-Age', '86400');
  }
  
  // ============================================
  // Performance Headers
  // ============================================
  
  // Resource hints for critical assets
  if (pathname === '/' || pathname === '/components/' || pathname === '/builder/') {
    response.headers.set('Link', 
      '</fonts/inter-var.woff2>; rel=preload; as=font; type=font/woff2; crossorigin=anonymous'
    );
  }
  
  return response;
}

// ============================================
// Middleware Configuration
// ============================================

export const config = {
  matcher: [
    // Apply to all routes except static files and API
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
