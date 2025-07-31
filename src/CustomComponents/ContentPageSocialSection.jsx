import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, FileText, Loader2 } from "lucide-react";
import { Drawer } from "antd";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/utils/axios.util";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function ContentPageSocialSection({ content, type }) {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!content?.id) return;

    setLoading(true);
    axiosInstance
      .get(`/content/socials/${content.id}/${type}`)
      .then((res) => {
        if (res.data) setPosts(res.data);
      })
      .catch((err) => {
        console.error("Error loading social posts", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const copyToClipboard = async (text, label = "Copied") => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(label); // Optional
    } catch (err) {
      toast.error("Copy failed");
    }
  };

  return (
    <>
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={700}
        size="large"
      >
        {selectedPost && (
          <div className="p-4 space-y-4">
            {selectedPost?.data?.title && (
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {selectedPost.data.title}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    copyToClipboard(selectedPost.data.title, "Title copied")
                  }
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            )}
            <div className="relative">
              <p className="whitespace-pre-line text-gray-700">
                {selectedPost.data.content}
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-0 right-0"
                onClick={() =>
                  copyToClipboard(selectedPost.data.content, "Content copied")
                }
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedPost.data.hashTags?.map((tag, idx) => (
                <Badge key={idx} variant="secondary">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Drawer>

      {loading && (
        <Card>
          <CardContent className="text-center py-8">
            <Loader2 className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Loading Social Posts
            </h3>
            <p className="text-gray-600">Please wait while we fetch them.</p>
          </CardContent>
        </Card>
      )}

      {!loading && posts.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Posts Found
            </h3>
            <p className="text-gray-600">No social media posts yet.</p>
          </CardContent>
        </Card>
      )}

      {!loading && posts.length > 0 && (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card
              key={post.contentId}
              className="hover:bg-gray-50 transition cursor-pointer"
              onClick={() => {
                setSelectedPost(post);
                setDrawerOpen(true);
              }}
            >
              <CardHeader className="pb-2">
                {post.data?.title && (
                  <div className="flex items-center justify-between">
                    {
                      <CardTitle className="flex items-center gap-2 text-base">
                        {post.data.title || "Untitled"}
                      </CardTitle>
                    }
                  </div>
                )}
              </CardHeader>

              <CardContent className="gap-4">
                <div className="flex-1 space-y-1">
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {post.data.content}
                  </p>
                  {post.data.tone && (
                    <p className="text-xs text-gray-500">
                      <strong>Tone:</strong> {post.data.tone}
                    </p>
                  )}
                  {post.tags?.length > 0 && (
                    <p className="text-xs text-gray-500">
                      <strong>Tags:</strong> {post.tags.join(", ")}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {post.data.hashTags?.map((tag, idx) => (
                      <Badge key={idx} variant="secondary">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 text-sm text-gray-500 whitespace-nowrap mt-5">
                  <p>
                    <strong>Created:</strong> {formatDate(post.created_at)}
                  </p>
                  <p>
                    <strong>Updated:</strong> {formatDate(post.updated_at)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
