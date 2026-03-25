import React, { useState } from "react";
import "../src/App.css"

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState(null);
  const [activeTab, setActiveTab] = useState(null);

 const handleGenerate = async () => {
  try {
    const res = await fetch("http://localhost:5000/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    // 👇 முக்கியம்
    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("Not JSON:", text);
      alert("Server error வந்துருக்கு (HTML response)");
      return;
    }

    console.log(data);
    setResponse(data);

  } catch (err) {
    console.error(err);
    alert("Error generating extension");
  }
};

  return (
    <div className=" fullcontainer min-h-screen 
    bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center p-6">
      <div className="innercontainer bg-gray-900 shadow-2xl rounded-2xl p-6 w-full max-w-4xl"
      style={{
  backgroundColor: "#111827",
  boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
  borderRadius: "16px",
  // padding: "20px",
  width: "100%",
  maxWidth: "896px"
}}>
        {/* Header */}
        <h1 style={{
  fontSize: "50px",
  fontWeight: "700",
  marginBottom: "24px",
  textAlign: "center",
  color:"white"
}}>
          Extensio.ai 🚀
        </h1>

        {/* Input */}
        <h1 style={{display:'flex', fontSize:'40px', textAlign:'center', marginLeft:'180px'}}>
          Create your browser Extension</h1><br/>
        <div className="row">
          
          <input
            type="text"
            placeholder="Describe your Chrome extension..."
            className="flex-1 p-5 rounded-lg bg-gray-800 border border-gray-700"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            style={{
              height:'100px', width:'500px', fontSize:'20px'
            }}
          />
          <button
            onClick={handleGenerate}
            className="button1 bg-blue-600 hover:bg-blue-700 px-4 rounded-lg"
          >
            Generate
          </button>
        </div>

        {/* Output Section */}
        {response && (
          <div className=" box bg-gray-800 rounded-xl p-4">
            <h2 className="subtitle text-lg font-semibold mb-4">Generated Files</h2>

            {/* Tabs */}
            <div className="row-small flex gap-2 mb-4">
              {Object.keys(response.files).map((file) => (
                <button
                  key={file}
                  onClick={() => setActiveTab(file)}
                  className={`small-btn px-3 py-1 rounded-lg text-sm ${
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
            <div className="code-box bg-black rounded-lg p-4 text-sm overflow-auto max-h-64">
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
              className="download-btn block mt-4 text-center bg-green-600 hover:bg-green-700 py-2 rounded-lg"
            >
              ⬇ Download ZIP
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
