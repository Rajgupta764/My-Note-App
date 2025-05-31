import Note from "../models/Note.js";

export const getNotes = async (req, res) => {
  const notes = await Note.find({ user: req.user }).sort({ createdAt: -1 });
  res.json(notes);
};

export const createNote = async (req, res) => {
  const { title, content } = req.body;
  const note = await Note.create({ user: req.user, title, content });
  res.status(201).json(note);
};

export const updateNote = async (req, res) => {
  const { title, content } = req.body;
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.user },
    { title, content },
    { new: true }
  );
  if (!note) return res.status(404).json({ message: "Note not found" });
  res.json(note);
};

export const deleteNote = async (req, res) => {
  const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user });
  if (!note) return res.status(404).json({ message: "Note not found" });
  res.json({ message: "Note deleted" });
};
