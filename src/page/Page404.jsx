import { Link } from "react-router-dom";

function Page404() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8fafc"
      }}
    >
      <div
        style={{
          maxWidth: "420px",
          padding: "32px",
          textAlign: "center",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.08)"
        }}
      >
        <h1
          style={{
            fontSize: "26px",
            marginBottom: "12px",
            color: "#111827"
          }}
        >
          Page not available
        </h1>

        <p
          style={{
            fontSize: "16px",
            color: "#374151",
            marginBottom: "12px",
            lineHeight: "1.6"
          }}
        >
          The page you are trying to access does not exist or may have been moved.
          Your information remains secure.
        </p>

        <p
          style={{
            fontSize: "15px",
            color: "#4b5563",
            marginBottom: "24px"
          }}
        >
          If you are looking for support, help is always available.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px"
          }}
        >
          <Link
            to="/dashboard"
            style={{
              padding: "10px 18px",
              borderRadius: "6px",
              backgroundColor: "#0f766e",
              color: "#ffffff",
              textDecoration: "none",
              fontWeight: "500"
            }}
          >
            Go to Dashboard
          </Link>

          <Link
            to="/counsellor"
            style={{
              padding: "10px 18px",
              borderRadius: "6px",
              border: "1px solid #0f766e",
              color: "#0f766e",
              textDecoration: "none",
              fontWeight: "500"
            }}
          >
            Speak with a Counsellor
          </Link>
        </div>

        <p
          style={{
            marginTop: "24px",
            fontSize: "13px",
            color: "#6b7280"
          }}
        >
          Safe Harbour supports your mental and emotional well-being.
        </p>
      </div>
    </div>
  );
}

export default Page404;
