const city = {
    11: "北京",
    12: "天津",
    13: "河北",
    14: "山西",
    15: "内蒙古",
    21: "辽宁",
    22: "吉林",
    23: "黑龙江",
    31: "上海",
    32: "江苏",
    33: "浙江",
    34: "安徽",
    35: "福建",
    36: "江西",
    37: "山东",
    41: "河南",
    42: "湖北",
    43: "湖南",
    44: "广东",
    45: "广西",
    46: "海南",
    50: "重庆",
    51: "四川",
    52: "贵州",
    53: "云南",
    54: "西藏",
    61: "陕西",
    62: "甘肃",
    63: "青海",
    64: "宁夏",
    65: "新疆",
    71: "台湾",
    81: "香港",
    82: "澳门",
    91: "国外",
};

export default class Validator {
  /**
   * 空字符串验证
   */
   static trim = (rule, value, callback) => {
    if(value.replace(/^\s+/, "").replace(/\s+$/, "") === '') {
      return callback(new Error('输入不能为空'));
    }
    callback();
   }

  /**
   * 数组不能为空
   */
   static requiredArray = (rule, value, callback) => {
    if (value.length == 0) {
        return callback(new Error('类型不正确'));
    }
    callback();
    }

    /**
     * 浮点数字的判断
     */
    static float = (rule, value, callback) => {
        if (isNaN(value) || value === '') {
            return callback(new Error('类型不正确'));
        }
        callback();
    }

    /**
     * 整数类型的判断
     */
    static int = (rule, value, callback) => {
        var value = '' + value
        var re = /^[0-9]*[1-9][0-9]*$/;
        if (!re.test(value) && value != '0' || value == '') {
            return callback(new Error('类型不正确'));
        }
        callback();
    }


	 /**
   * 手机号验证
   */
  static strictMobile = (rule, value, callback) => {
    value == '' &&
        callback(new Error('请输入手机号码'));
    !(/^1[3|4|5|7|8][0-9]{9}$/.test(value)) &&
    callback(new Error('请输入11位数字'));
    callback();
	}

   /**
   * 身份证的判断
   */
  static idCard = (rule, value, callback) => {
    if (!/^\d{17}(\d|x)$/i.test(value) || city[value.substr(0, 2)] === undefined || !/^(19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])$/.test(value.substr(6, 8))) {
        return callback(new Error('类型不正确'));
    }
    callback();
	}

    /**
     * 床型验证
     */
    static bedInfo = (rule, value, callback) => {
        if (!/^\d+(\.\d+)?\*\d+(\.\d+)?$/.test(value)) {
            return callback(new Error('类型不正确'));
        }
        callback();
    }

    /**
     * 国外护照验证
     */
    static passport = (rule, value, callback) => {
        if (!/^((\d{9})|([a-zA-Z]{2}\d{6})|(\d{2}[a-zA-Z]{2}\d{5})|([a-zA-Z]{2}\d{7})|([a-zA-Z]{3}\d{6}))?$/.test(value)||value=='') {
            return callback(new Error('类型不正确'));
        }
        callback();
    }
}