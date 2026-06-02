import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * MathRenderer compiles LaTeX notation into web math elements using the KaTeX engine.
 * - Supports block=true for centered, isolated formulas.
 * - Supports inline rendering, parsing text blocks mixed with inline $formula$ blocks.
 */
export default function MathRenderer({ text = '', block = false, className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Reset container contents
    containerRef.current.innerHTML = '';

    if (block) {
      // Pure mathematical formula block
      const wrapper = document.createElement('div');
      wrapper.className = 'overflow-x-auto py-2 w-full text-center scrollbar-none';
      try {
        // Strip any \\( and \\) if they are passed in block mode
        let cleanText = text;
        if (text.startsWith('\\(') && text.endsWith('\\)')) {
          cleanText = text.slice(2, -2);
        }
        katex.render(cleanText, wrapper, {
          displayMode: true,
          throwOnError: false,
          trust: true
        });
      } catch (err) {
        wrapper.textContent = text;
      }
      containerRef.current.appendChild(wrapper);
    } else {
      // Mixed text containing inline math denoted by \(...\)
      const parts = text.split(/(\\\([\s\S]*?\\\))/g);

      parts.forEach((part) => {
        if (part.startsWith('\\(') && part.endsWith('\\)')) {
          const formula = part.slice(2, -2);
          const mathSpan = document.createElement('span');
          mathSpan.className = 'inline-block align-middle mx-0.5';
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
    }
  }, [text, block]);


  return <span ref={containerRef} className={`inline-block w-full ${className}`} />;
}
