import axios from 'axios';
import { User } from './userSlice';

export const getUsersApi = (url: string, token: string) =>
  axios.get(`${url}/Platform/PlatformUser`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const updateUserApi = (url: string, token: string, user: User) =>
  axios.put(`${url}/UpdateUser`, user, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const addUserApi = (url: string, token: string, user: User) =>
  axios.post(`${url}/Platform/Add/PlatformUser`, user, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const deleteUserApi = (url: string, token: string, userID: string) =>
  axios.delete(`${url}/Platform/PlatformUser/${userID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const addMultipleUsers = (url: string, token: string, file: FormData) =>
  axios.post(`${url}/Platform/BulkUserUpload`, file, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
