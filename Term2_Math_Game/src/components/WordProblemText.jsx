import React from 'react';
import KaTeXRenderer from './KaTeXRenderer';

/**
 * WordProblemText renders text-heavy word problems with clean spacing and size constraints
 * to prevent reading fatigue, parsing inline math variables into amber highlighted expressions.
 */
export default function WordProblemText({ text = '' }) {
  return (
    <div className="w-full py-4 px-2 select-text">
      <div className="max-w-2xl mx-auto text-slate-200 text-base md:text-lg leading-relaxed font-sans text-center md:text-left select-text">
        <KaTeXRenderer text={text} />
      </div>
    </div>
  );
}
