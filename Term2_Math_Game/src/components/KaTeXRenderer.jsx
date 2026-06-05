import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * KaTeXRenderer parses standard text containing inline \(...\) math segments,
 * rendering the math parts with KaTeX and styling them in high-contrast amber.
 */
export default function KaTeXRenderer({ text = '', className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Reset container contents
    containerRef.current.innerHTML = '';

    // Split text using LaTeX inline math delimiter \(...\) group capture
    const parts = text.split(/(\\\([\s\S]*?\\\))/g);

    parts.forEach((part) => {
      if (part.startsWith('\\(') && part.endsWith('\\)')) {
        const formula = part.slice(2, -2);
        
        // Wrap KaTeX element in a high-contrast amber span
        const mathSpan = document.createElement('span');
        mathSpan.className = 'inline-block align-middle mx-1 text-amber-400 font-semibold drop-shadow-[0_0_3px_rgba(251,191,36,0.25)]';
        
        try {
          katex.render(formula, mathSpan, {
            displayMode: false,
            throwOnError: false
          });
        } catch (err) {
          mathSpan.textContent = formula;
        }
        containerRef.current.appendChild(mathSpan);
      } else if (part) {
        const textNode = document.createTextNode(part);
        containerRef.current.appendChild(textNode);
      }
    });
  }, [text]);

  return <span ref={containerRef} className={`inline-block leading-relaxed ${className}`} />;
}
