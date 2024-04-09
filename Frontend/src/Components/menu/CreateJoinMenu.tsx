export default function CreateJoinMenu() {



    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        {/* Host Game Button */}
        <button className="flex items-center w-3/4 lg:w-1/2 xl:w-1/3 bg-white border-2 border-gray-300 p-6 rounded-lg shadow-md justify-start hover:bg-gray-100">
          <img
            src="/character-logo.png"
            className="w-20 h-20 mr-4"
            alt="Large avatar"
          />
          <span className="text-xl font-bold">Host Game</span>
        </button>
        
  
      {/* Public Game Button */}
      <button
        className="flex items-center w-3/4 lg:w-1/2 xl:w-1/3 bg-white border-2 border-gray-300 p-6 rounded-lg shadow-md justify-start hover:bg-gray-100"  
      >
        <img
          src="/character-logo.png"
          className="w-20 h-20 mr-4"
          alt="Large avatar"
        />
        <span className="text-xl font-bold">Public Game</span>
      </button>

        {/* Private Game Button */}
        <button className="flex items-center w-3/4 lg:w-1/2 xl:w-1/3 bg-white border-2 border-gray-300 p-6 rounded-lg shadow-md justify-start hover:bg-gray-100">
          <img
            src="/character-logo.png"
            className="w-20 h-20 mr-4"
            alt="Large avatar"
          />
          <span className="text-xl font-bold">Private Game</span>
        </button>
      </div>
    );
  }
  