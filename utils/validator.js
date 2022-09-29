import { translate } from './IntlMessages';

let regMob = /^1[34578]\d{9}$/;
let regTel = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
let regEmail = /^.+@[a-z0-9]+\.+.+?$/;

// 对邮箱添加验证
const validateEmail = (rule, value, callback) => {
  if (value && !regEmail.test(value)) {
    callback('邮箱格式错误！');
  } else {
    callback();
  }
};
// 对手机号码添加验证
const validateMobile = (rule, value, callback) => {
  if (value && !regMob.test(value)) {
    callback('手机号格式错误！');
  } else {
    callback();
  }
};
// 对固定电话号码添加验证
const validateTel = (rule, value, callback) => {
  if (value && !regTel.test(value)) {
    callback('固定电话格式错误！');
  } else {
    callback();
  }
};
// 对电话号码添加验证---手机号码或者固定电话
const validatePhone = (rule, value, callback) => {
  if (
    value &&
    !regMob.test(value) &&
    (value && !regTel.test(value))
  ) {
    // console.log(1)
    callback('联系电话格式错误！');
  } else {
    // console.log(2)
    callback();
  }
};
// 大于0的校验
const validatePositive = (rule, value, callback) => {
  if (value && Number(value.replace(/,/g, '')) < 0) {
    callback('数字不允许小于0！');
  } else {
    callback();
  }
}
// 大于0的校验
const validateGreaterThanZero = (rule, value, callback) => {
  if (value && Number(value.replace(/,/g, '')) <= 0) {
    callback('数字不允许小于等于0');
  } else {
    callback();
  }
}

function countLength(str) {
  let inputLength = 0
  let strArr = str.split('');
  strArr.forEach((i, index) => {
    let countCode = str.codePointAt(index);
    if (countCode >= 0 && countCode <= 128) {
      inputLength++
    } else {
      inputLength += 2
    }
  })
  return inputLength
}
// 中英文长度校验
const validateLength = (rule, value, callback) => {
  let length = rule.length
  const string = '不能超出length个字符！'
  if (value && countLength(value) > length) {
    callback(string.replace(/length/, length))
  } else {
    callback()
  }
}

const validateComboLength = (rule, value, callback) => {
  let length = rule.length;
  let str = '';
  const string = '不能超出length个字符！'
  if (value) {
    if (value.label) {
      str = value.label;
    } else {
      value.forEach((item, index) => {
        str += item.label;
      })
    }
    if (countLength(str) > length) {
      callback(string.replace(/length/, length))
    } else {
      callback()
    }
  } else {
    callback()
  }
}
// 检验IP格式
const validateIP = (rule, value, callback) => {
  let reg = /^((([0-9][0-9]{0,1})|([0-1][0-9]{2})|(2[0-5]{2}))\.){3}(([0-9][0-9]{0,1})|([0-1][0-9]{2})|(2[0-5]{2}))$/;
  if (!reg.test(value)) {
    callback('IP格式错误！');
  } else {
    callback();
  }
};
// 用16进制匹配uniccode 编码前31位特殊字符
const validateUnicode = (rule, value, callback) => {
  let objRegExp = /[\x00-\x08\x0b-\x0c\x0e-\x1f]/;
  if (value && value.search(objRegExp) >= 0) {
    let string = '第length个字符是无效字符string请删除后操作'
    let nString = string.replace(/length/, value.search(objRegExp)).replace(/string/, value[value.search(objRegExp)])
    callback(nString);
  } else {
    callback();
  }
}

const validateSpace = (value) => {
  if (isEmpty(value.replaceAll(/^\s+|\s+$/g, ''))) {
    return ''
  }
  return value.replaceAll(/^\s+|\s+$/g, '')
}

const validateDate = (rule, value, callback) => {
  let dateArr = value;
  if (dateArr) {
    if (dateArr[0] && dateArr[1]) {
      callback()
    } else {
      callback('日期范围不完整！')
    }
  } else {
    callback()
  }
}
// 校验特殊字符
const validateCharacter = (rule, value, callback) => {
  let regChar = /^[A-Za-z0-9_-]+$/
  if (value && !regChar.test(value)) {
    callback('不能输入特殊字符和中文！')
  } else {
    callback()
  }
}
// 校验位数
const checkDigit = (rule, value, callback) => {
  let integerLength = rule.integerLength || 22;
  let decimalLength = rule.decimalLength || 10;
  if (value && value.indexOf('.') !== -1) {
    if (value.split('.')[0] && value.split('.')[0].length > integerLength) {
      callback(`整数位长度不能超过${integerLength}！`)
    } else if (value.split('.')[1] && value.split('.')[1].length > decimalLength) {
      callback(`小数位长度不能超过${decimalLength}！`)
    } else {
      callback()
    }
  } else {
    callback()
  }
}
// 校验英文
const validateEnglish = (rule, value, callback) => {
  const reg = /^[A-Za-z]+$/;
  if (value && !reg.test(value)) {
    callback('只能输入英文!')
  } else {
    callback()
  }
}
// 校验中文
const validateChinese = (rule, value, callback) => {
  const reg = /^[\u4e00-\u9fa5]{0,}$/;
  if (value && !reg.test(value)) {
    callback('只能输入中文！')
  } else {
    callback()
  }
}

export {
  validateEmail,
  validateMobile,
  validateTel,
  validatePhone,
  validateIP,
  validateLength,
  validatePositive,
  validateUnicode,
  validateGreaterThanZero,
  validateDate,
  validateComboLength
};
