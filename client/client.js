const fakeUsernames = [
  'rainydawn',
  'pixelnomad',
  'mountainmint',
  'saffronloop',
  'frostedlane',
  'atlas_writes',
  'slowriver',
  'tealhorizon',
  'quietorbit',
  'dune_echo',
  'northernkite',
  'inkandember',
  'sunlitframe',
];

const usernameList = document.querySelector('#username-list');
const usernameCount = document.querySelector('#username-count');
const usernameForm = document.querySelector('#username-form');
const usernameInput = document.querySelector('#username-input');
const statusMessage = document.querySelector('#status-message');
const suggestionsBox = document.querySelector('#suggestions-box');
const suggestionsList = document.querySelector('#suggestions-list');

function renderUsernames() {
  usernameList.innerHTML = '';

  fakeUsernames.forEach((username) => {
    const listItem = document.createElement('li');
    listItem.textContent = `@${username}`;
    usernameList.appendChild(listItem);
  });

  usernameCount.textContent = `${fakeUsernames.length} names`;
}

function normalizeUsername(value) {
  return value.trim().toLowerCase();
}

function isValidUsername(username) {
  const usernamePattern = /^[a-z0-9_.]{3,20}$/;
  return usernamePattern.test(username);
}

function isUsernameTaken(username) {
  return fakeUsernames.includes(username);
}

function clearSuggestions() {
  suggestionsList.innerHTML = '';
  suggestionsBox.classList.add('hidden');
}

function renderSuggestions(suggestions) {
  suggestionsList.innerHTML = '';

  suggestions.forEach((name) => {
    const listItem = document.createElement('li');
    listItem.textContent = `@${name}`;
    suggestionsList.appendChild(listItem);
  });

  suggestionsBox.classList.remove('hidden');
}

function buildSuggestions(username) {
  const base = username.replace(/[^a-z0-9_.]/g, '').slice(0, 14) || 'newuser';

  const candidates = [
    `${base}_official`,
    `${base}_daily`,
    `${base}_hq`,
    `${base}${Math.floor(Math.random() * 90 + 10)}`,
    `${base}.${new Date().getFullYear()}`,
    `${base}_zone`,
    `${base}_works`,
    `${base}_alpha`,
  ];

  const uniqueAvailable = [];

  candidates.forEach((candidate) => {
    if (!isUsernameTaken(candidate) && !uniqueAvailable.includes(candidate)) {
      uniqueAvailable.push(candidate);
    }
  });

  return uniqueAvailable.slice(0, 5);
}

function setStatus(text, type) {
  statusMessage.textContent = text;
  statusMessage.classList.remove('ok', 'error');

  if (type) {
    statusMessage.classList.add(type);
  }
}

usernameForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const rawValue = usernameInput.value;
  const username = normalizeUsername(rawValue);

  if (!isValidUsername(username)) {
    clearSuggestions();
    setStatus(
      'Invalid format. Use 3-20 chars: lowercase letters, numbers, underscore, dot.',
      'error',
    );
    return;
  }

  if (isUsernameTaken(username)) {
    const suggestions = buildSuggestions(username);
    setStatus(
      'That username is taken. Try one of these available options.',
      'error',
    );

    if (suggestions.length > 0) {
      renderSuggestions(suggestions);
    } else {
      clearSuggestions();
    }

    return;
  }

  clearSuggestions();
  setStatus('Great choice. This username is available.', 'ok');
});

renderUsernames();
