import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JOB_CONTEXT_MAP } from "@/constants/job-context-map";
import { JOB_STATUS_MAP } from "@/constants/job-status-map";
import {
  Calendar,
  ExternalLink,
  User,
  Tag,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Loader2,
} from "lucide-react";

export default function ContentPageBlogSection({ content }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
      {content.jobs?.filter((job) => job.context === "blog").length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Blog Jobs Found
            </h3>
            <p className="text-gray-600">
              No blog jobs have been created for this content yet.
            </p>
          </CardContent>
        </Card>
      )}
      {content.jobs?.filter((job) => job.context === "blog").length > 0 && (
        <>
          {content?.jobs
            ?.filter((job) => job.context === "blog")
            .map((job) => (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        {getStatusIcon(job.status)}
                        <span>Job Details</span>
                      </CardTitle>
                      <Badge className={`${getStatusColor(job.status)}`}>
                        {JOB_STATUS_MAP[job.status] || "Unknown Status"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-1">
                          Platform
                        </h4>
                        <p className="text-gray-900">
                          {(job.context && JOB_CONTEXT_MAP[job.context]) ||
                            "Unknown Platform"}
                        </p>
                      </div>
                      {/* <div>
                                      <h4 className="font-medium text-sm text-gray-700 mb-1">Tokens Used</h4>
                                      <p className="text-gray-900">{job.token_used || 0}</p>
                                    </div> */}
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-1">
                          Created
                        </h4>
                        <p className="text-gray-900">
                          {formatDate(job.created_at)}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-1">
                          Updated
                        </h4>
                        <p className="text-gray-900">
                          {formatDate(job.updated_at)}
                        </p>
                      </div>
                    </div>

                    {job.error && job.status === "failed" && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <h4 className="font-medium text-sm text-red-800 mb-1">
                          Error
                        </h4>
                        <p className="text-red-700 text-sm">{job.error}</p>
                      </div>
                    )}
                  </CardContent>
                  <CardContent>
                    {content?.blogs &&
                    content?.blogs?.filter((bl) => bl.job_id === job._id)
                      ?.length ? (
                      <div className="space-y-4">
                        {content?.blogs
                          ?.filter((bl) => bl.job_id === job._id)
                          ?.map((blog, index) => (
                            <div
                              key={index}
                              className="border rounded-lg p-4 hover:bg-gray-50 hover:cursor-pointer transition-colors"
                              onClick={() => {
                                console.log("Blog clicked:", blog, content);
                              }}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <h5 className="font-medium text-gray-900">
                                  {blog?.data?.title}
                                </h5>
                                <div className="">
                                    <span>
                                        ==>
                                    </span>
                                    </div>
                              </div>
                              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                {blog.content}
                              </p>
                              {blog.word_count && (
                                <p className="text-xs text-gray-500">
                                  {blog.word_count} words
                                </p>
                              )}
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 text-sm">
                          No blog posts generated yet
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ))}
        </>
      )}
    </>
  );
}
