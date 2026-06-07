import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function MarkdownRenderer({children} : any) {
  return (
    <div className="markdown-container">
      <Markdown remarkPlugins={[remarkGfm]}>{children}</Markdown>
    </div>
  );
}

export default MarkdownRenderer;