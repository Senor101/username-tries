import { USERNAME_PATTERN } from './config.js';

export function normalizeUsername(value) {
  return value.trim().toLowerCase();
}

export function validateUsername(username) {
  const normalized = normalizeUsername(username);

  if (normalized.length === 0) {
    return {
      valid: false,
      normalized,
      reason: 'Username is required.',
    };
  }

  if (!USERNAME_PATTERN.test(normalized)) {
    return {
      valid: false,
      normalized,
      reason:
        'Invalid format. Use 3-20 chars: lowercase letters, numbers, underscore, dot.',
    };
  }

  return {
    valid: true,
    normalized,
    reason: '',
  };
}
