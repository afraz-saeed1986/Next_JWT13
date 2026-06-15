import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function RegisterPage() {
  const router = useRouter();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  //   useEffect(() => {
  //     if (!loading && user) router.replace("/dashboard");
  //   }, [user, loading]);

  const signup = async (e) => {
    e.preventDefault();
    setError("");

    if (!firstname || !lastname || !username || !email || !password) {
      setError("لطفاً همه فیلدها را پر کنید");
      return;
    }
    if (password.length < 6) {
      setError("رمز عبور باید حداقل ۶ کاراکتر باشد");
      return;
    }

    setBusy(true);
    try {
      const user = { firstname, lastname, username, email, password };

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (res.status === 201) {
        setFirstname("");
        setLastname("");
        setUsername("");
        setEmail("");
        setPassword("");

        setBusy(false);

        alert("Registered Successfully :))");
        router.replace("/dashboard");
      } else if (res.status === 422) {
        alert("This username or email exist already !!");
        setBusy(false);
      }
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  //   if (loading)
  //     return (
  //       <div className="loading-page">
  //         <div className="loader" />
  //       </div>
  //     );

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo-row">
          <div className="logo-gem">✦</div>
          <span className="logo-wordmark">JWT REGISTER</span>
        </div>

        <h1 className="auth-heading">ایجاد حساب جدید</h1>
        <p className="auth-sub">به خانواده Nova بپیوند — رایگان و سریع</p>

        {error && (
          <div className="error-banner">
            <span>⚠</span> {error}
          </div>
        )}

        <form>
          <div className="field">
            <label className="field-label">نام</label>
            <input
              type="text"
              className="field-input"
              placeholder="علی"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              autoComplete="name"
            />
          </div>

          <div className="field">
            <label className="field-label">نام خانوادگی</label>
            <input
              type="text"
              className="field-input"
              placeholder="احمدی"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              autoComplete="name"
            />
          </div>

          <div className="field">
            <label className="field-label">نام کاربری</label>
            <input
              type="text"
              className="field-input"
              placeholder="ali.ahmadi"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              dir="ltr"
              autoComplete="name"
            />
          </div>

          <div className="field">
            <label className="field-label">آدرس ایمیل</label>
            <input
              type="email"
              className="field-input"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              dir="ltr"
              autoComplete="email"
            />
          </div>

          <div className="field">
            <label className="field-label">رمز عبور</label>
            <input
              type="password"
              className="field-input"
              placeholder="حداقل ۶ کاراکتر"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              dir="ltr"
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginTop: 8 }}
            disabled={busy}
            onClick={signup}
          >
            {busy ? (
              <>
                <span className="spin" /> در حال ثبت‌نام...
              </>
            ) : (
              "◉ ایجاد حساب"
            )}
          </button>
        </form>

        <div className="auth-footer-link">
          قبلاً ثبت‌نام کرده‌اید؟ <Link href="/login">وارد شوید</Link>
        </div>
        <Link href="/" className="back-link">
          ← بازگشت به خانه
        </Link>
      </div>
    </div>
  );
}
