import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ThesisProjectDropdown } from "../components/thesis/ThesisProjectDropdown";
import { TopMenu } from "../components/layout/TopMenu";
import type { ProjectWithDetails } from "../types";
import * as api from "../lib/api";

export function ThesisPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectWithDetails[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const details = await api.getAllProjectsWithDetails();
      setProjects(details);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filteredProjects = useMemo(() =>
    projects.filter((project) =>
      project.name.toLowerCase().includes(search.toLowerCase())
    ),
    [projects, search]
  );

  return (
    <div>
      <TopMenu title="Tugas Akhir" />
      <div className="app-content">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h2>Daftar Tugas Akhir</h2>
          <button
            className="btn btn-primary btn-add"
            onClick={() => navigate("/thesis/new")}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Tambah Project
          </button>
        </div>

        <div className="search-filter-bar">
          <input
            type="text"
            placeholder="Cari project tugas akhir..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="empty-state">Memuat data...</div>
        ) : filteredProjects.length === 0 ? (
          <div className="empty-state">Tidak ada project tugas akhir</div>
        ) : (
          filteredProjects.map((project) => (
            <ThesisProjectDropdown
              key={project.id}
              project={project}
              onProjectDelete={fetchProjects}
            />
          ))
        )}
      </div>
    </div>
  );
}
