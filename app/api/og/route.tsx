import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { products, getProductById } from '@/lib/products';

// ============================================
// Route Segment Config
// Edge Runtime with 30-day cache
// ============================================
export const runtime = 'edge';
export const preferredRegion = 'iad1'; // US East (N. Virginia) for lowest latency
export const revalidate = 2592000; // 30 days in seconds

// ============================================
// Font Loading (Edge-Compatible)
// ============================================

async function loadFonts() {
  try {
    const [interRegular, interBold, geistMonoRegular] = await Promise.all([
      fetch('https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2')
        .then((res) => res.arrayBuffer()),
      fetch('https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYAZ9hiJ-Ek-_EeA.woff2')
        .then((res) => res.arrayBuffer()),
      fetch('https://fonts.gstatic.com/s/geistmono/v1/gyB4h-AF9oo9iMha9LA6Kqp7lIOTpF_4pQ.woff2')
        .then((res) => res.arrayBuffer()),
    ]);

    return [
      {
        name: 'Inter',
        data: interRegular,
        weight: 400,
        style: 'normal',
      },
      {
        name: 'Inter',
        data: interBold,
        weight: 700,
        style: 'normal',
      },
      {
        name: 'Geist Mono',
        data: geistMonoRegular,
        weight: 400,
        style: 'normal',
      },
    ] as Array<{ name: string; data: ArrayBuffer; weight: 400 | 700; style: 'normal' }>;
  } catch {
    // Fallback to system fonts if loading fails
    return [];
  }
}

// ============================================
// Color Logic
// ============================================

function getAccentColors(price: number): { primary: string; gradient: string } {
  // Enterprise: >$10k gets Emerald-to-Gold gradient
  if (price > 10000) {
    return {
      primary: '#10b981', // Emerald
      gradient: 'linear-gradient(135deg, #10b981 0%, #f59e0b 100%)',
    };
  }
  
  // Consumer: Pure Emerald
  return {
    primary: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  };
}

// ============================================
// SVG Grid Pattern (10px spacing)
// ============================================

function GridPattern() {
  return `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  `;
}

// ============================================
// Hardware Silhouette SVG (Abstract Geometric)
// ============================================

function HardwareSVG(category: string, isWinner = false) {
  const color = isWinner ? '#10b981' : 'rgba(255,255,255,0.2)';
  
  if (category === 'GPU') {
    return `
      <svg width="180" height="120" viewBox="0 0 100 70" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="15" width="80" height="40" rx="3" fill="none" stroke="${color}" stroke-width="1.5"/>
        <rect x="35" y="25" width="30" height="20" rx="1" fill="none" stroke="${color}" stroke-width="1"/>
        <rect x="35" y="18" width="8" height="4" rx="0.5" fill="${color}" opacity="0.5"/>
        <rect x="45" y="18" width="8" height="4" rx="0.5" fill="${color}" opacity="0.5"/>
        <rect x="55" y="18" width="8" height="4" rx="0.5" fill="${color}" opacity="0.5"/>
        <rect x="10" y="50" width="20" height="5" rx="0.5" fill="${color}" opacity="0.7"/>
        <circle cx="25" cy="30" r="6" fill="none" stroke="${color}" stroke-width="0.5" opacity="0.3"/>
        <circle cx="25" cy="45" r="6" fill="none" stroke="${color}" stroke-width="0.5" opacity="0.3"/>
        <circle cx="75" cy="37" r="8" fill="none" stroke="${color}" stroke-width="0.5" opacity="0.3"/>
      </svg>
    `;
  }
  
  if (category === 'CPU') {
    return `
      <svg width="120" height="120" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="20" width="60" height="60" rx="2" fill="none" stroke="${color}" stroke-width="1.5"/>
        <rect x="25" y="25" width="50" height="50" rx="1" fill="none" stroke="${color}" stroke-width="1"/>
        <rect x="35" y="35" width="30" height="30" rx="0.5" fill="none" stroke="${color}" stroke-width="0.5"/>
        <circle cx="15" cy="15" r="2" fill="${color}" opacity="0.5"/>
        <circle cx="85" cy="15" r="2" fill="${color}" opacity="0.5"/>
        <circle cx="15" cy="85" r="2" fill="${color}" opacity="0.5"/>
        <circle cx="85" cy="85" r="2" fill="${color}" opacity="0.5"/>
      </svg>
    `;
  }
  
  // Generic hardware
  return `
    <svg width="140" height="100" viewBox="0 0 100 70" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="10" width="70" height="50" rx="3" fill="none" stroke="${color}" stroke-width="1.5"/>
      <rect x="25" y="20" width="50" height="30" rx="1" fill="none" stroke="${color}" stroke-width="1"/>
      <circle cx="50" cy="35" r="8" fill="none" stroke="${color}" stroke-width="0.5"/>
      <line x1="50" y1="27" x2="50" y2="43" stroke="${color}" stroke-width="0.5"/>
      <line x1="42" y1="35" x2="58" y2="35" stroke="${color}" stroke-width="0.5"/>
    </svg>
  `;
}

// ============================================
// Performance Score Bar
// ============================================

function PerformanceScoreBar(score: number, maxScore = 100) {
  const percentage = (score / maxScore) * 100;
  const segments = 6;
  const filledSegments = Math.round((percentage / 100) * segments);
  
  let hexBars = '';
  for (let i = 0; i < segments; i++) {
    const isFilled = i < filledSegments;
    const opacity = isFilled ? 1 : 0.2;
    const x = i * 18;
    hexBars += `
      <rect x="${x}" y="0" width="14" height="20" rx="2" fill="#10b981" fill-opacity="${opacity}"/>
    `;
  }
  
  return `
    <svg width="110" height="24" xmlns="http://www.w3.org/2000/svg">
      ${hexBars}
    </svg>
  `;
}

// ============================================
// Single Product OG Image
// ============================================

function SingleProductImage(product: typeof products[0], fonts: any[]) {
  const colors = getAccentColors(product.price);
  const vram = product.specs.vram || 'N/A';
  const tdp = product.specs.tdp || 'N/A';
  const aiScore = product.aiScore || 0;
  
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#0a0a0a',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Grid Background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(GridPattern())}")`,
            opacity: 1,
          }}
        />
        
        {/* Gradient Accent Line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: colors.gradient,
          }}
        />
        
        {/* FORGE CERTIFIED Watermark */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            right: '40px',
            fontFamily: fonts.length > 0 ? 'Inter' : 'system-ui',
            fontSize: '14px',
            fontWeight: 700,
            letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.08)',
            textTransform: 'uppercase',
            transform: 'rotate(-5deg)',
          }}
        >
          FORGE CERTIFIED
        </div>
        
        {/* Main Content */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            padding: '60px',
            gap: '60px',
          }}
        >
          {/* Left: Hardware Visual */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '400px',
            }}
            dangerouslySetInnerHTML={{
              __html: HardwareSVG(product.category),
            }}
          />
          
          {/* Right: Product Details */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              flex: 1,
              gap: '32px',
            }}
          >
            {/* Category Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: colors.primary,
                }}
              />
              <span
                style={{
                  fontFamily: fonts.length > 0 ? 'Geist Mono' : 'monospace',
                  fontSize: '14px',
                  color: colors.primary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
              >
                {product.category}
              </span>
            </div>
            
            {/* Product Name */}
            <h1
              style={{
                fontFamily: fonts.length > 0 ? 'Inter' : 'system-ui',
                fontSize: '56px',
                fontWeight: 700,
                color: '#ffffff',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              {product.name}
            </h1>
            
            {/* Brand */}
            <p
              style={{
                fontFamily: fonts.length > 0 ? 'Inter' : 'system-ui',
                fontSize: '24px',
                color: 'rgba(255,255,255,0.5)',
                margin: 0,
              }}
            >
              {product.brand}
            </p>
            
            {/* Specs Grid */}
            <div
              style={{
                display: 'flex',
                gap: '40px',
                marginTop: '20px',
              }}
            >
              {/* VRAM */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span
                  style={{
                    fontFamily: fonts.length > 0 ? 'Geist Mono' : 'monospace',
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.4)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  VRAM
                </span>
                <span
                  style={{
                    fontFamily: fonts.length > 0 ? 'Geist Mono' : 'monospace',
                    fontSize: '28px',
                    fontWeight: 600,
                    color: '#ffffff',
                  }}
                >
                  {vram}
                </span>
              </div>
              
              {/* TGP/TDP */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span
                  style={{
                    fontFamily: fonts.length > 0 ? 'Geist Mono' : 'monospace',
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.4)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  TGP
                </span>
                <span
                  style={{
                    fontFamily: fonts.length > 0 ? 'Geist Mono' : 'monospace',
                    fontSize: '28px',
                    fontWeight: 600,
                    color: '#ffffff',
                  }}
                >
                  {tdp}
                </span>
              </div>
              
              {/* AI Score */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span
                  style={{
                    fontFamily: fonts.length > 0 ? 'Geist Mono' : 'monospace',
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.4)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  AI Score
                </span>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: fonts.length > 0 ? 'Geist Mono' : 'monospace',
                      fontSize: '28px',
                      fontWeight: 600,
                      color: colors.primary,
                    }}
                  >
                    {aiScore}
                  </span>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: PerformanceScoreBar(aiScore),
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Price */}
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '8px',
                marginTop: '20px',
              }}
            >
              <span
                style={{
                  fontFamily: fonts.length > 0 ? 'Inter' : 'system-ui',
                  fontSize: '20px',
                  color: 'rgba(255,255,255,0.5)',
                }}
              >
                From
              </span>
              <span
                style={{
                  fontFamily: fonts.length > 0 ? 'Geist Mono' : 'monospace',
                  fontSize: '48px',
                  fontWeight: 700,
                  color: colors.primary,
                }}
              >
                ${product.price.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px 60px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(0,0,0,0.3)',
          }}
        >
          <span
            style={{
              fontFamily: fonts.length > 0 ? 'Inter' : 'system-ui',
              fontSize: '16px',
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: '-0.01em',
            }}
          >
            theaiforge.ai
          </span>
          <span
            style={{
              fontFamily: fonts.length > 0 ? 'Geist Mono' : 'monospace',
              fontSize: '12px',
              color: 'rgba(255,255,255,0.3)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            AI Hardware Intelligence
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts,
    }
  );
}

// ============================================
// Comparison Mode OG Image
// ============================================

function ComparisonImage(product1: typeof products[0], product2: typeof products[0], fonts: any[]) {
  const vram1 = parseInt(product1.specs.vram?.match(/\d+/)?.[0] || '0');
  const vram2 = parseInt(product2.specs.vram?.match(/\d+/)?.[0] || '0');
  const vramWinner = vram1 > vram2 ? 1 : vram2 > vram1 ? 2 : 0;
  
  const aiScore1 = product1.aiScore || 0;
  const aiScore2 = product2.aiScore || 0;
  
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#0a0a0a',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Grid Background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(GridPattern())}")`,
            opacity: 1,
          }}
        />
        
        {/* Gradient Accent Lines */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '50%',
            height: '4px',
            background: 'linear-gradient(90deg, #10b981, #059669)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '50%',
            height: '4px',
            background: vramWinner === 2 
              ? 'linear-gradient(90deg, #f59e0b, #d97706)' 
              : 'linear-gradient(90deg, #3b82f6, #2563eb)',
          }}
        />
        
        {/* FORGE CERTIFIED Watermark */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-15deg)',
            fontFamily: fonts.length > 0 ? 'Inter' : 'system-ui',
            fontSize: '24px',
            fontWeight: 700,
            letterSpacing: '0.3em',
            color: 'rgba(255,255,255,0.04)',
            textTransform: 'uppercase',
          }}
        >
          FORGE CERTIFIED
        </div>
        
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            gap: '24px',
          }}
        >
          <span
            style={{
              fontFamily: fonts.length > 0 ? 'Inter' : 'system-ui',
              fontSize: '18px',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
            }}
          >
            Hardware Comparison
          </span>
        </div>
        
        {/* VS Badge */}
        <div
          style={{
            position: 'absolute',
            top: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 40px rgba(16, 185, 129, 0.4)',
            zIndex: 10,
          }}
        >
          <span
            style={{
              fontFamily: fonts.length > 0 ? 'Inter' : 'system-ui',
              fontSize: '28px',
              fontWeight: 800,
              color: '#ffffff',
            }}
          >
            VS
          </span>
        </div>
        
        {/* Products Container */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            padding: '0 60px 60px',
            gap: '40px',
          }}
        >
          {/* Product 1 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              padding: '40px',
              background: vramWinner === 1 ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255,255,255,0.02)',
              border: vramWinner === 1 ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
            }}
          >
            {vramWinner === 1 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '16px',
                  padding: '6px 12px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  borderRadius: '20px',
                }}
              >
                <span style={{ color: '#10b981', fontSize: '14px' }}>★</span>
                <span
                  style={{
                    fontFamily: fonts.length > 0 ? 'Geist Mono' : 'monospace',
                    fontSize: '12px',
                    color: '#10b981',
                    textTransform: 'uppercase',
                  }}
                >
                  VRAM Winner
                </span>
              </div>
            )}
            
            <div
              style={{ marginBottom: '24px' }}
              dangerouslySetInnerHTML={{
                __html: HardwareSVG(product1.category, vramWinner === 1),
              }}
            />
            
            <span
              style={{
                fontFamily: fonts.length > 0 ? 'Geist Mono' : 'monospace',
                fontSize: '12px',
                color: '#10b981',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '8px',
              }}
            >
              {product1.category}
            </span>
            
            <h2
              style={{
                fontFamily: fonts.length > 0 ? 'Inter' : 'system-ui',
                fontSize: '32px',
                fontWeight: 700,
                color: '#ffffff',
                textAlign: 'center',
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              {product1.name}
            </h2>
            
            <p
              style={{
                fontFamily: fonts.length > 0 ? 'Inter' : 'system-ui',
                fontSize: '18px',
                color: 'rgba(255,255,255,0.5)',
                margin: '8px 0 24px',
              }}
            >
              {product1.brand}
            </p>
            
            <div
              style={{
                display: 'flex',
                gap: '24px',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <span
                  style={{
                    fontFamily: fonts.length > 0 ? 'Geist Mono' : 'monospace',
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.4)',
                    textTransform: 'uppercase',
                  }}
                >
                  VRAM
                </span>
                <p
                  style={{
                    fontFamily: fonts.length > 0 ? 'Geist Mono' : 'monospace',
                    fontSize: '24px',
                    fontWeight: 600,
                    color: '#ffffff',
                    margin: '4px 0 0',
                  }}
                >
                  {product1.specs.vram || 'N/A'}
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span
                  style={{
                    fontFamily: fonts.length > 0 ? 'Geist Mono' : 'monospace',
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.4)',
                    textTransform: 'uppercase',
                  }}
                >
                  AI Score
                </span>
                <p
                  style={{
                    fontFamily: fonts.length > 0 ? 'Geist Mono' : 'monospace',
                    fontSize: '24px',
                    fontWeight: 600,
                    color: aiScore1 > aiScore2 ? '#10b981' : '#ffffff',
                    margin: '4px 0 0',
                  }}
                >
                  {aiScore1}
                </p>
              </div>
            </div>
            
            <p
              style={{
                fontFamily: fonts.length > 0 ? 'Geist Mono' : 'monospace',
                fontSize: '28px',
                fontWeight: 700,
                color: '#10b981',
                margin: '24px 0 0',
              }}
            >
              ${product1.price.toLocaleString()}
            </p>
          </div>
          
          {/* Product 2 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              padding: '40px',
              background: vramWinner === 2 ? 'rgba(245, 158, 11, 0.08)' : 'rgba(255,255,255,0.02)',
              border: vramWinner === 2 ? '2px solid #f59e0b' : '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
            }}
          >
            {vramWinner === 2 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '16px',
                  padding: '6px 12px',
                  background: 'rgba(245, 158, 11, 0.2)',
                  borderRadius: '20px',
                }}
              >
                <span style={{ color: '#f59e0b', fontSize: '14px' }}>★</span>
                <span
                  style={{
                    fontFamily: fonts.length > 0 ? 'Geist Mono' : 'monospace',
                    fontSize: '12px',
                    color: '#f59e0b',
                    textTransform: 'uppercase',
                  }}
                >
                  VRAM Winner
                </span>
              </div>
            )}
            
            <div
              style={{ marginBottom: '24px' }}
              dangerouslySetInnerHTML={{
                __html: HardwareSVG(product2.category, vramWinner === 2),
              }}
            />
            
            <span
              style={{
                fontFamily: fonts.length > 0 ? 'Geist Mono' : 'monospace',
                fontSize: '12px',
                color: vramWinner === 2 ? '#f59e0b' : '#3b82f6',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '8px',
              }}
            >
              {product2.category}
            </span>
            
            <h2
              style={{
                fontFamily: fonts.length > 0 ? 'Inter' : 'system-ui',
                fontSize: '32px',
                fontWeight: 700,
                color: '#ffffff',
                textAlign: 'center',
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              {product2.name}
            </h2>
            
            <p
              style={{
                fontFamily: fonts.length > 0 ? 'Inter' : 'system-ui',
                fontSize: '18px',
                color: 'rgba(255,255,255,0.5)',
                margin: '8px 0 24px',
              }}
            >
              {product2.brand}
            </p>
            
            <div
              style={{
                display: 'flex',
                gap: '24px',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <span
                  style={{
                    fontFamily: fonts.length > 0 ? 'Geist Mono' : 'monospace',
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.4)',
                    textTransform: 'uppercase',
                  }}
                >
                  VRAM
                </span>
                <p
                  style={{
                    fontFamily: fonts.length > 0 ? 'Geist Mono' : 'monospace',
                    fontSize: '24px',
                    fontWeight: 600,
                    color: '#ffffff',
                    margin: '4px 0 0',
                  }}
                >
                  {product2.specs.vram || 'N/A'}
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span
                  style={{
                    fontFamily: fonts.length > 0 ? 'Geist Mono' : 'monospace',
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.4)',
                    textTransform: 'uppercase',
                  }}
                >
                  AI Score
                </span>
                <p
                  style={{
                    fontFamily: fonts.length > 0 ? 'Geist Mono' : 'monospace',
                    fontSize: '24px',
                    fontWeight: 600,
                    color: aiScore2 > aiScore1 ? '#f59e0b' : '#ffffff',
                    margin: '4px 0 0',
                  }}
                >
                  {aiScore2}
                </p>
              </div>
            </div>
            
            <p
              style={{
                fontFamily: fonts.length > 0 ? 'Geist Mono' : 'monospace',
                fontSize: '28px',
                fontWeight: 700,
                color: vramWinner === 2 ? '#f59e0b' : '#3b82f6',
                margin: '24px 0 0',
              }}
            >
              ${product2.price.toLocaleString()}
            </p>
          </div>
        </div>
        
        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(0,0,0,0.3)',
          }}
        >
          <span
            style={{
              fontFamily: fonts.length > 0 ? 'Inter' : 'system-ui',
              fontSize: '14px',
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.1em',
            }}
          >
            theaiforge.ai • AI Hardware Intelligence
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts,
    }
  );
}

// ============================================
// Main Route Handler
// ============================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const id1 = searchParams.get('id1');
    const id2 = searchParams.get('id2');
    
    // Load fonts
    const fonts = await loadFonts();
    
    // Comparison Mode
    if (id1 && id2) {
      const product1 = getProductById(id1);
      const product2 = getProductById(id2);
      
      if (!product1 || !product2) {
        return new Response('Product not found', { status: 404 });
      }
      
      return ComparisonImage(product1, product2, fonts);
    }
    
    // Single Product Mode
    if (id) {
      const product = getProductById(id);
      
      if (!product) {
        return new Response('Product not found', { status: 404 });
      }
      
      return SingleProductImage(product, fonts);
    }
    
    // Default/Fallback Image
    return new ImageResponse(
      (
        <div
          style={{
            width: '1200px',
            height: '630px',
            background: '#0a0a0a',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Grid Background */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(GridPattern())}")`,
              opacity: 1,
            }}
          />
          
          {/* Gradient Accent */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #10b981, #f59e0b)',
            }}
          />
          
          {/* Logo/Brand */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '24px',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 60px rgba(16, 185, 129, 0.3)',
              }}
            >
              <span
                style={{
                  fontFamily: fonts.length > 0 ? 'Inter' : 'system-ui',
                  fontSize: '36px',
                  fontWeight: 800,
                  color: '#ffffff',
                }}
              >
                AF
              </span>
            </div>
            
            <h1
              style={{
                fontFamily: fonts.length > 0 ? 'Inter' : 'system-ui',
                fontSize: '72px',
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '-0.03em',
                margin: 0,
              }}
            >
              The AI Forge
            </h1>
            
            <p
              style={{
                fontFamily: fonts.length > 0 ? 'Geist Mono' : 'monospace',
                fontSize: '20px',
                color: 'rgba(255,255,255,0.5)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
            >
              AI Hardware Intelligence
            </p>
          </div>
          
          {/* Watermark */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              right: '40px',
              fontFamily: fonts.length > 0 ? 'Inter' : 'system-ui',
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '0.2em',
              color: 'rgba(255,255,255,0.08)',
              textTransform: 'uppercase',
            }}
          >
            FORGE CERTIFIED
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts,
      }
    );
    
  } catch (error) {
    console.error('OG Image generation error:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
