import { Link } from 'react-router';
import {
  FaRobot, FaFolderPlus, FaChartPie,
  FaBookReader, FaCloudDownloadAlt, FaProjectDiagram
} from 'react-icons/fa';

export default function Home() {
  return (
    <div className="lg:ml-auto bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white min-h-screen">
      
      {/* Hero Section */}
      <section className="w-full py-20 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-300 to-yellow-300">
          Empower Your Study Journey with <span className="underline underline-offset-4">StudyAI</span>
        </h1>
        <p className="text-lg text-white/70 max-w-2xl mx-auto">
          “The beautiful thing about learning is that nobody can take it away from you.” – B.B. King
        </p>
      </section>

      {/* Features Section - First Set */}
      <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-6 md:px-12 lg:px-20 mb-16">
        <FeatureCard
          icon={<FaRobot className="text-4xl text-purple-400" />}
          title="Ask AI Anything"
          desc="Detailed answers with real-life examples, comparisons, and visuals."
          link="/ask-ai"
          btn="Explore"
        />
        <FeatureCard
          icon={<FaFolderPlus className="text-4xl text-yellow-300" />}
          title="Folder Organization"
          desc="Store, manage, and revisit your study responses easily."
          link="/folders"
          btn="Organize"
        />
        <FeatureCard
          icon={<FaChartPie className="text-4xl text-pink-400" />}
          title="Activity Insights"
          desc="Track your usage, sessions, and progress visually."
          link="/dashboard"
          btn="View"
        />
      </section>

      {/* More Features - On Scroll */}
      <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-6 md:px-12 lg:px-20 pb-20">
        <FeatureCard
          icon={<FaBookReader className="text-4xl text-green-300" />}
          title="Saved Resources"
          desc="Get back to any previous response anytime."
          link="/saved"
          btn="Open"
        />
        <FeatureCard
          icon={<FaProjectDiagram className="text-4xl text-indigo-300" />}
          title="AI Diagrams"
          desc="Get flowcharts and diagrams generated automatically."
          link="/ask-ai"
          btn="Generate"
        />
        <FeatureCard
          icon={<FaCloudDownloadAlt className="text-4xl text-cyan-300" />}
          title="Export Options"
          desc="Download your sessions as PDF or Markdown."
          link="/export"
          btn="Download"
        />
      </section>

      {/* Footer */}
      <div className="text-center text-white/30 py-6 text-sm">
        Built with 💜 using DaisyUI + TailwindCSS · © 2025 StudyAI
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc, link, btn }) {
  return (
    <div className="flex flex-col justify-between items-start h-full bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-purple-400/60 hover:shadow-xl transition-all duration-300 ease-in-out">
      <div>
        <div className="mb-4">{icon}</div>
        <h3 className="font-semibold text-xl mb-2 text-white">{title}</h3>
        <p className="text-sm text-white/70 mb-4">{desc}</p>
      </div>
      <Link
        to={link}
        className="btn btn-sm btn-outline border-purple-400 text-purple-300 hover:bg-purple-600 hover:text-white transition"
      >
        {btn}
      </Link>
    </div>
  );
}
