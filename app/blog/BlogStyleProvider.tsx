'use client';

import { ReactNode } from 'react';

interface BlogStyleProviderProps {
  children: ReactNode;
  fontVariables: string;
  fontSerif: string;
  fontSans: string;
}

export default function BlogStyleProvider({ 
  children, 
  fontVariables,
  fontSerif,
  fontSans 
}: BlogStyleProviderProps) {
  return (
    <div className={`${fontVariables} font-sans`}>
      <style dangerouslySetInnerHTML={{
        __html: `
          :root {
            --font-serif: ${fontSerif};
            --font-sans: ${fontSans};
          }
        `
      }} />
      {children}
    </div>
  );
}
