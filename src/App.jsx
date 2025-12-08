import { useEffect, useState } from "react";
import "./App.css";

function statusClass(status) {
  if (status === "online") return "status-pill status-online";
  if (status === "offline") return "status-pill status-offline";
  if (status === "maintenance") return "status-pill status-maintenance";
  return "status-pill";
}

function App() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setLoadError(null);

        const res = await fetch("/config/services.json");
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        setServices(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load services.json", err);
        setLoadError("Could not load services.json. Check the file path and JSON format.");
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const filteredServices = services.filter((svc) => {
    const matchesStatus =
      filter === "all" ? true : svc.status === filter;

    const text = `${svc.name || ""} ${svc.type || ""} ${svc.notes || ""}`.toLowerCase();
    const matchesSearch = text.includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const total = services.length;
  const online = services.filter((s) => s.status === "online").length;
  const offline = services.filter((s) => s.status === "offline").length;
  const maintenance = services.filter((s) => s.status === "maintenance").length;

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Homelab Dashboard</h1>
          <p className="subtitle">
            Quick links & status for lab
          </p>
        </div>
      </header>

      {/* Top stats */}
      <section className="stats-row">
        <div className="stat-card">
          <span className="stat-label">Total</span>
          <span className="stat-value">{total}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Online</span>
          <span className="stat-value">{online}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Offline</span>
          <span className="stat-value">{offline}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Maint.</span>
          <span className="stat-value">{maintenance}</span>
        </div>
      </section>

      {/* Controls */}
      <section className="controls-row">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search by name, type, or notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button
            className={filter === "all" ? "filter-btn active" : "filter-btn"}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={
              filter === "online" ? "filter-btn active" : "filter-btn"
            }
            onClick={() => setFilter("online")}
          >
            Online
          </button>
          <button
            className={
              filter === "offline" ? "filter-btn active" : "filter-btn"
            }
            onClick={() => setFilter("offline")}
          >
            Offline
          </button>
          <button
            className={
              filter === "maintenance"
                ? "filter-btn active"
                : "filter-btn"
            }
            onClick={() => setFilter("maintenance")}
          >
            Maintenance
          </button>
        </div>
      </section>

      {/* Loading / error states */}
      {loading && (
        <p className="empty-state">Loading services from services.json…</p>
      )}

      {loadError && !loading && (
        <p className="empty-state">
          {loadError}
        </p>
      )}

      {/* Cards */}
      {!loading && !loadError && (
        <main className="cards-grid">
          {filteredServices.length === 0 ? (
            <p className="empty-state">
              No services match that filter/search.
            </p>
          ) : (
            filteredServices.map((svc) => (
              <article key={svc.id} className="service-card">
                <header className="service-header">
                  <div>
                    <h2>{svc.name}</h2>
                    <p className="service-type">{svc.type}</p>
                  </div>
                  <span className={statusClass(svc.status)}>
                    {svc.status}
                  </span>
                </header>

                <div className="service-body">
                  <p className="service-notes">
                    {svc.notes || "No notes."}
                  </p>
                  <p className="service-url">
                    URL:{" "}
                    {svc.url ? (
                      <a href={svc.url} target="_blank" rel="noreferrer">
                        {svc.url}
                      </a>
                    ) : (
                      <span>Not set</span>
                    )}
                  </p>
                </div>
              </article>
            ))
          )}
        </main>
      )}

      <footer className="app-footer">
        <span>Homelab · {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}

export default App;