const STORAGE_KEY = 'easy_qr_storage';
const localStorage = window.localStorage;
let runtimeStorage;

function sync() {
  if (!runtimeStorage) {
    try {
      runtimeStorage = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch (e) {
      runtimeStorage = {};
    }
  } else {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(runtimeStorage));
    } catch (err) {
      // 防止存储错误导致应用崩溃
    }
  }
}

sync();

export function has(key) {
  return Object.hasOwnProperty.call(runtimeStorage, key);
}

export function removeItem(key) {
  if (has(key)) {
    delete runtimeStorage[key];
    sync();
  }
}

export function getItem(key, force) {
  if (force) {
    runtimeStorage = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  }

  if (!has(key)) {
    return undefined;
  }

  const { value, expires, timestamp } = runtimeStorage[key] || {};

  if (Date.now() - timestamp <= expires) {
    return value;
  }
  removeItem(key);
  return undefined;
}

export function setItem(key, value, expires = Number.MAX_SAFE_INTEGER) {
  runtimeStorage[key] = {
    value,
    expires,
    timestamp: Date.now(),
  };
  sync();
}

export function clear() {
  runtimeStorage = {};
  sync();
}
