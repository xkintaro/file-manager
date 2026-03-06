import { useState, useEffect } from 'react';
import { Modal, ModalFooter } from '../ui/Modal';
import { Button } from '../ui/Button';
import { TextBox } from '../ui/TextBox';
import { Description } from '../ui/Description';
import { Checkbox } from '../ui/Checkbox';

import { deleteFiles, downloadFile, downloadSelectedFiles, viewFile, updateFileTags, updateFileKeywords, updateFilePreviewStatus } from '../../services/fileService';
import { formatFileSize, formatDate } from '../../utils/format';
import TagManagement from "../tag/TagManagement";
import FileUpload from './FileUpload';

import { IoMdDownload } from "react-icons/io";
import { MdDeleteForever, MdSettings } from "react-icons/md";
import { FaEye, FaTags, FaKey, FaFilter, FaEyeSlash, FaFileAlt, FaGithub, FaDiscord } from "react-icons/fa";

function FileList({ allFiles, allTags, fetchTags, initialPageSize = 50 }) {
    const [files, setFiles] = useState([]);
    const [filteredFiles, setFilteredFiles] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [visibleTagsModal, setVisibleTagsModal] = useState(false);
    const [visibleKeywordsModal, setVisibleKeywordsModal] = useState(false);
    const [visibleFilterModal, setVisibleFilterModal] = useState(false);
    const [visiblePreviewModal, setVisiblePreviewModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedTags, setSelectedTags] = useState([]);
    const [filterTags, setFilterTags] = useState([]);
    const [keywordInput, setKeywordInput] = useState("");
    const [selectedFileForKeywords, setSelectedFileForKeywords] = useState(null);
    const [selectedFileForPreview, setSelectedFileForPreview] = useState(null);
    const [previewStatus, setPreviewStatus] = useState(false);
    const [visibleCount, setVisibleCount] = useState(initialPageSize);
    const [filterTagSearch, setFilterTagSearch] = useState('');
    const [editTagSearch, setEditTagSearch] = useState('');
    const [isAndFilter, setIsAndFilter] = useState(false);
    const [forceShowAllPreviews, setForceShowAllPreviews] = useState(false);

    useEffect(() => {
        setFiles([...allFiles]);
    }, [allFiles]);

    useEffect(() => {
        applyFilters();
    }, [files, searchKeyword, filterTags, isAndFilter]);

    const totalFileSize = files.reduce((total, file) => total + file.size, 0);
    const filteredFileSize = filteredFiles.reduce((total, file) => total + file.size, 0);
    const selectedFileSize = files
        .filter(file => selectedIds.includes(file._id))
        .reduce((total, file) => total + file.size, 0);

    const filteredFilterTags = allTags.filter(tag =>
        tag.name.toLowerCase().includes(filterTagSearch.toLowerCase())
    );

    const filteredEditTags = allTags.filter(tag =>
        tag.name.toLowerCase().includes(editTagSearch.toLowerCase())
    );

    const updateFileInList = (fileId, updates) => {
        setFiles(prevFiles =>
            prevFiles.map(file =>
                file._id === fileId ? { ...file, ...updates } : file
            )
        );
    };

    const openPreviewModal = (file) => {
        setSelectedFileForPreview(file);
        setPreviewStatus(file.showpreview);
        setVisiblePreviewModal(true);
    };

    const handleSavePreviewStatus = async () => {
        if (!selectedFileForPreview) return;
        try {
            await updateFilePreviewStatus(selectedFileForPreview._id, previewStatus);
            updateFileInList(selectedFileForPreview._id, { showpreview: previewStatus });
            setVisiblePreviewModal(false);
        } catch (error) {
            console.error("Failed to update preview status:", error);
            alert("Preview status could not be updated.");
        }
    };

    const getPreview = (file) => {
        if (!file.showpreview && !forceShowAllPreviews) {
            return 'hidden';
        }

        if (file.thumbnail) {
            return file.thumbnail.startsWith('http')
                ? file.thumbnail
                : `${import.meta.env.VITE_API_URL}/thumbnails/${file.thumbnail}`;
        }

        if (file.mimetype.startsWith("image/")) {
            return file.filename.startsWith('http')
                ? file.filename
                : `${import.meta.env.VITE_API_URL}/uploads/${file.filename}`;
        }

        return 'default_icon';
    };

    const applyFilters = () => {
        let result = [...files];

        if (searchKeyword) {
            const keywordLower = searchKeyword.toLowerCase();
            result = result.filter(file =>
                file.keywords?.some(kw => kw.toLowerCase().includes(keywordLower)));
        }

        if (filterTags.length > 0) {
            if (isAndFilter) {
                result = result.filter(file => {
                    const fileTagIds = file.tags?.map(t => t._id) || [];
                    return filterTags.every(filterTagId => fileTagIds.includes(filterTagId));
                });
            } else {
                result = result.filter(file =>
                    file.tags?.some(tag => filterTags.includes(tag._id))
                );
            }
        }

        setFilteredFiles(result);
        setSelectedIds([]);
    };

    const handleCloseFilterModal = () => {
        setVisibleFilterModal(false);
    };

    const handleLoadMore = () => {
        setVisibleCount(prevCount => prevCount + initialPageSize);
    };

    const openTagModal = (file) => {
        setSelectedFile(file);
        setSelectedTags(file.tags?.map(tag => tag._id) || []);
        setEditTagSearch('');
        setVisibleTagsModal(true);
    };

    const toggleTag = (tagId) => {
        setSelectedTags(prev =>
            prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
        );
    };

    const handleSaveTags = async () => {
        if (!selectedFile) return;
        try {
            await updateFileTags(selectedFile._id, selectedTags);
            const updatedTags = allTags.filter(tag => selectedTags.includes(tag._id));
            updateFileInList(selectedFile._id, { tags: updatedTags });
            setVisibleTagsModal(false);
        } catch (err) {
            console.error('Error updating tags:', err);
            alert('Failed to update tags');
        }
    };

    const openKeywordsModal = (file) => {
        setSelectedFileForKeywords(file);
        setKeywordInput(file.keywords ? file.keywords.join(', ') : '');
        setVisibleKeywordsModal(true);
    };

    const handleSaveKeywords = async () => {
        if (!selectedFileForKeywords) return;
        const keywordsArray = keywordInput.split(',').map(k => k.trim()).filter(k => k);
        try {
            await updateFileKeywords(selectedFileForKeywords._id, keywordsArray);
            updateFileInList(selectedFileForKeywords._id, { keywords: keywordsArray });
            setVisibleKeywordsModal(false);
        } catch (err) {
            console.error('Error updating keywords:', err);
            alert('Failed to update keywords');
        }
    };

    const handleDelete = async (fileIds) => {
        if (!fileIds || fileIds.length === 0) return;
        if (!window.confirm(`Are you sure you want to delete ${fileIds.length} files?`)) return;
        try {
            await deleteFiles(fileIds);
            setFiles(prevFiles => prevFiles.filter(file => !fileIds.includes(file._id)));
            setSelectedIds(prev => prev.filter(id => !fileIds.includes(id)));
        } catch (err) {
            console.error('Deletion error:', err);
            alert('Error while deleting files');
        }
    };

    const isViewable = (mimeType) => {
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
        return viewableTypes.includes(mimeType);
    };

    const toggleSelect = (fileId) => {
        setSelectedIds(prev =>
            prev.includes(fileId) ? prev.filter(id => id !== fileId) : [...prev, fileId]
        );
    };

    const toggleSelectAll = () => {
        const currentlyDisplayedFiles = filteredFiles.slice(0, visibleCount).map(file => file._id);

        if (selectedIds.length === currentlyDisplayedFiles.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(currentlyDisplayedFiles);
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-50 w-full bg-background border-b border-border shadow-2xl">
                <div className="flex flex-wrap lg:flex-nowrap px-0 md:px-10 max-w-[2400px] mx-auto w-full">
                    <div className="flex items-stretch border-b lg:border-b-0 border-border w-full lg:w-auto">
                        <div className="flex-1 lg:flex-none flex items-stretch justify-center border-l border-r border-border hover:bg-surface transition-colors">
                            <FileUpload onUploadSuccess={() => window.location.reload()} allTags={allTags} fetchTags={fetchTags} />
                        </div>
                        <div className="flex-1 lg:flex-none flex items-stretch justify-center border-r border-border hover:bg-surface transition-colors">
                            <TagManagement allTags={allTags} fetchTags={fetchTags} />
                        </div>
                        <div className="flex items-center justify-center px-4 bg-black gap-4 border-l-0 lg:border-l border-border hover:bg-surface transition-colors">
                            <a href="https://github.com/xkintaro/file-manager" target="_blank" rel="noreferrer" className="text-muted hover:text-white transition-colors">
                                <FaGithub size={18} />
                            </a>
                            <a href="https://discord.gg/NSQk27Zdkv" target="_blank" rel="noreferrer" className="text-muted hover:text-[#5865F2] transition-colors">
                                <FaDiscord size={18} />
                            </a>
                        </div>
                    </div>

                    {files.length > 0 && (
                        <div className="flex-1 flex items-stretch border-l border-b lg:border-b-0 border-border min-w-full lg:min-w-[200px]">
                            <input
                                type="text"
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                placeholder="SEARCH ARCHIVE..."
                                className="w-full bg-transparent text-white placeholder:text-muted/40 font-mono text-xs sm:text-sm uppercase px-4 py-4 lg:py-0 focus:outline-none focus:bg-accent/5 focus:placeholder:text-accent/50 transition-colors"
                            />
                        </div>
                    )}

                    <div className="flex items-stretch overflow-x-auto hide-scrollbar border-l-0 lg:border-l border-border bg-surface shrink-0 w-full lg:w-auto">
                        {files.length > 0 && (
                            <button
                                onClick={() => setVisibleFilterModal(true)}
                                className="px-4 flex items-center justify-center gap-2 hover:bg-accent hover:text-black font-mono text-xs sm:text-sm uppercase tracking-widest transition-colors border-r border-border min-h-[48px] whitespace-nowrap group w-full"
                            >
                                <FaFilter className="group-hover:animate-pulse" />
                                <span className="hidden sm:inline">Filters</span>
                            </button>
                        )}

                        {filteredFiles.length > 0 && (
                            <div className="flex items-center px-4 border-r border-border hover:bg-white/5 transition-colors whitespace-nowrap min-h-[48px]">
                                <label className='flex gap-2 items-center cursor-pointer'>
                                    <Checkbox
                                        checked={selectedIds.length === filteredFiles.slice(0, visibleCount).length && filteredFiles.slice(0, visibleCount).length > 0}
                                        onChange={toggleSelectAll}
                                    />
                                    <span className="text-micro">ALL ({selectedIds.length}/{filteredFiles.slice(0, visibleCount).length})</span>
                                </label>
                            </div>
                        )}

                        {files.length > 0 && (
                            <div className="flex items-center px-4 border-r border-border hover:bg-white/5 transition-colors whitespace-nowrap min-h-[48px]">
                                <label className="flex gap-2 items-center cursor-pointer">
                                    <Checkbox
                                        checked={forceShowAllPreviews}
                                        onChange={() => setForceShowAllPreviews(!forceShowAllPreviews)}
                                    />
                                    <span className="text-micro">PREVIEWS</span>
                                </label>
                            </div>
                        )}

                        {selectedIds.length > 0 ? (
                            <div className="flex bg-black">
                                <button onClick={() => handleDelete(selectedIds)} className="px-4 flex items-center justify-center gap-2 bg-error text-white hover:bg-white hover:text-error font-mono text-xs sm:text-sm uppercase transition-colors whitespace-nowrap min-h-[48px]">
                                    <MdDeleteForever size={18} />
                                    <span className="hidden sm:inline">DEL</span>
                                </button>
                                <button onClick={() => downloadSelectedFiles(selectedIds)} className="px-4 flex items-center justify-center gap-2 bg-success text-black hover:bg-white transition-colors font-mono text-xs sm:text-sm uppercase border-l border-black/10 whitespace-nowrap min-h-[48px]">
                                    <IoMdDownload size={18} />
                                    <span className="hidden sm:inline">DL</span>
                                </button>
                            </div>
                        ) : (
                            files.length > 0 && (
                                <div className="flex flex-col justify-center px-4 border-r border-border text-micro text-muted whitespace-nowrap bg-black min-h-[48px]">
                                    <div className="flex items-center gap-3">
                                        <span>VOL:</span>
                                        <span className="text-white">{formatFileSize(totalFileSize)}</span>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </header>

            <Modal isOpen={visibleFilterModal} onClose={handleCloseFilterModal} title="Filter by Tags">
                {filteredFilterTags.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        <TextBox
                            placeholder="Search tags..."
                            value={filterTagSearch}
                            onChange={(e) => setFilterTagSearch(e.target.value)}
                        />
                        <div className='flex flex-wrap gap-2 max-h-[300px] overflow-auto'>
                            {filteredFilterTags.map(tag => (
                                <label key={tag._id} className='flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface hover:border-accent transition-colors cursor-pointer select-none'>
                                    <Checkbox
                                        checked={filterTags.includes(tag._id)}
                                        onChange={() => setFilterTags(prev =>
                                            prev.includes(tag._id) ? prev.filter(id => id !== tag._id) : [...prev, tag._id]
                                        )}
                                    />
                                    <span className="text-sm text-white">{tag.name}</span>
                                </label>
                            ))}
                        </div>
                        <ModalFooter>
                            <label className='flex-1 flex items-center gap-2 cursor-pointer'>
                                <Checkbox checked={isAndFilter} onChange={() => setIsAndFilter(prev => !prev)} />
                                <span className="text-sm text-muted">Include all tags (AND)</span>
                            </label>
                            <Button variant="secondary" onClick={() => {
                                setFilterTags([]);
                                setFilterTagSearch('');
                                setIsAndFilter(false);
                            }}>
                                Clear All
                            </Button>
                        </ModalFooter>
                    </div>
                ) : (
                    <Description text="No tags found" />
                )}
            </Modal>

            <Modal isOpen={visiblePreviewModal} onClose={() => setVisiblePreviewModal(false)} title="Preview Settings">
                <div className="flex flex-col gap-6 items-center">
                    {selectedFileForPreview && (
                        <>
                            <div className='w-full max-w-[400px] aspect-video rounded-none overflow-hidden border border-border relative bg-black flex items-center justify-center p-2'>
                                <img src={getPreview(selectedFileForPreview) !== 'hidden' && getPreview(selectedFileForPreview) !== 'default_icon' ? getPreview(selectedFileForPreview) : ''}
                                    alt="preview"
                                    className="w-full h-full object-cover grayscale opacity-80" />
                            </div>
                            <span className="text-sm text-accent font-mono uppercase tracking-widest">{selectedFileForPreview.filename}</span>
                            <label className="flex gap-4 items-center cursor-pointer bg-surface hover:bg-surface-hover px-6 py-4 rounded-none border border-border w-fit justify-center transition-colors">
                                <Checkbox
                                    checked={previewStatus}
                                    onChange={() => setPreviewStatus(!previewStatus)}
                                />
                                <span className="text-sm text-white font-mono uppercase tracking-widest">Show Preview</span>
                            </label>
                        </>
                    )}
                    <ModalFooter>
                        <Button variant="secondary" onClick={() => setVisiblePreviewModal(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleSavePreviewStatus}>Save Changes</Button>
                    </ModalFooter>
                </div>
            </Modal>

            <div className='flex-1 p-6 md:p-10 flex flex-col gap-10 max-w-[2400px] mx-auto w-full'>
                {filteredFiles.length > 0 ? (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6 md:gap-8">
                        {filteredFiles.slice(0, visibleCount).map((file) => {
                            const previewResult = getPreview(file);
                            const isSelected = selectedIds.includes(file._id);
                            return (
                                <div
                                    key={file._id}
                                    className={`group relative flex flex-col structural-panel transition-all duration-300 ${isSelected ? 'border-accent/60 bg-accent/5' : 'border-border hover:border-accent/50'}`}
                                >
                                    <div className="w-full p-2 flex justify-between items-center border-b border-border bg-black/80 z-10">
                                        <Checkbox
                                            checked={isSelected}
                                            onChange={() => toggleSelect(file._id)}
                                            className="bg-black border-white/20"
                                        />
                                        <div className="flex">
                                            <button className='w-8 h-8 flex items-center justify-center text-muted hover:text-white hover:bg-surface transition-colors' title="Preview Settings" onClick={() => openPreviewModal(file)}>
                                                <MdSettings size={14} />
                                            </button>
                                            <button className='w-8 h-8 flex items-center justify-center text-muted hover:text-accent hover:bg-surface transition-colors' title="Keywords" onClick={() => openKeywordsModal(file)}>
                                                <FaKey size={14} />
                                            </button>
                                            <button className='w-8 h-8 flex items-center justify-center text-muted hover:text-warning hover:bg-surface transition-colors' title="Tags" onClick={() => openTagModal(file)}>
                                                <FaTags size={14} />
                                            </button>
                                            <button className='w-8 h-8 flex items-center justify-center text-muted hover:text-success hover:bg-surface transition-colors' title="Download" onClick={() => downloadFile(file._id)}>
                                                <IoMdDownload size={16} />
                                            </button>
                                            {isViewable(file.mimetype) && (
                                                <button className='w-8 h-8 flex items-center justify-center text-muted hover:text-white hover:bg-surface transition-colors' title="View" onClick={() => viewFile(file._id)}>
                                                    <FaEye size={16} />
                                                </button>
                                            )}
                                            <button className='w-8 h-8 flex items-center justify-center text-muted hover:text-error hover:bg-error/20 transition-colors' title="Delete" onClick={() => handleDelete([file._id])}>
                                                <MdDeleteForever size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="h-64 w-full bg-[#111] flex items-center justify-center overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-500">
                                        {(() => {
                                            if (previewResult === 'hidden') {
                                                return <FaEyeSlash size={48} className="text-muted/20" />;
                                            }
                                            if (previewResult === 'default_icon') {
                                                return <FaFileAlt size={48} className="text-muted/20" />;
                                            }
                                            return (
                                                <>
                                                    <img src={previewResult} alt="thumbnail" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" loading="lazy" />
                                                </>
                                            );
                                        })()}
                                    </div>

                                    <div className="p-4 bg-background flex flex-col gap-3 border-t border-border">
                                        <div className="flex justify-between items-baseline border-b border-border/50 pb-2">
                                            <Description text={file.filename} className="text-white font-heading font-medium text-sm truncate uppercase tracking-tight" />
                                        </div>

                                        <div className="flex justify-between items-center text-micro text-muted">
                                            <span>{formatDate(file.createdAt)}</span>
                                            <span className="text-accent">{formatFileSize(file.size)}</span>
                                        </div>

                                        {file.tags && file.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {file.tags.slice(0, 3).map(tag => (
                                                    <span key={tag._id} className="text-micro px-1.5 py-0.5 border border-border bg-surface text-muted/80">
                                                        {tag.name}
                                                    </span>
                                                ))}
                                                {file.tags.length > 3 && (
                                                    <span className="text-micro px-1.5 py-0.5 bg-accent text-black font-bold">
                                                        +{file.tags.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col flex-1 items-center justify-center p-20 border border-border bg-black/50">
                        <FaFileAlt size={48} className="text-muted mb-8" />
                        <h3 className="text-3xl font-heading font-black text-white text-center uppercase tracking-tighter mb-4">
                            {files.length === 0 ? "SECTOR EMPTY" : "NO RESULTS MATCHED"}
                        </h3>
                        <p className="text-micro text-muted text-center max-w-sm">
                            {files.length === 0 ? "UPLOAD ARCHIVES TO INITIALIZE DATA STREAM." : "ADJUST SEARCH PARAMETERS OR TAG FILTERS."}
                        </p>
                    </div>
                )}

                {visibleCount < filteredFiles.length && (
                    <div className='flex justify-center mt-4'>
                        <Button variant="secondary" onClick={handleLoadMore} className="px-8 py-3">
                            Load More Results ({filteredFiles.length - visibleCount} remaining)
                        </Button>
                    </div>
                )}

                <Modal isOpen={visibleKeywordsModal} onClose={() => setVisibleKeywordsModal(false)} title="Edit Keywords">
                    <div className="flex flex-col gap-4">
                        <span className="text-sm text-muted">Enter keywords separated by commas</span>
                        <TextBox value={keywordInput} onChange={(e) => setKeywordInput(e.target.value)} placeholder="project, design, meeting" />
                        <ModalFooter>
                            <Button variant="secondary" onClick={() => setVisibleKeywordsModal(false)}>Cancel</Button>
                            <Button variant="primary" onClick={handleSaveKeywords}>Save Keywords</Button>
                        </ModalFooter>
                    </div>
                </Modal>

                <Modal isOpen={visibleTagsModal} onClose={() => setVisibleTagsModal(false)} title="Edit Tags">
                    {filteredEditTags.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            <TextBox
                                placeholder="Search tags..."
                                value={editTagSearch}
                                onChange={(e) => setEditTagSearch(e.target.value)}
                            />
                            <div className='flex flex-wrap gap-2 max-h-[300px] overflow-auto'>
                                {filteredEditTags.map(tag => (
                                    <label key={tag._id} className='flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface hover:border-accent transition-colors cursor-pointer select-none'>
                                        <Checkbox
                                            checked={selectedTags.includes(tag._id)}
                                            onChange={() => toggleTag(tag._id)}
                                        />
                                        <span className="text-sm text-white">{tag.name}</span>
                                    </label>
                                ))}
                            </div>
                            <ModalFooter>
                                <Button variant="secondary" onClick={() => setVisibleTagsModal(false)}>Cancel</Button>
                                <Button variant="primary" onClick={handleSaveTags}>Save Tags</Button>
                            </ModalFooter>
                        </div>
                    ) : (
                        <Description text="No tags found" />
                    )}
                </Modal>
            </div>
        </div >
    );
}

export default FileList;