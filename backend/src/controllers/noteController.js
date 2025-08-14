import {PrismaClient}  from "../generated/prisma/client.js";

const prisma = new PrismaClient();

export const getNotesByFolder = async (req, res) => {
  const { folderId } = req.params;
  const notes = await prisma.note.findMany({
    where: { folderId: parseInt(folderId) },
  });
  res.json(notes);
};

export const createNote = async (req, res) => {
  const { content, folderId } = req.body;
  const note = await prisma.note.create({
    data: {
      content,
      folder: { connect: { id: parseInt(folderId) } },
    },
  });
  res.status(201).json(note);
};

export const deleteNote = async (req, res) => {
  const { id } = req.params;
  await prisma.note.delete({ where: { id: parseInt(id) } });
  res.sendStatus(204);
};
