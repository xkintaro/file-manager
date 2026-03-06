const Tag = require('../models/tag.model');

exports.getTags = async (req, res) => {
    try {
        const tags = Tag.findAll();
        res.json(tags);
    } catch (err) {
        res.status(500).json({ message: 'Tag retrieval failed', error: err.message });
    }
};

exports.createTag = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || name.trim() === "") {
            return res.status(400).json({ message: 'Tag name required' });
        }

        const newTag = Tag.create(name);
        res.status(201).json(newTag);
    } catch (err) {
        if (err.message && err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ message: 'This tag already exists' });
        }
        res.status(500).json({ message: 'Tag creation failed', error: err.message });
    }
};

exports.updateTag = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const updatedTag = Tag.updateById(id, name);

        if (!updatedTag) {
            return res.status(404).json({ message: 'Tag not found' });
        }

        res.json(updatedTag);
    } catch (err) {
        res.status(500).json({ message: 'Tag update failed', error: err.message });
    }
};

exports.deleteTag = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedTag = Tag.deleteById(id);

        if (!deletedTag) {
            return res.status(404).json({ message: 'Tag not found' });
        }

        res.json({ message: 'Tag deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Tag deletion failed', error: err.message });
    }
};
