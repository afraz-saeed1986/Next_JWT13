import Link from "next/link";
import { useRouter } from "next/router";

export default function Sidebar({ isOpen, onClose, user }) {
  const router = useRouter();
  console.log("User in Sidebar =>", user);

  const { pathname } = useRouter();

  const active = (path) => pathname === path;

  const handleLogout = async () => {
    const res = await fetch("/api/auth/signout");
    const data = await res.json();

    if (res.status === 200) {
      alert("User Logged Out Successfully :))");
      router.replace("/");
    }

    onClose?.();
  };

  return (
    <>
      {/* dark overlay on mobile */}
      <div
        className={`sidebar-overlay ${isOpen ? "overlay-open" : ""}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        {/* ── Logo ── */}
        <Link href="/" className="sidebar-logo" onClick={onClose}>
          <div className="logo-gem">✦</div>
          <span className="logo-wordmark">JWT LOGIN</span>
        </Link>

        <nav className="sidebar-nav">
          {user ? (
            <>
              <div className="nav-section-label">منوی اصلی</div>
              <Link
                href="/"
                className={`nav-item${active("/") ? " active" : ""}`}
                onClick={onClose}
              >
                <span className="nav-icon">◎</span>
                خانه
              </Link>
              <Link
                href="/dashboard"
                className={`nav-item${active("/dashboard") ? " active" : ""}`}
                onClick={onClose}
              >
                <span className="nav-icon">⬡</span>
                داشبورد
                {active("/dashboard") && <span className="nav-pip" />}
              </Link>
              {user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className={`nav-item${active("/admin") ? " active" : ""}`}
                  onClick={onClose}
                >
                  <span className="nav-icon">⬡</span>
                  پنل ادمین
                  {active("/admin") && <span className="nav-pip" />}
                </Link>
              )}
              <div className="nav-section-label" style={{ marginTop: 20 }}>
                حساب کاربری
              </div>
              <button className="nav-item nav-danger" onClick={handleLogout}>
                <span className="nav-icon">→</span>
                خروج از حساب
              </button>
            </>
          ) : (
            <>
              <div className="nav-section-label">شروع کنید</div>
              <Link
                href="/"
                className={`nav-item${active("/") ? " active" : ""}`}
                onClick={onClose}
              >
                <span className="nav-icon">◎</span>
                خانه
              </Link>
              <Link
                href="/login"
                className={`nav-item${active("/login") ? " active" : ""}`}
                onClick={onClose}
              >
                <span className="nav-icon">◈</span>
                ورود
                {active("/login") && <span className="nav-pip" />}
              </Link>

              <Link
                href="/register"
                className={`nav-item${active("/register") ? " active" : ""}`}
                onClick={onClose}
              >
                <span className="nav-icon">◉</span>
                ثبت‌نام
                {active("/register") && <span className="nav-pip" />}
              </Link>
            </>
          )}
        </nav>

        {/* ── Footer ── */}
        <div className="sidebar-footer">
          {user ? (
            <div className="user-chip">
              <div className="avatar">{user.firstname || user.email}</div>
              <div className="user-meta">
                {/* <div className="user-name">{user.firstname || "کاربر"}</div> */}
                <div className="user-email">{user.email}</div>
              </div>
            </div>
          ) : (
            <p className="guest-hint">برای دسترسی کامل وارد شوید</p>
          )}
        </div>
      </aside>
    </>
  );
}
