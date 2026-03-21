import {
  checkUsernameAvailability,
  createUsername,
  fetchUsernames,
} from './api.js';
import { DEBOUNCE_MS } from './config.js';
import {
  clearSuggestions,
  renderSuggestions,
  renderUsernames,
  setFormBusy,
  setStatus,
} from './ui.js';
import { normalizeUsername, validateUsername } from './validation.js';

function debounce(fn, delay) {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => fn(...args), delay);
  };
}

export function createUsernameController(ui) {
  let lastAvailability = null;

  async function loadUsernames() {
    const usernames = await fetchUsernames();
    renderUsernames(ui, usernames);
  }

  async function performAvailabilityCheck(rawValue) {
    const validation = validateUsername(rawValue);

    if (!validation.valid) {
      lastAvailability = null;
      clearSuggestions(ui);
      setStatus(ui, validation.reason, 'error');
      return null;
    }

    const availability = await checkUsernameAvailability(validation.normalized);
    lastAvailability = availability;

    if (availability.available) {
      clearSuggestions(ui);
      setStatus(ui, 'Great choice. This username is available.', 'ok');
      return availability;
    }

    renderSuggestions(ui, availability.suggestions, (selected) => {
      ui.usernameInput.value = selected;
      clearSuggestions(ui);
      setStatus(ui, `Selected @${selected}. Click Check and Save to reserve it.`, 'ok');
      ui.usernameInput.focus();
    });
    setStatus(ui, 'That username is taken. Try one of these available options.', 'error');

    return availability;
  }

  const debouncedAvailabilityCheck = debounce(async (value) => {
    try {
      await performAvailabilityCheck(value);
    } catch (_error) {
      setStatus(ui, 'Unable to check availability right now.', 'error');
    }
  }, DEBOUNCE_MS);

  function wireEvents() {
    ui.usernameInput.addEventListener('input', (event) => {
      const value = event.target.value;

      if (value.trim().length === 0) {
        lastAvailability = null;
        clearSuggestions(ui);
        setStatus(ui, '', undefined);
        return;
      }

      debouncedAvailabilityCheck(value);
    });

    ui.usernameForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const rawValue = ui.usernameInput.value;
      const validation = validateUsername(rawValue);

      if (!validation.valid) {
        clearSuggestions(ui);
        setStatus(ui, validation.reason, 'error');
        return;
      }

      setFormBusy(ui, true);

      try {
        const normalized = normalizeUsername(rawValue);
        const availability =
          lastAvailability?.username === normalized
            ? lastAvailability
            : await performAvailabilityCheck(normalized);

        if (!availability || !availability.available) {
          return;
        }

        await createUsername(normalized);
        await loadUsernames();

        ui.usernameForm.reset();
        lastAvailability = null;
        clearSuggestions(ui);
        setStatus(ui, `@${normalized} has been saved successfully.`, 'ok');
      } catch (error) {
        setStatus(ui, error.message || 'Could not save username.', 'error');
      } finally {
        setFormBusy(ui, false);
      }
    });
  }

  return {
    async init() {
      try {
        await loadUsernames();
        wireEvents();
      } catch (_error) {
        setStatus(ui, 'Unable to load usernames. Please refresh.', 'error');
      }
    },
  };
}
