import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ProjectWithDetails, TaskStatus } from "../../types";
import { PhaseProgressBar } from "./PhaseProgressBar";
import { SubtaskList } from "./SubtaskList";
import { AdvisorInfoPopup } from "../popups/AdvisorInfoPopup";
import { AdvisorFormPopup } from "../popups/AdvisorFormPopup";
import { PartnerFormPopup } from "../popups/PartnerFormPopup";
import { PartnerInfoPopup } from "../popups/PartnerInfoPopup";
import { deleteProject, addAdvisor, addPartner, deletePhase, updateSubtaskStatus, deleteSubtask, getProjectWithDetails } from "../../lib/api";

interface ThesisProjectDropdownProps {
  project: ProjectWithDetails;
  onProjectDelete?: () => void;
}

export function ThesisProjectDropdown({
  project: initialProject,
  onProjectDelete,
}: ThesisProjectDropdownProps) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);
  const [advisorPopup, setAdvisorPopup] = useState<{
    name: string;
    phone: string;
    email: string;
  } | null>(null);
  const [showAdvisorForm, setShowAdvisorForm] = useState(false);
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [partnerPopup, setPartnerPopup] = useState<{
    name: string;
    phone: string;
    email: string;
  } | null>(null);
  const [project, setProject] = useState<ProjectWithDetails>(initialProject);

  const totalSubtasks = project.phases.reduce(
    (acc, phase) => acc + phase.subtasks.length,
    0
  );
  const completedSubtasks = project.phases.reduce(
    (acc, phase) =>
      acc + phase.subtasks.filter((s) => s.status === "Selesai").length,
    0
  );
  const overallProgress =
    totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  const handleSubtaskStatusChange = async (id: number, status: TaskStatus) => {
    try {
      await updateSubtaskStatus(id, status);
      setProject((prev) => ({
        ...prev,
        phases: prev.phases.map((phase) => ({
          ...phase,
          subtasks: phase.subtasks.map((subtask) =>
            subtask.id === id ? { ...subtask, status } : subtask
          ),
        })),
      }));
    } catch (error) {
      console.error("Error updating subtask status:", error);
    }
  };

  const handleDeleteSubtask = async (id: number) => {
    try {
      await deleteSubtask(id);
      setProject((prev) => ({
        ...prev,
        phases: prev.phases.map((phase) => ({
          ...phase,
          subtasks: phase.subtasks.filter((s) => s.id !== id),
        })),
      }));
    } catch (error) {
      console.error("Error deleting subtask:", error);
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm(`Yakin ingin menghapus project "${project.name}"?`)) {
      try {
        await deleteProject(project.id);
        onProjectDelete?.();
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  const handleAddAdvisor = async (data: {
    project_id: number;
    name: string;
    phone: string;
    email: string;
  }) => {
    try {
      await addAdvisor(data);
      setShowAdvisorForm(false);
      // Refetch project to get updated advisors
      const updated = await getProjectWithDetails(project.id);
      setProject(updated);
    } catch (error) {
      console.error("Error adding advisor:", error);
    }
  };

  const handleAddPartner = async (data: {
    project_id: number;
    name: string;
    phone: string;
    email: string;
  }) => {
    try {
      await addPartner(data);
      setShowPartnerForm(false);
      // Refetch project to get updated partners
      const updated = await getProjectWithDetails(project.id);
      setProject(updated);
    } catch (error) {
      console.error("Error adding partner:", error);
    }
  };

  const handleDeletePhase = async (phaseId: number, phaseName: string) => {
    if (window.confirm(`Yakin ingin menghapus phase "${phaseName}"?`)) {
      try {
        await deletePhase(phaseId);
        setProject((prev) => ({
          ...prev,
          phases: prev.phases.filter((p) => p.id !== phaseId),
        }));
        if (expandedPhase === phaseId) {
          setExpandedPhase(null);
        }
      } catch (error) {
        console.error("Error deleting phase:", error);
      }
    }
  };

  return (
    <>
      <div className="project-dropdown">
        <div
          className="project-dropdown-header"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{
                transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <span style={{ fontWeight: 600 }}>{project.name}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, opacity: 0.7 }}>
              {Math.round(overallProgress)}%
            </span>
            <PhaseProgressBar progress={overallProgress} />
          </div>
        </div>

        {isExpanded && (
          <div className="project-dropdown-content">
            {project.description && (
              <p style={{ marginBottom: 12, opacity: 0.8 }}>
                {project.description}
              </p>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {project.advisors.map((advisor) => (
                <div
                  key={advisor.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    setAdvisorPopup({
                      name: advisor.name,
                      phone: advisor.phone ?? "",
                      email: advisor.email ?? "",
                    })
                  }
                >
                  <span style={{ opacity: 0.7 }}>Pembimbing:</span>
                  <span style={{ color: "var(--border-color)" }}>
                    {advisor.name}
                  </span>
                </div>
              ))}

              {project.partners.map((partner) => (
                <div
                  key={partner.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    setPartnerPopup({
                      name: partner.name,
                      phone: partner.phone ?? "",
                      email: partner.email ?? "",
                    })
                  }
                >
                  <span style={{ opacity: 0.7 }}>Partner:</span>
                  <span style={{ color: "var(--border-color)" }}>
                    {partner.name}
                  </span>
                </div>
              ))}

              {project.start_date && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ opacity: 0.7 }}>Periode:</span>
                  <span>
                    {project.start_date} - {project.end_date ?? "Sekarang"}
                  </span>
                </div>
              )}
            </div>

            <div style={{ marginTop: 16 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                <button
                  className="btn btn-primary btn-add"
                  onClick={() => navigate(`/thesis/${project.id}/edit`)}
                >
                  Edit Project
                </button>
                <button
                  className="btn btn-primary btn-add"
                  onClick={() => setShowAdvisorForm(true)}
                >
                  + Pembimbing
                </button>
                <button
                  className="btn btn-primary btn-add"
                  onClick={() => setShowPartnerForm(true)}
                >
                  + Partner
                </button>
                <button
                  className="btn btn-primary btn-add"
                  onClick={() =>
                    navigate(`/thesis/${project.id}/phase/new`)
                  }
                >
                  + Phase
                </button>
                <button
                  className="btn"
                  onClick={handleDeleteProject}
                  style={{ color: "#AB0000" }}
                >
                  Hapus Project
                </button>
              </div>

              {project.phases.map((phase) => (
                <div key={phase.id} className="phase-section">
                  <div
                    className="phase-header"
                    onClick={() =>
                      setExpandedPhase(
                        expandedPhase === phase.id ? null : phase.id
                      )
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        style={{
                          transform:
                            expandedPhase === phase.id
                              ? "rotate(90deg)"
                              : "rotate(0deg)",
                          transition: "transform 0.2s",
                        }}
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                      <span>{phase.name}</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        width: 120,
                      }}
                    >
                      <PhaseProgressBar progress={phase.progress} />
                      <span style={{ fontSize: 12 }}>
                        {Math.round(phase.progress)}%
                      </span>
                    </div>
                  </div>

                  {expandedPhase === phase.id && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                        <button
                          className="btn btn-primary btn-add"
                          onClick={() =>
                            navigate(
                              `/thesis/${project.id}/phase/${phase.id}/edit`
                            )
                          }
                        >
                          Edit Phase
                        </button>
                        <button
                          className="btn btn-primary btn-add"
                          onClick={() =>
                            navigate(
                              `/thesis/${project.id}/phase/${phase.id}/subtask/new`
                            )
                          }
                        >
                          + Subtask
                        </button>
                        <button
                          className="btn"
                          onClick={() => handleDeletePhase(phase.id, phase.name)}
                          style={{ color: "#AB0000" }}
                        >
                          Hapus
                        </button>
                      </div>
                      <SubtaskList
                        subtasks={phase.subtasks}
                        projectId={project.id}
                        phaseId={phase.id}
                        onSubtaskUpdate={(id, status) => handleSubtaskStatusChange(id, status as "Belum" | "Selesai" | "Terlewat")}
                        onDeleteSubtask={handleDeleteSubtask}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {advisorPopup && (
        <AdvisorInfoPopup
          name={advisorPopup.name}
          phone={advisorPopup.phone}
          email={advisorPopup.email}
          onClose={() => setAdvisorPopup(null)}
        />
      )}

      {showAdvisorForm && (
        <AdvisorFormPopup
          projectId={project.id}
          advisors={project.advisors}
          onSave={handleAddAdvisor}
          onClose={() => setShowAdvisorForm(false)}
        />
      )}

      {showPartnerForm && (
        <PartnerFormPopup
          projectId={project.id}
          partners={project.partners}
          onSave={handleAddPartner}
          onClose={() => setShowPartnerForm(false)}
        />
      )}

      {partnerPopup && (
        <PartnerInfoPopup
          name={partnerPopup.name}
          phone={partnerPopup.phone}
          email={partnerPopup.email}
          onClose={() => setPartnerPopup(null)}
        />
      )}
    </>
  );
}