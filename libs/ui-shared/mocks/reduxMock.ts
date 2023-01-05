import { jest } from "@jest/globals";

const setOrgFormModified = () => jest.fn();
const setSiteFormModified = () => jest.fn();
const setUserFormModified = () => jest.fn();
const platformStore = {
  useAppDispatch: () => jest.fn()
};
const setSuiteFormModified = () => jest.fn();
const setResetForm = () => jest.fn();

export {
  setOrgFormModified,
  setSiteFormModified,
  setUserFormModified,
  platformStore,
  setSuiteFormModified,
  setResetForm,
}; 