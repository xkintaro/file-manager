const db = require('../db/database');
const { v4: uuidv4 } = require('uuid');

function formatRow(row) {
    if (!row) return null;
    return {
        _id: row.id,
        name: row.name,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
}

const Tag = {
    findAll() {
        const rows = db.prepare('SELECT * FROM tags ORDER BY name ASC').all();
        return rows.map(formatRow);
    },

    findById(id) {
        const row = db.prepare('SELECT * FROM tags WHERE id = ?').get(id);
        return formatRow(row);
    },

    create(name) {
        const id = uuidv4();
        const now = new Date().toISOString();
        db.prepare('INSERT INTO tags (id, name, created_at, updated_at) VALUES (?, ?, ?, ?)').run(id, name.trim(), now, now);
        return this.findById(id);
    },

    updateById(id, name) {
        const now = new Date().toISOString();
        const result = db.prepare('UPDATE tags SET name = ?, updated_at = ? WHERE id = ?').run(name.trim(), now, id);
        if (result.changes === 0) return null;
        return this.findById(id);
    },

    deleteById(id) {
        const tag = this.findById(id);
        if (!tag) return null;
        db.prepare('DELETE FROM tags WHERE id = ?').run(id);
        return tag;
    }
};

module.exports = Tag;