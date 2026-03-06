import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + '/api/tags';

export const getTags = async () => {
    const res = await axios.get(`${API_URL}`);
    return res.data;
};

export const createTag = async (name) => {
    const res = await axios.post(`${API_URL}`, { name });
    return res.data;
};

export const updateTag = async (id, name) => {
    const res = await axios.put(`${API_URL}/${id}`, { name });
    return res.data;
};

export const deleteTag = async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
};
