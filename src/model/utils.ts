export const createdAtField = (required = true) => {
  return {
    required,
    type: Date,
    default: Date.now,
  }
}
