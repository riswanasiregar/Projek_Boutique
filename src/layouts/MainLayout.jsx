import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function MainLayout() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex min-h-screen" style={{ background: "#f5f0eb" }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onSearch={setSearchQuery} />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet context={{ searchQuery }} />
        </main>
      </div>
    </div>
  );
}
