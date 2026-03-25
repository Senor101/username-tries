class TrieNode {
  children: Record<string, TrieNode>;
  isEnd: boolean;

  constructor() {
    this.children = {};
    this.isEnd = false;
  }
}

const USERNAME_PATTERN = /^[a-z0-9_.]{3,30}$/;
const BRAND_SUFFIXES = [
  'official',
  'hq',
  'team',
  'studio',
  'labs',
  'media',
  'global',
  'collective',
  'network',
  'works',
  'community',
  'app',
  'dev',
  'daily',
];

const TRUST_PREFIXES = ['real', 'the', 'its'];

class Trie {
  root: TrieNode;
  constructor() {
    this.root = new TrieNode();
  }

  /**
   * Inserts a word into the trie.
   * @param {string} word
   * @return {void}
   */
  insert(word: string): void {
    let node = this.root;
    for (const char of word) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isEnd = true;
  }

  /**
   * Returns the node corresponding to the word if it exists, otherwise null.
   * @param {string} word
   * @return {TrieNode | null}
   */
  find(word: string): TrieNode | null {
    let node = this.root;
    for (const char of word) {
      if (!node.children[char]) {
        return null;
      }
      node = node.children[char];
    }
    return node;
  }

  /**
   * Returns true if the word is in the trie.
   * @param {string} word
   * @return {boolean}
   */
  search(word: string): boolean {
    const node = this.find(word);
    return node !== null && node.isEnd;
  }

  /**
   * Returns true if there is any word in the trie that starts with the given prefix.
   * @param {string} prefix
   * @return {boolean}
   */
  startsWith(prefix: string): boolean {
    return this.find(prefix) !== null;
  }

  /**
   * Returns an array of words that start with the given prefix, limited to a specified number of results.
   * @param {string} prefix prefix string to search for
   * @param {number} limit maximum number of results to return
   * @return {string[]} returns an array of words that start with the prefix
   */
  autoComplete(prefix: string, limit = 5): string[] {
    const node = this.find(prefix);

    const results: string[] = [];

    const dfs = (currentNode: TrieNode, path: string) => {
      if (results.length >= limit) return; // ultimate limit check

      if (currentNode.isEnd) results.push(prefix + path); // if we reach end, push the word to results

      for (const [char, childNode] of Object.entries(currentNode.children)) {
        dfs(childNode, path + char);
      }
    };

    if (node) {
      dfs(node, '');
    }

    return results;
  }

  private sanitizeSuggestionBase(username: string): string {
    const cleaned = username.replace(/[^a-z0-9_.]/g, '');
    return cleaned.length > 0 ? cleaned.slice(0, 14) : 'user';
  }

  private tokenizeBase(base: string): string[] {
    return base
      .split(/[._]+/)
      .map((segment) => segment.trim())
      .filter((segment) => segment.length > 0);
  }

  private trimTrailingSeparators(value: string): string {
    return value.replace(/[._]+$/g, '');
  }

  private appendWithSeparator(
    base: string,
    suffix: string,
    separator: '_' | '.',
  ): string | null {
    const maxBaseLength = 30 - separator.length - suffix.length;
    if (maxBaseLength < 3) {
      return null;
    }

    const trimmedBase = this.trimTrailingSeparators(base).slice(
      0,
      maxBaseLength,
    );
    if (trimmedBase.length < 3) {
      return null;
    }

    return `${trimmedBase}${separator}${suffix}`;
  }

  private appendCompact(base: string, suffix: string): string | null {
    const compactBase = base.replace(/[._]+/g, '');
    const maxBaseLength = 30 - suffix.length;
    if (maxBaseLength < 3) {
      return null;
    }

    const trimmedBase = compactBase.slice(0, maxBaseLength);
    if (trimmedBase.length < 3) {
      return null;
    }

    return `${trimmedBase}${suffix}`;
  }

  private prependWithSeparator(
    base: string,
    prefix: string,
    separator: '_' | '.',
  ): string | null {
    const maxBaseLength = 30 - prefix.length - separator.length;
    if (maxBaseLength < 3) {
      return null;
    }

    const trimmedBase = this.trimTrailingSeparators(base).slice(
      0,
      maxBaseLength,
    );
    if (trimmedBase.length < 3) {
      return null;
    }

    return `${prefix}${separator}${trimmedBase}`;
  }

  private buildSuggestionCandidates(base: string): string[] {
    const separator: '_' | '.' = base.includes('.') ? '.' : '_';
    const compactBase = base.replace(/[._]+/g, '');
    const tokens = this.tokenizeBase(base);
    const mergedTokens = tokens.join('');
    const initials = tokens.map((token) => token[0]).join('');
    const year = String(new Date().getFullYear());
    const candidates: Array<string | null> = [];

    for (const suffix of BRAND_SUFFIXES) {
      candidates.push(this.appendWithSeparator(base, suffix, separator));
    }

    for (const prefix of TRUST_PREFIXES) {
      candidates.push(this.prependWithSeparator(base, prefix, separator));
    }

    candidates.push(this.appendWithSeparator(base, year, separator));
    candidates.push(this.appendCompact(base, 'app'));
    candidates.push(this.appendCompact(base, 'hq'));
    candidates.push(this.appendCompact(base, 'live'));

    if (mergedTokens.length >= 3) {
      candidates.push(this.appendWithSeparator(mergedTokens, 'official', '_'));
      candidates.push(this.appendWithSeparator(mergedTokens, 'team', '_'));
      candidates.push(this.appendWithSeparator(mergedTokens, year, '_'));
    }

    if (tokens.length >= 2) {
      const firstAndLast = `${tokens[0]}${separator}${tokens[tokens.length - 1]}`;
      candidates.push(
        this.appendWithSeparator(firstAndLast, 'official', separator),
      );
      candidates.push(
        this.appendWithSeparator(firstAndLast, 'works', separator),
      );
    }

    if (initials.length >= 3) {
      candidates.push(this.appendWithSeparator(initials, 'team', '_'));
      candidates.push(this.appendWithSeparator(initials, 'dev', '_'));
    }

    if (compactBase.length >= 3) {
      candidates.push(this.prependWithSeparator(compactBase, 'join', '_'));
      candidates.push(this.prependWithSeparator(compactBase, 'hello', '_'));
    }

    const uniqueCandidates = Array.from(
      new Set(
        candidates.filter(
          (candidate): candidate is string => candidate !== null,
        ),
      ),
    );

    return uniqueCandidates.filter((candidate) =>
      USERNAME_PATTERN.test(candidate),
    );
  }

  async suggestAvailableUsernames(
    username: string,
    isAvailable: (candidate: string) => Promise<boolean>,
    limit = 5,
  ): Promise<string[]> {
    const base = this.sanitizeSuggestionBase(username);
    const candidates = this.buildSuggestionCandidates(base);
    const suggestions: string[] = [];

    for (const candidate of candidates) {
      if (suggestions.length >= limit) {
        break;
      }

      const available = await isAvailable(candidate);
      if (available && candidate !== username) {
        suggestions.push(candidate);
      }
    }

    return suggestions;
  }

  toJson(): string {
    return JSON.stringify(this.root);
  }

  fromJson(json: string): void {
    this.root = JSON.parse(json);
  }
}

export const userNameTrie = new Trie();
