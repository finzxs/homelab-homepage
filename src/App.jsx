import { useState } from "react";
import "./App.css";

const SERVICES = [
  {
    id: 1,
    name: "Nextcloud",
    type: "Storage",
    url: "https://nextcloud.local",
    status: "online",
    notes: "Main personal cloud",
  },
  {
    id: 2,
    name: "Navidrome",
    type: "Media",
    url: "https://music.local",
    status: "online",
    notes: "Music streaming",
  },
  {
    id: 3,
    name: "Router",
    type: "Network",
    url: "http://192.168.1.1",
    status: "online",
    notes: "ISP router login",
  },
  {
    id: 4,
    name: "Flint 2",
    type: "Network",
    url: "http://192.168.1.2",
    status: "maintenance",
    notes: "Main lab router",
  },
  {
    id: 5,
    name: "Pi-hole",
    type: "DNS",
    url: "http://pi-hole.local/admin",
    status: "offline",
    notes: "Ad-blocking DNS",
  },
];

function statusClass(status) {
  if (status === "online") return "status-pill status-online";
  if (status === "offline") return "status-pill status-offline";
  if (status === "maintenance") return "status-pill status-maintenance";
  return "status-pill";
}

function App() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredServices = SERVICES.filter((svc) => {
    const matchesStatus =
      filter === "all" ? true : svc.status === filter;

    const matchesSearch =
      svc.name.toLowerCase().includes(search.toLowerCase()) ||
      svc.type.toLowerCase().includes(search.toLowerCase()) ||
      (svc.notes || "")
        .toLowerCase()
        .includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const total = SERVICES.length;
  const online = SERVICES.filter((s) => s.status === "online").length;
  const offline = SERVICES.filter((s) => s.status === "offline").length;
  const maintenance = SERVICES.filter(
    (s) => s.status === "maintenance"
  ).length;

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Homelab Dashboard</h1>
          <p className="subtitle">
            Quick links & status for your lab services.
          </p>
        </div>
      </header>

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

      <footer className="app-footer">
        <span>Homelab · {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}

export default App;