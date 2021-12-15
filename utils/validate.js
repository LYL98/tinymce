// 合法uri
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return urlregex.test(textval);
}
// 小写字母
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/;
  return reg.test(str);
}
// 大写字母
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/;
  return reg.test(str);
}
// 大小写字母
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/;
  return reg.test(str);
}

/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
export function checkPhone(phone) {
  const re = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
  return re.test(phone);
}
/**
 * validate phone
 * @param phone
 * @returns {boolean}
 */
export function validatePhone(rule, value, callback) {
  let reg = /^1[345789]\d{9}$/;
  let regTel = /^0\d{2,3}-?\d{7,8}$/;
  if (reg.test(value) || regTel.test(value) || value == "") {
    callback();
  } else {
    callback(new Error("请输入11位手机号"));
  }
}
/**
 * 验证数字和字母 或者是纯数字组成
 * @param phone
 * @returns {boolean}
 */
export function validateNumberAndLetter(rule, value, callback) {
  let regLetter = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{1,20}$/;
  let regNum = /^[0-9]*$/;
  if (regLetter.test(value) || regNum.test(value)) {
    callback();
  } else {
    callback(new Error("请输入1-20位的数字和字母组成的订单号"));
  }
}
/**
 * 验证身份证为合法
 */
export function isIdCard(idCard) {
  // 身份证15位和18位身份证号码正则表达式
  const regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
  if (regIdCard.test(idCard)) {
    if (idCard.length == 18) {
      const idCardWi = new Array(
        7,
        9,
        10,
        5,
        8,
        4,
        2,
        1,
        6,
        3,
        7,
        9,
        10,
        5,
        8,
        4,
        2
      ); // 将前17位加权因子保存在数组里
      const idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2); // 这是除以11后，可能产生的11位余数、验证码，也保存成数组
      let idCardWiSum = 0; // 用来保存前17位各自乖以加权因子后的总和
      for (let i = 0; i < 17; i++) {
        idCardWiSum += idCard.substring(i, i + 1) * idCardWi[i];
      }

      let idCardMod = idCardWiSum % 11; // 计算出校验码所在数组的位置
      let idCardLast = idCard.substring(17); // 得到最后一位身份证号码

      // 如果等于2，则说明校验码是10，身份证号码最后一位应该是X
      if (idCardMod == 2) {
        if (idCardLast == "X" || idCardLast == "x") {
          //alert("恭喜通过验证啦！");
          return true;
        } else {
          //alert("身份证号码错误！");
          return false;
        }
      } else {
        // 用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
        if (idCardLast == idCardY[idCardMod]) {
          //alert("恭喜通过验证啦！");
          return true;
        } else {
          //alert("身份证号码错误！");
          return false;
        }
      }
    } else {
      return true;
    }
  } else {
    //alert("身份证格式不正确!");
    return false;
  }
}
/**
 * 判断对象是否为空对象
 */
export function isEmpty(str) {
  if (typeof str == "undefined" || str == null || str == "") {
    return true;
  }
  return false;
}
/**
 * 验证密码(6-12位)
 */
export function valiadePassword(str) {
  let regLetter = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/;
  let regSpecialLeterr = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*])[\da-zA-Z~!@#$%^&*]{6,12}$/;
  if (regLetter.test(str) || regSpecialLeterr.test(str)) {
    return true;
  }
  return false;
}

export function valiadeInputPassword(rule, value, callback) {
  console.log(value);
  let regLetter = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/;
  let regSpecialLeterr = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*])[\da-zA-Z~!@#$%^&*]{6,12}$/;
  if (regLetter.test(value) || regSpecialLeterr.test(value)) {
    callback();
  } else {
    callback(new Error("密码由6-12数字和字母或数字、字母特殊字符组成"));
  }
}
// 获取当前的yyyy-MM-dd mm:hh:ss
export function getCurTime() {
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  if (hours <= 9) {
    hours = "0" + hours;
  }
  if (minutes <= 9) {
    minutes = "0" + minutes;
  }
  if (seconds <= 9) {
    seconds = "0" + seconds;
  }
  var currentdate =
    date.getFullYear() +
    seperator1 +
    month +
    seperator1 +
    strDate +
    " " +
    hours +
    seperator2 +
    minutes +
    seperator2 +
    seconds;
  return currentdate;
}
/***
 * 判断是否是空对象
 */
export function isEmptyObject(obj) {
  return Object.keys(obj).length ? JSON.parse(obj) : {};
}

/***
 * 检查输入字符串是否为空或者全部都是空格
 */

export function validateSpace(rule, value, callback) {
  let isNull = /^[ ]+$/;
  if (isNull.test(value)) {
    callback(new Error("请输入非空格内容"));
  } else {
    callback();
  }
}
