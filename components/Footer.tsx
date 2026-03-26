"use client";

import { Cpu, ExternalLink, Mail } from "lucide-react";

const footerLinks = {
  product: [
    { name: "GPU Database", href: "#gpus" },
    { name: "Methodology", href: "#" },
    { name: "Custom Builds", href: "#" },
    { name: "Enterprise", href: "#" },
  ],
  resources: [
    { name: "Documentation", href: "#" },
    { name: "Benchmarks", href: "#" },
    { name: "Blog", href: "/blog" },
    { name: "Community", href: "#" },
  ],
  company: [
    { name: "About", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Contact", href: "#" },
  ],
  legal: [
    { name: "Privacy", href: "#" },
    { name: "Terms", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#050505] pt-24 pb-12 px-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-16 mb-24">
          <div className="col-span-2">
            <a href="/" className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg bg-[#10b981]/10 border border-[#10b981]/20 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-[#10b981]" strokeWidth={1.5} />
              </div>
              <span className="text-sm font-medium text-white tracking-wider">AI Forge</span>
            </a>
            <p className="text-sm text-zinc-600 mb-8 max-w-xs leading-relaxed">
              The professional standard for local AI hardware architecture. Precision-engineered for deep learning excellence.
            </p>
            <div className="flex gap-3">
              {[ExternalLink, ExternalLink, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-lg border border-white/[0.06] flex items-center justify-center text-zinc-600 hover:text-zinc-300 hover:border-white/[0.12] transition-all">
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-6">Product</h4>
            <ul className="space-y-4">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-zinc-600 hover:text-zinc-300 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-6">Resources</h4>
            <ul className="space-y-4">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-zinc-600 hover:text-zinc-300 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-6">Company</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-zinc-600 hover:text-zinc-300 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-6">Legal</h4>
            <ul className="space-y-4">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-zinc-600 hover:text-zinc-300 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/[0.06] flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-xs text-zinc-700">
            © 2026 AI Forge. Built to Global Standards.
          </p>
          <div className="flex gap-8">
            <span className="text-xs text-zinc-700">Hardware Status: Online</span>
            <span className="text-xs text-zinc-700">Encryption: AES-256</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
