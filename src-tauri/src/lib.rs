mod commands;
mod db;
mod models;

use std::sync::Mutex;
use rusqlite::Connection;
use tauri::{State, Manager, Emitter};

struct DbState {
    conn: Mutex<Connection>,
}

#[tauri::command]
fn get_tasks(state: State<DbState>) -> Result<String, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    let tasks = commands::tasks::get_tasks(&conn)?;
    serde_json::to_string(&tasks).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_task_by_id(state: State<DbState>, id: i64) -> Result<String, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    let task = commands::tasks::get_task_by_id(&conn, id)?;
    serde_json::to_string(&task).map_err(|e| e.to_string())
}

#[tauri::command]
fn create_task(state: State<DbState>, data: models::TaskFormData) -> Result<String, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    let task = commands::tasks::create_task(&conn, &data)?;
    serde_json::to_string(&task).map_err(|e| e.to_string())
}

#[tauri::command]
fn update_task(state: State<DbState>, id: i64, data: models::TaskFormData) -> Result<String, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    let task = commands::tasks::update_task(&conn, id, &data)?;
    serde_json::to_string(&task).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_task(state: State<DbState>, id: i64) -> Result<(), String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    commands::tasks::delete_task(&conn, id)
}

#[tauri::command]
fn get_tasks_by_date_range(state: State<DbState>, start_date: String, end_date: String) -> Result<String, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    let tasks = commands::tasks::get_tasks_by_date_range(&conn, &start_date, &end_date)?;
    serde_json::to_string(&tasks).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_task_counts(state: State<DbState>) -> Result<String, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    let counts = commands::tasks::get_task_counts(&conn)?;
    Ok(counts.to_string())
}

#[tauri::command]
fn get_projects(state: State<DbState>) -> Result<String, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    let projects = commands::phases::get_projects(&conn)?;
    serde_json::to_string(&projects).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_all_projects_with_details(state: State<DbState>) -> Result<String, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    let projects = commands::phases::get_all_projects_with_details(&conn)?;
    serde_json::to_string(&projects).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_project_with_details(state: State<DbState>, id: i64) -> Result<String, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    let project = commands::phases::get_project_with_details(&conn, id)?;
    serde_json::to_string(&project).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_phases_by_project(state: State<DbState>, project_id: i64) -> Result<String, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    let phases = commands::phases::get_phases_by_project(&conn, project_id)?;
    serde_json::to_string(&phases).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_subtasks_by_phase(state: State<DbState>, phase_id: i64) -> Result<String, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    let subtasks = commands::phases::get_subtasks_by_phase(&conn, phase_id)?;
    serde_json::to_string(&subtasks).map_err(|e| e.to_string())
}

#[tauri::command]
fn update_subtask_status(state: State<DbState>, id: i64, status: String) -> Result<String, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    let subtask = commands::phases::update_subtask_status(&conn, id, &status)?;
    serde_json::to_string(&subtask).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_advisors_by_project(state: State<DbState>, project_id: i64) -> Result<String, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    let advisors = commands::advisors::get_advisors_by_project(&conn, project_id)?;
    serde_json::to_string(&advisors).map_err(|e| e.to_string())
}

#[tauri::command]
fn add_advisor(state: State<DbState>, data: models::AdvisorFormData) -> Result<String, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    let advisor = commands::advisors::add_advisor(&conn, &data)?;
    serde_json::to_string(&advisor).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_partners_by_project(state: State<DbState>, project_id: i64) -> Result<String, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    let partners = commands::advisors::get_partners_by_project(&conn, project_id)?;
    serde_json::to_string(&partners).map_err(|e| e.to_string())
}

#[tauri::command]
fn add_partner(state: State<DbState>, data: models::PartnerFormData) -> Result<String, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    let partner = commands::advisors::add_partner(&conn, &data)?;
    serde_json::to_string(&partner).map_err(|e| e.to_string())
}

#[tauri::command]
fn update_advisor(state: State<DbState>, data: models::AdvisorFormDataUpdate) -> Result<String, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    let advisor = commands::advisors::update_advisor(&conn, &data)?;
    serde_json::to_string(&advisor).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_advisor(state: State<DbState>, id: i64) -> Result<(), String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    commands::advisors::delete_advisor(&conn, id)
}

#[tauri::command]
fn update_partner(state: State<DbState>, data: models::PartnerFormDataUpdate) -> Result<String, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    let partner = commands::advisors::update_partner(&conn, &data)?;
    serde_json::to_string(&partner).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_partner(state: State<DbState>, id: i64) -> Result<(), String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    commands::advisors::delete_partner(&conn, id)
}

#[tauri::command]
fn create_project(state: State<DbState>, data: models::ProjectFormData) -> Result<String, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    let project = commands::phases::create_project(&conn, &data)?;
    serde_json::to_string(&project).map_err(|e| e.to_string())
}

#[tauri::command]
fn update_project(state: State<DbState>, id: i64, data: models::ProjectFormData) -> Result<String, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    let project = commands::phases::update_project(&conn, id, &data)?;
    serde_json::to_string(&project).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_project(state: State<DbState>, id: i64) -> Result<(), String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    commands::phases::delete_project(&conn, id)
}

#[tauri::command]
fn create_phase(state: State<DbState>, data: models::PhaseFormData) -> Result<String, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    let phase = commands::phases::create_phase(&conn, &data)?;
    serde_json::to_string(&phase).map_err(|e| e.to_string())
}

#[tauri::command]
fn update_phase(state: State<DbState>, id: i64, data: models::PhaseFormData) -> Result<String, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    let phase = commands::phases::update_phase(&conn, id, &data)?;
    serde_json::to_string(&phase).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_phase(state: State<DbState>, id: i64) -> Result<(), String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    commands::phases::delete_phase(&conn, id)
}

#[tauri::command]
fn create_subtask(state: State<DbState>, data: models::SubtaskFormData) -> Result<String, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    let subtask = commands::phases::create_subtask(&conn, &data)?;
    serde_json::to_string(&subtask).map_err(|e| e.to_string())
}

#[tauri::command]
fn update_subtask(state: State<DbState>, id: i64, data: models::SubtaskFormData) -> Result<String, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    let subtask = commands::phases::update_subtask(&conn, id, &data)?;
    serde_json::to_string(&subtask).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_subtask(state: State<DbState>, id: i64) -> Result<(), String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    commands::phases::delete_subtask(&conn, id)
}

#[tauri::command]
fn update_task_status(state: State<DbState>, id: i64, status: String) -> Result<String, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    let task = commands::tasks::update_task_status(&conn, id, &status)?;
    serde_json::to_string(&task).map_err(|e| e.to_string())
}

#[tauri::command]
fn create_recurring_task_instance(state: State<DbState>, parent_id: i64, new_date: String) -> Result<String, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    let task = commands::tasks::create_recurring_task_instance(&conn, parent_id, &new_date)?;
    serde_json::to_string(&task).map_err(|e| e.to_string())
}

#[tauri::command]
fn update_overdue_tasks(state: State<DbState>) -> Result<String, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    let tasks = commands::tasks::update_overdue_tasks(&conn)?;
    serde_json::to_string(&tasks).map_err(|e| e.to_string())
}

#[tauri::command]
fn check_due_tasks(state: State<DbState>) -> Result<String, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    let tasks = commands::notifications::get_due_tasks_for_notification(&conn)?;
    serde_json::to_string(&tasks).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_due_tasks_for_notification(state: State<DbState>) -> Result<String, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    let tasks = commands::notifications::get_due_tasks_for_notification(&conn)?;
    serde_json::to_string(&tasks).map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            let app_dir = match app.path().app_data_dir() {
                Ok(d) => d,
                Err(e) => {
                    let msg = format!("Gagal menentukan direktori aplikasi: {e}");
                    log::error!("[DB] {msg}");
                    eprintln!("[FATAL] {msg}");
                    let _ = app.emit("db-error", &msg);
                    return Err(e.into());
                }
            };

            if let Err(e) = std::fs::create_dir_all(&app_dir) {
                let msg = format!(
                    "Gagal membuat direktori penyimpanan di {}: {e}",
                    app_dir.display()
                );
                log::error!("[DB] {msg}");
                eprintln!("[FATAL] {msg}");
                let _ = app.emit("db-error", &msg);
                return Err(e.into());
            }

            let db_path = db::get_db_path(app_dir);
            match db::init_db(&db_path) {
                Ok(conn) => {
                    log::info!(
                        "[DB] Database berhasil diinisialisasi di {}",
                        db_path.display()
                    );
                    app.manage(DbState {
                        conn: Mutex::new(conn),
                    });
                    Ok(())
                }
                Err(e) => {
                    let msg = format!(
                        "Gagal menginisialisasi database.\n\nPath: {}\nError: {e}\n\nAplikasi akan ditutup.",
                        db_path.display()
                    );
                    log::error!("[DB] {msg}");
                    eprintln!("[FATAL] {msg}");
                    let _ = app.emit("db-error", &msg);
                    Err(e.into())
                }
            }
        })
        .invoke_handler(tauri::generate_handler![
            get_tasks,
            get_task_by_id,
            create_task,
            update_task,
            delete_task,
            get_tasks_by_date_range,
            get_task_counts,
            get_projects,
            get_all_projects_with_details,
            get_project_with_details,
            get_phases_by_project,
            get_subtasks_by_phase,
            update_subtask_status,
            get_advisors_by_project,
            add_advisor,
            get_partners_by_project,
            add_partner,
            update_advisor,
            delete_advisor,
            update_partner,
            delete_partner,
            create_project,
            update_project,
            delete_project,
            create_phase,
            update_phase,
            delete_phase,
            create_subtask,
            update_subtask,
            delete_subtask,
            update_task_status,
            create_recurring_task_instance,
            update_overdue_tasks,
            check_due_tasks,
            get_due_tasks_for_notification,
        ])
        .run(tauri::generate_context!())
        .unwrap_or_else(|e| {
            let msg = format!("Gagal menjalankan aplikasi: {e}");
            log::error!("[APP] {msg}");
            eprintln!("[FATAL] {msg}");
        });
}
