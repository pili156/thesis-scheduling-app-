use rusqlite::Connection;
use crate::models::{Task, TaskFormData};

pub fn get_tasks(conn: &Connection) -> Result<Vec<Task>, String> {
    let mut stmt = conn
        .prepare(
            "SELECT id, name, description, date, status, priority, is_recurring,
                    recurrence_pattern, recurrence_type, recurrence_day_of_week,
                    recurrence_day_of_month, recurrence_interval, parent_task_id,
                    phase_id, created_at, updated_at
             FROM tasks ORDER BY date ASC",
        )
        .map_err(|e| e.to_string())?;

    let tasks = stmt
        .query_map([], |row| {
            Ok(Task {
                id: row.get(0)?,
                name: row.get(1)?,
                description: row.get(2)?,
                date: row.get(3)?,
                status: row.get(4)?,
                priority: row.get(5)?,
                is_recurring: row.get::<_, i32>(6)? != 0,
                recurrence_pattern: row.get(7)?,
                recurrence_type: row.get(8)?,
                recurrence_day_of_week: row.get(9)?,
                recurrence_day_of_month: row.get(10)?,
                recurrence_interval: row.get(11)?,
                parent_task_id: row.get(12)?,
                phase_id: row.get(13)?,
                created_at: row.get(14)?,
                updated_at: row.get(15)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(tasks)
}

pub fn get_task_by_id(conn: &Connection, id: i64) -> Result<Task, String> {
    conn.query_row(
        "SELECT id, name, description, date, status, priority, is_recurring,
                recurrence_pattern, recurrence_type, recurrence_day_of_week,
                recurrence_day_of_month, recurrence_interval, parent_task_id,
                phase_id, created_at, updated_at
         FROM tasks WHERE id = ?1",
        [id],
        |row| {
            Ok(Task {
                id: row.get(0)?,
                name: row.get(1)?,
                description: row.get(2)?,
                date: row.get(3)?,
                status: row.get(4)?,
                priority: row.get(5)?,
                is_recurring: row.get::<_, i32>(6)? != 0,
                recurrence_pattern: row.get(7)?,
                recurrence_type: row.get(8)?,
                recurrence_day_of_week: row.get(9)?,
                recurrence_day_of_month: row.get(10)?,
                recurrence_interval: row.get(11)?,
                parent_task_id: row.get(12)?,
                phase_id: row.get(13)?,
                created_at: row.get(14)?,
                updated_at: row.get(15)?,
            })
        },
    )
    .map_err(|e| e.to_string())
}

pub fn create_task(conn: &Connection, data: &TaskFormData) -> Result<Task, String> {
    conn.execute(
        "INSERT INTO tasks (name, description, date, priority, is_recurring,
                            recurrence_type, recurrence_day_of_week, recurrence_day_of_month,
                            recurrence_interval)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)",
        rusqlite::params![
            data.name,
            data.description,
            data.date,
            data.priority,
            data.is_recurring as i32,
            data.recurrence_type,
            data.recurrence_day_of_week,
            data.recurrence_day_of_month,
            data.recurrence_interval,
        ],
    )
    .map_err(|e| e.to_string())?;

    let id = conn.last_insert_rowid();
    get_task_by_id(conn, id)
}

pub fn update_task(
    conn: &Connection,
    id: i64,
    data: &TaskFormData,
) -> Result<Task, String> {
    conn.execute(
        "UPDATE tasks SET name = ?1, description = ?2, date = ?3, priority = ?4,
                is_recurring = ?5, recurrence_type = ?6, recurrence_day_of_week = ?7,
                recurrence_day_of_month = ?8, recurrence_interval = ?9,
                updated_at = datetime('now')
         WHERE id = ?10",
        rusqlite::params![
            data.name,
            data.description,
            data.date,
            data.priority,
            data.is_recurring as i32,
            data.recurrence_type,
            data.recurrence_day_of_week,
            data.recurrence_day_of_month,
            data.recurrence_interval,
            id,
        ],
    )
    .map_err(|e| e.to_string())?;

    get_task_by_id(conn, id)
}

pub fn delete_task(conn: &Connection, id: i64) -> Result<(), String> {
    conn.execute("DELETE FROM tasks WHERE id = ?1", [id])
        .map_err(|e| e.to_string())?;
    Ok(())
}

pub fn get_tasks_by_date_range(
    conn: &Connection,
    start_date: &str,
    end_date: &str,
) -> Result<Vec<Task>, String> {
    let mut stmt = conn
        .prepare(
            "SELECT id, name, description, date, status, priority, is_recurring,
                    recurrence_pattern, recurrence_type, recurrence_day_of_week,
                    recurrence_day_of_month, recurrence_interval, parent_task_id,
                    phase_id, created_at, updated_at
             FROM tasks WHERE date >= ?1 AND date <= ?2 ORDER BY date ASC",
        )
        .map_err(|e| e.to_string())?;

    let tasks = stmt
        .query_map(rusqlite::params![start_date, end_date], |row| {
            Ok(Task {
                id: row.get(0)?,
                name: row.get(1)?,
                description: row.get(2)?,
                date: row.get(3)?,
                status: row.get(4)?,
                priority: row.get(5)?,
                is_recurring: row.get::<_, i32>(6)? != 0,
                recurrence_pattern: row.get(7)?,
                recurrence_type: row.get(8)?,
                recurrence_day_of_week: row.get(9)?,
                recurrence_day_of_month: row.get(10)?,
                recurrence_interval: row.get(11)?,
                parent_task_id: row.get(12)?,
                phase_id: row.get(13)?,
                created_at: row.get(14)?,
                updated_at: row.get(15)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(tasks)
}

pub fn get_task_counts(conn: &Connection) -> Result<serde_json::Value, String> {
    let now = chrono::Local::now().format("%Y-%m-%d").to_string();

    let count_days = |days: i32| -> Result<i64, String> {
        let future_date = chrono::Local::now()
            .checked_add_signed(chrono::Duration::days(days as i64))
            .ok_or_else(|| "Date arithmetic overflow saat menghitung task counts".to_string())?
            .format("%Y-%m-%d")
            .to_string();

        conn.query_row(
            "SELECT COUNT(*) FROM tasks WHERE status = 'Belum' AND date >= ?1 AND date <= ?2",
            rusqlite::params![now, future_date],
            |row| row.get(0),
        )
        .map_err(|e| e.to_string())
    };

    Ok(serde_json::json!({
        "threeDays": count_days(3)?,
        "sevenDays": count_days(7)?,
        "thirtyDays": count_days(30)?,
        "ninetyDays": count_days(90)?,
    }))
}

pub fn update_task_status(conn: &Connection, id: i64, status: &str) -> Result<Task, String> {
    conn.execute(
        "UPDATE tasks SET status = ?1, updated_at = datetime('now') WHERE id = ?2",
        rusqlite::params![status, id],
    )
    .map_err(|e| e.to_string())?;

    get_task_by_id(conn, id)
}

pub fn create_recurring_task_instance(
    conn: &Connection,
    parent_id: i64,
    new_date: &str,
) -> Result<Task, String> {
    let parent = get_task_by_id(conn, parent_id)?;

    conn.execute(
        "INSERT INTO tasks (name, description, date, status, priority, is_recurring,
                            recurrence_pattern, recurrence_type, recurrence_day_of_week,
                            recurrence_day_of_month, recurrence_interval, parent_task_id, phase_id)
         VALUES (?1, ?2, ?3, 'Belum', ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)",
        rusqlite::params![
            parent.name,
            parent.description,
            new_date,
            parent.priority,
            parent.is_recurring as i32,
            parent.recurrence_pattern,
            parent.recurrence_type,
            parent.recurrence_day_of_week,
            parent.recurrence_day_of_month,
            parent.recurrence_interval,
            parent.id,
            parent.phase_id,
        ],
    )
    .map_err(|e| e.to_string())?;

    let id = conn.last_insert_rowid();
    get_task_by_id(conn, id)
}

pub fn update_overdue_tasks(conn: &Connection) -> Result<Vec<Task>, String> {
    let today = chrono::Local::now().format("%Y-%m-%d").to_string();

    conn.execute(
        "UPDATE tasks SET status = 'Terlewat', updated_at = datetime('now')
         WHERE status = 'Belum' AND date < ?1",
        [&today],
    )
    .map_err(|e| e.to_string())?;

    get_tasks(conn)
}
