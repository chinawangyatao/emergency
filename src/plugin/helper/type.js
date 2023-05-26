// 判断数据类型
export const checkValueType = (value, type) => Object.prototype.toString.call(value) === type

/**
 * 判断是否是数组
 */
export const isArray = (value) => checkValueType(value, '[object Array]')

/**
 * 判断是否是对象
 */
export const isObject = (value) => checkValueType(value, '[object Object]')

/**
 * 判断是否是字符串
 */
export const isString = (value) => checkValueType(value, '[object String]')

/**
 * 判断是否是数字
 */
export const isNumber = (value) => checkValueType(value, '[object Number]')

/**
 * 判断是否为空
 */
export const isNull = (value) => {
  if (isObject(value) && JSON.stringify(value) === '{}') {
    return true
  }

  if (isArray(value) && !value.length) {
    return true
  }

  if (isString(value) && (!value || value === 'null')) {
    return true
  }

  if (!value) {
    return true
  }

  return false
}
