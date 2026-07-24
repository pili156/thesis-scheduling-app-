use rusqlite::Connection;

pub fn create_tables(conn: &Connection) -> Result<(), rusqlite::Error> {
    conn.execute_batch(
        "
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT DEFAULT '',
            date TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'Belum' CHECK(status IN ('Belum', 'Selesai', 'Terlewat')),
            priority TEXT NOT NULL DEFAULT 'Sedang' CHECK(priority IN ('Tinggi', 'Sedang', 'Rendah')),
            is_recurring INTEGER NOT NULL DEFAULT 0,
            recurrence_pattern TEXT,
            recurrence_type TEXT CHECK(recurrence_type IN ('daily', 'weekly', 'monthly', 'custom')),
            recurrence_day_of_week INTEGER,
            recurrence_day_of_month INTEGER,
            recurrence_interval INTEGER DEFAULT 1,
            parent_task_id INTEGER REFERENCES tasks(id) ON DELETE SET NULL,
            phase_id INTEGER REFERENCES phases(id) ON DELETE SET NULL,
            created_at TEXT NOT NULL DEFAULT (datetime('now')),
            updated_at TEXT NOT NULL DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT DEFAULT '',
            start_date TEXT,
            end_date TEXT,
            created_at TEXT NOT NULL DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS phases (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
            name TEXT NOT NULL,
            description TEXT DEFAULT '',
            phase_order INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS subtasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            phase_id INTEGER NOT NULL REFERENCES phases(id) ON DELETE CASCADE,
            name TEXT NOT NULL,
            description TEXT DEFAULT '',
            status TEXT NOT NULL DEFAULT 'Belum' CHECK(status IN ('Belum', 'Selesai', 'Terlewat')),
            priority TEXT NOT NULL DEFAULT 'Sedang' CHECK(priority IN ('Tinggi', 'Sedang', 'Rendah')),
            estimated_days INTEGER,
            actual_days INTEGER,
            due_date TEXT,
            created_at TEXT NOT NULL DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS advisors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
            name TEXT NOT NULL,
            phone TEXT DEFAULT '',
            email TEXT DEFAULT ''
        );

        CREATE TABLE IF NOT EXISTS partners (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
            name TEXT NOT NULL,
            phone TEXT DEFAULT '',
            email TEXT DEFAULT ''
        );
        ",
    )?;

    match conn.execute(
        "ALTER TABLE subtasks ADD COLUMN priority TEXT NOT NULL DEFAULT 'Sedang' CHECK(priority IN ('Tinggi', 'Sedang', 'Rendah'))",
        [],
    ) {
        Ok(_) => {}
        Err(e) => {
            let msg = e.to_string();
            if msg.contains("duplicate column") {
                log::info!("[DB] Kolom priority subtasks sudah ada, skip migrasi");
            } else {
                log::warn!("[DB] Migrasi kolom priority subtasks gagal: {e}");
                return Err(e);
            }
        }
    }

    conn.execute_batch(
        "
        CREATE INDEX IF NOT EXISTS idx_tasks_date ON tasks(date);
        CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
        CREATE INDEX IF NOT EXISTS idx_tasks_status_date ON tasks(status, date);
        CREATE INDEX IF NOT EXISTS idx_subtasks_phase_id ON subtasks(phase_id);
        CREATE INDEX IF NOT EXISTS idx_phases_project_id ON phases(project_id);
        CREATE INDEX IF NOT EXISTS idx_advisors_project_id ON advisors(project_id);
        CREATE INDEX IF NOT EXISTS idx_partners_project_id ON partners(project_id);
        ",
    )?;

    Ok(())
}
