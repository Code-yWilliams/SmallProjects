(function() {
  var _ = function(element) {
    let u = {
      first() {
        return element[0];
      },
      last() {
        return element[element.length - 1];
      },
      without(...excludedValues) {
        let result = [];
        element.forEach(e => {
          if (excludedValues.indexOf(e) === -1) {
            result.push(e);
          }
        });
        return result;
      },
      lastIndexOf(value) {
        let index = -1;
        for (let i = element.length - 1; i >= 0; i--) {
          if (element[i] === value) {
            return i;
          }
        }
        return -1;
      },
      sample(n = 1) {
        let result = [];
        let arr = element.slice();
        function randomIndexValue(collection) {
          return Math.floor(Math.random() * collection.length);
        }
        if (n === 1) {
          let sampleIdx = randomIndexValue(arr);
          result = arr[sampleIdx];
        } else {
          while (result.length < n) {
            let sampleIdx = randomIndexValue(arr);
            result.push(arr[sampleIdx]);
            arr.splice(sampleIdx, 1);
          }
        }
        return result;
      },
      findWhere(suppliedObject) {
        let props = Object.getOwnPropertyNames(suppliedObject);
        for (let i = 0; i < element.length; i++) {
          let currentObject = element[i];
          if (props.every(prop => currentObject[prop] === suppliedObject[prop])) {
            return currentObject;
          }
        }
        return undefined;
      },
      where(suppliedObject) {
        let result = [];
        let props = Object.getOwnPropertyNames(suppliedObject);
        element.forEach(e => {
          if (props.every(prop => suppliedObject[prop] === e[prop])) {
            result.push(e);
          }
        });
        return result;
      },
      pluck(propName) {
        return element.filter(e => e.hasOwnProperty(propName))
                      .map(e => e[propName]);
      },
      keys() {
        return Object.getOwnPropertyNames(element);
      },
      values() {
        let keys = this.keys();
        return keys.map(key => element[key]);
      },
      pick(...propNames) {
        let result = {};
        propNames.forEach(prop => {
          if (prop in element) {
            result[prop] = element[prop];
          }
        });
        return result;
      },
      omit(...propNames) {
        let allPropNames = Object.getOwnPropertyNames(element);
        let propsToInclude = allPropNames.filter(prop => {
          return propNames.indexOf(prop) === -1;
        });
        return this.pick(...propsToInclude)
      },
      has(propName) {
        return Object.prototype.hasOwnProperty.call(element, propName);
      },
    };

    ["isElement", "isArray", "isObject", "isFunction",
     "isBoolean", "isString", "isNumber"].forEach(methodName => {
      u[methodName] = _[methodName].bind(u, u.element);
    });

    return u;
  }

  _.range = function(start, end) {
    if (arguments.length === 1) {
      end = start;
      start = 0;
    }
    let range  = [];
    for (let i = start; i < end; i++) {
      range.push(i);
    }
    return range;
  };

  _.extend = function ext(target, ...sources) {
    if (sources.length === 0) {
      return target;
    } else {
      let last = sources.pop();
      let receiver = sources[sources.length - 1] || target;
      let props = Object.getOwnPropertyNames(last);
      props.forEach(prop => receiver[prop] = last[prop]);
      return ext(target, ...sources);
    }
  };

  _.isElement = function(value) {
    return (value && value.nodeType === 1);
  };

  _.isArray = Array.isArray || function(value) {
    return toString.call(value) === "[object Array]";
  };

  _.isObject = function(value) {
    let type = typeof value;
    return value && (type === 'object' || type === 'function');
  };

  _.isFunction = function(value) {
    return toString.call(value) === "[object Function]";
  };

  ["Boolean", "String", "Number"].forEach(typeName => {
    _[`is${typeName}`] = function(value) {
      return toString.call(value) === `[object ${typeName}]`;
    }
  })

  window._ = _;
})();

