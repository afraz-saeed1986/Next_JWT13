import Link from "next/link";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [user, setUser] = useState(false);

  useEffect(() => {
    const userAuth = async () => {
      const res = await fetch("/api/auth/me");
      if (res.status === 200) {
        const user = await res.json();
        setUser(user.data);
      }
    };

    userAuth();
  }, []);

  return (
    <Layout title="خانه" user={user}>
      <section className="home-hero">
        <div className="hero-glow-left" />

        <div className="hero-badge">
          <span>✦</span>
          پلتفرم مدرن وب
        </div>

        <h1 className="hero-title">
          به <span className="gradient-text">JWT SAMPLE</span> خوش آمدید
          <br />
          آینده دیجیتال شما
        </h1>

        <p className="hero-desc">
          یک پلتفرم سریع، امن و زیبا برای مدیریت پروژه‌ها و تیم‌های شما.
          تجربه‌ای متفاوت با رابط کاربری نسل جدید.
        </p>

        <div className="hero-cta">
          {user ? (
            <>
              <Link href="/dashboard" className="btn btn-primary btn-lg">
                ⬡ رفتن به داشبورد
              </Link>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: 14,
                  color: "var(--text-secondary)",
                }}
              >
                خوش برگشتی، {user.name || user.email} 👋
              </span>
            </>
          ) : (
            <>
              <Link href="/register" className="btn btn-primary btn-lg">
                ◉ شروع کنید — رایگان
              </Link>
              <Link href="/login" className="btn btn-outline btn-lg">
                ورود به حساب
              </Link>
            </>
          )}
        </div>

        <div className="hero-pills">
          {[
            "⚡ بسیار سریع",
            "🔒 امنیت بالا",
            "📱 ریسپانسیو",
            "✨ طراحی مدرن",
          ].map((f) => (
            <span className="pill" key={f}>
              {f}
            </span>
          ))}
        </div>
      </section>
    </Layout>
  );
}
