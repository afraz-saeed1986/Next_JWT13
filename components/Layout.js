import { useState } from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children, title = "Nova", user }) {
  console.log("HomePage To Layout =>", user);

  const [open, setOpen] = useState(false);

  return (
    <div className="shell">
      <Sidebar isOpen={open} onClose={() => setOpen(false)} user={user} />

      <div className="main">
        {/* ── Topbar ── */}
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="hamburger"
              onClick={() => setOpen(true)}
              aria-label="باز کردن منو"
            >
              ☰
            </button>
            <span className="topbar-title">{title}</span>
          </div>

          <div className="topbar-right">
            <div className="icon-btn" title="اعلان‌ها">
              🔔
            </div>
            <div className="icon-btn" title="تنظیمات">
              ⚙
            </div>
          </div>
        </header>

        {/* ── Content ── */}
        <main className="page-body">{children}</main>
      </div>
    </div>
  );
}
