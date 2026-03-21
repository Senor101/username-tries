import { API_BASE } from './config.js';

function readMessageFromPayload(payload) {
  if (payload && typeof payload.message === 'string' && payload.message.length > 0) {
    return payload.message;
  }

  return null;
}

function normalizeClientError(error, fallbackMessage) {
  if (error instanceof Error) {
    if (error.name === 'TypeError') {
      return new Error('Network error. Please check your connection and retry.');
    }

    return error;
  }

  return new Error(fallbackMessage);
}

async function parseJsonResponse(response, fallbackMessage) {
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage = readMessageFromPayload(payload) ?? fallbackMessage;
    throw new Error(errorMessage);
  }

  if (payload === null || typeof payload !== 'object') {
    throw new Error('Unexpected server response format.');
  }

  return payload;
}

async function requestJson(path, fallbackMessage, options) {
  try {
    const response = await fetch(`${API_BASE}${path}`, options);
    return await parseJsonResponse(response, fallbackMessage);
  } catch (error) {
    throw normalizeClientError(error, fallbackMessage);
  }
}

export async function fetchUsernames() {
  const payload = await requestJson('/usernames', 'Failed to load usernames.');

  if (!Array.isArray(payload.data)) {
    throw new Error('Invalid usernames response payload.');
  }

  return payload.data;
}

export async function checkUsernameAvailability(username) {
  const query = encodeURIComponent(username);
  const payload = await requestJson(
    `/usernames/availability?username=${query}`,
    'Failed to check username availability.',
  );

  if (!payload.data || typeof payload.data !== 'object') {
    throw new Error('Invalid availability response payload.');
  }

  if (
    typeof payload.data.username !== 'string' ||
    typeof payload.data.available !== 'boolean' ||
    !Array.isArray(payload.data.suggestions)
  ) {
    throw new Error('Invalid availability response payload.');
  }

  return payload.data;
}

export async function createUsername(username) {
  return requestJson('/usernames', 'Failed to create username.', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username }),
  });
}
