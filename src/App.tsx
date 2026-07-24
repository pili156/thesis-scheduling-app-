import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "./components/layout/ErrorBoundary";
import { Sidebar } from "./components/layout/Sidebar";
import { DashboardPage } from "./pages/DashboardPage";
import { TaskListPage } from "./pages/TaskListPage";
import { TaskFormPage } from "./pages/TaskFormPage";
import { TaskEditPage } from "./pages/TaskEditPage";
import { ThesisPage } from "./pages/ThesisPage";
import { ThesisFormPage } from "./pages/ThesisFormPage";
import { PhaseFormPage } from "./pages/PhaseFormPage";
import { SubtaskFormPage } from "./pages/SubtaskFormPage";

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <div className="app-layout">
          <Sidebar />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/tasks" element={<TaskListPage />} />
              <Route path="/tasks/new" element={<TaskFormPage />} />
              <Route path="/tasks/:id/edit" element={<TaskEditPage />} />
              <Route path="/thesis" element={<ThesisPage />} />
              <Route path="/thesis/new" element={<ThesisFormPage />} />
              <Route path="/thesis/:id/edit" element={<ThesisFormPage />} />
              <Route
                path="/thesis/:projectId/phase/new"
                element={<PhaseFormPage />}
              />
              <Route
                path="/thesis/:projectId/phase/:phaseId/edit"
                element={<PhaseFormPage />}
              />
              <Route
                path="/thesis/:projectId/phase/:phaseId/subtask/new"
                element={<SubtaskFormPage />}
              />
              <Route
                path="/thesis/:projectId/phase/:phaseId/subtask/:subtaskId/edit"
                element={<SubtaskFormPage />}
              />
            </Routes>
          </main>
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
