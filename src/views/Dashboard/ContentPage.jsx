import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
import { useDataFetcher } from "react-data-fetcher-hook";
import { API_BASE_URL } from "@/config";
import { useParams } from "react-router-dom";
import { JOB_CONTEXT_MAP } from "@/constants/job-context-map";
import { JOB_CONTEXTS } from "@/constants/job-contexts";
import ContentPageBlogSection from "@/CustomComponents/ContentPageBlogSection";

const ContentPage = () => {
  const { contentId: id } = useParams();
  const [activeTab, setActiveTab] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    data: content,
    loading,
    error,
    refetch,
  } = useDataFetcher({
    baseUrl: API_BASE_URL,
    url: `/api/v1/content/content-with-jobs/${id}`,
    credentials: true,
  });

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-lg">Loading content...</span>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">
            Content not found
          </h2>
          <p className="text-gray-600">
            The requested content could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Content Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {content.title}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Created: {formatDate(content.created_at)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>Updated: {formatDate(content.updated_at)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={content.is_active ? "default" : "secondary"}>
              {content.is_active ? "Active" : "Inactive"}
            </Badge>
            {content.link && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={content.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View Source
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Tags */}
        {content.tags && content.tags.length > 0 && (
          <div className="flex items-center space-x-2 mb-4">
            <Tag className="h-4 w-4 text-gray-500" />
            <div className="flex flex-wrap gap-2">
              {content.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Content Preview */}
        {content.raw_text && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Content Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-700 leading-relaxed">
                {isExpanded
                  ? content.raw_text
                  : `${content.raw_text.slice(0, 200)}${
                      content.raw_text.length > 200 ? "..." : ""
                    }`}
              </div>
              {content.raw_text.length > 200 && (
                <Button
                  variant="link"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-0 h-auto mt-2 text-blue-600 hover:text-blue-800"
                >
                  {isExpanded ? "Read less" : "Read more"}
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <Separator className="my-8" />

      {/* Content Jobs Tabs */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Content Jobs
        </h2>

        {content?.jobs?.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Jobs Found
              </h3>
              <p className="text-gray-600">
                No content jobs have been created for this content yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-1 lg:grid-cols-4 gap-2 h-auto p-1">
              {JOB_CONTEXTS.map((ctx) => (
                <TabsTrigger
                  key={ctx}
                  value={ctx}
                  className="flex items-center justify-between p-3 h-auto data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <div className="flex items-center space-x-2">
                    <div className="text-left">
                      <div className="font-medium text-sm">
                        {JOB_CONTEXT_MAP[ctx] || ctx}
                      </div>
                    </div>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
            <br />

            {activeTab === "blog" && (
              <ContentPageBlogSection content={content} />
            )}
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default ContentPage;
