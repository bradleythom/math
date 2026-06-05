import React, { useRef } from 'react';

export default function AnswerInput({ value, onChange, onSubmit, disabled, placeholder = "Type your answer..." }) {
  const inputRef = useRef(null);

  // Helper characters for easy mobile typing — includes ², ³ for exponents
  const mathSymbols = [
    { label: 'π', value: '\\pi' },
    { label: '²', value: '²' },
    { label: '³', value: '³' },
    { label: '^', value: '^' },
    { label: '×', value: ' \\times ' },
    { label: '/', value: '/' },
    { label: 'x', value: 'x' },
    { label: 'y', value: 'y' },
    { label: 'r', value: 'r' },
    { label: 't', value: 't' },
    { label: 'g', value: 'g' },
  ];

  const handleInsertSymbol = (symbol) => {
    if (!inputRef.current || disabled) return;
    const input = inputRef.current;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const text = input.value;
    
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    const newValue = before + symbol + after;
    
    onChange(newValue);

    // Keep focus and adjust cursor position
    setTimeout(() => {
      input.focus();
      const newCursorPos = start + symbol.length;
      input.setSelectionRange(newCursorPos, newCursorPos);
    }, 50);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (value.trim()) {
        onSubmit();
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Input container */}
      <div className="flex gap-2 w-full">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={placeholder}
            className="w-full bg-slate-950/60 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all font-mono text-base disabled:opacity-50 disabled:cursor-not-allowed shadow-inner"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          {value && !disabled && (
            <button
              onClick={() => {
                onChange('');
                inputRef.current?.focus();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1 rounded-full cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
            </button>
          )}
        </div>

        <button
          onClick={onSubmit}
          disabled={disabled || !value.trim()}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 disabled:from-slate-800 disabled:to-slate-800 text-slate-950 disabled:text-slate-500 font-outfit font-bold hover:shadow-lg hover:shadow-amber-500/10 disabled:opacity-40 disabled:hover:shadow-none cursor-pointer transition-all border border-amber-500/20 disabled:border-none"
        >
          Submit
        </button>
      </div>

      {/* Floating Math Symbol Keys */}
      {!disabled && (
        <div className="flex flex-wrap items-center gap-1.5 py-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider mr-1.5 select-none font-semibold">
            Math Keyboard:
          </span>
          {mathSymbols.map((sym) => (
            <button
              key={sym.label}
              type="button"
              onClick={() => handleInsertSymbol(sym.value)}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white cursor-pointer transition-colors font-mono"
            >
              {sym.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
