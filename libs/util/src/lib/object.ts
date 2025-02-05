export function crawlObject(
  obj: any,
  keys: string[] = [],
  validate: (o: any, keys: string[]) => boolean,
  cb: (o: any, keys: string[]) => void
) {
  if (validate(obj, keys)) cb(obj, keys)
  else
    obj &&
      typeof obj === 'object' &&
      Object.entries(obj).forEach(([key, val]) =>
        crawlObject(val, [...keys, key], validate, cb)
      )
}

//assign obj.[keys...] = value
export function layeredAssignment<T>(
  obj: any,
  keys: readonly (number | string)[],
  value: T
) {
  keys.reduce((accu, key, i, arr) => {
    if (i === arr.length - 1) return (accu[key] = value)
    if (!accu[key]) accu[key] = {}
    return accu[key]
  }, obj)
  return obj
}

/**
 * Filter the object to only have key:value for a correspoding array of keys
 * Assumes that `keys` is a superset of Object.keys(obj)
 * @param obj
 * @param keys
 * @returns
 */
export function objFilterKeys<K extends string, K2 extends string, V>(
  obj: Record<K, V>,
  keys: K2[]
): Record<K2, V> {
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => keys.includes(k as K2))
  ) as Record<K2, V>
}

export function objMap<K extends string | number, V, V2>(
  obj: Record<K, V>,
  f: (v: V, k: K, i: number) => V2
): Record<K, V2> {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v], i) => [k, f(v as V, k as K, i)])
  ) as Record<K, V2>
}

/**
 * Generate an object from an array of keys, and a function that maps the key to a value
 * @param keys
 * @param map
 * @returns
 */
export function objKeyMap<K extends string | number, V>(
  keys: readonly K[],
  map: (key: K, i: number) => V
): Record<K, V> {
  return Object.fromEntries(keys.map((k, i) => [k, map(k, i)])) as Record<K, V>
}

export function objKeyValMap<
  K extends string | number,
  K2 extends string | number,
  V
>(items: readonly K[], map: (item: K, i: number) => [K2, V]): Record<K2, V> {
  return Object.fromEntries(items.map((t, i) => map(t, i))) as Record<K2, V>
}

//multiplies every numerical value in the obj by a multiplier.
export function objMultiplication(obj: Record<string, unknown>, multi: number) {
  if (multi === 1) return obj
  Object.keys(obj).forEach((prop: any) => {
    if (typeof obj[prop] === 'object')
      objMultiplication(
        (obj as Record<string, Record<string, unknown>>)[prop],
        multi
      )
    if (typeof obj[prop] === 'number')
      obj[prop] = (obj as Record<string, number>)[prop] * multi
  })
  return obj
}
//delete the value denoted by the path. Will also delete empty objects as well.
export function deletePropPath(
  obj: Record<string, unknown>,
  path: readonly string[]
) {
  const tempPath = [...path]
  const lastKey = tempPath.pop()
  if (!lastKey) return
  const objPathed = objPathValue(obj, tempPath)
  delete objPathed?.[lastKey]
}

//get the value in a nested object, giving array of path
export function objPathValue(
  obj: object | undefined,
  keys: readonly string[]
): any {
  if (!obj || !keys) return undefined
  return keys.reduce((a, k) => (a as any)?.[k], obj)
}

export function objClearEmpties(o: Record<string, unknown>) {
  for (const k in o) {
    if (typeof o[k] !== 'object') continue
    objClearEmpties(o[k] as Record<string, unknown>)
    if (!Object.keys(o[k] as Record<string, unknown>).length) delete o[k]
  }
}

export const getObjectKeysRecursive = (obj: unknown): string[] =>
  typeof obj === 'object'
    ? Object.values(obj as Record<string, unknown>)
        .flatMap(getObjectKeysRecursive)
        .concat(Object.keys(obj as Record<string, unknown>))
    : typeof obj === 'string'
    ? [obj]
    : []

export function deepFreeze<T>(obj: T, layers = 5): T {
  if (layers === 0) return obj
  if (typeof obj === 'object')
    Object.values(Object.freeze(obj)).forEach((o) => deepFreeze(o, layers--))
  return obj
}
