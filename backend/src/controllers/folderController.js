import { PrismaClient } from "../generated/prisma/client.js";
const prisma = new PrismaClient();

export const getAllFolders = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const folders = await prisma.folder.findMany({
    where: { userId },
    include: { notes: true }
  });
  res.json(folders);
};

export const createFolder = async (req, res) => {
  const { name } = req.body;
  const userId = req.user?.id;

  if (!name || !userId) {
    return res.status(400).json({ error: "Name and authenticated user required" });
  }

  const folder = await prisma.folder.create({
    data: {
      name,
      userId,
    },
  });

  res.status(201).json(folder);
};

export const deleteFolder = async (req, res) => {
  const { id } = req.params;
  await prisma.note.deleteMany({ where: { folderId: parseInt(id) } });
  await prisma.folder.delete({ where: { id: parseInt(id) } });
  res.sendStatus(204);
};
