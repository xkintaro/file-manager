const db = require('../db/database');
const { v4: uuidv4 } = require('uuid');

function formatFileRow(row) {
    if (!row) return null;
    return {
        _id: row.id,
        filename: row.filename,
        size: row.size,
        thumbnail: row.thumbnail || null,
        showpreview: row.showpreview === 1,
        mimetype: row.mimetype || null,
        keywords: JSON.parse(row.keywords || '[]'),
        tags: [],
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
}

function getTagsForFile(fileId) {
    const rows = db.prepare(`
        SELECT t.id, t.name, t.created_at, t.updated_at
        FROM tags t
        INNER JOIN file_tags ft ON ft.tag_id = t.id
        WHERE ft.file_id = ?
    `).all(fileId);

    return rows.map(row => ({
        _id: row.id,
        name: row.name,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    }));
}

function populateTags(file) {
    if (!file) return null;
    file.tags = getTagsForFile(file._id);
    return file;
}

const File = {
    create(data) {
        const id = uuidv4();
        const now = new Date().toISOString();
        const keywords = JSON.stringify(data.keywords || []);

        db.prepare(`
            INSERT INTO files (id, filename, size, thumbnail, showpreview, mimetype, keywords, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            id,
            data.filename,
            data.size,
            data.thumbnail || null,
            data.showpreview ? 1 : 0,
            data.mimetype || null,
            keywords,
            now,
            now
        );

        if (data.tags && data.tags.length > 0) {
            const insertTag = db.prepare('INSERT OR IGNORE INTO file_tags (file_id, tag_id) VALUES (?, ?)');
            const insertMany = db.transaction((tags) => {
                for (const tagId of tags) {
                    insertTag.run(id, tagId);
                }
            });
            insertMany(data.tags);
        }

        return this.findById(id);
    },

    findAll() {
        const rows = db.prepare('SELECT * FROM files ORDER BY created_at DESC').all();
        return rows.map(row => populateTags(formatFileRow(row)));
    },

    findById(id) {
        const row = db.prepare('SELECT * FROM files WHERE id = ?').get(id);
        return populateTags(formatFileRow(row));
    },

    findByIds(ids) {
        if (!ids || ids.length === 0) return [];
        const placeholders = ids.map(() => '?').join(',');
        const rows = db.prepare(`SELECT * FROM files WHERE id IN (${placeholders})`).all(...ids);
        return rows.map(row => populateTags(formatFileRow(row)));
    },

    updateShowPreview(id, showpreview) {
        const now = new Date().toISOString();
        const result = db.prepare('UPDATE files SET showpreview = ?, updated_at = ? WHERE id = ?').run(showpreview ? 1 : 0, now, id);
        if (result.changes === 0) return null;
        return this.findById(id);
    },

    updateTags(id, tagIds) {
        const now = new Date().toISOString();
        const update = db.transaction(() => {
            db.prepare('DELETE FROM file_tags WHERE file_id = ?').run(id);
            if (tagIds && tagIds.length > 0) {
                const insertTag = db.prepare('INSERT OR IGNORE INTO file_tags (file_id, tag_id) VALUES (?, ?)');
                for (const tagId of tagIds) {
                    insertTag.run(id, tagId);
                }
            }
            db.prepare('UPDATE files SET updated_at = ? WHERE id = ?').run(now, id);
        });
        update();
        return this.findById(id);
    },

    updateKeywords(id, keywords) {
        const now = new Date().toISOString();
        const result = db.prepare('UPDATE files SET keywords = ?, updated_at = ? WHERE id = ?').run(JSON.stringify(keywords), now, id);
        if (result.changes === 0) return null;
        return this.findById(id);
    },

    deleteById(id) {
        db.prepare('DELETE FROM files WHERE id = ?').run(id);
    }
};

module.exports = File;