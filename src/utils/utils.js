import moment from "moment";

export const convertEmojiToUTF8 = (str) => {
  const rex =
    /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/gu;
  return str.replace(
    rex,
    (match) => `[e-${match.codePointAt(0).toString(16)}]`
  );
};

export const convertEmoji = (str) => {
  return str.replace(/\[e-([0-9a-fA-F]+)\]/g, (match, hex) =>
    String.fromCodePoint(Number.parseInt(hex, 16))
  );
};

export const currentYearMonthDate = () => {
  /** date string */
  // new Date(Date.now()).toLocaleString()
  /* 2020/01/10 */
  return new Date().toJSON().slice(0, 10).replace(/-/g, "/");
};

export const currentYearMonthDay = () => {
  /** date string */
  // new Date(Date.now()).toLocaleString()
  /* 20200110 */
  return new Date().toJSON().slice(0, 10).replace(/-/g, "");
};

export const currentDateMonthYear = () => {
  return new Date().toJSON().slice(0, 10).split("-").reverse().join("/");
};


export const formatDateMonthYear = (param, type) => {
  let stripCharactor, date, month, year, hour, min;
  stripCharactor = param.replace(/[\/-]/g, "");

  date = stripCharactor.slice(6, 8);
  month = stripCharactor.slice(4, 6);
  year = stripCharactor.slice(0, 4);
  hour = stripCharactor.slice(8, 10);
  min = stripCharactor.slice(10, 12);

  if (type === "DDMMYYYY") {
    return `${date}${month}${year}`;
  } else if (type === "YYYYMMDD") {
    return `${year}${month}${date}`;
  } else if (type === "HM") {
    return `${hour}:${min}`;
  } else if (type === "DDMMYYYYHM") {
    return `${date}/${month}/${year} - ${hour}:${min}`;
  }

  return `${date}/${month}/${year}`;
};

export const formatDateMonthYearThai = (param, type) => {
  let stripCharactor, date, month, year, hour, min;
  stripCharactor = param.replace(/[\/-]/g, "");
  date = stripCharactor.slice(6, 8);
  month = stripCharactor.slice(4, 6);
  year = stripCharactor.slice(0, 4);
  hour = stripCharactor.slice(8, 10);
  min = stripCharactor.slice(10, 12);

  if (type === "DDMMYYYY") {
    return `${date}${month}${parseInt(year) + 543}`;
  } else if (type === "YYYYMMDD") {
    return `${parseInt(year) + 543}${month}${date}`;
  } else if (type === "HM") {
    return `${hour}:${min}`;
  } else if (type === "DDMMYYYYHM") {
    return `${date}/${month}/${parseInt(year) + 543} - ${hour}:${min}`;
  }

  return `${date}/${month}/${parseInt(year) + 543}`;
};

export const currentDateAndTime = (format) => {
  let currentDateTime;

  if (format === "dmy") {
    currentDateTime = moment(new Date()).format("DDMMYYYY");
  } else if (format === "y/m/d") {
    currentDateTime = moment(new Date()).format("YYYY/MM/DD");
  } else if (format === "ymdhms") {
    currentDateTime = moment(new Date()).format("YYYYMMDDHHmmss");
  } else if (format === "y-m-d") {
    currentDateTime = moment(new Date()).format("YYYY-MM-DD");
  } else if (format === "ymdhm") {
    currentDateTime = moment(new Date()).format("YYYYMMDDHHmm");
  } else if (format === "ymd") {
    currentDateTime = moment(new Date()).format("YYYYMMDD");
  }
  return currentDateTime;
};

export const beforeToday = (format, subtract) => {
  let beforeDate;

  if (format === "dmy") {
    beforeDate = moment(new Date())
      .subtract(subtract, "day")
      .format("DDMMYYYY");
  } else if (format === "y/m/d") {
    beforeDate = moment(new Date())
      .subtract(subtract, "day")
      .format("YYYY/MM/DD");
  } else if (format === "ymdhms") {
    beforeDate = moment(new Date())
      .subtract(subtract, "day")
      .format("YYYYMMDDHHmmss");
  } else if (format === "y-m-d") {
    beforeDate = moment(new Date())
      .subtract(subtract, "day")
      .format("YYYY-MM-DD");
  }
  return beforeDate;
};

export const convertDateFormat = (yearMonthDayHourMin, format) => {
  let date, month, year, hour, min, result;

  if (
    format === null ||
    format === "" ||
    format === undefined ||
    format === "undefined"
  ) {
    result = "format date is invalid";
  }

  if (yearMonthDayHourMin === "-") {
    result = yearMonthDayHourMin;
    return result;
  }

  if (format === "DD/MM/YYYY-HH:mm") {
    year = yearMonthDayHourMin.slice(0, 4);
    month = yearMonthDayHourMin.slice(4, 6);
    date = yearMonthDayHourMin.slice(6, 8);
    hour = yearMonthDayHourMin.slice(8, 10);
    min = yearMonthDayHourMin.slice(10, 12);
    result = `${date}/${month}/${year} time ${hour}:${min}`;
  } else if (format === "DD/MM/YYYY") {
    year = yearMonthDayHourMin.slice(0, 4);
    month = yearMonthDayHourMin.slice(4, 6);
    date = yearMonthDayHourMin.slice(6, 8);
    result = `${date}/${month}/${year}`;
    // result = `${year}`;
  }

  return result;
};

export const afterToday = (format, additional) => {
  let afterDate;

  if (format === "dmy") {
    afterDate = moment(new Date()).add(additional, "day").format("DDMMYYYY");
  } else if (format === "y/m/d") {
    afterDate = moment(new Date()).add(additional, "day").format("YYYY/MM/DD");
  } else if (format === "ymdhms") {
    afterDate = moment(new Date())
      .add(additional, "day")
      .format("YYYYMMDDHHmmss");
  } else if (format === "y-m-d") {
    afterDate = moment(new Date()).add(additional, "day").format("YYYY-MM-DD");
  }
  return afterDate;
};

// export const currentYearMonthDateWithSlash = () => {
// 	return moment(new Date()).format('YYYY/MM/DD');
// };

export const currentYearMonthDateHourMinSec = () => {
  return moment(new Date()).format("YYYYMMDDHHmmss");
};

export const stripSlash = (param) => {
  return param.replace(/\//g, "");
};

// For String
export const replaceAll = (str, find, replace) => {
  return str.replace(new RegExp(find, "g"), replace);
};

// Return number of data
export const removeElement = (nums, val) => {
  return nums.length
    ? nums.reduceRight((acc, value, i) => {
        if (value == val) {
          nums.splice(i, 1);
        }
        return nums;
      }, null).length
    : 0;
};

export const remove = (array, element) => {
  return array.filter((el) => el !== element);
};

// export const addSpecialCharactor = ({type, data}) => {

// 	let format;
// 	if (type === 'slash') {
// 		format = data.replace(/\//g, '/')
// 	} else if (type === 'hyphen') {

// 	} else if (type === 'pipe' ) {

// 	}

// 	return format
// }

export const replaceCharAt = (str, index, chr) => {
  if (index > str.length - 1) {
    return str;
  }
  return str.substr(0, index) + chr + str.substr(index + 1);
};

export const addSpecialCharactor = (input, search, replace, start, end) => {
  return (
    input.slice(0, start) +
    input.slice(start, end).replace(search, replace) +
    input.slice(end)
  );
};

export const addSpaces = (x) => {
  var res = "";
  while (x--) {
    res += " ";
  }
  return res;
};

export const formatDayMonthYear = (param) => {
  let date, month, year;

  year = param.slice(0, -4);
  month = param.slice(4, -2);
  date = param.slice(6);

  return `${date}/${month}/${year}`;
};

export const formatYearMonthDayTime = (param) => {
  let date, month, year, time, minute;

  date = param.slice(0, 8);
  time = param.slice(8, 10);
  minute = param.slice(10);

  return `${date} ${time}:${minute}`;
};

export const formatDayMonthYearTimeThai = (param) => {
  let date, month, year, time, minute;

  year = param.slice(0, 4);
  month = param.slice(4, 6);
  date = param.slice(6, 8);
  time = param.slice(8, 10);
  minute = param.slice(10);

  return `${date}-${month}-${parseInt(year) + 543} ${time}:${minute}`;
};

export const formatGetDayMonthYear = (param) => {
  let getDayMonthYear;
  getDayMonthYear = moment(param).format("LLLL");
  return getDayMonthYear.toString();
};

export const formatDayMonthYearThai = (param) => {
  let date, month, year;

  year = param.slice(0, -4);
  month = param.slice(4, -2);
  date = param.slice(6);

  return `${date}/${month}/${parseInt(year) + 543}`;
};

export const literalMonth = (param) => {
  let day,
    month,
    dayMonth = [],
    literalMonth;

  day = param.slice(6);
  month = param.slice(4, -2);

  literalMonth = moment(month, "MM").format("MMM");
  dayMonth.push(day, literalMonth);

  return dayMonth;
};

export const textSpaceReplaceWithNewline = (text) => {
  return text.replace(/[\s-]/g, "\n");
};

export const convertLiteralPatientNumber = (param) => {
  let frontDegit, backDegit;

  frontDegit = param.replace(/[\s-]/g, "").slice(0, 2);
  backDegit = param.replace(/[\s-]/g, "").slice(2);

  return `${frontDegit}/${backDegit}`;
};

export const showPromotion = (params) => {
  return;
};

export const timeToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split("T")[0];
};

export const toLocalISOString = (date) => {
  var d = new Date(+date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split("T")[0];
};
