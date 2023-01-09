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

getFieldsFromObject({ body: 'hello' }, 'body').body
