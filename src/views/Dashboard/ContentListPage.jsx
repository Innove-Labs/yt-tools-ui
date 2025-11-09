import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useDataFetcher } from "react-data-fetcher-hook";
import { API_BASE_URL } from "@/config";
import { axiosInstance } from "@/utils/axios.util";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function ContentListPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    link: "",
    types: [], // array of selected types
    counts: {}, // { linkedin: 2, reddit: 1, twitter: 3 }
  });
  const { data, loading, error, refetch } = useDataFetcher({
    baseUrl: API_BASE_URL,
    url: "/content/contents-with-jobs",
    queryParams: {
      skip: 0,
      limit: 10,
    },
    credentials: true,
    autoRefresh: 10000,
  });

  const formattedData =
    data?.items?.map((item) => ({
      id: item.id,
      title: item.title,
      link: item.link,
      created_at: item.created_at,
      pending_jobs:
        item.jobs?.reduce(
          (acc, job) => acc + (job.status === "pending" ? 1 : 0),
          0
        ) || 0,
      failed_jobs:
        item.jobs?.reduce(
          (acc, job) => acc + (job.status === "failed" ? 1 : 0),
          0
        ) || 0,
      successful_jobs:
        item.jobs?.reduce(
          (acc, job) => acc + (job.status === "completed" ? 1 : 0),
          0
        ) || 0,
    })) || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const updatedTypes = checked
        ? [...prev.types, value]
        : prev.types.filter((type) => type !== value);

      const updatedCounts = { ...prev.counts };
      if (!checked) delete updatedCounts[value];

      return {
        ...prev,
        types: updatedTypes,
        counts: updatedCounts,
      };
    });
  };

  const handleCountChange = (e) => {
    const { name, value } = e.target; // name format: "counts.twitter"
    const key = name.split(".")[1];
    setFormData((prev) => ({
      ...prev,
      counts: {
        ...prev.counts,
        [key]: Number(value),
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    const blogPresent = formData.types?.includes("blog");
    const generateIdeasFromComments = formData.types?.includes(
      "comment_idea_generation"
    );
    const sentimentAnalysis = formData.types?.includes(
      "comment_sentiment_analysis"
    );
    const commentAnalysis = formData.types?.includes("comment_analysis");
    const newBlog = {
      title: formData.title,
      link: formData.link,
    };
    if (blogPresent) {
      newBlog.blog = true;
    }
    if (generateIdeasFromComments) {
      newBlog.comment_idea_generation = true;
    }
    if (sentimentAnalysis) {
      newBlog.comment_sentiment_analysis = true;
    }
    if (commentAnalysis) {
      newBlog.comment_analysis = true;
    }
    if (formData?.counts && Object.keys(formData.counts).length > 0) {
      Object.keys(formData.counts).forEach((type) => {
        if (formData.counts[type] > 0) {
          newBlog[type] = {
            include: true,
            count: formData.counts[type],
          };
        }
      });
    }
    setSubmissionLoading(true);
    axiosInstance
      .post("/yt/extraction-request", newBlog)
      .then((response) => {
        console.log("Blog created successfully:", response.data);
        toast.success("Blog created successfully!");
        setFormData({ title: "", link: "" });
        setOpen(false);
        refetch();
      })
      .catch((error) => {
        console.error("Error creating blog:", error);
        toast.error("Failed to create blog. Please try again.");
      })
      .finally(() => {
        setSubmissionLoading(false);
      });
  };

  const generateLabel = (type) => {
    switch (type) {
      case "blog":
        return "Blog Post";
      case "twitter":
        return "Twitter Post";
      case "reddit":
        return "Reddit Post";
      case "comment_idea_generation":
        return "Comment Idea Generation";
      case "comment_sentiment_analysis":
        return "Comment Sentiment Analysis";
      case "comment_analysis":
        return "Comment Analysis";
      default:
        return type;
    }
  };

  return (
    <div className="p-8 space-y-6">
      {submissionLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white p-6 rounded-2xl shadow-xl text-center max-w-sm">
            {/* Spinner */}
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>

            {/* Message */}
            <h2 className="text-lg font-semibold mb-2">
              Processing your video...
            </h2>
            <p className="text-sm text-gray-600">
              We are extracting content and generating insights. This may take a
              few minutes.
              <br />
              Please don’t close this window.
            </p>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Content</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Content
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Content</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Link
                </label>
                <Input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Content Types */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Generate Content Types
                </label>

                {[
                  "blog",
                  "linked_in",
                  "reddit",
                  "twitter",
                  "comment_analysis",
                ].map((type) => (
                  <div key={type} className="flex items-center gap-4 mb-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="types"
                        value={type}
                        checked={formData.types?.includes(type)}
                        onChange={handleTypeChange}
                        className="accent-blue-600"
                      />
                      <span className="capitalize">{generateLabel(type)}</span>
                    </label>

                    {/* Show count input only for non-blog */}
                    {!["comment_analysis", "blog"].includes(type) &&
                      formData.types?.includes(type) && (
                        <Input
                          type="number"
                          min={1}
                          max={5}
                          name={`counts.${type}`}
                          placeholder="Count"
                          value={formData.counts?.[type] || ""}
                          onChange={handleCountChange}
                          className="w-24"
                          required
                        />
                      )}
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submissionLoading}
                  loading={submissionLoading}
                >
                  Submit
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table Layout */}
      {formattedData.length === 0 ? (
        <p className="text-gray-500">No blogs available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table
            loading={loading}
            className="min-w-full bg-white border border-gray-200 rounded shadow"
          >
            <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
              <tr>
                <th className="px-4 py-3 border-b">Title</th>
                <th className="px-4 py-3 border-b">Link</th>
                <th className="px-4 py-3 border-b">Created At</th>
                <th className="px-4 py-3 border-b text-center">Pending Jobs</th>
                <th className="px-4 py-3 border-b text-center">
                  Successful Jobs
                </th>
                <th className="px-4 py-3 border-b text-center">Failed Jobs</th>
              </tr>
            </thead>
            <tbody>
              {formattedData.map((blog) => (
                <tr
                  key={blog.id}
                  className="border-t hover:bg-gray-50 text-sm cursor-pointer"
                  onClick={() => navigate(`/dashboard/content/${blog.id}`)}
                >
                  <td className="px-4 py-2 font-medium">{blog.title}</td>
                  <td className="px-4 py-2">
                    <a
                      href={blog.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {blog.link}
                    </a>
                  </td>
                  <td className="px-4 py-2">
                    {new Date(blog.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-center">{blog.pending_jobs}</td>
                  <td className="px-4 py-2 text-center">
                    {blog.successful_jobs}
                  </td>
                  <td className="px-4 py-2 text-center">{blog.failed_jobs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
