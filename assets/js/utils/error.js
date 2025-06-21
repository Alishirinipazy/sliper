function normalizeAxiosError(error) {
  if (!error?.response && !error?.request) return error

  const err = error.response
    ? new Error(
        `Response error: ${error?.response?.message}` ||
          error?.response?.data?.message ||
          error?.toJSON()?.message
      )
    : new Error(`Network error: ${error?.toJSON()?.message}`)

  err.viewableMessage =
    error?.response?.message?.msg ||
    error?.response?.message ||
    error?.response?.data?.message?.[0]?.msg ||
    error?.response?.data?.message?.msg ||
    error?.response?.data?.message

  err.statusCode = error?.response?.status || 500

  err.url = error?.config?.url

  err.baseURL = error?.config?.baseURL

  err.method = error?.config?.method

  err.headers = error?.config?.headers

  err.data = error?.config?.data

  err.timeout = error?.config?.timeout

  if (err.url && err.baseURL) {
    const parsedUrl = new URL(err.url, err.baseURL)

    err.hostname = parsedUrl.hostname

    err.pathname = parsedUrl.pathname

    err.search = parsedUrl.search
  }

  return err
}

export function humanizeError(error) {
  let err = null

  if (error?.response || error?.request) {
    err = normalizeAxiosError(error)
  } else if (error instanceof Error) {
    err = error
  } else {
    err = new Error('something unexpected', { cause: error })
  }

  if (!err.statusCode) err.statusCode = 500

  return err
}
