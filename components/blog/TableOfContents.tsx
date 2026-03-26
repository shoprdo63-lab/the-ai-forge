"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Extract headings from markdown content
    const lines = content.split("\n");
    const items: TOCItem[] = [];
    
    lines.forEach((line) => {
      const match = line.match(/^(#{2,4})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        
        items.push({ id, text, level });
      }
    });
    
    setHeadings(items);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -80% 0px" }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-32">
      <h4 className="font-sans text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">
        Table of Contents
      </h4>
      <ul className="space-y-2">
        {headings.map((heading, index) => (
          <motion.li
            key={heading.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <button
              onClick={() => handleClick(heading.id)}
              className={`text-left w-full text-sm transition-all duration-200 hover:text-emerald-400 ${
                heading.level === 2 ? "font-medium" : "font-normal"
              } ${
                activeId === heading.id
                  ? "text-emerald-400 translate-x-2"
                  : "text-zinc-400"
              }`}
              style={{
                paddingLeft: `${(heading.level - 2) * 12}px`,
              }}
            >
              {heading.text}
            </button>
            {activeId === heading.id && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute left-0 w-1 h-5 bg-emerald-500 rounded-full"
                style={{
                  top: `${index * 28 + 4}px`,
                }}
              />
            )}
          </motion.li>
        ))}
      </ul>
    </nav>
  );
}
