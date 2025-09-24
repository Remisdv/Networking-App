let memoryToken: string | null = null;

export function setSessionToken(token: string) {
  memoryToken = token;
}

export function clearSessionToken() {
  memoryToken = null;
}

export function getSessionToken() {
  return memoryToken;
}
