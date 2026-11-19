import { Link } from "react-router-dom";

function Home() {
  const token = sessionStorage.getItem("accessToken");

  let user = null;

  try {
    user = JSON.parse(sessionStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  const dashboardPath = user?.role === "admin" ? "/admin" : "/dashboard";

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-label">Digital Library Management</span>

          <h1>
            Manage Your Library
            <span> Smarter & Faster.</span>
          </h1>

          <p>
            A modern library management platform to explore books, request
            borrowing, track returns, and manage your library efficiently.
          </p>

          <div className="hero-actions">
            <Link className="hero-primary" to="/books">
              Explore Books
            </Link>

            <Link
              className="hero-secondary"
              to={token && user ? dashboardPath : "/register"}
            >
              {token && user ? "Go to Dashboard" : "Get Started"}
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-book-icon">📚</div>
          <h2>Your Digital Library</h2>
          <p>Discover • Borrow • Manage</p>
        </div>
      </section>

      <section className="features-section">
        <div className="section-heading">
          <h2>Everything You Need</h2>
          <p>Simple tools for students and library administrators.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔎</div>
            <h3>Explore Books</h3>
            <p>
              Browse the library collection and find books by title, author, or
              category.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📖</div>
            <h3>Borrow Books</h3>
            <p>Request books online and track their issue and return status.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Admin Management</h3>
            <p>
              Manage books, borrowing requests, and returns through a dedicated
              admin dashboard.
            </p>
          </div>
        </div>
      </section>

      <section className="home-cta">
        <h2>Ready to Explore Your Library?</h2>
        <p>Find your next book in just a few clicks.</p>

        <Link className="hero-primary" to="/books">
          Browse Collection
        </Link>
      </section>
    </div>
  );
}

export default Home;
