import axiosLib from 'axios';

export const axios = axiosLib.create({
  baseURL: '/api',
});
