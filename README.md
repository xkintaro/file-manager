<div align="center">
  <img src="frontend/public/kintaro.png" width="120" height="120" />
  <br />
  <br />

  [![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
  [![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)

  <p align="center">
    <b>Self-Hosted File Management & Organization Station</b>
    <br />
    Upload. Tag. Filter. Archive locally.
    <br />
    <br />
    <a href="#features">Features</a> •
    <a href="#technologies">Technologies</a> •
    <a href="#installation">Installation</a> •
    <a href="#structure">Structure</a>
  </p>
</div>

---

## 📋 About

**Kintaro File Manager** is a self-hosted file management application with a cyberpunk-inspired interface. It lets you upload, organize, tag, and filter any type of file through a sleek, modern web interface backed by SQLite — no external database required.

All files are stored locally on your machine — no cloud, no third-party servers. Upload your files, assign tags and keywords, and find them instantly with powerful filtering. The application automatically generates thumbnails for images and videos, giving you a visual overview of your entire archive.

<img src="frontend/public/md/20260305210513749.jpg" width="100%" style="border-radius: 8px;" />

## <a id="features"></a> ✨ Features

### 📤 File Upload

Upload files through a drag-and-drop interface or traditional file picker.

- **Drag & Drop**: Drop files directly onto the upload zone for instant queuing.
- **Multi-File Upload**: Select and upload multiple files at once.
- **Tag on Upload**: Assign tags to files during the upload process.
- **Keyword on Upload**: Add searchable keywords to files before uploading.
- **Preview Toggle**: Choose whether to show or hide the file preview on upload.
- Supports all file types — images, videos, audio, documents, archives, and more.

### 🏷️ Tag Management

Create and manage a custom tag system to categorize your files.

- **Create Tags**: Define custom tags from a dedicated tag management panel.
- **Edit Tags**: Rename existing tags at any time.
- **Delete Tags**: Remove tags that are no longer needed.
- **Assign Tags**: Attach one or more tags to any file via a modal interface.
- **Tag Search**: Search through your tags when assigning or filtering.

### 🔑 Keyword System

Add keywords to files for granular search and discovery.

- **Per-File Keywords**: Assign comma-separated keywords to individual files.
- **Edit Keywords**: Update keywords through a dedicated modal at any time.
- **Keyword Search**: Instantly search across your archive by keyword.

### 🔍 Advanced Filtering

Find exactly what you need with multi-layered filtering options.

- **Keyword Search**: Real-time search bar that filters files by their keywords.
- **Tag Filtering**: Open the filter modal and select one or more tags to narrow results.
- **AND / OR Logic**: Toggle between AND (files must match all selected tags) and OR (files match any selected tag) filtering modes.
- **Tag Search in Filter**: Search through tags directly within the filter modal.
- **Combined Filters**: Apply keyword search and tag filters simultaneously.

### 🖼️ Thumbnails & Preview

Automatic thumbnail generation provides a visual overview of your archive.

- **Image Thumbnails**: Automatically generated via Sharp when an image is uploaded.
- **Video Thumbnails**: Extracted from the first frame using FFmpeg.
- **In-Browser Preview**: View files directly in the browser — supports 30+ MIME types including PDF, images, videos, audio, plain text, markdown, JSON, YAML, Office documents (DOCX, XLSX, PPTX), and more.
- **Preview Toggle**: Show or hide thumbnails on a per-file basis via the settings button.
- **Force Show All Previews**: Global toggle to override individual preview settings and display all thumbnails.
- **Grayscale-to-Color**: File cards display in grayscale and smoothly transition to full color on hover.

### ⬇️ Download & Export

Download files individually or in bulk.

- **Single Download**: Download any file with one click.
- **Bulk Download**: Select multiple files and download them as a single `.zip` archive.
- **Timestamped Archives**: ZIP files are named with a timestamp for easy identification.

### 🗑️ File Deletion

Remove files from your archive with confirmation.

- **Single Delete**: Delete individual files from their card actions.
- **Bulk Delete**: Select multiple files and delete them all at once.
- **Confirmation Dialog**: Prevents accidental deletions with a confirmation prompt.
- **Auto Cleanup**: Deletes both the original file and its thumbnail from disk.

### ✅ Selection & Bulk Operations

Manage files in bulk with intuitive selection controls.

- **Individual Selection**: Toggle selection on each file card.
- **Select All / Deselect All**: Select or deselect all visible files with a single click.
- **Selection Counter**: See how many files are selected out of the currently visible set.
- **Volume Display**: See the total storage volume of your archive at a glance.

### 🎨 Cyberpunk UI

A dark, modern interface designed for power users.

- **Dark Glassmorphism**: Deep black background with semi-transparent surfaces and subtle borders.
- **Neon Accent Colors**: Electric green (`#ccff00`) accent with complementary error, success, and warning colors.
- **Modern Typography**: Syne for headings, Plus Jakarta Sans for body text — imported from Google Fonts.
- **Responsive Design**: Fully responsive layout that adapts from mobile to ultra-wide displays.
- **Smooth Transitions**: Hover effects, color transitions, and scale animations on file cards.
- **Lazy Loading (Pagination)**: Files load in batches of 50 with a "Load More" button for optimal performance.

<img src="frontend/public/md/20260305210513666.jpg" width="100%" style="border-radius: 8px;" />

## <a id="technologies"></a> 🛠️ Technologies

### Backend
- **[Node.js](https://nodejs.org/)** — JavaScript runtime for the server.
- **[Express](https://expressjs.com/)** — Minimal web framework for REST API endpoints.
- **[SQLite](https://www.sqlite.org/)** + **[better-sqlite3](https://github.com/WiseLibs/better-sqlite3)** — Embedded SQL database with zero external dependencies.
- **[Multer](https://github.com/expressjs/multer)** — Middleware for handling multipart/form-data file uploads.
- **[Sharp](https://sharp.pixelplumbing.com/)** — High-performance image processing for thumbnail generation.
- **[Fluent-FFmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg)** — FFmpeg wrapper for video thumbnail extraction.
- **[Archiver](https://github.com/archiverjs/node-archiver)** — ZIP archive creation for bulk downloads.

### Frontend
- **[React 19](https://react.dev/)** — Component-based UI with the latest React features.
- **[Vite](https://vitejs.dev/)** — Lightning-fast build tool and dev server.
- **[Tailwind CSS v4](https://tailwindcss.com/)** — Utility-first CSS framework for rapid styling.
- **[Framer Motion](https://www.framer.com/motion/)** — Production-ready animation library.
- **[Axios](https://axios-http.com/)** — Promise-based HTTP client.
- **[React Icons](https://react-icons.github.io/react-icons/)** — Popular icon sets as React components.

<img src="frontend/public/md/20260305210513573.jpg" width="100%" style="border-radius: 8px;" />

## <a id="installation"></a> 🚀 Installation

### Requirements
- **Node.js** (v18+)

### Step-by-Step Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/xkintaro/file-manager.git
   cd file-manager
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure Environment Variables:**

   **Backend** (`backend/.env`):
   ```env
   BACKEND_PORT=5034
   FRONTEND_URL=http://localhost:5033
   UPLOAD_DIR=uploads
   THUMBNAILS_DIR=thumbnails
   ```

   **Frontend** (`frontend/.env`):
   ```env
   VITE_API_URL=http://localhost:5034
   VITE_FRONTEND_PORT=5033
   VITE_UPLOAD_DIR=uploads
   VITE_THUMBNAILS_DIR=thumbnails
   ```

5. **Start the Application:**

   **Option A — Using the batch script (Windows):**
   ```
   run.bat
   ```

   **Option B — Manual start:**
   ```bash
   # Terminal 1 — Backend
   cd backend && node src/server.js

   # Terminal 2 — Frontend
   cd frontend && npm run dev
   ```

6. Open `http://localhost:5033` in your browser to start managing your files.

<img src="frontend/public/md/20260305210513455.jpg" width="100%" style="border-radius: 8px;" />

## <a id="structure"></a> 📂 Project Structure

```
kintaro-file-manager/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── file.controller.js     # File upload, delete, download, tag/keyword update
│   │   │   └── tag.controller.js      # Tag CRUD operations
│   │   ├── db/
│   │   │   └── database.js            # SQLite connection and schema initialization
│   │   ├── models/
│   │   │   ├── file.model.js          # File data model (SQLite queries)
│   │   │   └── tag.model.js           # Tag data model (SQLite queries)
│   │   ├── routes/
│   │   │   ├── file.routes.js         # File API endpoints
│   │   │   └── tag.routes.js          # Tag API endpoints
│   │   ├── utils/
│   │   │   └── constants.js           # Directory path configuration
│   │   └── server.js                  # Express server entry point
│   ├── data/                          # SQLite database file (gitignored)
│   ├── uploads/                       # Uploaded files directory (gitignored)
│   ├── thumbnails/                    # Generated thumbnails (gitignored)
│   ├── package.json                   # Backend dependencies
│   └── .env                           # Backend environment config
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── file/
│   │   │   │   ├── FileList.jsx       # Main file grid with search, filter, selection
│   │   │   │   └── FileUpload.jsx     # Upload modal with drag-and-drop
│   │   │   ├── tag/
│   │   │   │   └── TagManagement.jsx  # Tag create, edit, delete panel
│   │   │   └── ui/                    # Reusable UI components (Button, Modal, etc.)
│   │   ├── hooks/                     # Custom React hooks for data fetching
│   │   ├── services/                  # API service functions (file, tag)
│   │   ├── utils/                     # Utility functions (formatting)
│   │   ├── App.jsx                    # Main application component
│   │   └── index.css                  # Global styles and design tokens
│   ├── public/                        # Static assets (logos, icons)
│   ├── vite.config.js                 # Vite configuration with API proxy
│   ├── package.json                   # Frontend dependencies
│   └── .env                           # Frontend environment config
├── run.bat                            # Windows batch script to start both services
├── run-kintaro-file-manager.vbs       # Windows silent startup script
└── README.md
```

---

<p align="center">
  <sub>❤️ Developed by Kintaro.</sub>
</p>
