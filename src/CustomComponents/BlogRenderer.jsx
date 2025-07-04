import React from 'react';

const BlogPostRenderer = ({ blogData: blogPost }) => {
  // Sample blog post data - replace with your actual data
    if (!blogPost || !blogPost.sections) {
        return (
          <div className="flex items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold text-gray-700">Blog not found</h1>
            </div>
        );
    }

  const renderSection = (section, index) => {
    switch (section.type) {
      case 'heading':
        const HeadingTag = `h${section.level}`;
        return React.createElement(
          HeadingTag,
          {
            key: index,
            className: `text-${section.level === 1 ? '4xl' : section.level === 2 ? '3xl' : '2xl'} font-bold mb-4 text-gray-800`
          },
          section.text
        );

      case 'paragraph':
        return (
          <p key={index} className="text-gray-700 mb-4 leading-relaxed">
            {section.text}
          </p>
        );

      case 'blockquote':
        return (
          <blockquote key={index} className="border-l-4 border-blue-500 pl-6 py-4 mb-6 bg-blue-50 italic text-gray-700">
            "{section.text}"
          </blockquote>
        );

      case 'list':
        const ListTag = section.ordered ? 'ol' : 'ul';
        return (
          <ListTag key={index} className={`mb-6 ${section.ordered ? 'list-decimal' : 'list-disc'} list-inside space-y-2`}>
            {section.items.map((item, itemIndex) => (
              <li key={itemIndex} className="text-gray-700 pl-2">
                {item}
              </li>
            ))}
          </ListTag>
        );

      case 'code':
        return (
          <div key={index} className="mb-6">
            <div className="bg-gray-100 border border-gray-300 rounded-t-lg px-4 py-2">
              <span className="text-sm text-gray-600 font-mono">{section.language}</span>
            </div>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-b-lg overflow-x-auto">
              <code className="font-mono text-sm">{section.code}</code>
            </pre>
          </div>
        );

      case 'table':
        return (
          <div key={index} className="mb-6 overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  {section.headers.map((header, headerIndex) => (
                    <th key={headerIndex} className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50">
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="border border-gray-300 px-4 py-2 text-gray-700">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {blogPost.title}
        </h1>
        <div className="h-1 w-20 bg-blue-500 rounded"></div>
      </header>
      
      <article className="prose prose-lg max-w-none">
        {blogPost.sections.map((section, index) => renderSection(section, index))}
      </article>
    </div>
  );
};

export default BlogPostRenderer;