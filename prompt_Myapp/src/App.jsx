import React, { useState } from "react";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleGenerate = async () => {
    
    if (!prompt) return alert("Please enter your requirement");

    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch("http://localhost:5000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error(err);
      alert("Error generating extension");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Extensio.ai 🚀
        </h1>

        <textarea
          className="w-full border p-3 rounded-lg mb-4"
          rows="4"
          placeholder="Describe your Chrome extension..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
          onClick={handleGenerate}
          className="w-full bg-black text-white py-2 rounded-lg"
        >
          {loading ? "Generating..." : "Generate Extension"}
        </button>

     {response && response.files && (
  <div>
    <h2>Generated Files:</h2>

    {Object.entries(response.files).map(([fileName, content]) => (
      <div key={fileName} style={{ marginBottom: "10px" }}>
        <h3>{fileName}</h3>

        <pre style={{ background: "#eee", padding: "10px" }}>
          {fileName === "manifest.json"
            ? JSON.stringify(JSON.parse(content), null, 2)
            : content}
        </pre>
      </div>
    ))}

    <a href={response.downloadUrl}>
      Download ZIP
    </a>
  </div>
)}
      </div>
    </div>
  );
}
