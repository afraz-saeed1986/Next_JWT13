import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then((res) => {
      if (res.status === 200) {
        router.replace("/dashboard");
      }
    });
  }, []);

  const signIn = async (e) => {
    e.preventDefault();
    setError("");
    if (!identifier || !password) {
      setError("لطفاً همه فیلدها را پر کنید");
      return;
    }
    setBusy(true);
    try {
      const user = { identifier, password };
      const res = await fetch("api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (res.status === 200) {
        setIdentifier("");
        setPassword("");
        alert("Logged In Successfully :))");
        setBusy(false);

        router.replace("/dashboard");
      } else if (res.status === 404) {
        alert("User Not Fount !!");
        setBusy(false);
      } else if (res.status === 422) {
        alert("username or password is not correct !!");
        setBusy(false);
      } else if (res.status === 500) {
        alert("The server Error Occured. Please try again !!");
        setBusy(false);
      }

      // login(email, password);
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
          <span className="logo-wordmark">JWT LOGIN</span>
        </div>

        <h1 className="auth-heading">ورود به حساب</h1>
        <p className="auth-sub">خوشحالیم که برگشتی! اطلاعاتت رو وارد کن</p>

        {error && (
          <div className="error-banner">
            <span>⚠</span> {error}
          </div>
        )}

        <form>
          <div className="field">
            <label className="field-label">آدرس ایمیل | نام کاربری</label>
            <input
              type="text"
              className="field-input"
              placeholder="example@email.com|example username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              dir="ltr"
              // autoComplete="email/username"
            />
          </div>

          <div className="field">
            <label className="field-label">رمز عبور</label>
            <input
              type="password"
              className="field-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              dir="ltr"
              // autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginTop: 8 }}
            disabled={busy}
            onClick={signIn}
          >
            {busy ? (
              <>
                <span className="spin" /> در حال ورود...
              </>
            ) : (
              "◈ ورود به حساب"
            )}
          </button>
        </form>

        <div className="auth-footer-link">
          حساب ندارید؟ <Link href="/register">همین الان ثبت‌نام کنید</Link>
        </div>
        <Link href="/" className="back-link">
          ← بازگشت به خانه
        </Link>
      </div>
    </div>
  );
}
