import axiosLib from 'axios';

export const axios = axiosLib.create({
  baseURL: '/api',
});

export const botAPI = axiosLib.create({
  baseURL: '/bot',
})