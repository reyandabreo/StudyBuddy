import { Routes, Route } from "react-router";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import AskAI from "../pages/AskAI";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/NotFound";
import FoldersPage from "../pages/FolderPage";
import SavedFolders from "../pages/SavedFolders";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/ask-ai" element={<AskAI />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/saved" element={<SavedFolders />} />
      <Route path="/folders" element={<FoldersPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
