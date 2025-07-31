import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Loader2,
} from "lucide-react";
import BlogPage from "./BlogViewPage";
import { useEffect, useState } from "react";
import { Drawer } from "antd";
import { axiosInstance } from "@/utils/axios.util";

export default function ContentPageBlogSection({ content }) {
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    if (!content || !content.id) return;
    setLoadingBlogs(true);
    axiosInstance
      .get(`/content/blogs/${content.id}`)
      .then((response) => {
        if (response.data) {
          setBlogs(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching blogs:", error);
      })
      .finally(() => {
        setLoadingBlogs(false);
      });
  }, [content]);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in_progress":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <>
      <Drawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        width={800}
        size="large"
      >
        <BlogPage blog={selectedBlog} />
      </Drawer>

      {loadingBlogs && (
        <Card>
          <CardContent className="text-center py-8">
            <Loader2 className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Loading Blogs
            </h3>
            <p className="text-gray-600">
              Please wait, we are fetching the blogs.
            </p>
          </CardContent>
        </Card>
      )}

      {blogs?.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Blogs Found
            </h3>
            <p className="text-gray-600">
              No blogs have been generated for this content yet.
            </p>
          </CardContent>
        </Card>
      )}

      {blogs?.length > 0 && (
        <div className="space-y-4">
          {blogs.map((blog) => (
            <Card
              key={blog._id}
              className="hover:cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => {
                setSelectedBlog(blog);
                setIsDrawerOpen(true);
              }}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    {getStatusIcon("completed")}
                    <span>{blog.data?.title || "N/A"}</span>
                  </CardTitle>
                  <Badge className={getStatusColor("completed")}>Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-1">
                      Created At
                    </h4>
                    <p className="text-gray-900">
                      {formatDate(blog.created_at)}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-1">
                      Updated At
                    </h4>
                    <p className="text-gray-900">
                      {formatDate(blog.updated_at)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
