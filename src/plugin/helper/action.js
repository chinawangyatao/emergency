/**
 * 是否是外链
 */
export const isExternal = (path) => /^(https?:|mailto:|tel:)/.test(path || '')

/**
 * 检查客户端环境
 */
export const checkBrowser = () => {
  const ua = window.navigator.userAgent.toLowerCase()
  const micromessenger = ua.match(/MicroMessenger/i) || []
  const alipay = ua.match(/AliPay/i) || []
  const wxwork = ua.match(/wxwork/i) || []

  if (ua.indexOf('psbc') !== -1) {
    return 'PSBC'
  }

  if (micromessenger[0] === 'micromessenger' && wxwork[0] === 'wxwork') {
    return 'WXWORK'
  }

  if (micromessenger[0] === 'micromessenger') {
    return 'WECHAT'
  }

  if (alipay[0] === 'alipay') {
    return 'ALIPAY'
  }

  return ''
}
/**
 * android  ios
 */
export const checkSystem = () => {
  const u = navigator.userAgent
  const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
  const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
  if (isAndroid) return 'android'
  if (isiOS) return 'ios'
  return ''
}

/**
 * 保留小数点后几位
 * string | toFixed(num)
 * number | toFixed(num)
 */
export const toFixed = (val, num = 2) => {
  const value = isNull(val) ? 0 : val
  return parseFloat(String(value)).toFixed(num)
}

/**
 * 获取URL中单个参数
 */
export const getURLParam = (string) => {
  const reg = new RegExp('(^|&)' + string + '=([^&]*)(&|$)', 'i')
  const hash = location.hash
  const search = location.search
  let r

  if (search) {
    r = search.substr(1).match(reg)
  }

  if (!r && hash && hash.indexOf('?') !== -1) {
    r = location.hash.substring(location.hash.indexOf('?')).substr(1).match(reg)
  }

  return r ? decodeURI(r[2]) : ''
}

/**
 * 获取URL中多个参数
 */
export const getURLMultiParam = (array) => {
  const params = {}
  array.forEach((item) => {
    params[item] = getURLParam(item)
  })
  return params
}

/**
 * 获取url中所有参数
 */
export const getURLAllParam = () => {
  const hash = location.hash
  const search = location.search

  let queryParamToken = ''

  if (search && search.indexOf('?') !== -1) {
    queryParamToken = search.substr(1)
  }

  if (hash && hash.indexOf('?') !== -1) {
    queryParamToken += `&${location.hash.substring(location.hash.indexOf('?')).substr(1)}`
  }

  const queryParamTokens = queryParamToken.split('&')

  const query = {}

  if (queryParamTokens) {
    queryParamTokens.forEach((item) => {
      if (item) {
        const key = item.split('=')[0]
        const value = item.split('=')[1]
        query[key] = value
      }
    })

    return query
  }

  return query
}
