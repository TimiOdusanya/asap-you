import React from "react";

const ColorTest = () => {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-3xl font-bold mb-6">Professional Color Scale System</h2>
      
      {/* Gray Scale */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Gray Scale (50-600)</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-gray-50 text-gray-500 p-3 rounded text-center">
            <div className="font-bold">gray-50</div>
            <div className="text-xs">#F0F0F0</div>
          </div>
          <div className="bg-gray-100 text-gray-500 p-3 rounded text-center">
            <div className="font-bold">gray-100</div>
            <div className="text-xs">#B1B1B1</div>
          </div>
          <div className="bg-gray-200 text-gray-500 p-3 rounded text-center">
            <div className="font-bold">gray-200</div>
            <div className="text-xs">#D2D4C7</div>
          </div>
          <div className="bg-gray-300 text-white p-3 rounded text-center">
            <div className="font-bold">gray-300</div>
            <div className="text-xs">#3C3C3C</div>
          </div>
          <div className="bg-gray-400 text-white p-3 rounded text-center">
            <div className="font-bold">gray-400</div>
            <div className="text-xs">#212121</div>
          </div>
          <div className="bg-gray-500 text-white p-3 rounded text-center">
            <div className="font-bold">gray-500</div>
            <div className="text-xs">#2C2C2C</div>
          </div>
        </div>
        <div className="bg-gray-600 text-white p-3 rounded text-center max-w-xs">
          <div className="font-bold">gray-600</div>
          <div className="text-xs">#193A1B</div>
        </div>
      </div>
      
      {/* Green Scale */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Green Scale (50-300)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-green-50 text-gray-500 p-3 rounded text-center">
            <div className="font-bold">green-50</div>
            <div className="text-xs">#F9FED9</div>
          </div>
          <div className="bg-green-100 text-gray-500 p-3 rounded text-center">
            <div className="font-bold">green-100</div>
            <div className="text-xs">#FAFFD8</div>
          </div>
          <div className="bg-green-200 text-gray-500 p-3 rounded text-center">
            <div className="font-bold">green-200</div>
            <div className="text-xs">#D7FED8</div>
          </div>
          <div className="bg-green-300 text-white p-3 rounded text-center">
            <div className="font-bold">green-300</div>
            <div className="text-xs">#4CAF50</div>
          </div>
          <div className="bg-green-400 text-white p-3 rounded text-center">
            <div className="font-bold">green-400</div>
            <div className="text-xs">#4CAF50</div>
          </div>
          <div className="bg-green-500 text-white p-3 rounded text-center">
            <div className="font-bold">green-500</div>
            <div className="text-xs">#88CA8A</div>
          </div>
          <div className="bg-green-600 text-white p-3 rounded text-center">
            <div className="font-bold">green-600</div>
            <div className="text-xs">#193A1B</div>
          </div>
          <div className="bg-green-700 text-white p-3 rounded text-center">
            <div className="font-bold">green-700</div>
            <div className="text-xs">#0F2310</div>
          </div>
        </div>
      </div>
      
      {/* Extended Color Palette */}
      <div className="space-y-4 text-black">
        <h3 className="text-xl font-semibold">Extended Color Palette</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <div className="bg-orange-50 text-black p-3 rounded text-center">
            <div className="font-bold">orange-50</div>
            <div className="text-xs">#FFEFEB</div>
          </div>
          <div className="bg-orange-100 text-black p-3 rounded text-center">
            <div className="font-bold">orange-100</div>
            <div className="text-xs">#FFE0D3</div>
          </div>
          <div className="bg-purple-50 text-black p-3 rounded text-center">
            <div className="font-bold">purple-50</div>
            <div className="text-xs">#F0E9FF</div>
          </div>
          <div className="bg-yellow-50 text-black p-3 rounded text-center">
            <div className="font-bold">yellow-50</div>
            <div className="text-xs">#FFE6B8</div>
          </div>
          <div className="bg-cyan-50 text-black p-3 rounded text-center">
            <div className="font-bold">cyan-50</div>
            <div className="text-xs">#E2FFFD</div>
          </div>
          <div className="bg-blue-50 text-black p-3 rounded text-center">
            <div className="font-bold">blue-50</div>
            <div className="text-xs">#EEEEFF</div>
          </div>
          <div className="bg-pink-50 text-black p-3 rounded text-center">
            <div className="font-bold">pink-50</div>
            <div className="text-xs">#FCEDF9</div>
          </div>
        </div>
      </div>
      
      {/* Additional Colors */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Additional Colors</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gray-600 text-white p-3 rounded text-center">
            <div className="font-bold">gray-600</div>
            <div className="text-xs">#555555</div>
          </div>
          <div className="bg-gray-700 text-gray-700 p-3 rounded text-center">
            <div className="font-bold">gray-700</div>
            <div className="text-xs">#F5F2F2</div>
          </div>
          <div className="bg-yellow-400 text-white p-3 rounded text-center">
            <div className="font-bold">yellow-400</div>
            <div className="text-xs">#EBBC08</div>
          </div>
          <div className="bg-coral-50 text-white p-3 rounded text-center">
            <div className="font-bold">coral-50</div>
            <div className="text-xs">#E2725B</div>
          </div>
        </div>
      </div>
      
      {/* Legacy Brand Colors */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Legacy Brand Colors (Backward Compatibility)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-brand-dark text-white p-3 rounded text-center">
            <div className="font-bold">brand-dark</div>
            <div className="text-xs">#212121</div>
          </div>
          <div className="bg-brand-gray text-white p-3 rounded text-center">
            <div className="font-bold">brand-gray</div>
            <div className="text-xs">#3C3C3C</div>
          </div>
          <div className="bg-brand-green text-white p-3 rounded text-center">
            <div className="font-bold">brand-green</div>
            <div className="text-xs">#4CAF50</div>
          </div>
        </div>
      </div>
      
      {/* Usage Examples */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Usage Examples</h3>
        <div className="space-y-3">
          <div className="bg-gray-50 border-2 border-gray-200 p-4 rounded-lg">
            <p className="text-gray-400">Light card with gray-50 background and gray-200 border</p>
          </div>
          <div className="bg-green-100 border-2 border-green-300 p-4 rounded-lg">
            <p className="text-gray-500">Success card with green-100 background and green-300 border</p>
          </div>
          <div className="bg-coral-50 text-white p-4 rounded-lg">
            <p>Alert card with coral-50 background</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorTest;
