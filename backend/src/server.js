require('dotenv').config();
const express = require('express');
const cors = require('cors');

require('./db/database');

const fileRoutes = require('./routes/file.routes');
const tagRoutes = require('./routes/tag.routes');

const PORT = process.env.BACKEND_PORT || 5006;

const { UPLOAD_DIR, THUMBNAILS_DIR } = require('./utils/constants');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/tags', tagRoutes);
app.use('/api/files', fileRoutes);

app.use('/uploads', express.static(UPLOAD_DIR));
app.use('/thumbnails', express.static(THUMBNAILS_DIR));

app.get('/', (req, res) => res.send('Server is running!'));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Upload directory: ${UPLOAD_DIR}`);
    console.log(`Thumbnail directory: ${THUMBNAILS_DIR}`);
});