"use client";

import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { Cpu, Zap, TrendingUp, DollarSign, Award } from "lucide-react";
import { products } from "@/lib/products";

// ============================================
// Typography Components - Premium Magazine Style
// ============================================

export function H1({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-white mb-8 leading-tight tracking-tight">
      {children}
    </h1>
  );
}

export function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-sans text-2xl md:text-3xl font-semibold text-white mt-16 mb-6 leading-tight">
      {children}
    </h2>
  );
}

export function H3({ children }: { children: ReactNode }) {
  return (
    <h3 className="font-sans text-xl md:text-2xl font-semibold text-white mt-12 mb-4 leading-tight">
      {children}
    </h3>
  );
}

export function H4({ children }: { children: ReactNode }) {
  return (
    <h4 className="font-sans text-lg md:text-xl font-semibold text-white mt-8 mb-3">
      {children}
    </h4>
  );
}

export function Paragraph({ children }: { children: ReactNode }) {
  return (
    <p className="font-serif text-lg text-zinc-300 leading-relaxed mb-6">
      {children}
    </p>
  );
}

export function Blockquote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="border-l-4 border-emerald-500 pl-6 py-2 my-8 bg-white/[0.02] rounded-r-lg">
      <p className="font-serif text-xl text-zinc-300 italic leading-relaxed">
        {children}
      </p>
    </blockquote>
  );
}

export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="font-mono text-sm bg-zinc-800 text-emerald-400 px-2 py-1 rounded">
      {children}
    </code>
  );
}

export function Pre({ children }: { children: ReactNode }) {
  return (
    <pre className="font-mono text-sm bg-zinc-900 border border-zinc-800 rounded-xl p-6 overflow-x-auto my-8">
      {children}
    </pre>
  );
}

export function UnorderedList({ children }: { children: ReactNode }) {
  return (
    <ul className="font-serif text-lg text-zinc-300 list-disc list-outside ml-6 mb-6 space-y-2">
      {children}
    </ul>
  );
}

export function OrderedList({ children }: { children: ReactNode }) {
  return (
    <ol className="font-serif text-lg text-zinc-300 list-decimal list-outside ml-6 mb-6 space-y-2">
      {children}
    </ol>
  );
}

export function ListItem({ children }: { children: ReactNode }) {
  return <li className="leading-relaxed pl-2">{children}</li>;
}

export function Anchor({ href, children }: { href?: string; children: ReactNode }) {
  if (!href) return <span>{children}</span>;

  const isExternal = href.startsWith("http");

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4 transition-colors"
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4 transition-colors"
    >
      {children}
    </Link>
  );
}

export function HorizontalRule() {
  return <hr className="border-zinc-800 my-12" />;
}

// ============================================
// Table Components
// ============================================

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto my-8">
      <table className="w-full text-left border-collapse">{children}</table>
    </div>
  );
}

export function TableHead({ children }: { children: ReactNode }) {
  return <thead className="bg-zinc-800/50">{children}</thead>;
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-zinc-800">{children}</tbody>;
}

export function TableRow({ children }: { children: ReactNode }) {
  return (
    <tr className="hover:bg-white/[0.02] transition-colors">{children}</tr>
  );
}

export function TableHeaderCell({ children }: { children: ReactNode }) {
  return (
    <th className="font-sans font-semibold text-sm text-zinc-300 px-4 py-3 border-b border-zinc-700">
      {children}
    </th>
  );
}

export function TableCell({ children }: { children: ReactNode }) {
  return (
    <td className="font-serif text-base text-zinc-400 px-4 py-3">{children}</td>
  );
}

// ============================================
// Interactive Hardware Components
// ============================================

interface HardwareCardProps {
  productId: string;
}

export function HardwareCard({ productId }: HardwareCardProps) {
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="my-8 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
        <p className="text-zinc-500">Product not found: {productId}</p>
      </div>
    );
  }

  return (
    <Link
      href={`/product/${product.id}`}
      className="block my-8 p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all duration-300 group"
    >
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
          {product.category === "GPU" ? (
            <Zap className="w-8 h-8 text-emerald-400" />
          ) : (
            <Cpu className="w-8 h-8 text-emerald-400" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm text-emerald-400 font-mono mb-1">{product.category}</p>
          <h4 className="font-sans text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
            {product.name}
          </h4>
          <p className="text-zinc-400 text-sm mt-1 line-clamp-2">{product.description}</p>
          
          <div className="flex items-center gap-4 mt-3">
            <span className="text-sm font-mono text-emerald-400">
              ${product.price.toLocaleString()}
            </span>
            {product.aiScore && (
              <span className="flex items-center gap-1 text-xs text-zinc-500">
                <Award className="w-3 h-3" />
                AI Score: {product.aiScore}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

interface PerformanceChartProps {
  data: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  title?: string;
  unit?: string;
}

export function PerformanceChart({ data, title, unit = "" }: PerformanceChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="my-8 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
      {title && (
        <h4 className="font-sans text-lg font-semibold text-white mb-6">
          {title}
        </h4>
      )}
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-4">
            <span className="font-sans text-sm text-zinc-400 w-32 flex-shrink-0">
              {item.name}
            </span>
            <div className="flex-1 h-8 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-500"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
            <span className="font-mono text-sm text-emerald-400 w-20 text-right">
              {item.value}{unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface SpecComparisonProps {
  products: string[];
}

export function SpecComparison({ products: productIds }: SpecComparisonProps) {
  const comparisonProducts = productIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  if (comparisonProducts.length === 0) {
    return (
      <div className="my-8 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
        <p className="text-zinc-500">No products found for comparison</p>
      </div>
    );
  }

  return (
    <div className="my-8 overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-zinc-700">
            <th className="font-sans font-semibold text-sm text-zinc-300 px-4 py-3">
              Specification
            </th>
            {comparisonProducts.map((product) => (
              <th
                key={product.id}
                className="font-sans font-semibold text-sm text-emerald-400 px-4 py-3 min-w-[150px]"
              >
                {product.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          <tr className="hover:bg-white/[0.02]">
            <td className="font-serif text-base text-zinc-400 px-4 py-3">Price</td>
            {comparisonProducts.map((product) => (
              <td key={product.id} className="font-mono text-sm text-emerald-400 px-4 py-3">
                ${product.price.toLocaleString()}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-white/[0.02]">
            <td className="font-serif text-base text-zinc-400 px-4 py-3">VRAM</td>
            {comparisonProducts.map((product) => (
              <td key={product.id} className="font-mono text-sm text-zinc-300 px-4 py-3">
                {product.specs.vram || "N/A"}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-white/[0.02]">
            <td className="font-serif text-base text-zinc-400 px-4 py-3">CUDA Cores</td>
            {comparisonProducts.map((product) => (
              <td key={product.id} className="font-mono text-sm text-zinc-300 px-4 py-3">
                {product.specs.cuda || "N/A"}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-white/[0.02]">
            <td className="font-serif text-base text-zinc-400 px-4 py-3">TDP</td>
            {comparisonProducts.map((product) => (
              <td key={product.id} className="font-mono text-sm text-zinc-300 px-4 py-3">
                {product.specs.tdp || "N/A"}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-white/[0.02]">
            <td className="font-serif text-base text-zinc-400 px-4 py-3">AI Score</td>
            {comparisonProducts.map((product) => (
              <td key={product.id} className="font-mono text-sm text-emerald-400 px-4 py-3">
                {product.aiScore}/100
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

interface PriceComparisonProps {
  products: string[];
}

export function PriceComparison({ products: productIds }: PriceComparisonProps) {
  const comparisonProducts = productIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined)
    .sort((a, b) => a.price - b.price);

  if (comparisonProducts.length === 0) {
    return null;
  }

  return (
    <div className="my-8 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
      <h4 className="font-sans text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-emerald-400" />
        Price Comparison
      </h4>
      <div className="space-y-3">
        {comparisonProducts.map((product, index) => (
          <div
            key={product.id}
            className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-mono text-zinc-500">#{index + 1}</span>
              <span className="font-sans text-sm text-white">{product.name}</span>
            </div>
            <span className="font-mono text-sm text-emerald-400">
              ${product.price.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// MDX Components Export
// ============================================

export const mdxComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  p: Paragraph,
  blockquote: Blockquote,
  code: Code,
  pre: Pre,
  ul: UnorderedList,
  ol: OrderedList,
  li: ListItem,
  a: Anchor,
  hr: HorizontalRule,
  table: Table,
  thead: TableHead,
  tbody: TableBody,
  tr: TableRow,
  th: TableHeaderCell,
  td: TableCell,
  // Custom interactive components
  HardwareCard,
  PerformanceChart,
  SpecComparison,
  PriceComparison,
};
