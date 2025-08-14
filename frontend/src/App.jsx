import AppRoutes from "./router";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="flex">
      <div className="w-full">
        <Navbar />
        {/* Page content goes here */}
        <AppRoutes />
      </div>
    </div>
  );
}

export default App;
