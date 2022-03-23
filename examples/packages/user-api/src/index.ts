export const fetchUsername = () =>
  fetch("/api/user")
    .then((response) => response.json())
    .then((data) => data.username);
