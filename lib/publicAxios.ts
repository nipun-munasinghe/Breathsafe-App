'use client';

import axios, { AxiosInstance } from 'axios';

const publicAxios: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default publicAxios;
