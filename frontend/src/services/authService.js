import axios from '../utils/axios';

export const signupUser = async (formData) => {
    const res = await axios.post('/auth/signup', formData);
    return res.data;// token+user
};

export const loginUser = async (formData) =>{
    const res = await axios.post('auth/login', formData);
    return res.data;// token + user
};