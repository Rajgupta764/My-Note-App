import { useEffect, useState } from "react";
import { getNotes, deleteNote, createNote, updateNote } from "../api/notes";
import { toast } from "react-toastify";
import NoteCard from "../components/NoteCard";
import { FiPlus } from "react-icons/fi";

// Format date helper
const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleString(undefined, options);
};

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false); // start false to avoid initial spinner flicker
  const [showModal, setShowModal] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [editId, setEditId] = useState(null);

  // Load notes from localStorage immediately on mount
  useEffect(() => {
    const cachedNotes = localStorage.getItem("notes");
    if (cachedNotes) {
      try {
        const parsedNotes = JSON.parse(cachedNotes);
        setNotes(parsedNotes);
      } catch {
        localStorage.removeItem("notes");
      }
    }
    // Fetch fresh notes from backend after loading cached notes
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      let data = await getNotes();
      if (!Array.isArray(data)) data = [];

      // Sort notes by creation date descending
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setNotes(data);
      localStorage.setItem("notes", JSON.stringify(data)); // cache notes
    } catch (err) {
      console.error("Error loading notes:", err);
      toast.error("Failed to load notes");
      setNotes([]);
      localStorage.removeItem("notes");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNote(id);
      toast.success("Note deleted!");
      loadNotes();
    } catch (err) {
      toast.error("Failed to delete note.");
    }
  };

  const openNewNoteModal = () => {
    setNewNote({ title: "", content: "" });
    setEditId(null);
    setShowModal(true);
  };

  const openEditModal = (note) => {
    setNewNote({ title: note.title, content: note.content });
    setEditId(note._id);
    setShowModal(true);
  };

  const handleSaveNote = async () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      toast.error("Please fill in both title and description.");
      return;
    }

    try {
      if (editId) {
        await updateNote(editId, newNote);
        toast.success("Note updated!");
      } else {
        await createNote(newNote);
        toast.success("Note created!");
      }
      setShowModal(false);
      setNewNote({ title: "", content: "" });
      setEditId(null);
      loadNotes();
    } catch (err) {
      console.error("Failed to save note:", err);
      toast.error("Failed to save note.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-8 relative">
      <h1 className="text-4xl font-extrabold text-indigo-700 mb-8 text-center md:text-left">
        Your Notes
      </h1>

      {/* Show spinner only if loading and no notes are currently shown */}
      {loading && notes.length === 0 ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600"></div>
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <p className="text-xl mb-4">You have no notes yet.</p>
          <p className="text-sm">Start by creating a new note to organize your thoughts!</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {notes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onDelete={handleDelete}
              onEdit={openEditModal}
              formatDate={formatDate}
            />
          ))}
        </div>
      )}

      <button
        onClick={openNewNoteModal}
        className="fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transition transform hover:scale-110 flex items-center justify-center"
        aria-label="Create new note"
        title="Create new note"
      >
        <FiPlus size={24} />
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 animate-gradient-bg"
            style={{
              background:
                "linear-gradient(270deg, #667eea, #764ba2, #6b8dd6, #b4aee8)",
              backgroundSize: "800% 800%",
              filter: "blur(50px)",
              opacity: 0.3,
              zIndex: -1,
            }}
          />
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md space-y-6 border border-gray-200 relative z-10">
            <h2 className="text-2xl font-bold text-indigo-700">
              {editId ? "Edit Note" : "Create a Note"}
            </h2>
            <input
              type="text"
              placeholder="Note title"
              value={newNote.title}
              onChange={(e) =>
                setNewNote({ ...newNote, title: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            <textarea
              placeholder="Note description"
              value={newNote.content}
              onChange={(e) =>
                setNewNote({ ...newNote, content: e.target.value })
              }
              className="w-full p-3 h-28 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-400">{newNote.content.length} characters</p>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setNewNote({ title: "", content: "" });
                    setEditId(null);
                  }}
                  className="px-5 py-2 rounded-lg text-gray-600 hover:text-gray-900 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNote}
                  className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  {editId ? "Update Note" : "Save Note"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes gradientBackground {
          0% {background-position:0% 50%}
          50% {background-position:100% 50%}
          100% {background-position:0% 50%}
        }
        .animate-gradient-bg {
          animation: gradientBackground 15s ease infinite;
          background-size: 800% 800%;
        }
      `}</style>
    </div>
  );
}
