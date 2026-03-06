import { useState } from 'react';
import { getTags } from '../services/tagService';

function useFetchTags() {
    const [allTags, setAllTags] = useState([]);

    const fetchTags = async () => {
        try {
            const data = await getTags();
            const tagsArray = Array.isArray(data) ? data : [];
            setAllTags(tagsArray);
            console.log("fetchTags, Tag list updated.");
        } catch (err) {
            console.error('Failed to retrieve tag list:', err);
        }
    };

    return { allTags, fetchTags };
}

export default useFetchTags;