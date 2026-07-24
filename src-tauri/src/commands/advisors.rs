use rusqlite::Connection;
use crate::models::{Advisor, Partner, AdvisorFormData, PartnerFormData, AdvisorFormDataUpdate, PartnerFormDataUpdate};

pub fn get_advisors_by_project(conn: &Connection, project_id: i64) -> Result<Vec<Advisor>, String> {
    let mut stmt = conn
        .prepare(
            "SELECT id, project_id, name, phone, email
             FROM advisors WHERE project_id = ?1",
        )
        .map_err(|e| e.to_string())?;

    let advisors = stmt
        .query_map([project_id], |row| {
            Ok(Advisor {
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

    Ok(advisors)
}

pub fn add_advisor(conn: &Connection, data: &AdvisorFormData) -> Result<Advisor, String> {
    conn.execute(
        "INSERT INTO advisors (project_id, name, phone, email)
         VALUES (?1, ?2, ?3, ?4)",
        rusqlite::params![data.project_id, data.name, data.phone, data.email],
    )
    .map_err(|e| e.to_string())?;

    let id = conn.last_insert_rowid();

    conn.query_row(
        "SELECT id, project_id, name, phone, email
         FROM advisors WHERE id = ?1",
        [id],
        |row| {
            Ok(Advisor {
                id: row.get(0)?,
                project_id: row.get(1)?,
                name: row.get(2)?,
                phone: row.get(3)?,
                email: row.get(4)?,
            })
        },
    )
    .map_err(|e| e.to_string())
}

pub fn get_partners_by_project(conn: &Connection, project_id: i64) -> Result<Vec<Partner>, String> {
    let mut stmt = conn
        .prepare(
            "SELECT id, project_id, name, phone, email
             FROM partners WHERE project_id = ?1",
        )
        .map_err(|e| e.to_string())?;

    let partners = stmt
        .query_map([project_id], |row| {
            Ok(Partner {
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

    Ok(partners)
}

pub fn add_partner(conn: &Connection, data: &PartnerFormData) -> Result<Partner, String> {
    conn.execute(
        "INSERT INTO partners (project_id, name, phone, email)
         VALUES (?1, ?2, ?3, ?4)",
        rusqlite::params![data.project_id, data.name, data.phone, data.email],
    )
    .map_err(|e| e.to_string())?;

    let id = conn.last_insert_rowid();

    conn.query_row(
        "SELECT id, project_id, name, phone, email
         FROM partners WHERE id = ?1",
        [id],
        |row| {
            Ok(Partner {
                id: row.get(0)?,
                project_id: row.get(1)?,
                name: row.get(2)?,
                phone: row.get(3)?,
                email: row.get(4)?,
            })
        },
    )
    .map_err(|e| e.to_string())
}

pub fn update_advisor(conn: &Connection, data: &AdvisorFormDataUpdate) -> Result<Advisor, String> {
    conn.execute(
        "UPDATE advisors SET name = ?1, phone = ?2, email = ?3 WHERE id = ?4",
        rusqlite::params![data.name, data.phone, data.email, data.id],
    )
    .map_err(|e| e.to_string())?;

    conn.query_row(
        "SELECT id, project_id, name, phone, email
         FROM advisors WHERE id = ?1",
        [data.id],
        |row| {
            Ok(Advisor {
                id: row.get(0)?,
                project_id: row.get(1)?,
                name: row.get(2)?,
                phone: row.get(3)?,
                email: row.get(4)?,
            })
        },
    )
    .map_err(|e| e.to_string())
}

pub fn delete_advisor(conn: &Connection, id: i64) -> Result<(), String> {
    conn.execute("DELETE FROM advisors WHERE id = ?1", [id])
        .map_err(|e| e.to_string())?;
    Ok(())
}

pub fn update_partner(conn: &Connection, data: &PartnerFormDataUpdate) -> Result<Partner, String> {
    conn.execute(
        "UPDATE partners SET name = ?1, phone = ?2, email = ?3 WHERE id = ?4",
        rusqlite::params![data.name, data.phone, data.email, data.id],
    )
    .map_err(|e| e.to_string())?;

    conn.query_row(
        "SELECT id, project_id, name, phone, email
         FROM partners WHERE id = ?1",
        [data.id],
        |row| {
            Ok(Partner {
                id: row.get(0)?,
                project_id: row.get(1)?,
                name: row.get(2)?,
                phone: row.get(3)?,
                email: row.get(4)?,
            })
        },
    )
    .map_err(|e| e.to_string())
}

pub fn delete_partner(conn: &Connection, id: i64) -> Result<(), String> {
    conn.execute("DELETE FROM partners WHERE id = ?1", [id])
        .map_err(|e| e.to_string())?;
    Ok(())
}
