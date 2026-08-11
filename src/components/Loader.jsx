export default function Loader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center">
      <div className="relative flex flex-col items-center">

        <div className="relative w-24 h-24">

          <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>

          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-black animate-spin"></div>

          <div className="absolute inset-3 rounded-full border-4 border-transparent border-t-gray-500 animate-spin [animation-direction:reverse] [animation-duration:1.5s]"></div>

        </div>

        <h2 className="mt-8 text-2xl font-bold tracking-wide text-gray-800">
          Tiles Gallery
        </h2>

        <p className="mt-2 text-gray-500 text-sm tracking-widest uppercase">
          Loading Experience...
        </p>

        <div className="mt-6 flex gap-2">
          <span className="w-3 h-3 bg-black rounded-full animate-bounce"></span>
          <span className="w-3 h-3 bg-gray-600 rounded-full animate-bounce delay-150"></span>
          <span className="w-3 h-3 bg-gray-400 rounded-full animate-bounce delay-300"></span>
        </div>

      </div>
    </div>
  );
}