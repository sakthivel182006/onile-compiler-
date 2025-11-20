import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [language, setLanguage] = useState("java");
  const [code, setCode] = useState(`public class Main {
  public static void main(String[] args) {
    System.out.println("Hello, World!");
  }
}`);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const runCode = async () => {
    setLoading(true);
    setOutput("");
    try {
      const res = await axios.post("http://localhost:5000/api/compiler/run", {
        language,
        code,
        input,
      });
      setOutput(res.data.output || "No output");
    } catch (err) {
      setOutput("⚠️ Error running code! Check console for details.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getDefaultCode = (lang) => {
    switch (lang) {
      case "java":
        return `public class Main {
  public static void main(String[] args) {
    System.out.println("Hello, World!");
  }
}`;
      case "cpp":
        return `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!";
    return 0;
}`;
      case "python":
        return `print("Hello, World!")`;
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">

      {/* Header */}
      <div className="max-w-6xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          🚀 <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Sakthivel Online Compiler</span>
        </h1>
        <p className="text-gray-600 text-lg">Compile and run Java, C++, and Python code instantly</p>
      </div>

      {/* Main Box */}
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">

        {/* Top Bar */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-4">
            <span className="text-white font-semibold">Language:</span>
            <select
              className="px-4 py-2 rounded-lg bg-white border border-gray-300 focus:ring-2 outline-none"
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                setCode(getDefaultCode(e.target.value));
              }}
            >
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="python">Python</option>
            </select>
          </div>

          <button
            className="px-8 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-100 transition-all duration-200 shadow-lg flex items-center space-x-2 disabled:opacity-60"
            onClick={runCode}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-t-2 border-blue-600 rounded-full animate-spin"></div>
                <span>Running...</span>
              </>
            ) : (
              <>
                <span>▶</span>
                <span>Compile & Run</span>
              </>
            )}
          </button>
        </div>

        {/* Editor Section */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Code Editor</h3>

          <textarea
            className="w-full h-96 p-4 border border-gray-300 rounded-xl bg-black text-green-400 font-mono text-sm resize-none outline-none focus:ring-2 focus:ring-blue-600"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          {/* Input / Output */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

            {/* Input */}
            <div className="bg-gray-50 rounded-xl p-4 border">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Input</h3>
              <textarea
                className="w-full h-40 p-4 border border-gray-300 rounded-lg bg-white resize-none font-mono text-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter input..."
              />
            </div>

            {/* Output */}
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-2">Output</h3>
              <pre className="w-full h-40 p-4 bg-gray-800 text-green-400 rounded-lg overflow-auto font-mono text-sm">
                {output || "⚙️ Output will appear here..."}
              </pre>
            </div>

          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto text-center mt-8 text-gray-600">
        <p className="flex items-center justify-center gap-2">
          Built with <span className="text-red-500">❤️</span> using React + Tailwind + Judge0
        </p>
      </footer>
    </div>
  );
};

export default App;
