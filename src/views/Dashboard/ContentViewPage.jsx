const { useParams } = require("react-router-dom");

const ContentViewPage = () => {
  const { contentId, contentType, typeId } = useParams();

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-2xl font-bold mb-4">Content View Page</h1>
      <p className="text-gray-600">This is the content view page.</p>
    </div>
  );
}