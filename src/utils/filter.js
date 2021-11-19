import Vue from 'vue'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

Vue.filter('NumberFormat', function (value) {
  if (!value) {
    return '0'
  }
  const intPartFormat = value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
  return intPartFormat
})

Vue.filter('dayjs', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return dataStr ? moment(dataStr).format(pattern) : ''
})

Vue.filter('moment', function (dataStr, pattern = 'YYYY-MM-DD') {
  return dataStr ? moment(dataStr).format(pattern) : ''
})
// 将数值四舍五入(保留2位小数)后格式化成金额形式
// ss@precision 精度
Vue.filter('formatCurrency', function (num, precision = 2, keep0cents = false) {
  if (Number.isNaN(num) && Number.parseInt(num) === 0) return 0.0
  const pre = Math.pow(10, precision)
  num = num + ''
  // eslint-disable-next-line no-useless-escape
  num = num.replace(/\$|\,/g, '')
  if (Number.isNaN(num)) num = '0'

  num = Math.floor(num * pre + 0.50000000001)
  let cents = num % pre
  num = Math.floor(num / pre) + ''
  if (cents === 0) {
    cents = keep0cents ? '.00' : ''
  } else if (cents < 10) {
    cents = '.0' + cents
  } else {
    cents = '.' + cents
  }
  for (let i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
    num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3))
  }
  return num + cents
})
// 将金额形式转换成数字形式
Vue.filter('formatCurrencyi', function (stringNum) {
  // eslint-disable-next-line no-useless-escape
  return stringNum.replace(/[^\d\.-]/g, '')
})

// 手机号中间四位用星代替
Vue.filter('phoneFilter', function (phone) {
  const tel = '' + phone
  const reg = /(\d{3})\d{4}(\d{4})/
  return tel.replace(reg, '$1****$2')
})
