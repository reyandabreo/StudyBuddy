import { useState, useEffect } from "react";
import { FaSave, FaInbox } from "react-icons/fa";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { useNavigate } from "react-router";
import mermaid from "mermaid";

export default function SavedFolders() {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedFolderId, setExpandedFolderId] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setFolders([]);
      navigate("/login");
      return;
    }

    const fetchFolders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/folders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFolders(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching folders:", err);
        setFolders([]);
      }
      setLoading(false);
    };
    fetchFolders();
  }, [token, navigate]);

  useEffect(() => {
    // Render Mermaid diagrams when component updates
    mermaid.initialize({ startOnLoad: false });
    const renderMermaids = async () => {
      const elements = document.querySelectorAll("pre code.language-mermaid");
      elements.forEach(async (element, index) => {
        try {
          const parent = element.parentElement;
          const graphDefinition = element.textContent;
          const { svg } = await mermaid.render(`mermaid-${index}`, graphDefinition);
          const container = document.createElement("div");
          container.innerHTML = svg;
          parent.replaceWith(container);
        } catch (e) {
          console.error("Mermaid render error", e);
        }
      });
    };
    renderMermaids();
  }, [folders, expandedFolderId]);

  const toggleFolder = (id) => {
    setExpandedFolderId(expandedFolderId === id ? null : id);
  };

  return (
    <div className="lg:ml-auto bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white min-h-screen flex flex-col">
      {/* Header */}
      <section className="w-full py-16 text-center px-4 sm:px-6 md:px-12 lg:px-20">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-300 to-yellow-300">
          <FaSave className="inline mr-2 text-cyan-400" />
          Your Saved Folders
        </h1>
        <p className="text-lg text-white/70 max-w-2xl mx-auto">
          This is where your saved folders will appear. Save folders from the Folder page to access them here anytime.
        </p>
      </section>

      {/* Folder Cards */}
      <section className="flex-grow px-6 sm:px-10 md:px-20 flex flex-col items-center justify-center text-white/60 w-full">
        {loading ? (
          <div>Loading...</div>
        ) : folders.length === 0 ? (
          <>
            <FaInbox className="text-8xl mb-6" />
            <p className="text-xl max-w-md text-center">
              No saved folders yet. When you save folders from the Folder page, they will show up here.
            </p>
          </>
        ) : (
          <div className="w-full max-w-5xl space-y-6">
            {folders.map((folder) => (
              <div
                key={folder.id}
                className="bg-white/10 rounded-xl p-6 shadow-md transition-all duration-300 border border-white/20"
              >
                <button
                  className="text-left w-full flex justify-between items-center"
                  onClick={() => toggleFolder(folder.id)}
                >
                  <h2 className="text-xl font-bold text-purple-200 flex items-center gap-2">
                    <FaSave /> {folder.name}
                  </h2>
                  <span className="text-sm text-white/50">
                    {expandedFolderId === folder.id ? "Hide" : "Show"}
                  </span>
                </button>

                {expandedFolderId === folder.id && (
                  <div className="mt-4 space-y-6">
                    {folder.notes && folder.notes.length > 0 ? (
                      folder.notes.map((note) => (
                        <div
                          key={note.id}
                          className="bg-[#1e1b4b] p-4 rounded-lg border border-white/20"
                        >
                          <div className="prose prose-invert prose-sm sm:prose-base max-w-none">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              rehypePlugins={[rehypeHighlight]}
                              components={{
                                code({ className, children }) {
                                  // Mermaid support
                                  if (className === "language-mermaid") {
                                    return (
                                      <pre>
                                        <code className="language-mermaid">{children}</code>
                                      </pre>
                                    );
                                  }
                                  return (
                                    <pre>
                                      <code className={className}>{children}</code>
                                    </pre>
                                  );
                                },
                              }}
                            >
                              {note.content}
                            </ReactMarkdown>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-white/40">No notes in this folder.</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="text-center text-white/30 py-6 text-sm mt-auto">
        Built with 💜 using DaisyUI + TailwindCSS · © 2025 StudyAI
      </footer>
    </div>
  );
}
