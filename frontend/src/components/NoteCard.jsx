import { FiEdit2, FiTrash2 } from "react-icons/fi";

export default function NoteCard({ note, onDelete, onEdit, formatDate }) {
  const created = note.createdAt ? formatDate(note.createdAt) : "Unknown date";
  const updated =
    note.updatedAt && note.updatedAt !== note.createdAt
      ? formatDate(note.updatedAt)
      : null;

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col justify-between transition hover:shadow-lg">
      <div>
        <h2 className="text-xl font-semibold text-indigo-700 break-words">
          {note.title || "Untitled Note"}
        </h2>
        <p className="text-gray-700 mt-2 whitespace-pre-wrap break-words">
          {note.content || "No content provided."}
        </p>
      </div>

      <div className="mt-4 text-xs text-gray-400 select-none">
        <p>Created: {created}</p>
        {updated && <p>Updated: {updated}</p>}
        <p>Length: {note.content?.length || 0} chars</p>
      </div>

      <div className="flex justify-end gap-3 mt-5">
        {onEdit && (
          <button
            onClick={() => onEdit(note)}
            className="text-indigo-500 hover:text-indigo-700 transition"
            title="Edit Note"
            aria-label="Edit Note"
          >
            <FiEdit2 className="w-5 h-5" />
          </button>
        )}
        <button
          onClick={() => onDelete(note._id)}
          className="text-red-500 hover:text-red-700 transition"
          title="Delete Note"
          aria-label="Delete Note"
        >
          <FiTrash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
