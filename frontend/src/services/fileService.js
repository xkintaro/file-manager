const API_URL = import.meta.env.VITE_API_URL + '/api/files';

export async function listFiles() {
    const res = await fetch(`${API_URL}/list`);
    if (!res.ok) {
        throw new Error('Failed to retrieve file list');
    }
    return res.json();
}

export function viewFile(fileId) {
    window.open(`${API_URL}/view/${fileId}`, '_blank');
}

export async function uploadFiles(files, keywords = '', tags = [], showpreview = true) {
    const formData = new FormData();
    for (const file of files) {
        formData.append('files', file);
    }

    formData.append('keywords', keywords);
    formData.append('tags', JSON.stringify(tags));
    formData.append('showpreview', showpreview);

    const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) {
        throw new Error('File upload failed');
    }
    return res.json();
}

export async function updateFilePreviewStatus(fileId, showpreview) {
    const res = await fetch(`${API_URL}/update_preview`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fileId, showpreview })
    });

    if (!res.ok) {
        throw new Error('Failed to update preview status');
    }
    return res.json();
}

export async function deleteFiles(fileIds) {
    const res = await fetch(`${API_URL}/delete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fileIds })
    });

    if (!res.ok) {
        throw new Error('File deletion failed');
    }
    return res.json();
}

export async function downloadFile(fileId) {
    window.open(`${API_URL}/download/${fileId}`, '_blank');
}

export async function downloadSelectedFiles(fileIds) {
    const res = await fetch(`${API_URL}/download_selected`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fileIds })
    });

    if (!res.ok) {
        throw new Error('Batch download failed');
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kintaro_manager_${Date.now()}.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
}

export async function updateFileTags(fileId, tags) {
    const res = await fetch(`${API_URL}/update_tags`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fileId, tags })
    });

    if (!res.ok) {
        throw new Error('Failed to update tags');
    }
    return res.json();
}


export async function updateFileKeywords(fileId, keywords) {
    const res = await fetch(`${API_URL}/update_keywords`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fileId, keywords })
    });

    if (!res.ok) {
        throw new Error('Failed to update keywords');
    }
    return res.json();
}
