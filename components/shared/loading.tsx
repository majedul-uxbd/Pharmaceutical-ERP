const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="h-full w-full bg-white rounded-xl shadow-lg p-4 flex flex-col space-y-4 lg:space-y-6">
        {/* Top skeleton rows */}
        <div className="w-full h-6 bg-gray-300 rounded animate-pulse"></div>
        <div className="w-full h-6 bg-gray-300 rounded animate-pulse"></div>
        <div className="w-3/4 h-6 bg-gray-300 rounded animate-pulse"></div>

        {/* Skeleton cards for medium/large screens */}
        <div className="flex space-x-4 mt-4 lg:mt-6">
          <div className="w-1/4 h-20 bg-gray-300 rounded animate-pulse"></div>
          <div className="w-1/4 h-20 bg-gray-300 rounded animate-pulse"></div>
          <div className="w-1/4 h-20 bg-gray-300 rounded animate-pulse"></div>
          <div className="hidden lg:block w-1/4 h-20 bg-gray-300 rounded animate-pulse"></div>
        </div>

        {/* Additional rows for large screens */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
          <div className="h-32 bg-gray-300 rounded animate-pulse"></div>
          <div className="h-32 bg-gray-300 rounded animate-pulse"></div>
          <div className="h-32 bg-gray-300 rounded animate-pulse"></div>
          <div className="h-32 bg-gray-300 rounded animate-pulse"></div>
          <div className="hidden lg:block h-32 bg-gray-300 rounded animate-pulse"></div>
          <div className="hidden lg:block h-32 bg-gray-300 rounded animate-pulse"></div>
          <div className="hidden xl:block h-32 bg-gray-300 rounded animate-pulse"></div>
          <div className="hidden xl:block h-32 bg-gray-300 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
