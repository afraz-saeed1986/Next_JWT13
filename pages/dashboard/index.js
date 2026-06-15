import userModel from "@/models/User";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { redirect } from "next/dist/server/api-utils";
import { verifyToken } from "@/utils/auth";
import connectToDB from "@/configs/db";

const STATS = [
  {
    icon: "⬡",
    label: "پروژه‌های فعال",
    value: "12",
    trend: "↑ ۳ نسبت به ماه قبل",
    cls: "ic-purple",
  },
  {
    icon: "✓",
    label: "وظایف انجام‌شده",
    value: "84",
    trend: "↑ ۱۲٪ این هفته",
    cls: "ic-green",
  },
  {
    icon: "◎",
    label: "اعضای تیم",
    value: "7",
    trend: "+ ۱ عضو جدید",
    cls: "ic-blue",
  },
  {
    icon: "★",
    label: "امتیاز عملکرد",
    value: "96",
    trend: "بالاتر از میانگین",
    cls: "ic-orange",
  },
];

const ACTIVITIES = [
  { color: "#6366f1", text: "پروژه Nova UI آپدیت شد", time: "۵ دقیقه پیش" },
  {
    color: "#10b981",
    text: "وظیفه طراحی داشبورد تکمیل شد",
    time: "۱ ساعت پیش",
  },
  { color: "#f59e0b", text: "جلسه تیم برنامه‌ریزی شد", time: "۳ ساعت پیش" },
  { color: "#38bdf8", text: "گزارش ماهانه آماده شد", time: "دیروز" },
  { color: "#ec4899", text: "عضو جدید به تیم اضافه شد", time: "۲ روز پیش" },
];

const QUICK = [
  { icon: "＋", label: "پروژه جدید" },
  { icon: "✎", label: "ایجاد وظیفه" },
  { icon: "⤷", label: "دعوت از همکار" },
  { icon: "⊞", label: "مشاهده گزارش‌ها" },
  { icon: "⚙", label: "تنظیمات حساب" },
];

export default function DashboardPage({ user }) {
  console.log("User:", user);

  const router = useRouter();

  // useEffect(() => {
  //   if (!loading && !user) router.replace("/login");
  // }, [user, loading]);

  // if (loading || !user) {
  //   return (
  //     <div className="loading-page">
  //       <div className="loader" />
  //     </div>
  //   );
  // }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "صبح بخیر" : hour < 17 ? "ظهر بخیر" : "عصر بخیر";

  return (
    <Layout title="داشبورد" user={user}>
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">
          {greeting}، {user.firstname + " " + user.lastname || "کاربر"} 👋
        </h1>
        <p className="page-sub">خلاصه‌ای از فعالیت‌های اخیر شما</p>
      </div>

      {/* Stats */}
      <div className="stats-row">
        {STATS.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className={`stat-icon-wrap ${s.cls}`}>{s.icon}</div>
            <div>
              <div className="stat-num">{s.value}</div>
              <div className="stat-lbl">{s.label}</div>
              <div className="stat-trend">{s.trend}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="dash-grid">
        {/* Activity */}
        <div className="card">
          <div className="card-title">
            <span className="card-title-dot" />
            فعالیت‌های اخیر
          </div>
          <div className="activity-list">
            {ACTIVITIES.map((a, i) => (
              <div className="activity-row" key={i}>
                <div
                  className="act-dot"
                  style={{
                    background: a.color,
                    boxShadow: `0 0 6px ${a.color}`,
                  }}
                />
                <div>
                  <div className="act-text">{a.text}</div>
                  <div className="act-time">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="card">
          <div className="card-title">
            <span
              className="card-title-dot"
              style={{ background: "var(--violet)" }}
            />
            دسترسی سریع
          </div>
          <div className="quick-list">
            {QUICK.map((q) => (
              <button className="quick-btn" key={q.label}>
                <span className="quick-icon">{q.icon}</span>
                {q.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { token } = context.req.cookies;
  connectToDB();
  if (!token) {
    return {
      redirect: {
        destination: "/login",
      },
    };
  }

  const tokenPayload = verifyToken(token);

  if (!tokenPayload) {
    return {
      redirect: {
        destination: "/login",
      },
    };
  }

  const user = await userModel.findOne(
    {
      email: tokenPayload.email,
    },
    "firstname lastname role",
  );

  return {
    props: { user: JSON.parse(JSON.stringify(user)) },
  };
}
