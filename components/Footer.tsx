"use client";

import Link from "next/link";
import { Cpu, Mail, ExternalLink } from "lucide-react";

const footerLinks = {
  products: [
    { name: "Graphics Cards", href: "/products?category=GPU" },
    { name: "Processors", href: "/products?category=CPU" },
    { name: "Motherboards", href: "/products?category=Motherboard" },
    { name: "Memory", href: "/products?category=RAM" },
  ],
  resources: [
    { name: "Compare Hardware", href: "/compare" },
    { name: "Build Configurator", href: "/builder" },
    { name: "Blog & Guides", href: "/blog" },
    { name: "Specs Database", href: "/specs" },
  ],
  company: [
    { name: "About Us", href: "#" },
    { name: "Contact", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
  ],
};

const socialLinks = [
  { icon: Mail, href: "mailto:contact@aiforge.ai", label: "Email" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0f] border-t border-[#2a2a30]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-4">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#00d4aa]/10 border border-[#00d4aa]/20 rounded-xl flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-[#00d4aa]" strokeWidth={1.5} />
                </div>
                <div>
                  <span className="text-lg font-bold text-white">AI Forge</span>
                  <p className="text-xs text-[#666] -mt-1">Hardware Database</p>
                </div>
              </Link>
              <p className="text-sm text-[#888] leading-relaxed mb-6 max-w-sm">
                Professional AI hardware database and comparison tool. 
                Find the perfect components for your machine learning workloads 
                with real-time pricing from major retailers.
              </p>
              {/* Social Links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="w-10 h-10 bg-[#1a1a1f] border border-[#2a2a30] rounded-lg flex items-center justify-center text-[#666] hover:text-[#00d4aa] hover:border-[#00d4aa]/30 transition-all"
                    >
                      <Icon className="w-4 h-4" strokeWidth={1.5} />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Links Sections */}
            <div className="lg:col-span-2">
              <h4 className="text-sm font-semibold text-white mb-4">Products</h4>
              <ul className="space-y-3">
                {footerLinks.products.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#888] hover:text-[#00d4aa] transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-sm font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#888] hover:text-[#00d4aa] transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#888] hover:text-[#00d4aa] transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter Section */}
            <div className="lg:col-span-2">
              <h4 className="text-sm font-semibold text-white mb-4">Stay Updated</h4>
              <p className="text-sm text-[#888] mb-4">
                Get the latest hardware deals and AI benchmarks.
              </p>
              <form className="space-y-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 bg-[#1a1a1f] border border-[#2a2a30] rounded-lg text-sm text-white placeholder-[#666] focus:outline-none focus:border-[#00d4aa]/50"
                />
                <button
                  type="submit"
                  className="w-full px-3 py-2 bg-[#00d4aa] hover:bg-[#00b894] text-[#0a0a0f] text-sm font-semibold rounded-lg transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-[#2a2a30]">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-[#666]">
              © 2026 AI Forge. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-xs text-[#666]">
                Affiliate Disclosure: We earn from qualifying purchases
              </span>
              <a
                href="https://www.netlify.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-[#666] hover:text-[#00d4aa] transition-colors"
              >
                Deployed on Netlify
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
