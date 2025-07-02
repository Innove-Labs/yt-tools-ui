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
  const [formData, setFormData] = useState({ title: "", link: "" });
  const [open, setOpen] = useState(false);
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const { data, loading, error, refetch } = useDataFetcher({
    baseUrl: API_BASE_URL,
    url: "/api/v1/content/contents-with-jobs",
    queryParams: {
      skip: 0,
      limit: 10,
    },
    credentials: true,
    autoRefresh: 6000
  });

  const formattedData = data?.items?.map((item) => ({
    id: item.id,
    title: item.title,
    link: item.link,
    created_at: item.created_at,
    pending_jobs: item.jobs?.reduce(
      (acc, job) => acc + (job.status === "pending" ? 1 : 0),
      0
    ) || 0,
    failed_jobs: item.jobs?.reduce(
      (acc, job) => acc + (job.status === "failed" ? 1 : 0),
      0
    ) || 0,
    successful_jobs: item.jobs?.reduce(
      (acc, job) => acc + (job.status === "completed" ? 1 : 0),
      0
    ) || 0,
  })) || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newBlog = {
      title: formData.title,
      link: formData.link,
    };
    setSubmissionLoading(true);
    axiosInstance.post("/yt/extraction-request", newBlog)
    .then((response) => {
      console.log("Blog created successfully:", response.data);
      toast.success("Blog created successfully!");
      refetch();
    })
    .catch((error) => {
      console.error("Error creating blog:", error);
      toast.error("Failed to create blog. Please try again.");
    })
    .finally(() => {
      setSubmissionLoading(false);
    });
    setFormData({ title: "", link: "" });
    setOpen(false);
  };

  return (
    <div className="p-8 space-y-6">
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
              <DialogTitle>Create Blog Content</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" loading={submissionLoading}>Submit</Button>
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
          <table loading={loading} className="min-w-full bg-white border border-gray-200 rounded shadow">
            <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
              <tr>
                <th className="px-4 py-3 border-b">Title</th>
                <th className="px-4 py-3 border-b">Link</th>
                <th className="px-4 py-3 border-b">Created At</th>
                <th className="px-4 py-3 border-b text-center">Pending Jobs</th>
                <th className="px-4 py-3 border-b text-center">Successful Jobs</th>
                <th className="px-4 py-3 border-b text-center">Failed Jobs</th>
              </tr>
            </thead>
            <tbody>
              {formattedData.map((blog) => (
                <tr key={blog.id} className="border-t hover:bg-gray-50 text-sm cursor-pointer" onClick={() => navigate(`/dashboard/content/${blog.id}`)}>
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
                  <td className="px-4 py-2 text-center">{blog.successful_jobs}</td>
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
