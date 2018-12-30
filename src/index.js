/**
 * This file is part of lodash-up.
 *
 * (c) Nicolas Tallefourtane <dev@nicolab.net>
 *
 * For the full copyright and license information, please view the LICENSE file
 * distributed with this source code.
 */

'use strict';

let _ = require('lodash');

let rxSlugWords = /[a-z0-9]{1,}/g;
let rxPlaceholder = /\{(\w+)\}/g;

/**
 * Get type of obj.
 *
 * @param {*} obj
 * @return {string} The type
 */
_.toType = function(obj) {
  return ({}).toString.call(obj)
    .match(/\s([a-z|A-Z]+)/)[1]
    .toLowerCase()
  ;
};

/**
 * Resolve the resource ID from a resource object or resource ID.
 *
 * @param {object|string} resource Resource or resource ID.
 * @return {string} The resource ID.
 */
_.toId = function(resource) {
  return typeof resource === 'object'
    ? resource.id || resource._id
    : resource
  ;
};

/**
 * Handle resource data (used in post, put and patch).
 * Support `FormData` by passing it in `resource._formData` property.
 *
 * @param  {object} resource
 * @return {FormData|object|*} Returns `resource._formData` (`FormData`)
 * or `resource` (`object|*`).
 */
_.toData = function(resource) {
  return resource._formData || resource;
};

/**
 * Ensure that the value (`val`) is a string.
 *
 * @param  {*}       val  A given value.
 * @return {string}  JSON stringified value if `val` is an object
 * or the string value.
 *
 * @see _.toString() for another strategy of conversion.
 */
_.toStr = function(val) {
  return typeof val === 'object' ? JSON.stringify(val) : String(val);
};

/**
 * Ensure that the value (`val`) is an object.
 *
 * @param  {*}       val  A given value.
 * @return {string}  JSON parsed value if `val` is not an object
 * or the object value.
 *
 * @see _.toPlainObject() for another strategy of conversion.
 */
_.toObj = function(val) {
  return typeof val === 'object' ? val : JSON.parse(val);
};

/**
 * Compare `v1` and `v2` with the `operator`.
 *
 * @param  {*}      v1       Value 1.
 * @param  {string} operator Operator: ===, !==, >, <, >=, <=, ==, !=
 * @param  {*}      v2       Value 2.
 * @return {bool}
 */
_.compareWithOperator = function(v1, operator, v2) {
  switch (operator) {
    case '===': return v1 === v2;
    case '!==': return v1 !== v2;
    case '>':   return v1 > v2;
    case '<':   return v1 < v2;
    case '>=':  return v1 >= v2;
    case '<=':  return v1 <= v2;
    case '==':  return v1 == v2;
    case '!=':  return v1 != v2;
    default:
      throw new RangeError('Operator "' + operator + '" is not supported.');
  }
};


_.mergeRecursive = function(target/*, obj*/) {
  let ln = arguments.length;

  if (ln < 2) {
    throw new Error('There should be at least 2 arguments passed to _.mergeRecursive()');
  }

  // start at `obj`
  for (let i = 1; i < ln; i++) {
    for (let p in arguments[i]) {
      if (target[p] && typeof target[p] === 'object') {
        target[p] = _.mergeRecursive(target[p], arguments[i][p]);
      } else {
        target[p] = arguments[i][p];
      }
    }
  }

  return target;
};

/**
 * Capitalizes the first letter.
 *
 * @param {string} str
 * @return {string}
 */
_.ucFirst = function(str) {
  return str.charAt(0).toUpperCase() + str.substr(1);
};

/**
 * Lowercase the first letter.
 *
 * @param {string} str
 * @return {string}
 */
_.lcFirst = function(str) {
  return str.charAt(0).toLowerCase() + str.substr(1);
};

/**
 * Converts `string` to upper camel case.
 *
 * @param {string} [string=''] String to convert.
 * @return {string} Returns the pascal cased string.
 */
_.pascalCase = _.flow(_.camelCase, _.ucFirst);

/**
 * Converts `str` to dot.case notation.
 *
 * @param {string} str
 * @return {string}
 */
_.dotCase = function (str) {
  return _.snakeCase(str).replace('_', '.');
};

/**
 * Slugify `str`.
 *
 * @param {string} str
 * @param {number} min
 * @param {number} max
 * @return {string}
 */
_.slugify = function (str, min, max) {
  let rx;

  if (str) {
    if (!min && !max) {
      rx = rxSlugWords;
    }
    else if (min && max) {
      rx = new RegExp('[a-z0-9]{' + min + ',' + max + '}', 'g');
    }
    else if (min && !max) {
      rx = new RegExp('[a-z0-9]{' + min + ',}', 'g');
    }
    else if (min === null && max) {
      rx = new RegExp('[a-z0-9]{,' + max + '}', 'g');
    }
    else {
      throw new RangeError('Bad arguments passed in _.slugify()');
    }

    return _.words(_.deburr(str.toLowerCase()), rx).join('-');
  }

  return '';
};

/**
 * Parse a string and returns with the {placeholders}
 * replaced by the related `params` values.
 *
 * @param {string} str
 * @param {object} [params]
 * @return {string}
 */
_.placeholder = function (str, params) {
  if (params) {
    return str.replace(rxPlaceholder, (match, p) => params[p] || p);
  }

  return str;
};

/**
 * Ensure that `str` starts with the given `target` string.
 *
 * @param {string} [str='']
 * @param {string} [target]
 * @param {number} [position=0]
 * @return {string}
 */
_.ensureStartsWith = function(str = '', target, position = 0) {
  if (_.startsWith(str, target, position)) {
    return str;
  }

  return _.insertStr(str, target, position);
};

/**
 * Ensure that `str` ends with the given `target` string.
 *
 * @param {string} [str='']
 * @param {string} [target]
 * @param {number} [position=str.length]
 * @return {string}
 */
_.ensureEndsWith = function(str = '', target, position) {
  if (_.endsWith(str, target, position)) {
    return str;
  }

  if (typeof position === 'undefined') {
    position = str.length;
  }

  return _.insertStr(str, target, position);
};

/**
 * Insert the given `target` string in `str` at `position`.
 *
 * @param {string} str
 * @param {string} target
 * @param {number} position
 * @return {string}
 */
_.insertStr = function(str, target, position) {
  return str.substr(0, position) + target + str.substr(position);
};

/**
 * Check if `input` matches with `subject`.
 *
 * @param  {string} subject  Subject for the search base.
 * @param  {string} input Value to check (input).
 * @return {bool} true if `input` matches, `false` otherwise.
 */
_.checkSubject = function checkSubject(subject, input) {
  subject = String(subject);
  input = String(input);

  if (subject === input) {
    return true;
  }

  return Boolean(
    input.length && subject.toLowerCase().search(input.toLowerCase()) !== -1
  );
};

/**
 * Convert string to seconds.
 *
 * @param {string} hms `HH:MM:SS`
 * @return {number} The seconds of `hms`.
 */
_.strToSec = function(hms) {
  let [h, m, s] = hms.split(':');

  h = parseInt(h, 10) || 0;
  m = parseInt(m, 10) || 0;
  s = parseInt(s, 10) || 0;

  return ((h * 3600) + (m * 60)) + s;
};

/**
 * Convert seconds to string.
 *
 * @param {string} sec
 * @return {string} `HH:MM:SS`.
 */
_.secToStr = function(sec) {
  let h, m, s;

  sec = parseInt(sec, 10);
  h = Math.floor(sec / 3600);
  m = Math.floor((sec - (h * 3600)) / 60);
  s = sec - (h * 3600) - (m * 60);

  if (h < 10) h = '0' + h;
  if (m < 10) m = '0' + m;
  if (s < 10) s = '0' + s;

  return `${h}:${m}:${s}`;
};

/**
 * Convert milliseconds to string.
 *
 * @param {string} ms  milliseconds
 * @return {string} `HH:MM:SS`.
 */
_.msToStr = function(ms) {
  return _.secToStr(Math.floor(parseInt(ms, 10) / 1000));
};

/**
 * Converts bytes to bytes units.
 *
 * @param {number} b Bytes to convert.
 * @return {string} The bytes converted (e.g: 42 KB, 10 MB, 2 GB, 1.24 TB, ...).
 */
_.toByteUnits = function(b) {
  let def = [
    [1, 'byte'],
    [1024, 'KB'],
    [1024 * 1024, 'MB'],
    [1024 * 1024 * 1024, 'GB'],
    [1024 * 1024 * 1024 * 1024, 'TB']
  ];

  b = Math.abs(parseInt(b, 10));

  for (let i = 0, ln = def.length; i < ln; i++) {
    if (b < def[i][0] && def[i - 1]) {
      return (b / def[i - 1][0]).toFixed(2) + ' ' + def[i - 1][1];
    }
  }

  return b + ' byte' + (b > 1 ? 's' : '');
};

/**
 * Converts bytes to bytes rate units (e.g: 10 MB/s).
 *
 * @param {number} b Bytes to convert.
 * @return {string} The bytes converted (e.g: 42 KB/s, 10 MB/s, 2 GB/s, ...).
 */
_.toByteRateUnits = function(b) {
  return _.toByteUnits(b) + '/s';
};

/**
 * Resolve and returns an error message.
 *
 * @param {string|object} res An `Error` instance
 * or a HTTP response or a string.
 * @return {string}
 */
_.getErrorMessage = function getErrorMessage(res) {
  if (typeof res === 'object') {
    if (res.message) {
      return res.message;
    }

    if (res.data) {
      if (res.data.message) {
        return res.data.message;
      }

      if (typeof res.data.error === 'string') {
        return res.data.error;
      }

      if (typeof res.data.error === 'object' && res.data.error.message) {
        return res.data.error.message;
      }
    }

    if (res.statusText) {
      return res.statusText;
    }

    if (res.status) {
      return res.status;
    }
  }

  return res;
};

module.exports = _;
