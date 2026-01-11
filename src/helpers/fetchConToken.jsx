export const fetchConToken = async (url, options = {}) => {
  const token = localStorage.getItem("token") || "";

  const headers = {
    "Content-Type": "application/json",
    "x-token": token,
    ...options.headers,
  };

  return fetch(url, { ...options, headers });
};


