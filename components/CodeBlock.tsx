import React, { useState } from 'react';

interface CodeBlockProps {
  code: string;
}

const CopyIcon = (props: React.ComponentProps<'svg'>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a2.25 2.25 0 0 1-2.25 2.25h-1.5a2.25 2.25 0 0 1-2.25-2.25v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
  </svg>
);

const CheckIcon = (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
);


const syntaxHighlight = (code: string) => {
  // Usar uma única passagem com uma regex combinada é mais robusto do que encadear .replace()
  // pois evita que as regras interfiram nas tags HTML inseridas pelas regras anteriores.
  // Grupos de captura nomeados (?<name>...) são usados para clareza.
  const tokenRegex = [
    '(?<comment>--\\[\\[[\\s\\S]*?\\]\\]|--.*)', // 1. Comentários (devem vir primeiro)
    '(?<string>".*?"|\'.*?\')',                     // 2. Strings
    '(?<keyword>\\b(?:local|function|if|then|else|elseif|end|for|while|do|return|and|or|not|in|break|continue|repeat|until)\\b)', // 3. Palavras-chave
    '(?<globals>\\b(?:game|script|workspace|Instance|Enum|Vector2|Vector3|UDim2|Color3|print|wait|Connect|GetService|Players)\\b)', // 4. Globais do Roblox
    '(?<booleanNil>\\b(?:true|false|nil)\\b)',       // 5. Booleanos e nil
    '(?<number>\\b\\d+\\.?\\d*\\b)',                 // 6. Números
  ].join('|');

  const highlighter = new RegExp(tokenRegex, 'g');
  
  const escapeHtml = (str: string) => 
    str.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c as keyof typeof escapeHtml.characterMap]!));
  escapeHtml.characterMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };

  return escapeHtml(code).replace(highlighter, (match, ...args) => {
    const groups = args[args.length - 1]; // Em ES2018+, os grupos de captura nomeados estão no último argumento

    if (groups.comment) return `<span class="text-green-400 italic">${groups.comment}</span>`;
    if (groups.string) return `<span class="text-yellow-300">${groups.string}</span>`;
    if (groups.keyword) return `<span class="text-pink-400">${groups.keyword}</span>`;
    if (groups.globals) return `<span class="text-cyan-400">${groups.globals}</span>`;
    if (groups.booleanNil) return `<span class="text-purple-400">${groups.booleanNil}</span>`;
    if (groups.number) return `<span class="text-orange-400">${groups.number}</span>`;

    return match;
  });
};

export const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightedCode = syntaxHighlight(code);

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden my-6 border border-gray-700">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-900/50">
        <p className="text-sm font-medium text-gray-400" style={{fontFamily: "'Roboto Mono', monospace"}}>Script Lua</p>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          {copied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <CopyIcon className="w-4 h-4" />}
          {copied ? 'Copiado!' : 'Copiar'}
        </button>
      </div>
      <pre className="p-4 text-sm overflow-x-auto">
        <code
          style={{fontFamily: "'Roboto Mono', monospace"}}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </pre>
    </div>
  );
};