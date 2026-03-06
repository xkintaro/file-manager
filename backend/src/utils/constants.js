const path = require('path');
const fs = require('fs');

const UPLOAD_DIR = path.join(__dirname, '..', '..', process.env.VITE_UPLOAD_DIR || 'uploads');
const THUMBNAILS_DIR = path.join(__dirname, '..', '..', process.env.VITE_THUMBNAILS_DIR || 'thumbnails');

[UPLOAD_DIR, THUMBNAILS_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📂 Folder created: ${dir}`);
    }
});

module.exports = {
    UPLOAD_DIR,
    THUMBNAILS_DIR
};
