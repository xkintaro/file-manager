const archiver = require('archiver');
const path = require('path');
const fs = require('fs');
const File = require('../models/file.model');
const { UPLOAD_DIR, THUMBNAILS_DIR } = require('../utils/constants');
const sharp = require('sharp');
const ffmpegPath = require('ffmpeg-static');
const ffprobe = require('@ffprobe-installer/ffprobe');
const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobe.path);

function generateRandomString(length = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

exports.generateFileName = (filename) => {
    const ext = path.extname(filename);
    const date = new Date().toISOString().replace(/[-:.TZ]/g, '');
    return `${date}_${generateRandomString(10)}${ext}`;
};

async function generateVideoThumbnail(filePath, filename) {
    return new Promise((resolve, reject) => {
        const thumbName = `thumbnail_${path.parse(filename).name}.jpg`;

        ffmpeg(filePath)
            .screenshots({
                count: 1,
                folder: THUMBNAILS_DIR,
                filename: thumbName,
                size: '320x240',
            })
            .on('end', () => resolve(thumbName))
            .on('error', (err) => reject(err));
    });
}

async function generateImageThumbnail(filePath, filename) {
    const thumbName = `thumbnail_${path.parse(filename).name}.jpg`;
    const outputPath = path.join(THUMBNAILS_DIR, thumbName);

    await sharp(filePath)
        .resize(320, 240)
        .toFile(outputPath);

    return thumbName;
}

exports.listFiles = async (req, res) => {
    try {
        const files = File.findAll();
        return res.json(files);
    } catch (err) {
        console.error('File listing error:', err);
        return res.status(500).json({ message: 'File list could not be retrieved' });
    }
};

exports.viewFile = async (req, res) => {
    try {
        const file = File.findById(req.params.id);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        const filePath = path.join(UPLOAD_DIR, file.filename);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found' });
        }

        const viewableTypes = [
            'application/pdf',

            'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
            'image/bmp', 'image/tiff', 'image/x-icon', 'image/vnd.microsoft.icon',

            'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime',
            'video/x-msvideo', 'video/x-ms-wmv', 'video/3gpp', 'video/3gpp2',

            'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm',
            'audio/aac', 'audio/x-m4a', 'audio/flac', 'audio/x-wav',

            'text/plain', 'text/html', 'text/css', 'text/javascript',
            'text/xml', 'application/xml', 'text/csv', 'text/markdown',
            'application/json', 'application/x-yaml', 'text/yaml',

            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',

            'application/rtf', 'text/rtf'
        ];

        if (!viewableTypes.includes(file.mimetype)) {
            return res.status(400).json({ message: 'This file type cannot be displayed' });
        }

        res.setHeader('Content-Disposition', 'inline; filename="' + file.filename + '"');
        res.setHeader('Content-Type', file.mimetype);

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    } catch (err) {
        console.error('File viewing error:', err);
        return res.status(500).json({ message: 'File could not be displayed' });
    }
};

exports.uploadFile = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'File not found!' });
        }

        const savedFiles = [];
        const tags = req.body.tags ? JSON.parse(req.body.tags) : [];

        const showpreview = req.body.showpreview === 'false' ? false : true;

        for (const f of req.files) {
            let thumbnail = null;

            if (f.mimetype.startsWith('video/')) {
                try {
                    const thumbName = await generateVideoThumbnail(
                        path.join(UPLOAD_DIR, f.filename),
                        f.filename
                    );
                    thumbnail = thumbName;
                } catch (err) {
                    console.error('Video thumbnail error:', err);
                }
            }
            else if (f.mimetype.startsWith('image/')) {
                try {
                    const thumbName = await generateImageThumbnail(
                        path.join(UPLOAD_DIR, f.filename),
                        f.filename
                    );
                    thumbnail = thumbName;
                } catch (err) {
                    console.error('Image thumbnail error:', err);
                }
            }

            const fileData = File.create({
                filename: f.filename,
                size: f.size,
                mimetype: f.mimetype,
                thumbnail,
                showpreview: showpreview,
                keywords: req.body.keywords ? req.body.keywords.split(',').map(k => k.trim()) : [],
                tags: tags
            });
            savedFiles.push(fileData);
        }

        return res.json({ message: 'Files uploaded successfully', files: savedFiles });
    } catch (err) {
        console.error('File upload error:', err);
        return res.status(500).json({ message: 'File upload failed' });
    }
};

exports.updatePreviewStatus = async (req, res) => {
    try {
        const { fileId, showpreview } = req.body;

        if (!fileId) {
            return res.status(400).json({ message: 'File ID required!' });
        }

        const file = File.updateShowPreview(fileId, showpreview);
        if (!file) {
            return res.status(404).json({ message: 'File not found!' });
        }

        return res.json({ message: 'Preview status updated successfully', file });
    } catch (err) {
        console.error('Preview status update error:', err);
        return res.status(500).json({ message: 'Preview status update failed' });
    }
};

exports.deleteFile = async (req, res) => {
    try {
        const { fileIds } = req.body;

        if (!fileIds || fileIds.length === 0) {
            return res.status(400).json({ message: 'File not selected!' });
        }

        const files = File.findByIds(fileIds);

        for (const file of files) {
            const filePath = path.join(UPLOAD_DIR, file.filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            if (file.thumbnail) {
                const thumbPath = path.join(THUMBNAILS_DIR, file.thumbnail);
                if (fs.existsSync(thumbPath)) {
                    fs.unlinkSync(thumbPath);
                }
            }

            File.deleteById(file._id);
        }

        return res.json({ message: 'Files deleted successfully' });
    } catch (err) {
        console.error('File deletion error:', err);
        return res.status(500).json({ message: 'File deletion failed' });
    }
};

exports.downloadFile = async (req, res) => {
    try {
        const file = File.findById(req.params.id);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        const filePath = path.join(UPLOAD_DIR, file.filename);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found' });
        }

        res.download(filePath, file.originalname || file.filename);
    } catch (err) {
        console.error('File download error:', err);
        return res.status(500).json({ message: 'File download failed' });
    }
};

exports.downloadSelected = async (req, res) => {
    try {
        const { fileIds } = req.body;
        if (!fileIds || fileIds.length === 0) {
            return res.status(400).json({ message: 'File not selected!' });
        }

        const files = File.findByIds(fileIds);
        if (files.length === 0) {
            return res.status(404).json({ message: 'Files not found' });
        }

        const archive = archiver('zip', { zlib: { level: 9 } });
        const zipName = `download_${Date.now()}.zip`;

        res.attachment(zipName);
        archive.pipe(res);

        for (const file of files) {
            const filePath = path.join(UPLOAD_DIR, file.filename);
            if (fs.existsSync(filePath)) {
                archive.file(filePath, { name: file.originalname || file.filename });
            }
        }

        archive.finalize();
    } catch (err) {
        console.error('Bulk download error:', err);
        return res.status(500).json({ message: 'Bulk download failed' });
    }
};

exports.updateFileTags = async (req, res) => {
    try {
        const { fileId, tags } = req.body;

        if (!fileId) return res.status(400).json({ message: 'File ID required!' });

        const existingFile = File.findById(fileId);
        if (!existingFile) return res.status(404).json({ message: 'File not found!' });

        const file = File.updateTags(fileId, tags);

        return res.json({ message: 'Tags updated successfully', file });
    } catch (err) {
        console.error('Tag update error:', err);
        return res.status(500).json({ message: 'Tag update failed' });
    }
};

exports.updateFileKeywords = async (req, res) => {
    try {
        const { fileId, keywords } = req.body;

        if (!fileId) return res.status(400).json({ message: 'File ID required!' });

        const file = File.updateKeywords(fileId, keywords);
        if (!file) return res.status(404).json({ message: 'File not found!' });

        return res.json({ message: 'Keywords updated successfully', file });
    } catch (err) {
        console.error('Keyword update error:', err);
        return res.status(500).json({ message: 'Keyword update failed' });
    }
};