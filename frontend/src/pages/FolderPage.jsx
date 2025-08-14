import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaFolderPlus,
  FaFolder,
  FaRegFolderOpen,
  FaStickyNote,
  FaPlusCircle,
} from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useNavigate } from "react-router";

const FolderPage = () => {
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [openFolderId, setOpenFolderId] = useState(null);
  const [noteContent, setNoteContent] = useState("");
  const [markdownPreview, setMarkdownPreview] = useState("");
  const [noteTitle, setNoteTitle] = useState(""); // NEW: for note title
  const [showNoteModal, setShowNoteModal] = useState(false); // NEW: for modal
  const [selectedNote, setSelectedNote] = useState(null); // NEW: for modal
  //const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Fetch folders on mounts
  useEffect(() => {
    if (!token) {
      setFolders([]); // Clear folders if not logged in
      navigate("/login");
      return;
    }
    const fetchFolders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/folders", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = Array.isArray(res.data) ? res.data : [];
        setFolders(data);
      } catch (err) {
        console.error("Error fetching folders:", err);
        setFolders([]); // fallback
      }
    };
    fetchFolders();
  }, [token, navigate]);
  
  // Add a new folder to DB
  const addFolder = async () => {
    if (newFolderName.trim() === "") return;
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to create a folder.");
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:5000/api/folders",
        { name: newFolderName.trim() }, // REMOVE userId from here!
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFolders([...folders, res.data]);
      setNewFolderName("");
    } catch (err) {
      console.error("Error adding folder:", err);
    }
  };

  // Save note to DB
  const saveNote = async (folderId) => {
    if (!noteContent.trim()) return;
    try {
      await axios.post("http://localhost:5000/api/notes", {
        title: noteTitle.trim(),
        content: noteContent,
        folderId: folderId,
      });
      alert("Note saved!");
      setNoteContent("");
      setNoteTitle("");
      setMarkdownPreview("");
      // Refresh folders to show new note, with Authorization header
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/folders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFolders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error saving note:", err);
    }
  };

  // Show note modal
  const handleShowNote = (note) => {
    setSelectedNote(note);
    setShowNoteModal(true);
  };

  // Close note modal
  const handleCloseModal = () => {
    setShowNoteModal(false);
    setSelectedNote(null);
  };

  return (
    <div className="lg:ml-auto bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white min-h-screen flex flex-col">
      {/* Header */}
      <section className="w-full py-16 text-center px-4 sm:px-6 md:px-12 lg:px-20">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-300 to-yellow-300">
          <FaFolder className="inline mr-2 text-yellow-300" />
          Your Study Folders
        </h1>
        <p className="text-lg text-white/70 max-w-2xl mx-auto">
          Organize all your study materials and AI responses in one place.
        </p>
      </section>

      {/* Add Folder */}
      <section className="px-6 sm:px-10 md:px-20 mb-10 flex flex-col sm:flex-row justify-center items-center gap-4">
        <input
          type="text"
          placeholder="New Folder Name"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          className="input input-bordered input-accent w-full max-w-md bg-[#1e1b4b] text-white placeholder-white/70"
        />
        <button
          onClick={addFolder}
          className="btn btn-accent flex items-center justify-center flex-grow max-w-xs"
          disabled={newFolderName.trim() === ""}
        >
          <FaFolderPlus className="mr-2" /> Add Folder
        </button>
      </section>

      {/* Folder Display */}
      <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-6 sm:px-10 md:px-20 flex-grow">
        {Array.isArray(folders) && folders.length > 0 ? (
          folders.map((folder, i) => (
            <div
              key={folder.id}
              className="glass-card p-6 border border-white/20 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <FaRegFolderOpen className="text-yellow-400 text-2xl" />
                <h3 className="font-semibold text-xl">{folder.name}</h3>
              </div>
              <p className="text-sm text-white/70 mt-2">
                {folder.notes?.length || 0}{" "}
                {folder.notes?.length === 1 ? "note" : "notes"}
              </p>

              {/* Notes as cards */}
              {folder.notes && folder.notes.length > 0 && (
                <div className="grid grid-cols-1 gap-3 mt-4 h-auto w-auto">
                  {folder.notes.map((note) => (
                    <div
                      key={note.id}
                      className="bg-[#23234a] rounded-lg p-4 shadow cursor-pointer hover:bg-[#35357a] transition"
                      onClick={() => handleShowNote(note)}
                    >
                      <div className="text-white/60 truncate">
                        {note.content.slice(0, 60)}...
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 flex gap-3">
                <button
                  className="btn btn-sm btn-outline btn-accent flex items-center flex-grow justify-center"
                  onClick={() =>
                    setOpenFolderId(i === openFolderId ? null : i)
                  }
                >
                  <FaPlusCircle className="mr-2" /> Add Note
                </button>
              </div>

              {openFolderId === i && (
                <div className="mt-6">
                  <textarea
                    value={noteContent}
                    onChange={(e) => {
                      setNoteContent(e.target.value);
                      setMarkdownPreview(e.target.value);
                    }}
                    placeholder="Paste Ask-AI content here..."
                    className="w-full min-h-[150px] rounded-lg p-4 bg-[#1e1b4b] text-white placeholder-white/60 resize-y overflow-auto break-words"
                  />
                  <button
                    onClick={() => saveNote(folder.id)}
                    className="btn btn-accent mt-4"
                    disabled={!noteContent.trim()}
                  >
                    Save Note to DB
                  </button>
                  <div className="mt-6 p-4 rounded-lg bg-[#2d2a55] border border-white/10 max-w-full overflow-x-auto">
                    <h4 className="text-white/70 font-semibold mb-2">
                      Markdown Preview:
                    </h4>
                    <div className="prose prose-invert max-w-none break-words">
                      <ReactMarkdown>{markdownPreview}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-white/50 col-span-full flex items-center justify-center gap-2 py-20">
            <FaStickyNote className="text-xl" />
            No folders created yet. Start by adding a new folder above.
          </p>
        )}
      </section>

      {/* Note Modal */}
        {showNoteModal && selectedNote && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            onClick={handleCloseModal}
          >
            <div
              className="bg-[#23234a] rounded-lg p-6 max-w-xl w-full shadow-lg"
              style={{ maxHeight: "80vh" }} // limit modal height
              onClick={(e) => e.stopPropagation()}
            >
              <div className="overflow-y-auto" style={{ maxHeight: "60vh" }}>
                <div className="prose prose-invert max-w-none mb-4">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {selectedNote.content}
                  </ReactMarkdown>
                </div>
              </div>
              <button
                className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        )}

      {/* Footer */}
      <footer className="text-center text-white/30 py-6 text-sm mt-auto">
        Built with ❤️ using DaisyUI + TailwindCSS · © 2025 StudyAI
      </footer>
    </div>
  );
};

export default FolderPage;