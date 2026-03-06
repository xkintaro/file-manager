import { useState, useEffect } from 'react';
import { Modal, ModalFooter } from '../ui/Modal';
import { Button } from '../ui/Button';
import { TextBox } from '../ui/TextBox';
import { Description } from '../ui/Description';
import { createTag, updateTag, deleteTag } from '../../services/tagService';
import { MdDeleteForever } from "react-icons/md";
import { FaTags, FaEdit } from "react-icons/fa";

function TagManagement({ allTags, fetchTags }) {
    const [isListModalOpen, setIsListModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [filteredTags, setFilteredTags] = useState([]);
    const [newTagName, setNewTagName] = useState('');
    const [tagToUpdate, setTagToUpdate] = useState(null);
    const [updatedTagName, setUpdatedTagName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (searchTerm === '') {
            setFilteredTags(allTags);
        } else {
            const filtered = allTags.filter(tag =>
                tag.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredTags(filtered);
        }
    }, [searchTerm, allTags]);

    const openListModal = () => {
        fetchTags();
        setIsListModalOpen(true);
    };

    const closeListModal = () => {
        setIsListModalOpen(false);
        setSearchTerm('');
        setErrorMessage('');
    };

    const openCreateModal = () => setIsCreateModalOpen(true);

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
        setNewTagName('');
        setErrorMessage('');
    };

    const openUpdateModal = (tag) => {
        setTagToUpdate(tag);
        setUpdatedTagName(tag.name);
        setIsUpdateModalOpen(true);
    };

    const closeUpdateModal = () => {
        setIsUpdateModalOpen(false);
        setTagToUpdate(null);
        setUpdatedTagName('');
        setErrorMessage('');
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        if (!newTagName.trim()) return;

        try {
            await createTag(newTagName);
            await fetchTags();
            closeCreateModal();
        } catch (err) {
            const message = err.response?.data?.message || "Operation failed. Please try again.";
            setErrorMessage(message);
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        if (!updatedTagName.trim() || !tagToUpdate) return;

        try {
            await updateTag(tagToUpdate._id, updatedTagName);
            await fetchTags();
            closeUpdateModal();
        } catch (err) {
            const message = err.response?.data?.message || "Operation failed. Please try again.";
            setErrorMessage(message);
        }
    };

    const handleDelete = async (tag) => {
        if (window.confirm(`Are you sure you want to delete the tag "${tag.name}"?`)) {
            try {
                await deleteTag(tag._id);
                await fetchTags();
            } catch (err) {
                console.error("Deletion failed:", err);
                setErrorMessage("Failed to delete tag. Please try again.");
            }
        }
    };

    return (
        <>
            <button
                onClick={openListModal}
                className="flex items-center justify-center gap-2 hover:text-accent font-mono text-xs sm:text-sm uppercase tracking-widest transition-colors group w-full h-full px-4 min-h-[48px]"
            >
                <FaTags size={16} className="group-hover:rotate-12 transition-transform" />
                <span className="hidden sm:inline">Tags</span>
            </button>

            <Modal
                isOpen={isListModalOpen}
                onClose={closeListModal}
                title={"Tags ・ " + allTags.length}
            >
                <div className='flex flex-col gap-4'>
                    {allTags.length > 0 && (
                        <TextBox
                            placeholder='Search tags...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    )}
                    {errorMessage && <Description text={errorMessage} className="text-error" />}

                    <div className='flex flex-wrap gap-2 max-h-[300px] overflow-auto'>
                        {filteredTags.length > 0 ? (
                            filteredTags.map(tag => (
                                <div key={tag._id} className='flex items-center gap-2 px-3 py-1.5 rounded-none border border-border bg-surface hover:border-accent transition-colors w-fit'>
                                    <span className="text-white text-sm">{tag.name}</span>
                                    <div className='flex items-center gap-1 ml-2'>
                                        <button
                                            onClick={() => openUpdateModal(tag)}
                                            className='text-muted hover:text-accent transition-colors bg-transparent border-none outline-none cursor-pointer p-1'
                                            title="Edit Tag"
                                        >
                                            <FaEdit size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(tag)}
                                            className='text-muted hover:text-error transition-colors bg-transparent border-none outline-none cursor-pointer p-1'
                                            title="Delete Tag"
                                        >
                                            <MdDeleteForever size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <Description text="No tags found." />
                        )}
                    </div>
                </div>
                <ModalFooter>
                    <Button variant="primary" onClick={openCreateModal}>
                        Create New Tag
                    </Button>
                </ModalFooter>
            </Modal>

            <Modal
                isOpen={isCreateModalOpen}
                onClose={closeCreateModal}
                title="Create New Tag"
            >
                <form onSubmit={handleCreateSubmit} className='flex flex-col gap-4'>
                    {errorMessage && <Description text={errorMessage} className="text-error" />}
                    <TextBox
                        placeholder='Enter new tag name...'
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        autoFocus
                    />
                    <ModalFooter>
                        <Button variant="secondary" onClick={closeCreateModal}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            Create
                        </Button>
                    </ModalFooter>
                </form>
            </Modal>

            <Modal
                isOpen={isUpdateModalOpen}
                onClose={closeUpdateModal}
                title="Update Tag"
            >
                <form onSubmit={handleUpdateSubmit} className='flex flex-col gap-4'>
                    {errorMessage && <Description text={errorMessage} className="text-error" />}
                    <TextBox
                        placeholder='Enter updated tag name...'
                        value={updatedTagName}
                        onChange={(e) => setUpdatedTagName(e.target.value)}
                        autoFocus
                    />
                    <ModalFooter>
                        <Button variant="secondary" onClick={closeUpdateModal}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            Update
                        </Button>
                    </ModalFooter>
                </form>
            </Modal>
        </>
    );
}

export default TagManagement;