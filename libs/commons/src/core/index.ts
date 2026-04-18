// @ts-expect-error platform has no bundled typings in this workspace
import { parse } from 'platform';

export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const randomId = (length: number) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const removeKeysForValues = (obj: any, values = [null]) => {
  for (const k in obj) {
    const type = typeof obj[k];
    if (obj[k] && JSON.stringify(obj[k])?.startsWith('{')) {
      if (Object.keys(obj[k]).length) {
        obj[k] = removeKeysForValues(obj[k], values);
      }
      continue;
    } else {
      if (values?.includes(obj[k])) {
        delete obj[k];
      }
    }
  }
  return obj;
};

export const trimStr = (str: string, opts?: any) => {
  const { length, appendSuffix = true, suffix = '...' } = opts || {};
  if (length!) {
    return str?.length > length
      ? str?.substring(0, length - 1) + (appendSuffix ? suffix : '')
      : str;
  }
  return str;
};

export const extractCookie = (cookie: string, name: string) => {
  const pattern = new RegExp(`${name}=([^;]+)`);
  try {
    const matched = cookie.match(pattern);
    return matched ? matched[1] : null;
  } catch (e) {
    console.error(e);
    return null;
  }
};
export const setCookie = (name: string, value: unknown, days = 7) => {
  if (typeof window === 'undefined') return;
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + JSON.stringify(value) + expires + '; path=/';
};
export const getCookie = (name: string) => {
  if (typeof window === 'undefined') return;
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return JSON.parse(c.substring(nameEQ.length, c.length));
  }
  return null;
};

export const eraseCookie = (name: string) => {
  if (typeof window === 'undefined') return;
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

export const setLocalKV = (name: string, value: any) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(name, JSON.stringify(value));
  }
};
export const getLocalKV = (name: string) => {
  if (typeof localStorage !== 'undefined') {
    const item = localStorage.getItem(name);
    return item ? JSON.parse(item) : null;
  }
  return null;
};

export const eraseLocalKV = (name: string) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(name);
  }
};

export function setSessionItem<T>(key: string, value: T): void {
  try {
    const serialized = JSON.stringify(value);
    sessionStorage.setItem(key, serialized);
  } catch (err) {
    console.error("Failed to set session item:", err);
  }
}

export function getSessionItem<T>(key: string): T | null {
  try {
    const item = sessionStorage.getItem(key);
    if (!item) return null;
    return JSON.parse(item) as T;
  } catch (err) {
    console.error("Failed to parse session item:", err);
    return null;
  }
}

export function eraseSessionItem(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch (err) {
    console.error("Failed to remove session item:", err);
  }
}

export function clearAllSessionItems(): void {
  try {
    sessionStorage.clear();
  } catch (err) {
    console.error("Failed to clear session storage:", err);
  }
}


/**
 * Make string plural
 * TODO: Move into seperate module
 * @param str
 * @returns
 */
export const pluralize = (str: string) => {
  const lChar = str.charAt(str.length - 1);
  if (lChar.match(/[s]/gi)) {
    return str + 'es';
  }
  if (lChar.match(/[yi]/gi)) {
    return str.substr(0, str.length - 1) + 'ies';
  }

  return str + 's';
};
export function toPascalCase(str: string) {
  return str
    ?.replace(/([a-z])([A-Z])/g, '$1 $2') // Insert space before uppercase letters (for camelCase handling)
    ?.match(/[a-zA-Z0-9]+/g) // Extract words (ignores special characters)
    ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
    ?.join(''); // Join without spaces
}

export function toCamelCase(str: string) {
  // Handle existing camelCase by inserting spaces before uppercase letters
  str = str.replace(/([a-z])([A-Z])/g, '$1 $2');

  const words = str.match(/[a-zA-Z0-9]+/g); // Extract words (ignores special characters)
  if (!words) return ''; // Handle empty or non-matching cases

  return words
    .map(
      (word, index) =>
        index === 0
          ? word.toLowerCase() // First word remains lowercase
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // Capitalize subsequent words
    )
    .join(''); // Join without spaces
}

export function toKebabCase(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2') // Insert hyphen between lowercase and uppercase letters (camelCase/PascalCase)
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
    .toLowerCase(); // Convert to lowercase
}

/**
 * convert to sentence case
 * TODO: Move into seperate module
 * @param str
 * @returns
 */
export const toSentenceCase = (str: string) => {
  return str.replace(/([A-Z])/g, ' $1');
};

export const isValidUUID = (uuid: string) => {
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/i;
  return uuidRegex.test(uuid);
};

export const fromBase64ToAscii = (str: string) => {
  return Buffer.from(str, 'base64').toString('ascii');
};
export const fromAsciiToBase64 = (str: string) => {
  return Buffer.from(str).toString('base64');
};

export function csvToJSON(csv: string) {
  const lines = csv.split('\n');
  const result = [];
  const headers = lines[0].split(',');

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i]) continue;
    const obj: any = {};
    const currentline = lines[i].split(',');

    for (let j = 0; j < headers.length; j++) {
      const k = headers[j].trim();
      const v = currentline[j].replace(/\r/g, '');
      obj[k] = v;
    }
    result.push(obj);
  }
  return result;
}

export const sleep = async (ms: number) => {
  return new Promise((res) => {
    setTimeout(res, ms);
  });
};

export const fetchIP = async () => {
  try {
    const res = await fetch('https://api.ipify.org/?format=json', {
      method: 'GET',
    });
    return await res?.json();
  } catch (e) {
    return;
  }
};
export const fetchIPInfo = async (ip: string) => {
  try {
    const res = await fetch(
      `${
        process.env['IP_INFO_API']?.replace(/\$\{(ip)\}/, '$1') ??
        `https://ipapi.co/${ip}/json`
      }`,
      {
        method: 'GET',
      }
    );
    const { data }: any = (await res?.json?.()) ?? {};
    return await data;
  } catch (e) {
    return;
  }
};

export const getWebsiteUrl = () => {
  return `${window.location.protocol}://${window.location.host}${window.location.pathname}`;
};

export const generateFingerprint = async (user?: any) => {
  try {
    if (typeof window !== 'undefined') {
      let { ip } = await fetchIP();
      if (ip) {
        ip = await fetchIPInfo(ip);
      }
      const uastr = navigator?.userAgent;
      let ua: any;
      try {
        ua = parse(uastr);
      } catch (e) {
        console.error('Could not parse User-Agent!');
      }
      const website = getWebsiteUrl();
      return {
        ua,
        ip,
        user,
        uastr,
        website,
      };
    } else {
      return { user };
    }
  } catch (e) {
    return { user };
  }
};

export const getSearch = () => {
  if (window.location.search) {
    const search = window.location.search.substring(1);
    return JSON.parse(
      '{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
      function (key, value) {
        return key === '' ? value : decodeURIComponent(value);
      }
    );
  } else {
    return {};
  }
};

export const getUniqueId = () => {
  let id_ = getLocalKV('_id')?.id;
  if (!id_) {
    id_ = getCookie('_id');
    if (!id_) {
      id_ = randomId(8);
      setLocalKV('_id', { id_ });
      setCookie('_id', id_);
    }
  }
  return id_;
};

export const formDataToObject = <T = any>(formData: FormData): T => {
  const obj = Object.fromEntries(formData as never);
  for (const k in obj) {
    if (k.startsWith('$')) {
      delete obj[k];
    }
    if (obj[k]?.startsWith?.('[') || obj[k]?.startsWith?.('{')) {
      obj[k] = JSON.parse(obj[k]);
    }
  }
  return obj as T;
};
