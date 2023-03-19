export const getFieldsFromObject = <
  O extends { [index: string]: any },
  T extends string[]
>(
  object: O,
  ...fields: T
) => {
  type OutputType = Record<T[number], O[T[number]]>
  const output = {} as OutputType
  fields.forEach((f) => {
    if (object[f] !== undefined) {
      output[f] = object[f]
    }
  })
  return output
}

export const getSuccess = <T>(data: T) => ({ status: 'success', data })

export const createTempObjectId = () => {
  const hex = 16
  const magic = (s) => Math.floor(s).toString(hex)
  const str =
    magic(Date.now() / 1000) +
    ' '.repeat(hex).replace(/./g, () => magic(Math.random() * hex))

  return str + '@' + Date.now()
}
