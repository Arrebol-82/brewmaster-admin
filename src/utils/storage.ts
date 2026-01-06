const TOKEN_KEY = "bm_token";

export const tokenStorage = {
  // 这里的 string | null 表示里面的TOKEN...返回的可能是个字符串, 也可能是个null; 他只接受这个两类型的值
  get(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  set(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
  },
};
