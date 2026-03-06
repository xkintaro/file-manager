const express = require('express');
const multer = require('multer');
const { uploadFile, listFiles, viewFile, generateFileName, deleteFile, downloadFile, downloadSelected, updateFileTags, updateFileKeywords, updatePreviewStatus } = require('../controllers/file.controller');
const { UPLOAD_DIR } = require('../utils/constants');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const filename = generateFileName(file.originalname);
        cb(null, filename);
    }
});

const upload = multer({
    storage,
    preservePath: true
});

router.post('/upload', upload.array('files'), uploadFile);
router.put('/update_preview', updatePreviewStatus);
router.get('/list', listFiles);
router.get('/view/:id', viewFile);
router.post('/delete', deleteFile);
router.get('/download/:id', downloadFile);
router.post('/download_selected', downloadSelected);
router.put('/update_tags', updateFileTags);
router.put('/update_keywords', updateFileKeywords);


module.exports = router; 