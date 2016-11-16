export default {
  invalidValue: (fieldName, input, message = `Invalid value ${input} for field '${fieldName}'`) => ({
    code: 'invalid_value',
    message,
    meta: {
      fieldName,
      input,
    }
  })
}

export function generateError({ code, message, meta }) {
  const error = new Error(message)
  error.code = code
  error.meta = meta
  return error
}
