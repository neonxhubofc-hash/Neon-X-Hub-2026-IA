import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const handleCopy = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="prose prose-invert prose-sm md:prose-base max-w-none text-gray-300">
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const isCodeBlock = !inline && match;
            const codeString = String(children).replace(/\n$/, '');
            
            // Generate a somewhat unique ID for copy button tracking
            const blockIndex = node?.position?.start?.line || Math.random();

            if (isCodeBlock) {
              return (
                <div className="relative my-4 rounded-lg overflow-hidden border border-hub-border bg-[#0d0d14] shadow-lg">
                  <div className="flex justify-between items-center bg-[#1a1a24] px-4 py-2 text-xs font-mono text-gray-400 border-b border-hub-border">
                    <span className="uppercase text-neon-cyan font-bold tracking-wider">
                      {match ? match[1] : 'CODE'}
                    </span>
                    <button
                      onClick={() => handleCopy(codeString, blockIndex)}
                      className="flex items-center gap-1 hover:text-white transition-colors"
                      title="Copy Code"
                    >
                      {copiedIndex === blockIndex ? (
                        <>
                          <Check size={14} className="text-green-400" />
                          <span className="text-green-400">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="p-4 overflow-x-auto">
                    <code className={`${className} font-mono text-sm`} {...props}>
                      {children}
                    </code>
                  </div>
                </div>
              );
            }
            
            // Inline code styling
            return (
              <code className="bg-[#1a1a24] text-neon-cyan px-1.5 py-0.5 rounded font-mono text-sm" {...props}>
                {children}
              </code>
            );
          },
          h1: ({children}) => <h1 className="text-2xl font-bold text-white mb-4 mt-6 border-b border-neon-purple/30 pb-2">{children}</h1>,
          h2: ({children}) => <h2 className="text-xl font-bold text-white mb-3 mt-5 flex items-center gap-2"><span className="text-neon-cyan">#</span> {children}</h2>,
          h3: ({children}) => <h3 className="text-lg font-semibold text-gray-100 mb-2 mt-4">{children}</h3>,
          p: ({children}) => <p className="mb-4 leading-relaxed">{children}</p>,
          ul: ({children}) => <ul className="list-disc list-inside mb-4 space-y-1 ml-2 marker:text-neon-purple">{children}</ul>,
          ol: ({children}) => <ol className="list-decimal list-inside mb-4 space-y-1 ml-2 marker:text-neon-cyan">{children}</ol>,
          a: ({href, children}) => <a href={href} target="_blank" rel="noreferrer" className="text-neon-blue hover:text-neon-cyan underline decoration-dotted underline-offset-4 transition-colors">{children}</a>,
          blockquote: ({children}) => <blockquote className="border-l-4 border-neon-purple pl-4 italic bg-white/5 py-2 pr-2 rounded-r my-4">{children}</blockquote>
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;