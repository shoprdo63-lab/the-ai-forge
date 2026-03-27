# The AI Forge - UI/UX Design System

## 1. Strict Component Library

### Rule: "Use ONLY Shadcn/UI components for all interactive elements"

**Allowed:**
- ✅ Tables, Buttons, Inputs, Dialogs from shadcn/ui
- ✅ Card components following shadcn/ui aesthetic
- ✅ Form elements with shadcn/ui styling
- ✅ Dropdown menus, Select, Checkbox, Radio

**Forbidden:**
- ❌ Custom 'Card' layouts built from scratch
- ❌ Custom button components
- ❌ Third-party UI libraries outside shadcn/ui
- ❌ Custom modal/dialog implementations

**Implementation:**
```tsx
// ✅ CORRECT - Use shadcn/ui components
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// ❌ INCORRECT - Don't create custom components
// const MyCustomCard = () => <div className="custom-card">...</div>
```

---

## 2. The 8px Grid & Alignment

### Rule: "All spacing must follow a strict 8px grid system"

**Spacing Scale:**
| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Tight spacing, icon padding |
| `space-2` | 8px | Default gap, small padding |
| `space-3` | 12px | Medium gaps |
| `space-4` | 16px | **Standard row padding** |
| `space-6` | 24px | **Section padding** |
| `space-8` | 32px | Large section gaps |
| `space-12` | 48px | Major section separators |

**Row Padding Standards:**
- Table rows: **exactly 16px** (`py-4` or `px-4 py-3`)
- Form inputs: **exactly 16px** vertical padding
- Cards: **24px** padding (`p-6`)
- Page sections: **24px** gap (`gap-6`)

**Vertical Alignment:**
- All table columns must be perfectly vertically aligned
- Use `items-center` for row content alignment
- Consistent text baseline across all cells

**Implementation:**
```tsx
// ✅ CORRECT - 8px grid alignment
<TableRow className="border-b border-[#f3f4f6] hover:bg-[#f9fafb] transition-colors">
  <TableCell className="px-4 py-3"> {/* 16px row padding */}
    <div className="flex items-center gap-3"> {/* 12px gap */}
      <img className="w-12 h-12" /> {/* 48px thumbnail */}
      <span className="text-sm">Product</span>
    </div>
  </TableCell>
</TableRow>

// ❌ INCORRECT - Arbitrary spacing
// <div className="p-[15px] gap-[13px]">
```

---

## 3. Typography Hierarchy

### Rule: "Set global font to 'Inter'. Use font-weight 600 for product names."

**Font Stack:**
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

**Typography Scale:**
| Element | Size | Weight | Line Height | Color |
|---------|------|--------|-------------|-------|
| Page Title | 24px | 600 | 1.2 | #0a0a0a |
| Section Title | 18px | 600 | 1.3 | #374151 |
| Product Name | 14px | **600** | 1.4 | #4f46e5 |
| Body Text | 14px | 400 | 1.5 | #6b7280 |
| Specs/Technical | 12px | 400 | 1.4 | #6b7280 |
| Price | 14px | **600** | 1.2 | #0d9488 |
| Small/Caption | 12px | 400 | 1.4 | #9ca3af |

**Constraints:**
- **Minimum font size: 12px** - Never smaller
- Use `text-muted-foreground` (#6b7280) for technical specs
- Product names and prices: **font-weight 600**

**Implementation:**
```tsx
// ✅ CORRECT - Typography hierarchy
<h1 className="text-2xl font-semibold text-[#0a0a0a]">Page Title</h1>
<Link className="text-sm font-semibold text-[#4f46e5]">Product Name</Link>
<span className="text-xs text-[#6b7280]">Technical Specs</span>
<span className="text-sm font-semibold text-[#0d9488]">$1,599</span>

// ❌ INCORRECT - Wrong weights/sizes
// <span className="text-[11px] font-bold">
// <span className="text-gray-500">
```

---

## 4. No Visual Fluff (The Anti-Amateur Rule)

### Rule: "Delete all heavy gradients, glowing borders, and 'playful' icons"

**Design Principles:**
- **Clean, minimal aesthetic** like Linear, Notion, Vercel
- **Purposeful design** - every element has a function
- **Professional feel** over "fun" or "trendy"

**Borders:**
- Use **1px solid borders** with `#e2e8f0` (light mode)
- Table borders: `#e5e7eb`
- Card borders: `#e5e5e5`
- Input borders: `#d1d5db`

**Shadows:**
- Only subtle shadows: `shadow-sm`, `shadow-md`
- No glow effects or neon shadows
- No gradient backgrounds on cards

**Icons:**
- **Only thin-stroke Lucide icons**
- No filled icons (unless for specific actions like heart/favorite)
- No decorative or "playful" icon styles

**Implementation:**
```tsx
// ✅ CORRECT - Clean, minimal design
<div className="bg-white border border-[#e5e5e5] rounded-lg p-6 shadow-sm">
  <Monitor className="w-6 h-6 text-[#9ca3af]" strokeWidth={1.5} />
</div>

// ❌ INCORRECT - Visual fluff
// <div className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
// <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
```

---

## 5. Strict Content Policy

### Rule: "Never include images of people or immodest content"

**Content Guidelines:**
- ✅ Hardware product renders
- ✅ Technical diagrams
- ✅ Data visualizations
- ✅ UI screenshots
- ✅ Abstract/minimalist graphics

**Forbidden:**
- ❌ Images of people
- ❌ Lifestyle photos with people
- ❌ Stock photos with faces
- ❌ Immodest or inappropriate content

**Image Sources:**
- High-resolution hardware renders from manufacturers
- Clean product photography on white/gray backgrounds
- Minimalist data visualizations
- Technical illustrations

---

## 6. Color Palette

### Primary Colors
| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#4f46e5` | Links, active states, buttons |
| Primary Hover | `#4338ca` | Button/link hover |
| Accent | `#0d9488` | Prices, success states, best value |
| Accent Light | `#14b8a6` | Progress bars, gradients |

### Background Colors
| Color | Hex | Usage |
|-------|-----|-------|
| Page BG | `#f5f5f5` | Main page background |
| Card BG | `#ffffff` | Card backgrounds |
| Hover BG | `#f9fafb` | Table row hover |
| Muted BG | `#f3f4f6` | Thumbnails, secondary areas |

### Text Colors
| Color | Hex | Usage |
|-------|-----|-------|
| Heading | `#0a0a0a` | Main headings |
| Body | `#374151` | Primary text |
| Muted | `#6b7280` | Secondary text, specs |
| Light | `#9ca3af` | Placeholder, hints |
| Border | `#e5e5e5` | Borders, dividers |

### Status Colors
| Color | Hex | Usage |
|-------|-----|-------|
| In Stock | `#22c55e` | Available products |
| Out of Stock | `#ef4444` | Unavailable products |
| Warning | `#f59e0b` | Alerts, ratings |
| Best Price | `#0d9488` | Lowest price indicator |

---

## 7. Component Patterns

### PCPartPicker-Style Product Table

```tsx
// Standard product table structure
<Table>
  <TableHeader className="bg-[#f9fafb]">
    <TableRow className="border-b border-[#e5e7eb]">
      <TableHead className="w-10"></TableHead> {/* Checkbox */}
      <TableHead className="w-12"></TableHead> {/* Thumbnail */}
      <TableHead className="text-left">Name</TableHead>
      <TableHead className="w-24 text-center">Specs</TableHead>
      <TableHead className="w-20 text-center">Rating</TableHead>
      <TableHead className="w-24 text-right">Price</TableHead>
      <TableHead className="w-20 text-center">Buy</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow className="border-b border-[#f3f4f6] hover:bg-[#f9fafb]">
      <TableCell className="px-3 py-3">
        <Checkbox />
      </TableCell>
      <TableCell className="px-3 py-3">
        <div className="w-12 h-12 bg-[#f3f4f6] rounded overflow-hidden">
          <img src={imageUrl} className="w-full h-full object-cover" />
        </div>
      </TableCell>
      <TableCell className="px-3 py-3">
        <Link className="text-sm font-semibold text-[#4f46e5]">
          Product Name
        </Link>
        <p className="text-xs text-[#6b7280]">Brand</p>
      </TableCell>
      {/* ... other cells with exact 16px padding */}
    </TableRow>
  </TableBody>
</Table>
```

### Product Detail Page

```tsx
// Product detail layout
<div className="max-w-[1400px] mx-auto px-4 py-8">
  <div className="grid lg:grid-cols-3 gap-8">
    {/* Left Column - 2/3 width */}
    <div className="lg:col-span-2 space-y-6">
      {/* Header */}
      {/* Product Image */}
      {/* Tabs */}
      {/* Specifications */}
    </div>
    
    {/* Right Column - 1/3 width, sticky */}
    <div className="lg:col-span-1">
      <div className="sticky top-20 space-y-4">
        {/* Price Comparison Card */}
        {/* AI Score Card */}
        {/* Buy Buttons */}
      </div>
    </div>
  </div>
</div>
```

### Filter Sidebar (PCPartPicker Style)

```tsx
<aside className="w-64 shrink-0 bg-[#f5f5f5]">
  {/* Part List Box */}
  <div className="bg-white border border-[#d1d5db] rounded-lg p-4 mb-4">
    {/* Summary */}
  </div>
  
  {/* Filters */}
  <div className="bg-white border border-[#d1d5db] rounded-lg">
    <div className="px-4 py-3 bg-[#f9fafb] border-b border-[#e5e7eb]">
      <h3 className="text-sm font-semibold text-[#374151]">Filters</h3>
    </div>
    <div className="p-4 space-y-4">
      {/* Filter sections */}
    </div>
  </div>
</aside>
```

---

## 8. Layout Principles

### Page Structure
```
max-w-[1400px] mx-auto px-4    // Container
  ├── Header (blue bg)         // PCPartPicker style
  ├── Main Content
  │   ├── Filter Sidebar (256px)
  │   └── Product Table (flex-1)
  └── Footer
```

### Responsive Breakpoints
| Breakpoint | Width | Changes |
|------------|-------|---------|
| Mobile | < 768px | Stack layout, hide sidebar |
| Tablet | 768px+ | Show sidebar, 2-col grid |
| Desktop | 1024px+ | Full layout, 3-col grid |
| Wide | 1400px+ | Max container width |

### Spacing Formula
- **Page padding:** `px-4` (16px)
- **Section gaps:** `gap-6` (24px)
- **Card padding:** `p-6` (24px)
- **Element gaps:** `gap-3` or `gap-4` (12-16px)

---

## 9. Interaction Patterns

### Hover States
| Element | Hover Effect |
|---------|-------------|
| Table Row | `hover:bg-[#f9fafb]` |
| Links | `hover:underline` + color change |
| Buttons | `hover:bg-[#4338ca]` |
| Cards | `hover:shadow-md hover:border-[#4f46e5]/30` |

### Active States
| Element | Active Style |
|---------|-------------|
| Tab | `border-b-2 border-[#4f46e5] text-[#4f46e5]` |
| Nav Link | `text-[#4f46e5]` |
| Selected Row | `bg-[#f9fafb]` |

### Focus States
- Visible focus rings for accessibility
- `focus:outline-none focus:ring-2 focus:ring-[#4f46e5]`

---

## 10. Implementation Checklist

### Before Committing Code:
- [ ] Using only shadcn/ui components
- [ ] All spacing follows 8px grid (16px/24px)
- [ ] Font is Inter, minimum 12px
- [ ] Font-weight 600 for product names/prices
- [ ] No gradient backgrounds on cards
- [ ] No glowing shadows
- [ ] Only thin-stroke Lucide icons
- [ ] 1px solid borders (#e2e8f0 or similar)
- [ ] No images of people
- [ ] All table columns vertically aligned

---

## Reference Implementations

### Linear.app
- Clean white backgrounds
- Subtle borders
- Blue accent color
- Minimal shadows
- Sharp typography

### Notion
- Consistent 8px spacing
- Clear hierarchy
- Minimal visual noise
- Functional design

### Vercel
- Bold but clean typography
- Teal accent color
- Professional aesthetic
- Grid-based layouts

### PCPartPicker
- Blue header
- Table-based product display
- Clear filters sidebar
- Functional over flashy

---

**Last Updated:** March 2026  
**Version:** 1.0  
**Maintainer:** AI Forge Design Team
