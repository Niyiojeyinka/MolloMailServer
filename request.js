const fetch = require("node-fetch");

/** make a request
 *
 * @param {*} url
 * @param {*} method
 * @param {*} data
 * @param {*} token
 */
exports.request = async (url, method, data = {}, headerObject = {}) => {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...headerObject,
  };
  const meta = {
    method,
    headers,
  };

  const bodyMethods = ["POST", "PUT", "UPDATE"];

  if (bodyMethods.indexOf(method) != -1) {
    meta["body"] = JSON.stringify(data);
  }

  const res = await fetch(url, meta);

  const responseData = await res.json();
  return {
    status: res.status,
    body: responseData,
  };
};