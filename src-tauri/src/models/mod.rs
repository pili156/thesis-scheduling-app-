use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Task {
    pub id: i64,
    pub name: String,
    pub description: String,
    pub date: String,
    pub status: String,
    pub priority: String,
    pub is_recurring: bool,
    pub recurrence_pattern: Option<String>,
    pub recurrence_type: Option<String>,
    pub recurrence_day_of_week: Option<i32>,
    pub recurrence_day_of_month: Option<i32>,
    pub recurrence_interval: i32,
    pub parent_task_id: Option<i64>,
    pub phase_id: Option<i64>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TaskFormData {
    pub name: String,
    pub description: String,
    pub date: String,
    pub priority: String,
    pub is_recurring: bool,
    pub recurrence_type: Option<String>,
    pub recurrence_day_of_week: Option<i32>,
    pub recurrence_day_of_month: Option<i32>,
    pub recurrence_interval: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Project {
    pub id: i64,
    pub name: String,
    pub description: String,
    pub start_date: Option<String>,
    pub end_date: Option<String>,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Phase {
    pub id: i64,
    pub project_id: i64,
    pub name: String,
    pub description: String,
    pub phase_order: i32,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Subtask {
    pub id: i64,
    pub phase_id: i64,
    pub name: String,
    pub description: String,
    pub status: String,
    pub priority: String,
    pub estimated_days: Option<i32>,
    pub actual_days: Option<i32>,
    pub due_date: Option<String>,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Advisor {
    pub id: i64,
    pub project_id: i64,
    pub name: String,
    pub phone: String,
    pub email: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Partner {
    pub id: i64,
    pub project_id: i64,
    pub name: String,
    pub phone: String,
    pub email: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PhaseWithDetails {
    #[serde(flatten)]
    pub phase: Phase,
    pub subtasks: Vec<Subtask>,
    pub progress: f64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ProjectWithDetails {
    #[serde(flatten)]
    pub project: Project,
    pub advisors: Vec<Advisor>,
    pub partners: Vec<Partner>,
    pub phases: Vec<PhaseWithDetails>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AdvisorFormData {
    pub project_id: i64,
    pub name: String,
    pub phone: String,
    pub email: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PartnerFormData {
    pub project_id: i64,
    pub name: String,
    pub phone: String,
    pub email: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ProjectFormData {
    pub name: String,
    pub description: String,
    pub start_date: Option<String>,
    pub end_date: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PhaseFormData {
    pub project_id: i64,
    pub name: String,
    pub description: String,
    pub phase_order: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SubtaskFormData {
    pub phase_id: i64,
    pub name: String,
    pub description: String,
    pub priority: Option<String>,
    pub estimated_days: Option<i32>,
    pub actual_days: Option<i32>,
    pub due_date: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AdvisorFormDataUpdate {
    pub id: i64,
    pub project_id: i64,
    pub name: String,
    pub phone: String,
    pub email: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PartnerFormDataUpdate {
    pub id: i64,
    pub project_id: i64,
    pub name: String,
    pub phone: String,
    pub email: String,
}
