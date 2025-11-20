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

  const TAB = "    "; // 4 spaces

  const runCode = async () => {
    setLoading(true);
    setOutput("");
    try {
      const res = await axios.post(
        "https://gameappbackend-i8zv.onrender.com/api/compiler/run",
        { language, code, input }
      );
      setOutput(res.data.output || "No output");
    } catch (err) {
      setOutput("⚠️ Error running code");
    }
    setLoading(false);
  };

  // ------------------ AUTO FORMATTER (ALT + SHIFT + F) ----------------------
  const formatCode = (raw) => {
    let formatted = "";
    let indent = 0;

    for (let i = 0; i < raw.length; i++) {
      let ch = raw[i];

      if (ch === "{") {
        formatted += " {\n";
        indent++;
        formatted += TAB.repeat(indent);
      } else if (ch === "}") {
        indent--;
        formatted = formatted.trimEnd();
        formatted += `\n${TAB.repeat(indent)}}\n${TAB.repeat(indent)}`;
      } else if (ch === ";") {
        formatted += ";\n" + TAB.repeat(indent);
      } else {
        formatted += ch;
      }
    }

    return formatted;
  };

  // ------------------ KEY PRESS HANDLER (TAB, SHIFT+TAB, ENTER, BRACES) ----
  const handleEditorKeyDown = (e) => {
    let val = code;
    let start = e.target.selectionStart;
    let end = e.target.selectionEnd;

    // ----------- Alt + Shift + F → FORMAT CODE -------------
    if (e.altKey && e.shiftKey && e.key === "F") {
      e.preventDefault();
      setCode(formatCode(code));
      return;
    }

    // ---------------- TAB -----------------
    if (e.key === "Tab") {
      e.preventDefault();

      // SHIFT+TAB → OUTDENT
      if (e.shiftKey) {
        const before = val.substring(0, start);
        const lineStart = before.lastIndexOf("\n") + 1;

        if (val.substring(lineStart, start).startsWith(TAB)) {
          const newCode =
            val.substring(0, lineStart) +
            val.substring(lineStart + TAB.length);

          setCode(newCode);

          setTimeout(() => {
            e.target.selectionStart = e.target.selectionEnd = start - TAB.length;
          }, 1);
        }

        return;
      }

      // TAB → Insert 4 spaces
      const newCode =
        val.substring(0, start) + TAB + val.substring(end);

      setCode(newCode);

      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd =
          start + TAB.length;
      }, 1);

      return;
    }

    // -------- AUTO BRACKETS --------
    const pairs = {
      "{": "}",
      "(": ")",
      "[": "]",
      '"': '"',
      "'": "'",
    };

    if (pairs[e.key]) {
      e.preventDefault();
      const newCode =
        val.slice(0, start) +
        e.key +
        pairs[e.key] +
        val.slice(end);

      setCode(newCode);

      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 1;
      }, 1);

      return;
    }

    // -------- ENTER INDENT / DEDENT --------
    if (e.key === "Enter") {
      e.preventDefault();

      const before = val.substring(0, start);
      const after = val.substring(end);

      const lineStart = before.lastIndexOf("\n") + 1;
      const line = before.substring(lineStart);

      let indent = line.match(/^\s*/)[0];

      // If previous line ends with "{", indent more
      if (line.trim().endsWith("{")) {
        indent += TAB;
      }

      // If next line starts with "}", outdent
      if (after.trim().startsWith("}")) {
        indent = indent.slice(0, -TAB.length);
      }

      const newCode = before + "\n" + indent + after;

      setCode(newCode);

      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd =
          before.length + 1 + indent.length;
      }, 1);

      return;
    }

    // -------- TYPING "}" DEDENT --------
    if (e.key === "}") {
      const before = val.substring(0, start);
      const lineStart = before.lastIndexOf("\n") + 1;
      const currentIndent = before.substring(lineStart).match(/^\s*/)[0];

      if (currentIndent.length >= TAB.length) {
        e.preventDefault();

        const newIndent = currentIndent.slice(0, -TAB.length);

        const newCode =
          val.substring(0, lineStart) +
          newIndent +
          "}" +
          val.substring(end);

        setCode(newCode);

        setTimeout(() => {
          e.target.selectionStart = e.target.selectionEnd =
            lineStart + newIndent.length + 1;
        }, 1);

        return;
      }
    }
  };

  // --------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-center text-3xl font-bold mb-6">
        🚀 Sakthivel Online Compiler
      </h1>

      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl">

        <div className="flex justify-between items-center p-4 bg-blue-600 text-white rounded-t-xl">
          <div className="flex items-center gap-4">
            <span>Language:</span>

            <select
              className="text-black px-2 py-1 rounded"
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);

                if (e.target.value === "java") {
                  setCode(`public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`);
                }

                if (e.target.value === "cpp") {
                  setCode(`#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!";
    return 0;
}`);
                }

                if (e.target.value === "python") {
                  setCode(`print("Hello, World!")`);
                }
              }}
            >
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="python">Python</option>
            </select>
          </div>

          <button
            onClick={runCode}
            disabled={loading}
            className="bg-white text-blue-600 font-bold px-6 py-2 rounded-lg shadow hover:bg-gray-100 disabled:opacity-50"
          >
            {loading ? "Running..." : "▶ Run Code"}
          </button>
        </div>

        <div className="p-4">
          <h2 className="font-semibold mb-2">Code Editor</h2>

          <textarea
            className="w-full h-96 p-4 bg-black text-green-400 font-mono text-sm rounded-lg resize-none outline-none"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleEditorKeyDown}
            spellCheck="false"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <h2 className="font-semibold mb-2">Input</h2>
              <textarea
                className="w-full h-40 p-3 border rounded-lg font-mono text-sm"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>

            <div>
              <h2 className="font-semibold mb-2">Output</h2>
              <pre className="w-full h-40 p-3 bg-gray-900 text-green-400 rounded-lg overflow-auto">
                {output || "⚙️ Output will appear here..."}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
