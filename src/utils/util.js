export function timeFix() {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

export function welcome() {
  const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 DOTA', '我猜你可能累了']
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent() {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

export function handleScrollHeader(callback) {
  let timer = 0

  let beforeScrollTop = window.pageYOffset
  callback = callback || function() {}
  window.addEventListener(
    'scroll',
    event => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        let direction = 'up'
        const afterScrollTop = window.pageYOffset
        const delta = afterScrollTop - beforeScrollTop
        if (delta === 0) {
          return false
        }
        direction = delta > 0 ? 'down' : 'up'
        callback(direction)
        beforeScrollTop = afterScrollTop
      }, 50)
    },
    false
  )
}

export function isIE() {
  const bw = window.navigator.userAgent
  const compare = s => bw.indexOf(s) >= 0
  const ie11 = (() => 'ActiveXObject' in window)()
  return compare('MSIE') || ie11
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate(id = '', timeout = 1500) {
  if (id === '') {
    return
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id))
  }, timeout)
}
export function scorePassword(pass) {
  let score = 0
  if (!pass) {
    return score
  }
  // award every unique letter until 5 repetitions
  const letters = {}
  for (let i = 0; i < pass.length; i++) {
    letters[pass[i]] = (letters[pass[i]] || 0) + 1
    score += 5.0 / letters[pass[i]]
  }

  // bonus points for mixing it up
  const variations = {
    digits: /\d/.test(pass),
    lower: /[a-z]/.test(pass),
    upper: /[A-Z]/.test(pass),
    nonWords: /\W/.test(pass)
  }

  let variationCount = 0
  for (var check in variations) {
    variationCount += variations[check] === true ? 1 : 0
  }
  score += (variationCount - 1) * 10

  return parseInt(score)
}

export function getSlot(slots, slot = 'default', data) {
  if (!slots || !Reflect.has(slots, slot)) {
    return null
  }
  if (!(slots[slot] instanceof Function)) {
    console.error(`${slot} is not a function!`)
    return null
  }
  const slotFn = slots[slot]
  if (!slotFn) return null
  return slotFn(data)
}

/**
 * 解决Vue Template模板中无法使用可选链的问题
 * @param obj
 * @param rest
 * @returns {*}
 */
export const optionalChaining = (obj, ...rest) => {
  let tmp = obj
  rest.forEach(key => {
    tmp = tmp?.[key]
  })
  return tmp || ''
}

export function formatDate(value) {
  const date = new Date(value)
  var YY = date.getFullYear() + '-'
  var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  var DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  return YY + MM + DD
}

export function randomNum(minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1, 10)
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
    default:
      return 0
  }
}

/**
 * 模板字符串赋值
 * @param {String} template 模板字符串（使用单{}包裹）
 * @param {Object} context 模板对象
 * @returns
 */
export function Render(template, context) {
  return template.replace(/{(.*?)}/g, (m, k) => {
    console.log(k)
    return context[k.trim()]
  })
}

/**
 * 获取模板中所有变量
 * @param {String}} html 模板字符串
 * @returns
 */
export function GetFunc(html) {
  const reg = /{(.*?)}/g
  const list = []
  let result = null
  do {
    result = reg.exec(html)
    result && !list.includes(result[1]) && list.push(result[1])
  } while (result)
  return list
}

/**
 * menu to tree data
 * @param arr
 * @param idPropName
 * @param pIdProdName
 * @param labelPropName
 * @returns {Array}
 */
export function menuTotree(arr, idPropName, pIdProdName, labelPropName) {
  if (!Array.isArray(arr)) {
    return []
  }
  for (let i = 0; i < arr.length; i++) {
    const o = arr[i]
    o.key = o[idPropName]
    o.title = o[labelPropName]
    o.pId = o[pIdProdName]
    o.originalId = o.key
    o.originalPId = o.pId
    o.originalLabel = o.title
  }
  const result = []
  arr.forEach(item => {
    if (item.pId === null || item.pId === '0' || item.pId === 0) {
      result.push(item)
      convertChild(arr, item, item.id)
    }
  })
  return result
}
function convertChild(arr, parentItem, parentId) {
  arr.forEach(item => {
    if (item.pId === parentId) {
      parentItem.children = parentItem.children ? parentItem.children : []
      item.parentLabel = parentItem.title
      parentItem.children.push(item)
      convertChild(arr, item, item.id)
    }
  })
}
/*
 * 数字转人民币（大写）
 * @param {Number} money 小写金额
 * @returns
 */
export function convertCurrency(money) {
  // 汉字的数字
  const cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  // 基本单位
  const cnIntRadice = ['', '拾', '佰', '仟']
  // 对应整数部分扩展单位
  const cnIntUnits = ['', '万', '亿', '兆']
  // 对应小数部分单位
  const cnDecUnits = ['角', '分', '毫', '厘']
  // 整数金额时后面跟的字符
  const cnInteger = '整'
  // 整型完以后的单位
  const cnIntLast = '元'
  // 最大处理的数字
  const maxNum = 999999999999999.9999
  // 金额整数部分
  let integerNum
  // 金额小数部分
  let decimalNum
  // 输出的中文金额字符串
  let chineseStr = ''
  // 分离金额后用的数组，预定义
  let parts
  if (money === '') {
    return ''
  }
  money = parseFloat(money)
  if (money >= maxNum) {
    // 超出最大处理数字
    return ''
  }
  if (money === 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger
    return chineseStr
  }
  // 转换为字符串
  money = money.toString()
  if (money.indexOf('.') === -1) {
    integerNum = money
    decimalNum = ''
  } else {
    parts = money.split('.')
    integerNum = parts[0]
    decimalNum = parts[1].substr(0, 4)
  }
  // 获取整型部分转换
  if (parseInt(integerNum, 10) > 0) {
    let zeroCount = 0
    const IntLen = integerNum.length
    for (let i = 0; i < IntLen; i++) {
      const n = integerNum.substr(i, 1)
      const p = IntLen - i - 1
      const q = p / 4
      const m = p % 4
      if (n === '0') {
        zeroCount++
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0]
        }
        zeroCount = 0
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m]
      }
      if (m === 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q]
      }
    }
    chineseStr += cnIntLast
  }
  if (decimalNum !== '') {
    const decLen = decimalNum.length
    for (let i = 0; i < decLen; i++) {
      const n = decimalNum.substr(i, 1)
      if (n !== '0') {
        chineseStr += cnNums[Number(n)] + cnDecUnits[i]
      }
    }
  }
  if (chineseStr === '') {
    chineseStr += cnNums[0] + cnIntLast + cnInteger
  } else if (decimalNum === '') {
    chineseStr += cnInteger
  }
  return chineseStr
}

export function groupBy(arr, fn) {
  return arr.map(typeof fn === 'function' ? fn : val => val[fn]).reduce((acc, val, i) => {
    acc[val] = (acc[val] || []).concat(arr[i])
    return acc
  }, {})
}

/**
 * 对象查重
 * @param {Object} arr 查重对象
 */
export function uniqueObject(arr) {
  if (arr.length > 0) {
    // 存放的是字符串形式的数组。
    var tempArr = []
    // 将数组对象转成数组字符串。
    var newStr = arrToString(arr)
    newStr.sort()

    // 先放置第一个
    var temp = newStr[0]
    tempArr.push(temp)
    // 数组去重
    for (let i = 1; i < newStr.length; i++) {
      if (newStr[i] !== temp) {
        temp = newStr[i] // 放置到集合里面。
        tempArr.push(newStr[i])
      }
    }
    // 上面，集合还是字符串形式的数组，需要转换成json对象的形式。
    const newArr = []
    // 新数组字符串转成数组对象
    for (let i = 0; i < tempArr.length; i++) {
      newArr.push(JSON.parse(tempArr[i]))
    }
    return newArr
  } else {
    return []
  }
}
/**
 *
 * @param arr 对象数组
 * @returns {Array} 转换成字符串的数组
 */
 function arrToString(arr) {
  const newArr = []
  if (arr.length !== 0) {
    for (let i = 0; i < arr.length; i++) {
      // 对每一个对象数据进行处理。
      // 将每一个对象里面的属性key 进行重新排序，变成新的对象。
      const thisObj = sortObject(arr[i])
      // 将json对象，转换成字符串
      let thisStr = JSON.stringify(thisObj)
      // 去除空格及\t空白字符
      thisStr = thisStr.replace(/(\s|[\t])/g, '')
      // 里面放置字符串
      newArr.push(thisStr)
    }
  }
  return newArr
}
/**
 *
 * @param obj 对象
 * @returns 将对象按照key值进行排序。
 */
function sortObject(obj) {
  const keyArr = []
  for (const item in obj) {
    // 把所有的key放置在一个数组里面。
    keyArr.push(item)
  }
  keyArr.sort() // 排序，按照字符进行排序。
  const newObj = {} // 还是json对象
  for (let i = 0; i < keyArr.length; i++) {
    newObj[keyArr[i]] = obj[keyArr[i]]
  }
  // 处理成 键=值的数组形式。
  // console.log("值是:"+JSON.stringify(newObj));
  return newObj
}
