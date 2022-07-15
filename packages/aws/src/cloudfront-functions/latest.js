/* eslint-disable no-unused-vars */
function handler(event) {
  const request = event.request;
  const regex = /^\/[^/]+\/latest\/+/;
  const matches = request.uri.match(regex);
  if (matches?.length) {
    const basename = matches[0].replace("/latest/", "");
    request.uri = request.uri.replace(
      regex,
      basename + "/__replace_with_version__/"
    );
  }

  return request;
}
