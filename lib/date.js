
/**
 * Date
 *
 * Simple wrapper methods around moment.js.
 */
const moment = require('moment');

/**
 * Return the date as a string in provided format.
 * @param {Date} date The date object to format.
 * @param {String} fmt The moment.js format string.
 */
const dateFormat = (date, fmt = 'YYYY-MM-DD hh:mm:ss') => {
  if (!date) {
    date = new Date();
  }

  //return `${ moment(date).utc().format(fmt) } UTC`;
  return `${ moment(date).utc().local().format(fmt) }`;
};

const date24Format = (date, fmt = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) {
    date = new Date();
  }
  return `${ moment(date).utc().local().format(fmt) }`;
  //return `${ moment(date).utc().format(fmt) } UTC`;
};

const timeStamp24Format = (timestamp, fmt = 'YYYY-MM-DD HH:mm:ss') => {
  return `${ moment(new Date(parseInt(timestamp))).utc().local().format(fmt) }`;
  //return `${ moment(new Date(parseInt(timestamp))).utc().format(fmt) } UTC`;
};

module.exports = {
  dateFormat,
  date24Format,
  timeStamp24Format
};
