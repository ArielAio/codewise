// components/LoadingSkeleton.jsx
const LoadingSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
      <div className="bg-gray-300 h-6 w-3/4 mb-4 rounded"></div>
      <div className="bg-gray-300 h-4 w-1/2 mb-4 rounded"></div>
      <div className="bg-gray-300 h-4 w-full mb-4 rounded"></div>
      <div className="bg-gray-300 h-4 w-5/6 mb-4 rounded"></div>
    </div>
  );
};

export default LoadingSkeleton;