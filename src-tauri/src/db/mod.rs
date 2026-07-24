pub mod schema;

use rusqlite::Connection;
use std::path::{Path, PathBuf};

pub fn get_db_path(app_dir: PathBuf) -> PathBuf {
    app_dir.join("schedule_thesis.db")
}

pub fn init_db(db_path: &Path) -> Result<Connection, String> {
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    conn.execute_batch("PRAGMA journal_mode=WAL;")
        .map_err(|e| e.to_string())?;
    conn.execute_batch("PRAGMA foreign_keys=ON;")
        .map_err(|e| e.to_string())?;

    schema::create_tables(&conn).map_err(|e| e.to_string())?;

    Ok(conn)
}
