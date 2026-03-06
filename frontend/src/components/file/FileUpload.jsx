import { useState, useEffect, useRef } from 'react';
import { Modal, ModalFooter } from '../ui/Modal';
import { Button } from '../ui/Button';
import { TextBox } from '../ui/TextBox';
import { Description } from '../ui/Description';
import { Checkbox } from '../ui/Checkbox';
import { uploadFiles } from '../../services/fileService';
import { formatFileSize } from '../../utils/format';
import { MdDeleteForever, MdCloudUpload } from "react-icons/md";
import { FaTags, FaKey } from "react-icons/fa";

function FileUpload({ onUploadSuccess, allTags, fetchTags }) {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [visibleUploadModal, setVisibleUploadModal] = useState(false);
    const [visibleKeywordsModal, setVisibleKeywordsModal] = useState(false);
    const [visibleTagsModal, setVisibleTagsModal] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [keywords, setKeywords] = useState('');
    const [filteredTags, setFilteredTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [tagSearchTerm, setTagSearchTerm] = useState('');
    const [showPreview, setShowPreview] = useState(true);
    const fileInputRef = useRef(null);

    useEffect(() => {
        setFilteredTags(allTags);
    }, [allTags]);

    useEffect(() => {
        if (tagSearchTerm === '') {
            setFilteredTags(allTags);
        } else {
            const filtered = allTags.filter(tag =>
                tag.name.toLowerCase().includes(tagSearchTerm.toLowerCase())
            );
            setFilteredTags(filtered);
        }
    }, [tagSearchTerm, allTags]);

    const totalFileSize = selectedFiles.reduce((total, file) => total + file.size, 0);

    const selectedTagNames = selectedTags.map(tagId => {
        const tag = allTags.find(t => t._id === tagId);
        return tag ? tag.name : '';
    }).filter(name => name !== '');

    const handleUpload = async () => {
        if (selectedFiles.length === 0) return;
        setIsUploading(true);
        try {
            await uploadFiles(selectedFiles, keywords, selectedTags, showPreview);
            setSelectedFiles([]);
            setShowPreview(true);
            setKeywords('');
            setSelectedTags([]);
            setTagSearchTerm('');
            setVisibleUploadModal(false);
            if (onUploadSuccess)
                onUploadSuccess();
            console.log("files uploaded");

        } catch (err) {
            console.error(err);
        } finally {
            setIsUploading(false);
        }
    };

    const handleTagSelection = (tagId) => {
        setSelectedTags(prev => {
            if (prev.includes(tagId)) {
                return prev.filter(id => id !== tagId);
            } else {
                return [...prev, tagId];
            }
        });
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setSelectedFiles(Array.from(e.dataTransfer.files));
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFiles(Array.from(e.target.files));
        }
    };

    const removeFile = (index) => {
        const newFiles = [...selectedFiles];
        newFiles.splice(index, 1);
        setSelectedFiles(newFiles);
    };

    const resetUploadModal = () => {
        setSelectedFiles([]);
        setKeywords('');
        setSelectedTags([]);
        setTagSearchTerm('');
        setShowPreview(true);
        setVisibleUploadModal(false);
    };

    return (
        <>
            <button
                onClick={() => setVisibleUploadModal(true)}
                className="flex items-center justify-center gap-2 hover:text-accent font-mono text-xs sm:text-sm uppercase tracking-widest transition-colors group w-full h-full px-4 min-h-[48px]"
            >
                <MdCloudUpload size={18} className="group-hover:-translate-y-1 transition-transform" />
                <span className="hidden sm:inline">Upload</span>
            </button>

            <Modal
                isOpen={visibleUploadModal}
                onClose={resetUploadModal}
                title={"File Upload"}
                width={"900px"}
            >
                <div className="flex flex-col gap-6">
                    {!isUploading ? (
                        <>
                            <div
                                className={`h-[250px] flex flex-col items-center justify-center transition-all bg-surface hover:bg-surface-hover cursor-pointer p-6 rounded-none border border-dashed ${dragActive ? 'border-accent bg-accent/5' : 'border-border'}`}
                                onDragEnter={handleDrag}
                                onDragOver={handleDrag}
                                onDragLeave={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current.click()}
                            >
                                <span className={`text-center transition-all ${dragActive ? 'text-accent' : 'text-muted'}`}>
                                    <MdCloudUpload className="mx-auto mb-2 opacity-50" size={48} />
                                    Drag and drop your files here, or click to browse
                                </span>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    multiple
                                    onChange={handleFileSelect}
                                    className='hidden'
                                />
                            </div>

                            {selectedFiles.length > 0 && (
                                <>
                                    <div className="flex flex-col p-4 bg-background border border-border rounded-xl gap-2">
                                        <div className="flex gap-2">
                                            <span className="text-muted text-sm font-medium">Files: </span>
                                            <span className="text-white text-sm">{selectedFiles.length} file(s)</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="text-muted text-sm font-medium">Total Size: </span>
                                            <span className="text-white text-sm">{formatFileSize(totalFileSize)}</span>
                                        </div>
                                        {keywords && (
                                            <div className="flex gap-2 items-center">
                                                <span className="flex gap-1 text-muted text-sm font-medium items-center">
                                                    <FaKey size={12} /> Keywords:
                                                </span>
                                                <span className="text-white text-sm">{keywords}</span>
                                            </div>
                                        )}
                                        {selectedTags.length > 0 && (
                                            <div className="flex gap-2 sm:items-center">
                                                <span className="flex gap-1 text-muted text-sm font-medium items-center">
                                                    <FaTags size={12} /> Tags:
                                                </span>
                                                <div className="flex flex-wrap gap-1">
                                                    {selectedTagNames.map((name, index) => (
                                                        <span key={index} className="text-white text-sm bg-surface px-2 py-0.5 rounded-md border border-border">
                                                            {name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="max-h-[250px] overflow-y-auto flex flex-col gap-2 pr-2">
                                        {selectedFiles.map((file, index) => (
                                            <div key={index} className="flex items-center p-3 bg-surface border border-border rounded-none justify-between hover:border-accent/50 transition-colors">
                                                <div className="flex gap-3 items-center truncate">
                                                    <span className="text-accent text-sm whitespace-nowrap">({formatFileSize(file.size)})</span>
                                                    <Description text={file.name} maxLength={40} showToggleButton={false} className="text-white truncate" />
                                                </div>
                                                <button
                                                    className='text-muted hover:text-error transition-colors bg-transparent border-none outline-none cursor-pointer flex items-center justify-center p-1'
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeFile(index);
                                                    }}
                                                >
                                                    <MdDeleteForever size={20} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className='flex flex-wrap items-center gap-3 mt-2'>
                                        <Button variant="secondary" onClick={() => setVisibleKeywordsModal(true)}>
                                            <FaKey /> {keywords ? 'Edit Keywords' : 'Add Keywords'}
                                        </Button>
                                        <Button variant="secondary" onClick={() => setVisibleTagsModal(true)}>
                                            <FaTags /> {selectedTags.length > 0 ? `Edit Tags (${selectedTags.length})` : 'Add Tags'}
                                        </Button>
                                        <label className='flex items-center gap-2 cursor-pointer ml-auto'>
                                            <Checkbox
                                                checked={showPreview}
                                                onChange={() => setShowPreview(!showPreview)}
                                            />
                                            <span className="text-muted text-sm">Show file preview in the list</span>
                                        </label>
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-10 gap-6">
                            <div className="spinner"></div>
                            <span className="text-white text-lg font-medium animate-pulse">Your files are being uploaded...</span>
                        </div>
                    )}
                </div>

                <ModalFooter>
                    <Button
                        variant="secondary"
                        onClick={resetUploadModal}
                        disabled={isUploading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleUpload}
                        disabled={selectedFiles.length === 0 || isUploading}
                    >
                        {isUploading ? "Uploading..." : `Upload ${selectedFiles.length} File(s)`}
                    </Button>
                </ModalFooter>
            </Modal>

            <Modal
                isOpen={visibleKeywordsModal}
                onClose={() => setVisibleKeywordsModal(false)}
                title="Add Keywords"
            >
                <div className="flex flex-col gap-4">
                    <span className="text-muted text-sm">Enter keywords separated by commas</span>
                    <TextBox
                        placeholder='example: project, document, report'
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                    />
                    <ModalFooter>
                        <Button variant="primary" onClick={() => setVisibleKeywordsModal(false)}>
                            Done
                        </Button>
                    </ModalFooter>
                </div>
            </Modal>

            <Modal
                isOpen={visibleTagsModal}
                onClose={() => setVisibleTagsModal(false)}
                title="Select Tags"
            >
                <div className="flex flex-col gap-4">
                    <TextBox
                        placeholder='Search tags...'
                        value={tagSearchTerm}
                        onChange={(e) => setTagSearchTerm(e.target.value)}
                    />
                    <div className="flex flex-wrap gap-2 max-h-[300px] overflow-auto">
                        {filteredTags.length > 0 ? (
                            filteredTags.map(tag => (
                                <label key={tag._id} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface hover:border-accent transition-colors cursor-pointer user-select-none">
                                    <Checkbox
                                        id={`tag-${tag._id}`}
                                        checked={selectedTags.includes(tag._id)}
                                        onChange={() => handleTagSelection(tag._id)}
                                    />
                                    <span className="text-white text-sm">{tag.name}</span>
                                </label>
                            ))
                        ) : (
                            <Description text="No tags found matching your search." className="text-muted w-full text-center py-4" />
                        )}
                    </div>
                    <ModalFooter>
                        <Button variant="primary" onClick={() => setVisibleTagsModal(false)}>
                            Done
                        </Button>
                    </ModalFooter>
                </div>
            </Modal>
        </>
    );
}

export default FileUpload;