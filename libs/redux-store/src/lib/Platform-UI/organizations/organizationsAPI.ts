import axios from 'axios';
import { Organization } from './organizationsSlice';

export const getOrganizationsAPI = (url: string, token: string) =>
  axios.get(`${url}/Platform/PlatformOrganization`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getOrganizationAPI = (
  url: string,
  token: string,
  orgCode: string
) =>
  axios.get(`${url}/Platform/PlatformOrganization/${orgCode}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const updateOrganizationAPI = (
  url: string,
  token: string,
  organization: Organization
) =>
  axios.put(`${url}/UpdateOrganization`, organization, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const addOrganizationAPI = (
  url: string,
  token: string,
  organization: Organization
) =>
  axios.post(`${url}/Platform/Add/PlatformOrganization`, organization, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const deleteOrganizationAPI = (
  url: string,
  token: string,
  orgCode: string
) =>
  axios.delete(`${url}/Platform/PlatformOrganization/${orgCode}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getOrganizationStatsAPI = (
  url: string,
  token: string,
  orgCode: string
) =>
  axios.get(`${url}/Statistics/Organization/${orgCode}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getAllOrganizationDomainsAPI = (url: string, token: string) =>
  axios.get(`${url}/Platform/Domain/All`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
