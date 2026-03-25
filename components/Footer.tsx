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
    <footer className="border-t border-[#1e293b] bg-[#020617] pt-24 pb-12 px-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-16 mb-24">
          <div className="col-span-2">
            <a href="/" className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-[4px] bg-white flex items-center justify-center">
                <Cpu className="w-4 h-4 text-[#020617]" />
              </div>
              <span className="text-[14px] font-black text-white tracking-[0.2em] uppercase">AI_Forge</span>
            </a>
            <p className="text-[13px] text-slate-500 mb-8 max-w-xs leading-relaxed font-medium">
              The professional standard for local AI hardware architecture. Precision-engineered for deep learning excellence.
            </p>
            <div className="flex gap-4">
              {[ExternalLink, ExternalLink, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-[4px] border border-[#1e293b] flex items-center justify-center text-slate-500 hover:text-white hover:border-white transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.3em] mb-6">Product</h4>
            <ul className="space-y-4">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-[12px] font-bold text-slate-500 hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.3em] mb-6">Resources</h4>
            <ul className="space-y-4">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-[12px] font-bold text-slate-500 hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.3em] mb-6">Company</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-[12px] font-bold text-slate-500 hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.3em] mb-6">Legal</h4>
            <ul className="space-y-4">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-[12px] font-bold text-slate-500 hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-[#1e293b] flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em]">
            © 2024 AI_Forge Protocol. All Rights Reserved.
          </p>
          <div className="flex gap-8">
            <span className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em]">Hardware_Status: Online</span>
            <span className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em]">Encryption: AES-256</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
