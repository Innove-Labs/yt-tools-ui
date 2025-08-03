import React, { useRef, useState } from "react";
import {
  Calendar,
  Clock,
  Tag,
  User,
  Copy,
  Check,
  ChevronDown,
} from "lucide-react";
import BlogPostRenderer from "./BlogRenderer";
import { formatDate, formatTime } from "@/utils/text-formatting.util";
import {
  convertToHTML,
  convertToPlainText,
} from "@/utils/sections-formatting.util";

const BlogPage = ({ blog: blogEntity }) => {
  const [copied, setCopied] = useState(false);
  const buttonRef = useRef();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!blogEntity || !blogEntity.data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-gray-700">Blog not found</h1>
      </div>
    );
  }

  const copyAsStyledHTML = async () => {
    const html = convertToHTML(blogEntity.data.sections);
    const blob = new Blob([html], { type: "text/html" });
    const data = [new ClipboardItem({ "text/html": blob })];
    await navigator.clipboard.write(data);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
    console.log("Copied HTML to clipboard!");
  };

  const copyAsMarkDown = async () => {
    try {
      const title = `# ${blogEntity.data.title}\n\n`;

      const content = convertToPlainText(blogEntity.data.sections);

      const fullContent = title + content;

      await navigator.clipboard.writeText(fullContent);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy content:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500 font-mono">
              ID: {blogEntity.contentId}
            </span>
            <div className="flex items-center space-x-4">
              {blogEntity.job_id && (
                <span className="text-sm text-gray-500 flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  Job: {blogEntity.job_id}
                </span>
              )}
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  blogEntity.is_active
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {blogEntity.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                {blogEntity.data?.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Published: {formatDate(blogEntity.created_at)}</span>
                </div>

                {blogEntity.created_at !== blogEntity.updated_at && (
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>
                      Updated: {formatDate(blogEntity.updated_at)} at{" "}
                      {formatTime(blogEntity.updated_at)}
                    </span>
                  </div>
                )}
              </div>

              {/* Tags */}
              {blogEntity.tags && blogEntity.tags.length > 0 && (
                <div className="flex items-center flex-wrap gap-2">
                  <Tag className="w-4 h-4 text-gray-500" />
                  {blogEntity.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="ml-6 relative inline-block text-left">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                ref={buttonRef}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  copied
                    ? "bg-green-100 text-green-700 border-2 border-green-300"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200 border-2 border-blue-300 hover:border-blue-400"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>

              {menuOpen && (
                <div className="absolute z-10 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg">
                  <button
                    onClick={copyAsMarkDown}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Copy as Text
                  </button>
                  <button
                    onClick={copyAsStyledHTML}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Copy as Styled
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <article className="bg-white rounded-lg shadow-sm p-8">
          <BlogPostRenderer blogData={blogEntity.data} />
        </article>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div>Content ID: {blogEntity.contentId}</div>
            <div>Last modified: {formatDate(blogEntity.updated_at)}</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlogPage;
