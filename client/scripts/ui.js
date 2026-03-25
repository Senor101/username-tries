function createSuggestionItem(name, onClick) {
  const listItem = document.createElement('li');
  const button = document.createElement('button');

  button.type = 'button';
  button.className =
    'rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm font-medium text-teal-800 transition hover:-translate-y-px hover:brightness-105';
  button.textContent = `@${name}`;
  button.addEventListener('click', () => onClick(name));

  listItem.appendChild(button);
  return listItem;
}

export function createUiBindings(documentRef) {
  return {
    usernameList: documentRef.querySelector('#username-list'),
    usernameCount: documentRef.querySelector('#username-count'),
    usernameForm: documentRef.querySelector('#username-form'),
    usernameInput: documentRef.querySelector('#username-input'),
    usernameSubmit: documentRef.querySelector('#username-submit'),
    statusMessage: documentRef.querySelector('#status-message'),
    suggestionsBox: documentRef.querySelector('#suggestions-box'),
    suggestionsList: documentRef.querySelector('#suggestions-list'),
  };
}

export function renderUsernames(ui, usernames) {
  ui.usernameList.innerHTML = '';

  usernames.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.className =
      'rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm text-slate-800';
    listItem.textContent = `@${item.username}`;
    ui.usernameList.appendChild(listItem);
  });

  ui.usernameCount.textContent = `${usernames.length} names`;
}

export function setStatus(ui, text, type) {
  ui.statusMessage.textContent = text;
  ui.statusMessage.classList.remove('text-emerald-700', 'text-rose-700');

  if (type === 'ok') {
    ui.statusMessage.classList.add('text-emerald-700');
    return;
  }

  if (type === 'error') {
    ui.statusMessage.classList.add('text-rose-700');
  }
}

export function clearSuggestions(ui) {
  ui.suggestionsList.innerHTML = '';
  ui.suggestionsBox.classList.add('hidden');
}

export function renderSuggestions(ui, suggestions, onSelectSuggestion) {
  ui.suggestionsList.innerHTML = '';

  suggestions.forEach((name) => {
    ui.suggestionsList.appendChild(
      createSuggestionItem(name, onSelectSuggestion),
    );
  });

  if (suggestions.length === 0) {
    ui.suggestionsBox.classList.add('hidden');
    return;
  }

  ui.suggestionsBox.classList.remove('hidden');
}

export function setFormBusy(ui, busy) {
  ui.usernameSubmit.disabled = busy;
  ui.usernameInput.disabled = busy;
}
