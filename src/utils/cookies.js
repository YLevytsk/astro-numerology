const DEFAULT_DAYS = 30;

const buildExpires = (days) => {
  const expiresDate = new Date(Date.now() + days * 864e5);
  return expiresDate.toUTCString();
};

export const setCookie = (name, value, days = DEFAULT_DAYS) => {
  if (!name) return;
  const encodedName = encodeURIComponent(name);
  const encodedValue = encodeURIComponent(value ?? "");
  const expires = buildExpires(days);
  document.cookie = `${encodedName}=${encodedValue}; expires=${expires}; path=/; SameSite=Lax`;
};

export const getCookie = (name) => {
  if (!name) return null;
  const encodedName = encodeURIComponent(name);
  const pair = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${encodedName}=`));
  if (!pair) return null;
  const [, rawValue] = pair.split("=");
  return decodeURIComponent(rawValue || "");
};

export const deleteCookie = (name) => {
  if (!name) return;
  const encodedName = encodeURIComponent(name);
  document.cookie = `${encodedName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
};
