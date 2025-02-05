export default function Loader() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="relative">
        <div
          className="w-24 h-24 rounded-full absolute
                      border-8 border-solid border-gray-200"
        ></div>
        <div
          className="w-24 h-24 rounded-full animate-spin absolute
                      border-8 border-solid border-blue-500 border-t-transparent
                      shadow-md"
        ></div>
      </div>
    </div>
  );
}
