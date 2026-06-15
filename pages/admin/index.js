import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import connectToDB from "@/configs/db";
import { verifyToken } from "@/utils/auth";
import userModel from "@/models/User";

/* ── Mock Data ── */
const USERS = [
  {
    id: 1,
    name: "علی احمدی",
    email: "ali@example.com",
    role: "admin",
    status: "active",
    joined: "۱۴۰۳/۰۱/۱۵",
    avatar: "ع",
  },
  {
    id: 2,
    name: "سارا محمدی",
    email: "sara@example.com",
    role: "editor",
    status: "active",
    joined: "۱۴۰۳/۰۲/۰۳",
    avatar: "س",
  },
  {
    id: 3,
    name: "رضا کریمی",
    email: "reza@example.com",
    role: "viewer",
    status: "inactive",
    joined: "۱۴۰۳/۰۲/۲۰",
    avatar: "ر",
  },
  {
    id: 4,
    name: "نیلوفر رضایی",
    email: "nilou@example.com",
    role: "editor",
    status: "active",
    joined: "۱۴۰۳/۰۳/۰۷",
    avatar: "ن",
  },
  {
    id: 5,
    name: "کامران شریفی",
    email: "kamran@example.com",
    role: "viewer",
    status: "banned",
    joined: "۱۴۰۳/۰۳/۱۸",
    avatar: "ک",
  },
  {
    id: 6,
    name: "مریم حسینی",
    email: "maryam@example.com",
    role: "editor",
    status: "active",
    joined: "۱۴۰۳/۰۴/۰۲",
    avatar: "م",
  },
];

const OVERVIEW = [
  {
    label: "کل کاربران",
    value: "1,284",
    trend: "+12%",
    trendUp: true,
    icon: "◎",
    cls: "ic-purple",
  },
  {
    label: "کاربران فعال",
    value: "948",
    trend: "+8%",
    trendUp: true,
    icon: "✓",
    cls: "ic-green",
  },
  {
    label: "درآمد ماهانه",
    value: "۴۸.۲M",
    trend: "+23%",
    trendUp: true,
    icon: "＄",
    cls: "ic-blue",
  },
  {
    label: "تیکت‌های باز",
    value: "37",
    trend: "-5%",
    trendUp: false,
    icon: "⚑",
    cls: "ic-orange",
  },
];

const RECENT_ACTIONS = [
  {
    type: "user",
    color: "#6366f1",
    text: "کاربر جدید ثبت‌نام کرد",
    time: "۲ دقیقه پیش",
  },
  {
    type: "success",
    color: "#10b981",
    text: "پرداخت #۴۴۲ تأیید شد",
    time: "۱۸ دقیقه پیش",
  },
  {
    type: "warning",
    color: "#f59e0b",
    text: "سرور backup هشدار منابع داد",
    time: "۴۵ دقیقه پیش",
  },
  {
    type: "danger",
    color: "#f43f5e",
    text: "تلاش ورود ناموفق از IP مشکوک",
    time: "۱ ساعت پیش",
  },
  {
    type: "success",
    color: "#10b981",
    text: "بک‌آپ روزانه با موفقیت انجام شد",
    time: "۲ ساعت پیش",
  },
];

const ROLE_LABEL = { admin: "ادمین", editor: "ویرایشگر", viewer: "بیننده" };
const ROLE_CLASS = {
  admin: "badge-accent",
  editor: "badge-blue",
  viewer: "badge-gray",
};
const STATUS_LABEL = { active: "فعال", inactive: "غیرفعال", banned: "مسدود" };
const STATUS_CLASS = {
  active: "status-active",
  inactive: "status-inactive",
  banned: "status-banned",
};

/* ── Bar Chart (pure CSS/SVG) ── */
const BAR_DATA = [
  { label: "فر", value: 65 },
  { label: "ارد", value: 80 },
  { label: "خر", value: 55 },
  { label: "تیر", value: 90 },
  { label: "مر", value: 72 },
  { label: "شه", value: 88 },
];

function BarChart() {
  const max = Math.max(...BAR_DATA.map((d) => d.value));
  return (
    <div className="bar-chart">
      {BAR_DATA.map((d, i) => (
        <div className="bar-col" key={i}>
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{
                height: `${(d.value / max) * 100}%`,
                animationDelay: `${i * 80}ms`,
              }}
            />
          </div>
          <span className="bar-label">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Donut Chart (SVG) ── */
function DonutChart() {
  const data = [
    { label: "فعال", value: 74, color: "#6366f1" },
    { label: "غیرفعال", value: 16, color: "#f59e0b" },
    { label: "مسدود", value: 10, color: "#f43f5e" },
  ];
  const r = 54,
    cx = 70,
    cy = 70,
    stroke = 18;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="donut-wrap">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="var(--bg-elevated)"
          strokeWidth={stroke}
        />
        {data.map((d, i) => {
          const dash = (d.value / 100) * circ;
          const gap = circ - dash;
          const seg = (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={d.color}
              strokeWidth={stroke}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              style={{
                transform: "rotate(-90deg)",
                transformOrigin: "50% 50%",
                transition: "stroke-dasharray .6s var(--ease)",
              }}
            />
          );
          offset += dash;
          return seg;
        })}
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          fill="var(--text-primary)"
          fontSize="18"
          fontWeight="700"
        >
          74%
        </text>
        <text
          x={cx}
          y={cy + 14}
          textAnchor="middle"
          fill="var(--text-secondary)"
          fontSize="10"
        >
          فعال
        </text>
      </svg>
      <div className="donut-legend">
        {data.map((d) => (
          <div className="donut-legend-item" key={d.label}>
            <span className="donut-dot" style={{ background: d.color }} />
            <span>{d.label}</span>
            <span
              style={{ marginRight: "auto", color: "var(--text-secondary)" }}
            >
              {d.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function AdminPanel({ user }) {
  //   const { user, loading } = useAuth();
  //   const router = useRouter();
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeTab, setActiveTab] = useState("users"); // users | logs | settings

  //   useEffect(() => {
  //     if (!loading && !user) router.replace("/login");
  //   }, [user, loading]);

  //   if (loading || !user) {
  //     return (
  //       <div className="loading-page">
  //         <div className="loader" />
  //       </div>
  //     );
  //   }

  /* filtering */
  const filtered = USERS.filter((u) => {
    const matchSearch = u.name.includes(search) || u.email.includes(search);
    const matchRole = filterRole === "all" || u.role === filterRole;
    const matchStatus = filterStatus === "all" || u.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  /* bulk select */
  const toggleAll = () =>
    setSelectedIds(
      selectedIds.length === filtered.length ? [] : filtered.map((u) => u.id),
    );
  const toggleOne = (id) =>
    setSelectedIds((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id],
    );

  return (
    <Layout title="پنل ادمین" user={user}>
      {/* ── Page Header ── */}
      <div className="ap-header">
        <div>
          <h1 className="page-title">پنل مدیریت</h1>
          <h2 className="page-title">
            {user.firstname} - {user.lastname}
          </h2>
          <p className="page-sub">مدیریت کاربران، نظارت بر سیستم و تنظیمات</p>
        </div>
        <div className="ap-header-actions">
          <button className="btn btn-outline">⤓ خروجی CSV</button>
          <button className="btn btn-primary" style={{ width: "auto" }}>
            ＋ افزودن کاربر
          </button>
        </div>
      </div>

      {/* ── Overview Stats ── */}
      <div className="stats-row" style={{ marginBottom: 24 }}>
        {OVERVIEW.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className={`stat-icon-wrap ${s.cls}`}>{s.icon}</div>
            <div>
              <div className="stat-num">{s.value}</div>
              <div className="stat-lbl">{s.label}</div>
              <div className={`stat-trend ${s.trendUp ? "" : "trend-down"}`}>
                {s.trend} نسبت به ماه گذشته
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="ap-charts-row">
        <div className="card ap-chart-main">
          <div className="card-title">
            <span className="card-title-dot" />
            رشد کاربران ۶ ماه اخیر
          </div>
          <BarChart />
        </div>
        <div className="card ap-chart-side">
          <div className="card-title">
            <span
              className="card-title-dot"
              style={{ background: "var(--violet)" }}
            />
            وضعیت کاربران
          </div>
          <DonutChart />
        </div>
        <div className="card ap-log-card">
          <div className="card-title">
            <span
              className="card-title-dot"
              style={{ background: "var(--warning)" }}
            />
            رویدادهای اخیر
          </div>
          <div className="activity-list">
            {RECENT_ACTIONS.map((a, i) => (
              <div className="activity-row" key={i}>
                <div
                  className="act-dot"
                  style={{
                    background: a.color,
                    boxShadow: `0 0 5px ${a.color}`,
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
      </div>

      {/* ── Tabs ── */}
      <div className="ap-tabs">
        {[
          ["users", "👥 کاربران"],
          ["logs", "📋 لاگ‌ها"],
          ["settings", "⚙ تنظیمات"],
        ].map(([key, label]) => (
          <button
            key={key}
            className={`ap-tab ${activeTab === key ? "ap-tab-active" : ""}`}
            onClick={() => setActiveTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Users Tab ── */}
      {activeTab === "users" && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          {/* Toolbar */}
          <div className="ap-toolbar">
            <div className="ap-search-wrap">
              <span className="ap-search-icon">🔍</span>
              <input
                className="ap-search"
                placeholder="جستجوی نام یا ایمیل..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="ap-filters">
              <select
                className="ap-select"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="all">همه نقش‌ها</option>
                <option value="admin">ادمین</option>
                <option value="editor">ویرایشگر</option>
                <option value="viewer">بیننده</option>
              </select>
              <select
                className="ap-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">همه وضعیت‌ها</option>
                <option value="active">فعال</option>
                <option value="inactive">غیرفعال</option>
                <option value="banned">مسدود</option>
              </select>
            </div>
            {selectedIds.length > 0 && (
              <div className="ap-bulk-actions">
                <span className="ap-selected-count">
                  {selectedIds.length} انتخاب‌شده
                </span>
                <button className="btn-danger-sm">🗑 حذف</button>
                <button className="btn-warning-sm">⊘ مسدود</button>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="ap-table-wrap">
            <table className="ap-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      className="ap-checkbox"
                      checked={
                        selectedIds.length === filtered.length &&
                        filtered.length > 0
                      }
                      onChange={toggleAll}
                    />
                  </th>
                  <th>کاربر</th>
                  <th>نقش</th>
                  <th>وضعیت</th>
                  <th>تاریخ عضویت</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="ap-empty">
                      نتیجه‌ای یافت نشد
                    </td>
                  </tr>
                ) : (
                  filtered.map((u) => (
                    <tr
                      key={u.id}
                      className={
                        selectedIds.includes(u.id) ? "ap-row-selected" : ""
                      }
                    >
                      <td>
                        <input
                          type="checkbox"
                          className="ap-checkbox"
                          checked={selectedIds.includes(u.id)}
                          onChange={() => toggleOne(u.id)}
                        />
                      </td>
                      <td>
                        <div className="ap-user-cell">
                          <div className="ap-avatar">{u.avatar}</div>
                          <div>
                            <div className="ap-user-name">{u.name}</div>
                            <div className="ap-user-email">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${ROLE_CLASS[u.role]}`}>
                          {ROLE_LABEL[u.role]}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`status-dot-label ${STATUS_CLASS[u.status]}`}
                        >
                          <span className="status-led" />
                          {STATUS_LABEL[u.status]}
                        </span>
                      </td>
                      <td className="ap-date">{u.joined}</td>
                      <td>
                        <div className="ap-actions">
                          <button className="ap-icon-btn" title="ویرایش">
                            ✎
                          </button>
                          <button className="ap-icon-btn" title="مشاهده">
                            ◎
                          </button>
                          <button
                            className="ap-icon-btn ap-icon-btn-danger"
                            title="حذف"
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="ap-pagination">
            <span className="ap-page-info">
              نمایش {filtered.length} از {USERS.length} کاربر
            </span>
            <div className="ap-page-btns">
              <button className="ap-page-btn" disabled>
                ‹
              </button>
              <button className="ap-page-btn ap-page-btn-active">۱</button>
              <button className="ap-page-btn">۲</button>
              <button className="ap-page-btn">۳</button>
              <button className="ap-page-btn">›</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Logs Tab ── */}
      {activeTab === "logs" && (
        <div className="card">
          <div className="ap-logs-header">
            <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>
              آخرین رویدادهای سیستم
            </span>
            <button
              className="btn btn-outline"
              style={{ padding: "7px 14px", fontSize: 12 }}
            >
              پاک‌سازی لاگ‌ها
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              {
                level: "INFO",
                msg: "سرویس auth با موفقیت راه‌اندازی شد",
                time: "14:32:01",
              },
              {
                level: "WARN",
                msg: "میزان مصرف CPU به ۸۵٪ رسید",
                time: "14:28:44",
              },
              {
                level: "ERROR",
                msg: "اتصال به دیتابیس پشتیبان قطع شد",
                time: "14:15:22",
              },
              {
                level: "INFO",
                msg: "بک‌آپ روزانه با موفقیت ذخیره شد",
                time: "13:00:00",
              },
              {
                level: "INFO",
                msg: "کاربر ali@example.com وارد شد",
                time: "12:45:10",
              },
              {
                level: "WARN",
                msg: "تلاش ورود ناموفق برای sara@example.com",
                time: "12:30:05",
              },
              {
                level: "INFO",
                msg: "ایمیل تأیید برای کاربر جدید ارسال شد",
                time: "11:58:30",
              },
            ].map((log, i) => (
              <div className="ap-log-row" key={i}>
                <span className={`log-level log-${log.level.toLowerCase()}`}>
                  {log.level}
                </span>
                <span className="log-msg">{log.msg}</span>
                <span className="log-time">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Settings Tab ── */}
      {activeTab === "settings" && (
        <div className="ap-settings-grid">
          {/* General */}
          <div className="card">
            <div className="card-title">
              <span className="card-title-dot" />
              تنظیمات عمومی
            </div>
            <div className="settings-form">
              {[
                { label: "نام سایت", val: "Nova App", type: "text" },
                {
                  label: "ایمیل پشتیبانی",
                  val: "support@nova.io",
                  type: "email",
                },
                { label: "حداکثر کاربر", val: "5000", type: "number" },
              ].map((f) => (
                <div className="field" key={f.label}>
                  <label className="field-label">{f.label}</label>
                  <input
                    className="field-input"
                    type={f.type}
                    defaultValue={f.val}
                  />
                </div>
              ))}
              <button className="btn btn-primary" style={{ marginTop: 8 }}>
                ذخیره تغییرات
              </button>
            </div>
          </div>

          {/* Toggles */}
          <div className="card">
            <div className="card-title">
              <span
                className="card-title-dot"
                style={{ background: "var(--violet)" }}
              />
              ویژگی‌ها
            </div>
            <div className="settings-toggles">
              {[
                {
                  label: "ثبت‌نام آزاد",
                  desc: "کاربران بدون دعوت‌نامه ثبت‌نام کنند",
                  on: true,
                },
                {
                  label: "احراز هویت دوعاملی",
                  desc: "2FA اجباری برای ادمین‌ها",
                  on: true,
                },
                {
                  label: "حالت نگهداری",
                  desc: "سایت برای کاربران غیرفعال شود",
                  on: false,
                },
                {
                  label: "اعلان ایمیل",
                  desc: "ارسال خودکار ایمیل رویدادها",
                  on: true,
                },
              ].map((t, i) => (
                <div className="toggle-row" key={i}>
                  <div>
                    <div className="toggle-label">{t.label}</div>
                    <div className="toggle-desc">{t.desc}</div>
                  </div>
                  <div className={`toggle-switch ${t.on ? "toggle-on" : ""}`}>
                    <div className="toggle-knob" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="card danger-zone-card">
            <div className="card-title" style={{ color: "var(--danger)" }}>
              <span
                className="card-title-dot"
                style={{ background: "var(--danger)" }}
              />
              منطقه خطر
            </div>
            <p
              style={{
                fontSize: 13,
                color: "var(--text-secondary)",
                marginBottom: 16,
                lineHeight: 1.8,
              }}
            >
              این عملیات‌ها برگشت‌پذیر نیستند. با احتیاط اقدام کنید.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button className="btn-danger-full">
                🗑 پاک‌سازی تمام لاگ‌ها
              </button>
              <button className="btn-danger-full">
                ⊘ غیرفعال‌سازی همه کاربران
              </button>
              <button className="btn-danger-full">⚠ ریست کامل سیستم</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

//SSR - Route Protection (Server Side - Client Side)
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

  if (user.role !== "ADMIN") {
    return {
      redirect: {
        destination: "/dashboard",
      },
    };
  }

  return {
    props: { user: JSON.parse(JSON.stringify(user)) },
  };
}
