export const fetchUsername = () =>
  fetch("http://localhost:3001/api/user")
    .then((response) => response.json())
    .then((data) => ({
      current: data.username,
      previous: "123",
    }));
