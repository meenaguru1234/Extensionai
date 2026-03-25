import React, { useState } from "react";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState(null);
  const [activeTab, setActiveTab] = useState(null);

  const handleGenerate = async () => {
    const res = await fetch("http://localhost:5000/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();
    setResponse(data);
    setActiveTab(Object.keys(data.files)[0]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center p-6">
      <div className="bg-gray-900 shadow-2xl rounded-2xl p-6 w-full max-w-4xl">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-6 text-center">
          Extensio.ai 🚀
        </h1>

        {/* Input */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Describe your Chrome extension..."
            className="flex-1 p-3 rounded-lg bg-gray-800 border border-gray-700"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            onClick={handleGenerate}
            className="bg-blue-600 hover:bg-blue-700 px-4 rounded-lg"
          >
            Generate
          </button>
        </div>

        {/* Output Section */}
        {response && (
          <div className="bg-gray-800 rounded-xl p-4">
            <h2 className="text-lg font-semibold mb-4">Generated Files</h2>

            {/* Tabs */}
            <div className="flex gap-2 mb-4">
              {Object.keys(response.files).map((file) => (
                <button
                  key={file}
                  onClick={() => setActiveTab(file)}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    activeTab === file
                      ? "bg-blue-600"
                      : "bg-gray-700"
                  }`}
                >
                  {file}
                </button>
              ))}
            </div>

            {/* Code Viewer */}
            <div className="bg-black rounded-lg p-4 text-sm overflow-auto max-h-64">
              <pre>
                {(() => {
                  const content = response.files[activeTab];
                  try {
                    return JSON.stringify(JSON.parse(content), null, 2);
                  } catch {
                    return content;
                  }
                })()}
              </pre>
            </div>

            {/* Download Button */}
            <a
              href={response.downloadUrl}
              className="block mt-4 text-center bg-green-600 hover:bg-green-700 py-2 rounded-lg"
            >
              ⬇ Download ZIP
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
