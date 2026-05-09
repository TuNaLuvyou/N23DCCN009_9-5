import { getSession, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const [classList, setClassList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [secondsUntilExpire, setSecondsUntilExpire] = useState(0);

  useEffect(() => {
    if (!session?.accessTokenExpires) return;

    if (session.error === "RefreshTokenExpired") {
      signOut({ redirect: true, callbackUrl: "/login" });
      return;
    }

    const updateCountdown = () => {
      const secondsLeft = Math.max(
        0,
        Math.ceil((session.accessTokenExpires - Date.now()) / 1000),
      );
      setSecondsUntilExpire(secondsLeft);

      if (secondsLeft === 0) {
        signOut({ redirect: true, callbackUrl: "/login" });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [session?.accessTokenExpires, session]);

  if (status === "loading") {
    return (
      <main className="loading-shell">
        <div className="loading-card">Đang tải dashboard...</div>
        <style jsx>{`
          .loading-shell {
            min-height: 100vh;
            display: grid;
            place-items: center;
            padding: 24px;
          }

          .loading-card {
            padding: 18px 24px;
            border-radius: 18px;
            background: var(--surface-strong);
            border: 1px solid var(--border);
            box-shadow: var(--shadow);
            color: var(--primary-deep);
            font-weight: 700;
          }
        `}</style>
      </main>
    );
  }

  if (!session) return null;

  if (session.user.role !== "ROLE_ADVISOR") {
    return (
      <main className="page-shell">
        <section className="access-denied-card">
          <div className="x-icon">❌</div>
          <p className="eyebrow danger-label">Access denied</p>
          <h1>Bị Từ Chối Truy Cập</h1>
          <p>
            Bạn không có quyền truy cập trang này. Chỉ Cố Vấn (ROLE_ADVISOR) mới
            được phép.
          </p>
          <div className="role-badge">Role của bạn: {session.user.role}</div>
          <button className="danger-button" onClick={() => signOut()}>
            Đăng Xuất
          </button>
        </section>

        <style jsx>{`
          .page-shell {
            min-height: 100vh;
            display: grid;
            place-items: center;
            padding: 32px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }

          .access-denied-card {
            width: min(640px, 100%);
            padding: 40px;
            border-radius: 28px;
            background: #ffe8e8;
            border: 1px solid rgba(211, 47, 47, 0.18);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
            text-align: center;
          }

          .x-icon {
            font-size: 48px;
            color: #d32f2f;
            margin-bottom: 20px;
          }

          .eyebrow {
            margin: 0 0 10px;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            font-size: 0.78rem;
            color: #d32f2f;
            font-weight: 800;
          }

          .danger-label {
            margin-top: 4px;
          }

          h1 {
            margin: 0;
            font-size: clamp(2rem, 4vw, 2.6rem);
            color: #d32f2f;
          }

          p {
            color: var(--muted);
            line-height: 1.7;
          }

          .role-badge {
            display: inline-flex;
            margin: 16px 0 22px;
            padding: 10px 15px;
            border-radius: 999px;
            background: white;
            color: #d32f2f;
            font-weight: 700;
          }

          .danger-button {
            border: none;
            border-radius: 14px;
            padding: 12px 18px;
            background: #d32f2f;
            color: white;
            cursor: pointer;
            width: 100%;
          }
        `}</style>
      </main>
    );
  }

  const handleFetchClassList = async () => {
    setLoading(true);
    try {
      const freshSession = await getSession();

      if (!freshSession?.accessToken) {
        signOut({ redirect: true, callbackUrl: "/login" });
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 800));

      setClassList({
        classes: [
          { id: 1, name: "Lớp A1", students: 30 },
          { id: 2, name: "Lớp A2", students: 28 },
          { id: 3, name: "Lớp A3", students: 32 },
        ],
        accessToken: freshSession.accessToken.substring(0, 20) + "...",
        expiresAt: new Date(freshSession.accessTokenExpires).toLocaleTimeString(
          "vi-VN",
        ),
        timestamp: new Date().toLocaleTimeString("vi-VN"),
      });
    } catch (error) {
      setClassList({ error: "Lỗi khi lấy danh sách lớp" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="dashboard-shell">
      <section className="hero-card">
        <div>
          <p className="eyebrow">Demo: Token Refresh Tự Động</p>
          <h1>Dashboard Cố Vấn</h1>
          <p className="hero-copy">
            Trang này mô phỏng đúng bài tập: xem token, kiểm tra role và bấm lấy
            danh sách lớp để kích hoạt refresh token.
          </p>
        </div>

        <div className="status-row">
          <div className="status-pill">
            <span>👤</span>
            <div>
              <strong>{session.user.username}</strong>
              <p>Người dùng</p>
            </div>
          </div>
          <div className="status-pill">
            <span>🔑</span>
            <div>
              <strong>{session.user.role}</strong>
              <p>Vai trò</p>
            </div>
          </div>
          <div
            className={`status-pill ${secondsUntilExpire <= 10 ? "warning" : ""}`}
          >
            <span>⏱️</span>
            <div>
              <strong>{secondsUntilExpire}s</strong>
              <p>Token còn hạn</p>
            </div>
          </div>
        </div>
      </section>

      <section className="content-grid">
        <div className="panel token-panel">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">Dashboard Cố Vấn</p>
              <h2>Trạng thái phiên đăng nhập</h2>
            </div>
            <button className="ghost-button" onClick={() => signOut()}>
              Đăng Xuất
            </button>
          </div>

          {secondsUntilExpire <= 10 && secondsUntilExpire > 0 && (
            <div className="alert-box">
              ⚠️ Token sắp hết hạn, hệ thống sẽ tự động refresh hoặc đăng xuất
              nếu đã quá hạn.
            </div>
          )}

          {session.error && (
            <div className="alert-box error">
              ❌ Lỗi: {session.error} - Vui lòng đăng nhập lại
            </div>
          )}

          <div className="info-grid">
            <div>
              <span>Access Token hết hạn sau:</span>
              <strong
                className={
                  secondsUntilExpire <= 10 ? "danger-text" : "success-text"
                }
              >
                {secondsUntilExpire}s
              </strong>
            </div>
            <div>
              <span>Thời điểm hết hạn</span>
              <strong>
                {new Date(session.accessTokenExpires).toLocaleTimeString(
                  "vi-VN",
                )}
              </strong>
            </div>
            <div>
              <span>Token hiện tại</span>
              <strong>{session.accessToken.substring(0, 30)}...</strong>
            </div>
          </div>
        </div>

        <div className="panel action-panel">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">Bước 3: Demo Token Hết Hạn</p>
              <h2>Hướng dẫn demo</h2>
            </div>
          </div>

          <ol className="steps-list">
            <li>
              Bấm "Lấy danh sách lớp" khi token còn hạn để thấy phản hồi thành
              công.
            </li>
            <li>
              Đợi tới lúc token gần hết hạn rồi bấm lại để NextAuth tự refresh.
            </li>
            <li>Mở console để xem log "Token hết hạn, đang refresh...".</li>
          </ol>

          <button
            className="primary-button"
            onClick={handleFetchClassList}
            disabled={loading}
          >
            {loading ? "⏳ Đang tải..." : "📋 Lấy danh sách lớp"}
          </button>
        </div>
      </section>

      {classList && (
        <section className="panel result-panel">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">Kết quả</p>
              <h2>Kết quả truy vấn</h2>
            </div>
          </div>

          {classList.error ? (
            <div className="alert-box error">{classList.error}</div>
          ) : (
            <div className="result-grid">
              <div className="result-summary">
                <div>
                  <span>Đồng bộ lúc</span>
                  <strong>{classList.timestamp}</strong>
                </div>
                <div>
                  <span>Token snapshot</span>
                  <strong>{classList.accessToken}</strong>
                </div>
                <div>
                  <span>Token hết hạn</span>
                  <strong>{classList.expiresAt}</strong>
                </div>
              </div>

              <div className="class-list">
                {classList.classes.map((item) => (
                  <div key={item.id} className="class-item">
                    <div>
                      <strong>{item.name}</strong>
                      <p>{item.students} sinh viên</p>
                    </div>
                    <span>#{item.id}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      <style jsx>{`
        .dashboard-shell {
          min-height: 100vh;
          padding: 40px 20px;
          display: grid;
          gap: 24px;
          width: min(1200px, 100%);
          margin: 0 auto;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .hero-card,
        .panel {
          border-radius: 28px;
          border: 1px solid var(--border);
          background: var(--surface-strong);
          box-shadow: var(--shadow);
          backdrop-filter: blur(18px);
        }

        .hero-card {
          padding: 32px;
          background: linear-gradient(
            135deg,
            #2f4368 0%,
            #36445f 55%,
            #2e3c4c 100%
          );
          color: #f7f4ef;
          display: grid;
          gap: 24px;
        }

        .eyebrow,
        .panel-kicker {
          margin: 0 0 10px;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          font-size: 0.76rem;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.7);
        }

        .panel-kicker {
          color: var(--primary);
        }

        h1,
        h2,
        p {
          margin: 0;
        }

        .hero-card h1 {
          font-size: clamp(2.4rem, 5vw, 4.2rem);
          line-height: 0.95;
          max-width: 10ch;
        }

        .hero-copy {
          margin-top: 14px;
          max-width: 60ch;
          line-height: 1.7;
          color: rgba(247, 244, 239, 0.84);
        }

        .status-row {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .status-pill {
          display: flex;
          gap: 14px;
          align-items: center;
          padding: 16px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .status-pill span {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.12);
          font-size: 1.1rem;
        }

        .status-pill strong {
          display: block;
          font-size: 1rem;
        }

        .status-pill p {
          color: rgba(247, 244, 239, 0.74);
          font-size: 0.9rem;
        }

        .warning {
          border-color: rgba(255, 204, 112, 0.35);
          background: rgba(255, 204, 112, 0.12);
        }

        .content-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
          gap: 24px;
        }

        .panel {
          padding: 28px;
          background: rgba(255, 255, 255, 0.95);
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 20px;
        }

        .panel h2 {
          color: var(--primary-deep);
          font-size: 1.5rem;
        }

        .ghost-button,
        .primary-button,
        .secondary-button {
          border: none;
          border-radius: 14px;
          padding: 13px 16px;
          cursor: pointer;
          font-weight: 800;
        }

        .ghost-button {
          background: rgba(32, 58, 79, 0.08);
          color: var(--primary-deep);
        }

        .primary-button {
          width: 100%;
          background: linear-gradient(
            135deg,
            var(--primary),
            var(--primary-deep)
          );
          color: white;
          box-shadow: 0 14px 30px rgba(16, 33, 46, 0.18);
        }

        .primary-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .alert-box {
          padding: 14px 16px;
          border-radius: 16px;
          background: rgba(45, 106, 79, 0.1);
          border: 1px solid rgba(45, 106, 79, 0.16);
          color: var(--success);
          margin-bottom: 16px;
          line-height: 1.6;
        }

        .alert-box.error {
          background: rgba(179, 67, 67, 0.1);
          border-color: rgba(179, 67, 67, 0.16);
          color: var(--danger);
        }

        .info-grid {
          display: grid;
          gap: 12px;
        }

        .info-grid > div {
          padding: 16px;
          border-radius: 18px;
          background: rgba(32, 58, 79, 0.05);
          border: 1px solid rgba(32, 58, 79, 0.08);
        }

        .info-grid span,
        .result-summary span {
          display: block;
          font-size: 0.86rem;
          color: var(--muted);
          margin-bottom: 6px;
        }

        .info-grid strong,
        .result-summary strong {
          color: var(--primary-deep);
          word-break: break-word;
        }

        .danger-text {
          color: var(--danger) !important;
        }

        .success-text {
          color: var(--success) !important;
        }

        .steps-list {
          margin: 0 0 22px;
          padding-left: 20px;
          color: var(--muted);
          line-height: 1.8;
        }

        .result-panel {
          display: grid;
          gap: 16px;
        }

        .result-grid {
          display: grid;
          gap: 18px;
        }

        .result-summary {
          display: grid;
          gap: 12px;
        }

        .result-summary > div,
        .class-item {
          padding: 16px;
          border-radius: 18px;
          background: rgba(32, 58, 79, 0.05);
          border: 1px solid rgba(32, 58, 79, 0.08);
        }

        .class-list {
          display: grid;
          gap: 12px;
        }

        .class-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .class-item p {
          margin-top: 4px;
          color: var(--muted);
        }

        .class-item span {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: rgba(32, 58, 79, 0.12);
          color: var(--primary-deep);
          font-weight: 800;
        }

        .loading-shell {
          min-height: 100vh;
        }

        @media (max-width: 980px) {
          .content-grid,
          .status-row {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .dashboard-shell {
            padding: 18px;
          }

          .hero-card,
          .panel {
            padding: 22px;
            border-radius: 22px;
          }

          .panel-header {
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
