import isArray from 'lodash/isArray'
import isObject from 'lodash/isObject'
import camelCase from 'lodash/camelCase'
import snakeCase from 'lodash/snakeCase'
import transform from 'lodash/transform'

export function camelize(obj) {
  return transform(obj, (acc, value, key, target) => {
    let camelKey = isArray(target) ? key : camelCase(key)
    while (camelKey in acc) {
      camelKey = `$${camelKey}`
    }
    acc[camelKey] = isObject(value) ? camelize(value) : value
  })
}

export function snakize(obj) {
  return transform(obj, (acc, value, key, target) => {
    const camelKey = isArray(target) ? key : snakeCase(key)
    acc[camelKey] = isObject(value) ? snakize(value) : value
  })
}

export function strCamelcaseToSnakecase(str) {
  if (typeof str !== 'string') return str
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

export function strSnakecaseToCamelcase(str) {
  if (typeof str !== 'string') return str
  return str
    .toLowerCase()
    .replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''))
}
