'use client';

import { cn } from '@/utils/utils';
import {
  type BundledLanguage,
  CodeBlock,
  CodeBlockBody,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFilename,
  CodeBlockFiles,
  CodeBlockHeader,
  CodeBlockItem,
  type CodeBlockProps,
  CodeBlockSelect,
  CodeBlockSelectContent,
  CodeBlockSelectItem,
  CodeBlockSelectTrigger,
  CodeBlockSelectValue,
} from '@/components/ui/kibo-ui/code-block';
import { memo } from 'react';
import type { HTMLAttributes } from 'react';
import ReactMarkdown, { type Options } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { codeThemes } from '@/components/theme/code-theme';
import { SelectCodeTheme } from '@/components/theme/select-code-theme';
import { useThemeStore } from '@/store/theme';

export type AIResponseProps = HTMLAttributes<HTMLDivElement> & {
  options?: Options;
  children: Options['children'];
};

const components: Options['components'] = {
  pre: ({ node, className, children, ...props }) => {
    return <>{children}</>;
  },
  ol: ({ node, children, className, ...props }) => (
    <ol className={cn('ml-4 list-outside list-decimal', className)} {...props}>
      {children}
    </ol>
  ),
  li: ({ node, children, className, ...props }) => (
    <li className={cn('py-1', className)} {...props}>
      {children}
    </li>
  ),
  ul: ({ node, children, className, ...props }) => (
    <ul className={cn('ml-4 list-outside list-decimal', className)} {...props}>
      {children}
    </ul>
  ),
  strong: ({ node, children, className, ...props }) => (
    <span className={cn('font-semibold', className)} {...props}>
      {children}
    </span>
  ),
  a: ({ node, children, className, ...props }) => (
    <a
      className={cn('font-medium text-primary underline', className)}
      target="_blank"
      rel="noreferrer"
      {...props}
    >
      {children}
    </a>
  ),
  h1: ({ node, children, className, ...props }) => (
    <h1
      className={cn('mt-6 mb-2 font-semibold text-3xl', className)}
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ node, children, className, ...props }) => (
    <h2
      className={cn('mt-6 mb-2 font-semibold text-2xl', className)}
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ node, children, className, ...props }) => (
    <h3 className={cn('mt-6 mb-2 font-semibold text-xl', className)} {...props}>
      {children}
    </h3>
  ),
  h4: ({ node, children, className, ...props }) => (
    <h4 className={cn('mt-6 mb-2 font-semibold text-lg', className)} {...props}>
      {children}
    </h4>
  ),
  h5: ({ node, children, className, ...props }) => (
    <h5
      className={cn('mt-6 mb-2 font-semibold text-base', className)}
      {...props}
    >
      {children}
    </h5>
  ),
  h6: ({ node, children, className, ...props }) => (
    <h6 className={cn('mt-6 mb-2 font-semibold text-sm', className)} {...props}>
      {children}
    </h6>
  ),
  code: ({ node, className, children }) => {
    let language = 'typescript';

    const { theme, getTheme } = useThemeStore();
    const selectedTheme = getTheme(theme);

    if (typeof node?.properties?.className === 'string') {
      language = node.properties.className.replace('language-', '');
    }

    const isInline = !node?.position?.start.line ||
      node.position.start.line === node.position.end.line;

    if (isInline) {
      return <code className={className}>{children}</code>;
    }

    const data: CodeBlockProps['data'] = [
      {
        language,
        filename: 'index.ts',
        code: children as string,
      },
    ];

    return (
      <CodeBlock
        className={cn('my-4', className)}
        data={data}
        defaultValue={data[0].language}
      >
        <CodeBlockHeader className="flex items-center bg-card/60 justify-end">
          <SelectCodeTheme />
          <CodeBlockFiles className="hidden">
            {(item) => (
              <CodeBlockFilename key={item.language} value={item.language}>
                {item.filename}
              </CodeBlockFilename>
            )}
          </CodeBlockFiles>
          <CodeBlockSelect>
            <CodeBlockSelectTrigger className="hidden">
              <CodeBlockSelectValue />
            </CodeBlockSelectTrigger>
            <CodeBlockSelectContent>
              {(item) => (
                <CodeBlockSelectItem key={item.language} value={item.language}>
                  {item.language}
                </CodeBlockSelectItem>
              )}
            </CodeBlockSelectContent>
          </CodeBlockSelect>
          <CodeBlockCopyButton />
        </CodeBlockHeader>
        <CodeBlockBody>
          {(item) => (
            <CodeBlockItem key={item.language} value={item.language}>
              <CodeBlockContent
                language={item.language as BundledLanguage}
                themes={selectedTheme.value}
              >
                {item.code}
              </CodeBlockContent>
            </CodeBlockItem>
          )}
        </CodeBlockBody>
      </CodeBlock>
    );
  },
};

export const AIResponse = memo(
  ({ className, options, children, ...props }: AIResponseProps) => {
    if (!children || (typeof children === 'string' && children.trim() === '')) {
      return null
    }

    return (
      <div
        className={cn(
          '[&>*:first-child]:mt-0 [&>*:last-child]:mb-0 overflow-hidden p-1.5',
          className
        )}
        {...props}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={components}
          {...options}
        >
          {children}
        </ReactMarkdown>
      </div>
    )
  },
  (prevProps, nextProps) => prevProps.children === nextProps.children
);
