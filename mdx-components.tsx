import type { MDXComponents } from "mdx/types";
import { ReactNode } from "react";
import Link from "next/link";
import { Cpu } from "lucide-react";

// ============================================
// Typography Components - Premium Magazine Style
// ============================================

function H1({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-white mb-8 leading-tight tracking-tight">
      {children}
    </h1>
  );
}

function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-sans text-2xl md:text-3xl font-semibold text-white mt-16 mb-6 leading-tight">
      {children}
    </h2>
  );
}

function H3({ children }: { children: ReactNode }) {
  return (
    <h3 className="font-sans text-xl md:text-2xl font-semibold text-white mt-12 mb-4 leading-tight">
      {children}
    </h3>
  );
}

function H4({ children }: { children: ReactNode }) {
  return (
    <h4 className="font-sans text-lg md:text-xl font-semibold text-white mt-8 mb-3">
      {children}
    </h4>
  );
}

function Paragraph({ children }: { children: ReactNode }) {
  return (
    <p className="font-serif text-lg text-zinc-300 leading-relaxed mb-6">
      {children}
    </p>
  );
}

function Blockquote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="border-l-4 border-emerald-500 pl-6 py-2 my-8 bg-white/[0.02] rounded-r-lg">
      <p className="font-serif text-xl text-zinc-300 italic leading-relaxed">
        {children}
      </p>
    </blockquote>
  );
}

function Code({ children }: { children: ReactNode }) {
  return (
    <code className="font-mono text-sm bg-zinc-800 text-emerald-400 px-2 py-1 rounded">
      {children}
    </code>
  );
}

function Pre({ children }: { children: ReactNode }) {
  return (
    <pre className="font-mono text-sm bg-zinc-900 border border-zinc-800 rounded-xl p-6 overflow-x-auto my-8">
      {children}
    </pre>
  );
}

function UnorderedList({ children }: { children: ReactNode }) {
  return (
    <ul className="font-serif text-lg text-zinc-300 list-disc list-outside ml-6 mb-6 space-y-2">
      {children}
    </ul>
  );
}

function OrderedList({ children }: { children: ReactNode }) {
  return (
    <ol className="font-serif text-lg text-zinc-300 list-decimal list-outside ml-6 mb-6 space-y-2">
      {children}
    </ol>
  );
}

function ListItem({ children }: { children: ReactNode }) {
  return <li className="leading-relaxed pl-2">{children}</li>;
}

function Anchor({ href, children }: { href?: string; children: ReactNode }) {
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

function HorizontalRule() {
  return <hr className="border-zinc-800 my-12" />;
}

// ============================================
// Table Components
// ============================================

function Table({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto my-8">
      <table className="w-full text-left border-collapse">{children}</table>
    </div>
  );
}

function TableHead({ children }: { children: ReactNode }) {
  return <thead className="bg-zinc-800/50">{children}</thead>;
}

function TableBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-zinc-800">{children}</tbody>;
}

function TableRow({ children }: { children: ReactNode }) {
  return (
    <tr className="hover:bg-white/[0.02] transition-colors">{children}</tr>
  );
}

function TableHeaderCell({ children }: { children: ReactNode }) {
  return (
    <th className="font-sans font-semibold text-sm text-zinc-300 px-4 py-3 border-b border-zinc-700">
      {children}
    </th>
  );
}

function TableCell({ children }: { children: ReactNode }) {
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

function HardwareCard({ productId }: HardwareCardProps) {
  return (
    <div className="my-8 p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
          <Cpu className="w-8 h-8 text-emerald-400" />
        </div>
        <div>
          <p className="text-sm text-emerald-400 font-mono mb-1">{productId}</p>
          <p className="text-zinc-400 text-sm">
            Hardware component data would be loaded here from the products
            array.
          </p>
        </div>
      </div>
    </div>
  );
}

interface PerformanceChartProps {
  data: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  title?: string;
}

function PerformanceChart({ data, title }: PerformanceChartProps) {
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
                className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
            <span className="font-mono text-sm text-emerald-400 w-16 text-right">
              {item.value}
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

function SpecComparison({ products }: SpecComparisonProps) {
  return (
    <div className="my-8 overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-zinc-700">
            <th className="font-sans font-semibold text-sm text-zinc-300 px-4 py-3">
              Specification
            </th>
            {products.map((product, i) => (
              <th
                key={i}
                className="font-sans font-semibold text-sm text-emerald-400 px-4 py-3"
              >
                {product}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          <tr className="hover:bg-white/[0.02]">
            <td className="font-serif text-base text-zinc-400 px-4 py-3">
              VRAM
            </td>
            <td
              className="font-mono text-sm text-zinc-300 px-4 py-3"
              colSpan={products.length}
            >
              Loading from products array...
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ============================================
// MDX Components Export
// ============================================

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
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
    // Custom components
    HardwareCard,
    PerformanceChart,
    SpecComparison,
    // Override with any user-provided components
    ...components,
  };
}
