use rusqlite::Connection;
use crate::models::Task;

pub fn get_due_tasks_for_notification(conn: &Connection) -> Result<Vec<Task>, String> {
    let today = chrono::Local::now().format("%Y-%m-%d").to_string();

    let mut stmt = conn
        .prepare(
            "SELECT id, name, description, date, status, priority, is_recurring,
                    recurrence_pattern, recurrence_type, recurrence_day_of_week,
                    recurrence_day_of_month, recurrence_interval, parent_task_id,
                    phase_id, created_at, updated_at
             FROM tasks
             WHERE status = 'Belum'
               AND date <= date(?1, '+1 day')
             ORDER BY date ASC",
        )
        .map_err(|e| e.to_string())?;

    let tasks = stmt
        .query_map([today], |row| {
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
