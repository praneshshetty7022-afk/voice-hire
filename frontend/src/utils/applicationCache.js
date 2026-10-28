/**
 * Utility to manage user job application caching in localStorage
 * Ensures applied jobs appear instantaneously on the applicant dashboard
 */

const STORAGE_KEY = 'voicehire_user_applications';

export const getCachedApplications = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error reading cached applications:', e);
    return [];
  }
};

export const saveAppToLocalCache = (app) => {
  if (!app) return;
  try {
    const list = getCachedApplications();
    const appId = String(app._id || app.id || `app_${Date.now()}`);
    const normalizedApp = {
      ...app,
      _id: appId,
      id: appId,
      appliedAt: app.appliedAt || app.createdAt || new Date().toISOString(),
    };

    const updated = [
      normalizedApp,
      ...list.filter((x) => String(x._id || x.id) !== appId && String(x.jobId) !== String(app.jobId)),
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return normalizedApp;
  } catch (e) {
    console.error('Error saving application to cache:', e);
  }
};
