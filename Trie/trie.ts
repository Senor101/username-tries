class TrieNode {
  children: Record<string, TrieNode>;
  isEnd: boolean;

  constructor() {
    this.children = {};
    this.isEnd = false;
  }
}

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
    let node = this.find(word);
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
        console.log(`Traversing: ${path}${char}`);
        dfs(childNode, path + char);
      }
    };

    if (node) {
      dfs(node, "");
    }

    return results;
  }

  toJson(): string {
    return JSON.stringify(this.root);
  }

  fromJson(json: string): void {
    this.root = JSON.parse(json);
  }
}

const trie1 = new Trie();

trie1.insert("hello");
trie1.insert("hell");
trie1.insert("heaven");
trie1.insert("heavy");
trie1.insert("hero");

// console.dir(trie1, { depth: null }); // ["hello", "hell", "heaven"]

console.log(trie1.autoComplete("he")); // true
