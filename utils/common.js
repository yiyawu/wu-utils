/**
 * 浏览器判断
 */
const checkBrowser = function () {
  let userAgent = navigator.userAgent;
  let isOpera = userAgent.indexOf('Opera') > -1;
  if (isOpera) {
    return 'Opera'
  }
  if (userAgent.indexOf('Firefox') > -1) {
    return 'FF';
  }
  if (userAgent.indexOf('Chrome') > -1) {
    return 'Chrome';
  }
  if (userAgent.indexOf('Safari') > -1) {
    return 'Safari';
  }
  if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera) {
    let reIE = new RegExp('MSIE (\\d+\\.\\d+);');
    reIE.test(userAgent);
    let fIEVersion = parseFloat(RegExp.$1);
    return `IE${fIEVersion}`;
  }
  if (userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1) {
    return 'IE11';
  }
  return '';
}

/**
 * 格式化日期
 * @param date
 * @param format
 * @returns {*}
 */
const dateFormat = function (date, format = 'Y-M-d') {
  if (!date || typeof date !== 'object') {
    return date;
  }
  // const newDate = new Date(moment(date).valueOf());
  const newDate = date;
  let o = {
    Y: newDate.getFullYear(), // 年份
    M: newDate.getMonth() + 1, // 月份
    d: newDate.getDate(), // 日
    h: newDate.getHours(), // 小时
    m: newDate.getMinutes(), // 分
    s: newDate.getSeconds(), // 秒
    q: Math.floor((newDate.getMonth() + 3) / 3), // 季度
    S: newDate.getMilliseconds() // 毫秒
  };
  o.M = String(o.M).padStart(2, '0');
  o.d = String(o.d).padStart(2, '0');
  o.h = String(o.h).padStart(2, '0');
  o.m = String(o.m).padStart(2, '0');
  o.s = String(o.s).padStart(2, '0');
  let arr = ['Y', 'M', 'd', 'h', 'm', 's'];
  let dateStr = format;
  arr.forEach((i) => {
    dateStr = dateStr.replace(i, o[i])
  })
  return dateStr;
}

/**
 * 处理浮点数相加乘
 * @param arg1
 * @param arg2
 * @returns {number}
 */
const accAdd = (arg1, arg2 = 0) => {
  let r1,
    r2,
    m,
    arg1s,
    arg2s;
  arg1s = arg1.toString().replace('.', '')
  arg2s = arg2.toString().replace('.', '')
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  let zero = '';
  if (r1 !== r2) {
    for (let i = 0; i < (Math.abs(r1 - r2)); i++) {
      zero += '0'
    }
  }
  if (r1 > r2) {
    arg2s += zero
  } else if (r1 < r2) {
    arg1s += zero
  }
  m = Math.pow(10, Math.max(r1, r2));
  return (Number(arg2s) + Number(arg1s)) / m;
}

/**
 * 处理浮点数相
 * @param arg1
 * @param arg2
 * @returns {number}
 */
function accMul(arg1, arg2) {
  arg1 = Number(arg1);
  arg2 = Number(arg2);
  let m = 0,
    s1 = arg1.toString(),
    s2 = arg2.toString();
  try {
    m += s1.split('.')[1].length
  } catch (e) {}
  try {
    m += s2.split('.')[1].length
  } catch (e) {}
  return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m);
}

/**
 * 处理浮点数相除
 * @param arg1
 * @param arg2
 * @returns arg1除以arg2的精确结果
 */
function accDiv(arg1, arg2) {
  arg1 = Number(arg1);
  arg2 = Number(arg2);
  let t1 = 0,
    t2 = 0,
    r1,
    r2;
  try {
    t1 = arg1.toString().split('.')[1].length
  } catch (e) {}
  try {
    t2 = arg2.toString().split('.')[1].length
  } catch (e) {}
  Math.r1 = Number(arg1.toString().replace('.', ''))
  Math.r2 = Number(arg2.toString().replace('.', ''))
  return (Math.r1 / Math.r2) * Math.pow(10, t2 - t1);
}

/**
 * 处理浮点数减法
 * @param arg1
 * @param arg2
 * @returns arg1除以arg2的精确结果
 */
function accSub(arg1, arg2) {
  let r1,
    r2,
    m,
    n;
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2));
  // last modify by deeka
  // 动态控制精度长度
  n = (r1 >= r2) ? r1 : r2;
  return (accDiv(accMul(arg1, m) - accMul(arg2, m), m)).toFixed(n);
}

/**
 * 比较两个字符串类型的数字(可能是浮点数)的大小,直接比较避免转换
 * @param source
 * @param dest
 *  source>dest 1
 *  source=dest 0
 *  source<dest -1
 * @returns {number}
 */
const compareFloat = function (source, dest) {
  const floatRegex = /^([+-]?)(\d+)(?:\.(\d+))?$/
  let sourceNum = floatRegex.exec(source)
  let destNum = floatRegex.exec(dest)
  if ((source === Infinity && dest === Infinity) ||
    (source === -Infinity && dest === -Infinity)
  ) {
    return 0
  } else if (source === Infinity && dest === -Infinity) {
    return 1
  } else if (source === -Infinity && dest === Infinity) {
    return -1
  }
  if (!(sourceNum && destNum) && source !== '' && dest !== '') {
    throw new Error(`被比较数字格式非法 sourceNum:${source} destNum:${dest}`)
  }
  if (source === '' || dest === '') {
    return -1
  }
  let sourceNumSymbol = sourceNum[1]
  let destNumSymbol = destNum[1]
  const compare = (innerSource, innerDest) => {
    let innerSourceNumIntPart = innerSource[2]
    let innerSourceNumFloatPart = innerSource[3]
    let innerDestNumIntPart = innerDest[2]
    let innerDestNumFloatPart = innerDest[3]
    if (parseInt(innerSourceNumIntPart) > parseInt(innerDestNumIntPart)) {
      return 1
    } else if (innerSourceNumIntPart === innerDestNumIntPart) {
      // 比较小数部分
      if (innerSourceNumFloatPart && innerDestNumFloatPart) {
        return parseInt(innerSourceNumFloatPart) > parseInt(innerDestNumFloatPart) ? 1 : (innerSourceNumFloatPart === innerDestNumFloatPart ? 0 : -1)
      } else if (innerSourceNumFloatPart) {
        return 1
      } else if (innerDestNumFloatPart) {
        return -1
      }
      return 0
    }
    return -1
  }
  // 去掉正符号
  sourceNumSymbol = sourceNumSymbol === '+' ? '' : sourceNumSymbol
  destNumSymbol = destNumSymbol === '+' ? '' : destNumSymbol
  if (sourceNumSymbol === '-' && destNumSymbol === '-') {
    // 都是负号
    let res = compare(sourceNum, destNum)
    return res === 0 ? 0 : -res
  } else if (sourceNumSymbol === '-') {
    return -1
  } else if (destNumSymbol === '-') {
    return 1
  }
  return compare(sourceNum, destNum)
}

/**
 * 字符串类型转数字类型
 * @param {*} numbers 
 * @returns 
 */
 function strToNumber(numbers) {
  if (typeof numbers === 'string') {
    numbers = numbers.replace(/,/g, '');
  }
  return Number(numbers)
}

/**
 * 金额类型转字符串
 * @param {*} money 
 * @returns 
 */
const moneyToString = (money) => {
  if (isNaN(money) && !(typeof money === 'string')) {
    return money;
  }
  let result = money.toString().replace(/,/g, '');
  return result;
}

/**
 * 格式化金额，加上千分位符号
 * @param s
 * @returns {*}
 */
const numberTomoney = (s) => {
  if (isNaN(s) && !(typeof s === 'string')) {
    return s;
  }
  if (s === null) {
    return s;
  }
  s = `${s}`;
  s = s.replace(/,/g, '');
  s = s === '' ? '0' : s;
  s = (`${s}`).split('.');
  let l = s[0].split('').reverse();
  let r = s[1];
  if (r) {
    if (r.length == 1) {
      r = `.${r}0`;
    } else if (r.length == 2) {
      r = `.${r}`;
    } else {
      r = `.${r.substr(0, 2)}`;
    }
  } else {
    r = '.00';
  }
  let t = '';
  for (let i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length && l[(i + 1)] != '-' ? ',' : '');
  }
  return t.split('').reverse().join('') + r;
}

/**
 * 金额大写
 * @param dMoney
 * @returns {string}
 */
const chineseMoney = function (dMoney, unit) {
  if (!dMoney) {
    return;
  }
  let maxDec = 2;
  // 验证输入金额数值或数值字符串：
  dMoney = dMoney.toString().replace(/,/g, '');
  dMoney = dMoney.replace(/^0+/, ''); // 金额数值转字符、移除逗号、移除前导零
  if (dMoney == '') {
    return '零元整';
  } // （错误：金额为空！）
  else if (isNaN(dMoney)) {
    return '错误：金额不是合法的数值！';
  }
  let money = Number(dMoney)
  const getMoney = (u) => {
    switch (u) {
      case '元':
        break;
      case '十元':
        money *= 10
        break;
      case '百元':
        money *= 100
        break;
      case '千元':
        money *= 1000
        break;
      case '万元':
        money *= 10000
        break;
      case '十万元':
        money *= 100000
        break;
      case '百万元':
        money *= 1000000
        break;
      case '千万元':
        money *= 10000000
        break;
      case '亿元':
        money *= 100000000
        break;
      default:
        break
    }
  }
  if (unit) {
    getMoney(unit)
  }
  dMoney = money.toString()
  let minus = ''; // 负数的符号“-”的大写：“负”字。可自定义字符，如“（负）”。
  let CN_SYMBOL = ''; // 币种名称（如“人民币”，默认空）
  if (dMoney.length > 1) {
    if (dMoney.indexOf('-') == 0) {
      dMoney = dMoney.replace('-', '');
      minus = '负';
    } // 处理负数符号“-”
    if (dMoney.indexOf('+') == 0) {
      dMoney = dMoney.replace('+', '');
    } // 处理前导正数符号“+”（无实际意义）
  }
  // 变量定义：
  let vInt = '';
  let vDec = ''; // 字符串：金额的整数部分、小数部分
  let resAIW; // 字符串：要输出的结果
  let parts; // 数组（整数部分.小数部分），length=1时则仅为整数。
  let digits,
    radices,
    bigRadices,
    decimals; // 数组：数字（0~9——零~玖）；基（十进制记数系统中每个数字位的基是10——拾,佰,仟）；大基（万,亿,兆,京,垓,杼,穰,沟,涧,正）；辅币（元以下，角/分/厘/毫/丝）。
  let zeroCount; // 零计数
  let i,
    p,
    d; // 循环因子；前一位数字；当前位数字。
  let quotient,
    modulus; // 整数部分计算用：商数、模数。
  // 金额数值转换为字符，分割整数部分和小数部分：整数、小数分开来搞（小数部分有可能四舍五入后对整数部分有进位）。
  let NoneDecLen = (typeof (maxDec) === 'undefined' || maxDec == null || Number(maxDec) < 0 || Number(maxDec) > 5); // 是否未指定有效小数位（true/false）
  parts = dMoney.split('.'); // 数组赋值：（整数部分.小数部分），Array的length=1则仅为整数。
  if (parts.length > 1) {
    vInt = parts[0];
    vDec = parts[1]; // 变量赋值：金额的整数部分、小数部分
    if (NoneDecLen) {
      maxDec = vDec.length > 5 ? 5 : vDec.length;
    } // 未指定有效小数位参数值时，自动取实际小数位长但不超5。
    let rDec = Number(`0.${vDec}`);
    rDec *= Math.pow(10, maxDec);
    rDec = Math.round(Math.abs(rDec));
    rDec /= Math.pow(10, maxDec); // 小数四舍五入
    let aIntDec = rDec.toString().split('.');
    if (Number(aIntDec[0]) == 1) {
      vInt = (Number(vInt) + 1).toString();
    } // 小数部分四舍五入后有可能向整数部分的个位进位（值1）
    if (aIntDec.length > 1) {
      vDec = aIntDec[1];
    } else {
      vDec = '';
    }
  } else {
    vInt = dMoney;
    vDec = '';
    if (NoneDecLen) {
      maxDec = 0;
    }
  }
  if (vInt.length > 44) {
    return `错误：金额值太大了！整数位长【${vInt.length.toString()}】超过了上限——44位/千正/10^43（注：1正=1万涧=1亿亿亿亿亿，10^40）！`;
  }
  // 准备各字符数组 Prepare the characters corresponding to the digits:
  digits = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'); // 零~玖
  radices = new Array('', '拾', '佰', '仟'); // 拾,佰,仟
  bigRadices = new Array('', '万', '亿', '兆', '京', '垓', '杼', '穰', '沟', '涧', '正'); // 万,亿,兆,京,垓,杼,穰,沟,涧,正
  decimals = new Array('角', '分', '厘', '毫', '丝'); // 角/分/厘/毫/丝
  resAIW = ''; // 开始处理
  // 处理整数部分（如果有）
  if (Number(vInt) > 0) {
    zeroCount = 0;
    for (i = 0; i < vInt.length; i++) {
      p = vInt.length - i - 1;
      d = vInt.substr(i, 1);
      quotient = p / 4;
      modulus = p % 4;
      if (d === '0') {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          resAIW += digits[0];
        }
        zeroCount = 0;
        resAIW += digits[Number(d)] + radices[modulus];
      }
      if (modulus === 0 && zeroCount < 4) {
        resAIW += bigRadices[quotient];
      }
    }
    resAIW += '元';
  }
  // 处理小数部分（如果有）
  for (i = 0; i < vDec.length; i++) {
    d = vDec.substr(i, 1);
    if (d !== '0') {
      resAIW += digits[Number(d)] + decimals[i];
    }
  }
  // 处理结果
  if (resAIW == '') {
    resAIW = '零' + '元';
  } // 零元
  if (vDec == '') {
    resAIW += '整';
  } // ...元整
  resAIW = CN_SYMBOL + minus + resAIW; // 人民币/负......元角分/整
  return resAIW;
}
