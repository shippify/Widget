export default {
  invalidValue: (fieldName, input, message = `Invalid value ${input} for field '${fieldName}.'`) => ({
    code: 'invalid_value',
    message,
    meta: {
      fieldName,
      input,
    }
  }),
  geocodingFailure: error => ({
    code: 'geocoding_failure',
    message: 'A geocoding error has occurred.',
    meta: {
      error
    }
  }),
  unauthenticated: () => ({
    code: 'unauthenticated',
    message: 'The provided Shippify API credentials are invalid'
  }),
  unknownError: error => ({
    code: 'unknown_error',
    message: 'An unknown error has occured.',
    meta: {
      error
    }
  })
}

export function generateError({ code, message, meta }) {
  const error = new Error(message)
  error.code = code
  error.meta = meta
  return error
}
