import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result.error) {
      setError("Sai tên đăng nhập hoặc mật khẩu");
    } else {
      router.push("/");
    }
  };

  return (
    <main className="page-shell">
      <section className="login-card">
        <div className="card-header">
          <span className="icon">🔐</span>
          <div>
            <p className="eyebrow eyebrow-card">NextAuth Exercise</p>
            <h2>Đăng Nhập</h2>
            <p className="subcopy">Nhập tài khoản demo để vào dashboard.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <label>
            <span>Username</span>
            <input
              type="text"
              placeholder="student hoặc advisor"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              placeholder="123456"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>

          {error && <p className="error-box">{error}</p>}

          <button type="submit">Đăng Nhập</button>
        </form>

        <div className="divider" />

        <div className="demo-box">
          <p className="demo-title">Demo Credentials</p>
          <div className="credential-row">
            <span>Student</span>
            <code>student / 123456</code>
          </div>
          <div className="credential-row">
            <span>Advisor</span>
            <code>advisor / 123456</code>
          </div>
        </div>
      </section>

      <style jsx>{`
        .page-shell {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 40px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .login-card {
          width: min(520px, 100%);
          padding: 32px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.93);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          overflow: hidden;
        }

        .card-header {
          display: flex;
          gap: 16px;
          align-items: center;
          margin-bottom: 28px;
        }

        .icon {
          width: 58px;
          height: 58px;
          display: grid;
          place-items: center;
          border-radius: 18px;
          background: linear-gradient(145deg, #f0e7d6, #ffffff);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
          font-size: 1.8rem;
          flex: 0 0 auto;
        }

        .eyebrow {
          margin: 0 0 6px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-size: 0.75rem;
          color: var(--muted);
          font-weight: 800;
        }

        .eyebrow-card {
          color: var(--muted);
        }

        h2 {
          margin: 0;
          font-size: clamp(2rem, 4vw, 2.8rem);
          line-height: 1.05;
          color: var(--primary-deep);
        }

        .subcopy {
          margin: 10px 0 0;
          color: var(--muted);
          line-height: 1.6;
        }

        .login-form {
          display: grid;
          gap: 16px;
        }

        .login-form label {
          display: grid;
          gap: 8px;
          font-size: 0.94rem;
          font-weight: 700;
          color: var(--primary-deep);
        }

        .login-form input {
          width: 100%;
          border: 1px solid rgba(32, 58, 79, 0.16);
          background: rgba(255, 255, 255, 0.92);
          border-radius: 16px;
          padding: 16px 18px;
          outline: none;
          color: var(--text);
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            transform 0.2s ease;
        }

        .login-form input::placeholder {
          color: #9096a1;
        }

        .login-form input:focus {
          border-color: rgba(32, 58, 79, 0.4);
          box-shadow: 0 0 0 4px rgba(32, 58, 79, 0.12);
          transform: translateY(-1px);
        }

        .error-box {
          margin: -4px 0 0;
          padding: 12px 14px;
          border-radius: 14px;
          background: rgba(179, 67, 67, 0.12);
          border: 1px solid rgba(179, 67, 67, 0.22);
          color: var(--danger);
          font-weight: 700;
        }

        .login-form button {
          margin-top: 6px;
          border: none;
          border-radius: 16px;
          padding: 16px 18px;
          background: linear-gradient(
            135deg,
            var(--primary),
            var(--primary-deep)
          );
          color: white;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 14px 30px rgba(16, 33, 46, 0.22);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            opacity 0.2s ease;
        }

        .login-form button:hover {
          transform: translateY(-1px);
          box-shadow: 0 18px 36px rgba(16, 33, 46, 0.26);
        }

        .divider {
          height: 1px;
          margin: 28px 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(32, 58, 79, 0.18),
            transparent
          );
        }

        .demo-title {
          margin: 0 0 14px;
          font-weight: 800;
          color: var(--primary-deep);
        }

        .credential-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 12px 0;
          border-top: 1px solid rgba(32, 58, 79, 0.08);
          color: var(--muted);
        }

        .credential-row:first-of-type {
          border-top: none;
        }

        .credential-row code {
          padding: 8px 10px;
          border-radius: 10px;
          background: rgba(32, 58, 79, 0.08);
          color: var(--primary-deep);
        }

        @media (max-width: 640px) {
          .page-shell {
            padding: 18px;
          }

          .login-card {
            width: 100%;
            padding: 22px;
            border-radius: 22px;
          }

          .card-header {
            align-items: flex-start;
          }

          .credential-row {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </main>
  );
}
