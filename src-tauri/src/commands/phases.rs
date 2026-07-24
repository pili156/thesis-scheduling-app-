use rusqlite::Connection;
use crate::models::{Phase, Subtask, PhaseWithDetails, ProjectWithDetails, Project, ProjectFormData, PhaseFormData, SubtaskFormData};

pub fn get_phases_by_project(conn: &Connection, project_id: i64) -> Result<Vec<PhaseWithDetails>, String> {
    let mut stmt = conn
        .prepare(
            "SELECT p.id, p.project_id, p.name, p.description, p.phase_order, p.created_at,
                    s.id, s.phase_id, s.name, s.description, s.status, s.priority,
                    s.estimated_days, s.actual_days, s.due_date, s.created_at
             FROM phases p
             LEFT JOIN subtasks s ON s.phase_id = p.id
             WHERE p.project_id = ?1
             ORDER BY p.phase_order ASC, s.id ASC",
        )
        .map_err(|e| e.to_string())?;

    let mut phase_map: std::collections::HashMap<i64, PhaseWithDetails> = std::collections::HashMap::new();
    let mut phase_order: Vec<i64> = Vec::new();

    let rows = stmt
        .query_map([project_id], |row| {
            let phase = Phase {
                id: row.get(0)?,
                project_id: row.get(1)?,
                name: row.get(2)?,
                description: row.get(3)?,
                phase_order: row.get(4)?,
                created_at: row.get(5)?,
            };
            let subtask_id: Option<i64> = row.get(6)?;
            let subtask = if subtask_id.is_some() {
                Some(Subtask {
                    id: subtask_id.unwrap(),
                    phase_id: row.get(7)?,
                    name: row.get(8)?,
                    description: row.get(9)?,
                    status: row.get(10)?,
                    priority: row.get(11)?,
                    estimated_days: row.get(12)?,
                    actual_days: row.get(13)?,
                    due_date: row.get(14)?,
                    created_at: row.get(15)?,
                })
            } else {
                None
            };
            Ok((phase, subtask))
        })
        .map_err(|e| e.to_string())?;

    for row in rows {
        let (phase, subtask) = row.map_err(|e| e.to_string())?;
        if !phase_map.contains_key(&phase.id) {
            phase_order.push(phase.id);
            phase_map.insert(phase.id, PhaseWithDetails {
                phase: phase.clone(),
                subtasks: Vec::new(),
                progress: 0.0,
            });
        }
        if let Some(s) = subtask {
            phase_map.get_mut(&phase.id).unwrap().subtasks.push(s);
        }
    }

    let result: Vec<PhaseWithDetails> = phase_order
        .into_iter()
        .filter_map(|id| phase_map.remove(&id))
        .map(|mut pd| {
            let total = pd.subtasks.len() as f64;
            let completed = pd.subtasks.iter().filter(|s| s.status == "Selesai").count() as f64;
            pd.progress = if total > 0.0 { (completed / total) * 100.0 } else { 0.0 };
            pd
        })
        .collect();

    Ok(result)
}

pub fn get_subtasks_by_phase(conn: &Connection, phase_id: i64) -> Result<Vec<Subtask>, String> {
    let mut stmt = conn
        .prepare(
            "SELECT id, phase_id, name, description, status, priority, estimated_days,
                    actual_days, due_date, created_at
             FROM subtasks WHERE phase_id = ?1",
        )
        .map_err(|e| e.to_string())?;

    let subtasks = stmt
        .query_map([phase_id], |row| {
            Ok(Subtask {
                id: row.get(0)?,
                phase_id: row.get(1)?,
                name: row.get(2)?,
                description: row.get(3)?,
                status: row.get(4)?,
                priority: row.get(5)?,
                estimated_days: row.get(6)?,
                actual_days: row.get(7)?,
                due_date: row.get(8)?,
                created_at: row.get(9)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(subtasks)
}

pub fn update_subtask_status(conn: &Connection, id: i64, status: &str) -> Result<Subtask, String> {
    conn.execute(
        "UPDATE subtasks SET status = ?1 WHERE id = ?2",
        rusqlite::params![status, id],
    )
    .map_err(|e| e.to_string())?;

    conn.query_row(
        "SELECT id, phase_id, name, description, status, priority, estimated_days,
                actual_days, due_date, created_at
         FROM subtasks WHERE id = ?1",
        [id],
        |row| {
            Ok(Subtask {
                id: row.get(0)?,
                phase_id: row.get(1)?,
                name: row.get(2)?,
                description: row.get(3)?,
                status: row.get(4)?,
                priority: row.get(5)?,
                estimated_days: row.get(6)?,
                actual_days: row.get(7)?,
                due_date: row.get(8)?,
                created_at: row.get(9)?,
            })
        },
    )
    .map_err(|e| e.to_string())
}

pub fn get_projects(conn: &Connection) -> Result<Vec<Project>, String> {
    let mut stmt = conn
        .prepare(
            "SELECT id, name, description, start_date, end_date, created_at
             FROM projects ORDER BY created_at DESC",
        )
        .map_err(|e| e.to_string())?;

    let projects = stmt
        .query_map([], |row| {
            Ok(Project {
                id: row.get(0)?,
                name: row.get(1)?,
                description: row.get(2)?,
                start_date: row.get(3)?,
                end_date: row.get(4)?,
                created_at: row.get(5)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(projects)
}

pub fn get_project_by_id(conn: &Connection, id: i64) -> Result<Project, String> {
    conn.query_row(
        "SELECT id, name, description, start_date, end_date, created_at
         FROM projects WHERE id = ?1",
        [id],
        |row| {
            Ok(Project {
                id: row.get(0)?,
                name: row.get(1)?,
                description: row.get(2)?,
                start_date: row.get(3)?,
                end_date: row.get(4)?,
                created_at: row.get(5)?,
            })
        },
    )
    .map_err(|e| e.to_string())
}

pub fn get_project_with_details(conn: &Connection, id: i64) -> Result<ProjectWithDetails, String> {
    let project = get_project_by_id(conn, id)?;

    let mut advisor_stmt = conn
        .prepare("SELECT id, project_id, name, phone, email FROM advisors WHERE project_id = ?1")
        .map_err(|e| e.to_string())?;
    let advisors = advisor_stmt
        .query_map([id], |row| {
            Ok(crate::models::Advisor {
                id: row.get(0)?,
                project_id: row.get(1)?,
                name: row.get(2)?,
                phone: row.get(3)?,
                email: row.get(4)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    let mut partner_stmt = conn
        .prepare("SELECT id, project_id, name, phone, email FROM partners WHERE project_id = ?1")
        .map_err(|e| e.to_string())?;
    let partners = partner_stmt
        .query_map([id], |row| {
            Ok(crate::models::Partner {
                id: row.get(0)?,
                project_id: row.get(1)?,
                name: row.get(2)?,
                phone: row.get(3)?,
                email: row.get(4)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    let phases = get_phases_by_project(conn, id)?;

    Ok(ProjectWithDetails {
        project,
        advisors,
        partners,
        phases,
    })
}

pub fn get_all_projects_with_details(conn: &Connection) -> Result<Vec<ProjectWithDetails>, String> {
    let projects = get_projects(conn)?;

    let mut result = Vec::with_capacity(projects.len());
    for project in projects {
        let details = get_project_with_details(conn, project.id)?;
        result.push(details);
    }

    Ok(result)
}

// --- Project CRUD ---

pub fn create_project(conn: &Connection, data: &ProjectFormData) -> Result<Project, String> {
    conn.execute(
        "INSERT INTO projects (name, description, start_date, end_date)
         VALUES (?1, ?2, ?3, ?4)",
        rusqlite::params![data.name, data.description, data.start_date, data.end_date],
    )
    .map_err(|e| e.to_string())?;

    let id = conn.last_insert_rowid();
    get_project_by_id(conn, id)
}

pub fn update_project(conn: &Connection, id: i64, data: &ProjectFormData) -> Result<Project, String> {
    conn.execute(
        "UPDATE projects SET name = ?1, description = ?2, start_date = ?3, end_date = ?4 WHERE id = ?5",
        rusqlite::params![data.name, data.description, data.start_date, data.end_date, id],
    )
    .map_err(|e| e.to_string())?;

    get_project_by_id(conn, id)
}

pub fn delete_project(conn: &Connection, id: i64) -> Result<(), String> {
    conn.execute("DELETE FROM projects WHERE id = ?1", [id])
        .map_err(|e| e.to_string())?;
    Ok(())
}

// --- Phase CRUD ---

pub fn create_phase(conn: &Connection, data: &PhaseFormData) -> Result<Phase, String> {
    conn.execute(
        "INSERT INTO phases (project_id, name, description, phase_order)
         VALUES (?1, ?2, ?3, ?4)",
        rusqlite::params![data.project_id, data.name, data.description, data.phase_order],
    )
    .map_err(|e| e.to_string())?;

    let id = conn.last_insert_rowid();
    conn.query_row(
        "SELECT id, project_id, name, description, phase_order, created_at
         FROM phases WHERE id = ?1",
        [id],
        |row| {
            Ok(Phase {
                id: row.get(0)?,
                project_id: row.get(1)?,
                name: row.get(2)?,
                description: row.get(3)?,
                phase_order: row.get(4)?,
                created_at: row.get(5)?,
            })
        },
    )
    .map_err(|e| e.to_string())
}

pub fn update_phase(conn: &Connection, id: i64, data: &PhaseFormData) -> Result<Phase, String> {
    conn.execute(
        "UPDATE phases SET name = ?1, description = ?2, phase_order = ?3 WHERE id = ?4",
        rusqlite::params![data.name, data.description, data.phase_order, id],
    )
    .map_err(|e| e.to_string())?;

    conn.query_row(
        "SELECT id, project_id, name, description, phase_order, created_at
         FROM phases WHERE id = ?1",
        [id],
        |row| {
            Ok(Phase {
                id: row.get(0)?,
                project_id: row.get(1)?,
                name: row.get(2)?,
                description: row.get(3)?,
                phase_order: row.get(4)?,
                created_at: row.get(5)?,
            })
        },
    )
    .map_err(|e| e.to_string())
}

pub fn delete_phase(conn: &Connection, id: i64) -> Result<(), String> {
    conn.execute("DELETE FROM phases WHERE id = ?1", [id])
        .map_err(|e| e.to_string())?;
    Ok(())
}

// --- Subtask CRUD ---

pub fn create_subtask(conn: &Connection, data: &SubtaskFormData) -> Result<Subtask, String> {
    conn.execute(
        "INSERT INTO subtasks (phase_id, name, description, priority, estimated_days, actual_days, due_date)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
        rusqlite::params![data.phase_id, data.name, data.description, data.priority, data.estimated_days, data.actual_days, data.due_date],
    )
    .map_err(|e| e.to_string())?;

    let id = conn.last_insert_rowid();
    conn.query_row(
        "SELECT id, phase_id, name, description, status, priority, estimated_days, actual_days, due_date, created_at
         FROM subtasks WHERE id = ?1",
        [id],
        |row| {
            Ok(Subtask {
                id: row.get(0)?,
                phase_id: row.get(1)?,
                name: row.get(2)?,
                description: row.get(3)?,
                status: row.get(4)?,
                priority: row.get(5)?,
                estimated_days: row.get(6)?,
                actual_days: row.get(7)?,
                due_date: row.get(8)?,
                created_at: row.get(9)?,
            })
        },
    )
    .map_err(|e| e.to_string())
}

pub fn update_subtask(conn: &Connection, id: i64, data: &SubtaskFormData) -> Result<Subtask, String> {
    conn.execute(
        "UPDATE subtasks SET name = ?1, description = ?2, priority = ?3, estimated_days = ?4, actual_days = ?5, due_date = ?6 WHERE id = ?7",
        rusqlite::params![data.name, data.description, data.priority, data.estimated_days, data.actual_days, data.due_date, id],
    )
    .map_err(|e| e.to_string())?;

    conn.query_row(
        "SELECT id, phase_id, name, description, status, priority, estimated_days, actual_days, due_date, created_at
         FROM subtasks WHERE id = ?1",
        [id],
        |row| {
            Ok(Subtask {
                id: row.get(0)?,
                phase_id: row.get(1)?,
                name: row.get(2)?,
                description: row.get(3)?,
                status: row.get(4)?,
                priority: row.get(5)?,
                estimated_days: row.get(6)?,
                actual_days: row.get(7)?,
                due_date: row.get(8)?,
                created_at: row.get(9)?,
            })
        },
    )
    .map_err(|e| e.to_string())
}

pub fn delete_subtask(conn: &Connection, id: i64) -> Result<(), String> {
    conn.execute("DELETE FROM subtasks WHERE id = ?1", [id])
        .map_err(|e| e.to_string())?;
    Ok(())
}
