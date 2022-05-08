// A tiny wrapper around fetch(), borrowed from
// https://kentcdodds.com/blog/replace-axios-with-a-simple-custom-fetch-wrapper

/**
 *
 * @param {string} endpoint url for fetch
 * @param {object} param1 request params
 * @param {object?} param1.body optional post body
 * @returns {Promise<object>} response
 */
export async function client(endpoint, { body, ...customConfig } = {}) {
  const headers = { "Content-Type": "application/json" }

  const config = {
    headers: {
      ...headers,
      ...customConfig.headers,
    },
    method: body ? "POST" : "GET",
    ...customConfig,
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  let data
  try {
    const response = await window.fetch(endpoint, config)
    data = await response.json()
    if (response.ok) {
      // Return a result object similar to Axios
      return {
        status: response.status,
        data,
        headers: response.headers,
        url: response.url,
      }
    }
    throw new Error(response.statusText)
  } catch (err) {
    return Promise.reject(err.message ? err.message : data)
  }
}

client.get = function (endpoint, customConfig = {}) {
  return client(endpoint, { ...customConfig, method: "GET" })
}

client.post = function (endpoint, body, customConfig = {}) {
  return client(endpoint, { ...customConfig, body })
}
