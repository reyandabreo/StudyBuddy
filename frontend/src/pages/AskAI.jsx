import { useState } from "react";
import { FaRobot, FaPaperPlane } from "react-icons/fa";
import { MdOutlineContentCopy } from "react-icons/md";
import MermaidRenderer from "../components/MermaidRenderer";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";
import remarkGfm from "remark-gfm";

export default function AskAI() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await response.json();
      setOutput(data.result);
    } catch (err) {
      setOutput("Failed to get response from AI.");
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  // Utility: Extract Mermaid code block
  function extractMermaid(text) {
    const match = text.match(/```mermaid\s*([\s\S]+?)```/i);
    if (!match) return null;

    const code = match[1].trim();
    // Check if it starts with a valid Mermaid keyword
    const validStart = /^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram)/i;
    return validStart.test(code) ? code : null;
  }

  // Utility: Escape problematic Mermaid characters
  function sanitizeMermaid(code) {
    // Wrap [ ... ] labels with problematic chars in quotes
    code = code.replace(/\[([^\]]*[\(\)%][^\]]*)\]/g, (_, label) => {
      const clean = label.replace(/^"|"$/g, "");
      return `["${clean}"]`;
    });
    // Wrap { ... } labels with problematic chars in quotes
    code = code.replace(/\{([^}]*[\(\)%][^}]*)\}/g, (_, label) => {
      const clean = label.replace(/^"|"$/g, "");
      return `{"${clean}"}`;
    });
    return code;
  }

  // Utility: Remove flowchart heading if no code block present
  function stripEmptyMermaidSection(text) {
    return text.replace(
      /(\*\*4\. Flowchart.*?\*\*\s*)(```mermaid\s*[\s\S]+?```)?/i,
      (_, heading, code) => (code ? heading : "")
    ).trim();
  }

  // Utility: Add spacing between sections
  function formatMarkdownSections(text) {
    const spaced = text.replace(/(\d\.\s.+?)(?=\n\d\.)/gs, "$1\n");
    return spaced.replace(/(\*\*\d\..+?\*\*)/g, "\n\n$1\n\n");
  }

// Utility: Normalize Mermaid code for LLM output
function normalizeMermaid(code) {
  // 1. Replace multiple spaces between arrows/nodes with a newline
  let fixed = code.replace(/([^\n;]+?--?>[^\n;]+?)(?= {2,})/g, "$1\n");
  // 2. Replace multiple spaces with a single newline
  fixed = fixed.replace(/ {2,}/g, "\n");
  // 3. Remove unnecessary escapes in node labels
  fixed = fixed.replace(/\\([()\/])/g, "$1");
  // 4. Remove trailing spaces
  fixed = fixed.replace(/[ \t]+$/gm, "");
  return fixed;
}

// ...your other utilities...

// Prepare content
const mermaidRaw = extractMermaid(output);
const mermaidCode = mermaidRaw ? normalizeMermaid(sanitizeMermaid(mermaidRaw)) : null;
const cleanedOutput = formatMarkdownSections(
  stripEmptyMermaidSection(output.replace(/```mermaid\s+[\s\S]+?```/, ""))
);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white flex flex-col py-10 px-4 sm:px-6 md:px-12 transition-all duration-300 lg:ml-auto">
      {/* Header */}
      <section className="text-center mb-10 px-2 sm:px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-300 via-pink-300 to-yellow-300 text-transparent bg-clip-text flex items-center justify-center gap-3 flex-wrap">
          <FaRobot className="text-cyan-400" size={32} />
          Ask StudyAI
        </h1>
        <p className="text-white/70 max-w-2xl mx-auto text-base sm:text-lg px-2">
          Enter your question below and let the AI help you. Perfect for quick explanations, summaries, and insights.
        </p>
      </section>

      {/* Main Interaction */}
      <section className="flex flex-col gap-6 max-w-4xl mx-auto w-full h-full">
        {/* Input */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg">
          <label className="block text-purple-200 font-semibold mb-2">Your Question</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
            placeholder="Ask something like: What is Quantum Computing?"
            className="w-full bg-transparent border border-white/20 rounded-lg px-4 py-3 text-white resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-white/40"
          />
          <button
            onClick={handleAsk}
            className="mt-4 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-600 hover:to-yellow-400 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md transition-all duration-200"
            disabled={loading}
          >
            <FaPaperPlane />
            {loading ? "Thinking..." : "Ask AI"}
          </button>
        </div>

        {/* Output */}
        {output && (
          <div className="relative bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg">
            <label className="block text-purple-200 font-semibold mb-2">AI Response</label>

            {/* Markdown Text Response */}
            <div className="overflow-x-auto">
              <div className="prose prose-invert max-w-none mb-6 break-words
                [&_pre]:overflow-x-auto 
                [&_pre]:whitespace-pre-wrap 
                [&_code]:break-words 
                [&_ul]:pl-4 
                [&_li]:break-words 
                [&_table]:block 
                [&_table]:w-full 
                [&_table]:overflow-x-auto 
                [&_table]:whitespace-nowrap">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {cleanedOutput}
                </ReactMarkdown>
              </div>
            </div>


            {/* Mermaid Diagram */}
           
            {mermaidCode && (
              <div className="bg-[#8c8cc7] rounded-lg p-4 text-white overflow-x-auto max-w-full">
                <h3 className="text-purple-300 font-bold mb-2">Diagram</h3>
                <MermaidRenderer chart={mermaidCode} />
              </div>
            )}
           

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition"
              title="Copy to clipboard"
            >
              <MdOutlineContentCopy size={20} />
            </button>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="text-center text-white/30 text-xs mt-16">
        Powered by 💡 StudyAI · TailwindCSS + DaisyUI · © 2025
      </footer>
    </div>
  );
}
