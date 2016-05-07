// Generated by CoffeeScript 1.10.0
(function() {
  'use strict';
  var isHTML, jNet, jNetObject, parseHTML, returnList;

  isHTML = function(string) {
    var elementObject, i, iteratorChildNodes;
    elementObject = document.createElement('div');
    elementObject.innerHTML = string;
    iteratorChildNodes = elementObject.childNodes;
    i = iteratorChildNodes.length;
    while (i--) {
      if (iteratorChildNodes[i].nodeType === 1) {
        return true;
      }
    }
    return false;
  };

  returnList = function(list) {
    if (list.length === 1) {
      return list.pop();
    }
    return list;
  };

  parseHTML = function(string) {
    var fragment, j, rhtml, rtagName, rxhtmlTag, tag, tmp, wrap, wrapMap;
    rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi;
    rtagName = /<([\w:]+)/;
    rhtml = /<|&#?\w+;/;
    wrapMap = {
      option: [1, "<select multiple='multiple'>", "</select>"],
      thead: [1, "<table>", "</table>"],
      col: [2, "<table><colgroup>", "</colgroup></table>"],
      tr: [2, "<table><tbody>", "</tbody></table>"],
      td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
      _default: [0, "", ""]
    };
    fragment = document.createDocumentFragment();
    if (!rhtml.test(string)) {
      fragment.appendChild(document.createTextNode(string));
    } else {
      tmp = fragment.appendChild(document.createElement("div"));
      tag = (rtagName.exec(string) || ["", ""])[1].toLowerCase();
      wrap = wrapMap[tag] || wrapMap._default;
      tmp.innerHTML = wrap[1] + string.replace(rxhtmlTag, "<$1></$2>") + wrap[2];
      j = wrap[0];
      while (j--) {
        tmp = tmp.lastChild;
      }
      fragment.removeChild(fragment.firstChild);
      while (tmp.firstChild) {
        fragment.appendChild(tmp.firstChild);
      }
    }
    return fragment.childNodes;
  };


  /**
   * Object for working with DOMTree
   *
   * @param object
   * @returns {*}
   */

  jNetObject = function(object) {

    /**
     * If parameter object is not Array
     */
    if (!Array.isArray(object)) {

      /**
       * Find element from DOMTree
       *  with method find
       *
       * @returns jNetObject
       */
      return this.find(object);
    }

    /**
     * With helped prototype Array, method's
     *  appended elements in object
     */
    Array.prototype.push.apply(this, object);

    /**
     * @returns {*}
     */
    return this;
  };


  /**
   * created prototype for jNetObject
   *  and created alias prototype, FN
   */

  jNetObject.prototype = jNetObject.fn = {

    /**
     * returns element DOMTree with index, without jNetObject
     */
    get: function(index) {
      if (index < 0) {
        index += this.length;
      }
      return this[index];
    },

    /**
     * get element with index DOMTree as jNetObject
     * @returns jNetObject
     */
    eq: function(index) {
      return jNet(this.get(index));
    },

    /**
     * get first element DOMTree as jNetObject
     * @returns jNetObject
     */
    first: function() {
      return this.eq(0);
    },

    /**
     * get last element DOMTree as jNetObject
     * @returns jNetObject
     */
    last: function() {
      return this.eq(this.length - 1);
    },
    odd: function(iterator) {
      var list;
      list = [];
      if (typeof iterator === "undefined") {
        iterator = 1;
      }
      while (iterator < this.length) {
        list.push(this[iterator]);
        iterator += 2;
      }
      return new jNetObject(list);
    },
    even: function() {
      return this.odd(0);
    },
    clone: function(object) {
      if (typeof object === "undefined") {
        object = this;
      }
      return Object.create(object);
    },

    /**
     * current method returns name this object
     *
     * @returns string
     */
    toString: function() {
      return "jNetObject";
    },

    /**
     * cycle implement in jNetFramework for objects jNet
     *
     * First parameter callback is Iterator
     *   Next parameter callback is Value
     *     Next parameter callback is this (array)
     *
     * @returns {*}
     */
    each: function(callback) {
      var iterator;
      iterator = 0;
      while (iterator < this.length) {
        callback(iterator, this[iterator], this);
        ++iterator;
      }
      return this;
    },
    find: function(object) {
      var elements, iterator, list;
      if (object instanceof jNetObject) {
        return object;
      }
      list = [];
      if (object === window) {
        list.push(object);
      } else if (object === document) {
        list.push(document);
      } else if (object && object.nodeType) {
        list.push(object);
      } else if (typeof object === "string") {
        if (isHTML(object)) {
          Array.prototype.push.apply(list, parseHTML(object));
        } else {
          elements = this.length ? this : [document];
          iterator = 0;
          while (iterator < elements.length) {
            Array.prototype.push.apply(list, elements[iterator].querySelectorAll(object));
            ++iterator;
          }
        }
      }
      return new jNetObject(list);
    },

    /**
     * current method append event on
     *   element's domtree
     *     type -- name event
     *     listener -- callback for event
     *     useCapture
     *
     * @link https://developer.mozilla.org/ru/docs/Web/API/EventTarget/addEventListener
     */
    on: function(type, listener, useCapture) {
      this.each(function(iterator, element) {
        if (typeof element.addEventListener !== "undefined") {
          element.addEventListener(type, listener, useCapture);
        } else if (typeof element.attachEvent !== "undefined") {
          element.attachEvent("on" + type, function() {
            return listener.call(element);
          });
        }
      });
      return this;
    },

    /**
     * current method remove event on
     *   element's domtree
     *     type -- name event
     *     listener -- callback for event
     *     useCapture
     *
     * @link https://developer.mozilla.org/ru/docs/Web/API/EventTarget/removeEventListener
     */
    off: function(type, listener, useCapture) {
      this.each(function(iterator, element) {
        if (typeof element.removeEventListener !== "undefined") {
          element.removeEventListener(type, listener, useCapture);
        } else if (typeof element.detachEvent !== "undefined") {
          element.detachEvent("on" + type, listener);
        }
      });
      return this;
    },

    /**
     * the browser has completely loaded HTML,
     * and has constructed a DOM tree.
     */
    ready: function(listener, useCapture) {
      return this.on("DOMContentLoaded", listener, useCapture);
    },
    remove: function() {
      return this.each(function(iterator, element) {
        element.remove();
      });
    },
    width: function(prototype) {
      var list;
      list = [];
      if (typeof prototype === "undefined") {
        prototype = "width";
      }
      this.each(function(iterator, element) {
        var clientRect;
        clientRect = element.getBoundingClientRect();
        list.push(clientRect[prototype]);
      });
      return returnList(list);
    },
    height: function() {
      return this.width("height");
    },
    clientWidth: function(prototype) {
      var list;
      list = [];
      if (typeof prototype === "undefined") {
        prototype = "clientWidth";
      }
      this.each(function(iterator, element) {
        list.push(element[prototype]);
      });
      return returnList(list);
    },
    clientHeight: function() {
      return this.clientWidth("clientHeight");
    },
    css: function(name, value) {
      var list;
      if (typeof value === "undefined") {
        list = [];
        this.each(function(iterator, element) {
          value = element.style.getPropertyValue(name);
          list.push(value);
        });
        return returnList(list);
      } else {
        return this.each(function(iterator, element) {
          element.style.setProperty(name, value);
        });
      }
    },
    outerHTML: function(value, prototype) {
      var list;
      if (typeof prototype === "undefined") {
        prototype = "outerHTML";
      }
      if (typeof value === "undefined") {
        list = [];
        this.each(function(iterator, element) {
          value = element[prototype];
          list.push(value);
        });
        return returnList(list);
      } else {
        return this.each(function(iterator, element) {
          var result;
          result = value;
          if (typeof value === "function") {
            result = value(jNet(element)[prototype](), element);
          }
          if (result) {
            element[prototype] = result;
          }
        });
      }
    },
    innerHTML: function(value) {
      return this.html(value);
    },
    html: function(value) {
      return this.outerHTML(value, "innerHTML");
    },
    index: function() {
      var list;
      list = [];
      this.each(function(iterator, element) {
        var children, parent;
        if (typeof element.parentNode !== "undefined") {
          parent = element.parentNode;
          if (typeof parent.children !== "undefined") {
            children = parent.children;
            return list.push(Array.prototype.indexOf.apply(children, element));
          }
        }
      });
      return returnList(list);
    },
    attr: function(name, value) {
      var list;
      if (typeof value === "undefined") {
        list = [];
        this.each(function(iterator, element) {
          value = element.getAttribute(name);
          list.push(value);
        });
        return returnList(list);
      } else if (value === null) {
        return this.each(function(iterator, element) {
          if (element.hasAttribute(name)) {
            element.removeAttribute(name);
          }
        });
      } else {
        return this.each(function(iterator, element) {
          var result;
          result = value;
          if (typeof value === "function") {
            result = value(jNet(element).attr(name), element);
          }
          if (result) {
            element.setAttribute(name, result);
          }
        });
      }
    },
    hasClass: function(classname) {
      var list;
      list = [];
      this.each(function(iterator, element) {
        var value;
        value = element.classList.contains(classname);
        return list.push(value);
      });
      return returnList(list);
    },
    addClass: function(classname) {
      return this.each(function(iterator, element) {
        return element.classList.add(classname);
      });
    },
    removeClass: function(classname) {
      return this.each(function(iterator, element) {
        return element.classList.remove(classname);
      });
    },
    toggleClass: function(classname) {
      return this.each(function(iterator, element) {
        return element.classList.toggle(classname);
      });
    },
    appendTo: function(selector) {
      var object;
      object = jNet(selector);
      return object.append(this);
    },
    prependTo: function(selector) {
      var object;
      object = jNet(selector);
      return object.prepend(this);
    },
    append: function(selector) {
      return this.each(function(iterator, element) {
        return jNet.each(jNet(selector), function(iteratorSelector, elementSelector) {
          return element.appendChild(elementSelector);
        });
      });
    },
    prepend: function(selector) {
      return this.each(function(iterator, element) {
        return jNet.each(jNet(selector), function(iteratorSelector, elementSelector) {
          if (typeof element.childNodes[0] !== "undefined") {
            return element.insertBefore(elementSelector, element.childNodes[0]);
          }
        });
      });
    },
    after: function(selector) {
      return this.each(function(iterator, element) {
        return jNet.each(jNet(selector), function(iteratorSelector, elementSelector) {
          var nextSibling, parentNode;
          parentNode = element.parentNode;
          nextSibling = element.nextSibling;
          if (nextSibling) {
            return parentNode.insertBefore(elementSelector, nextSibling);
          } else {
            return parentNode.appendChild(elementSelector);
          }
        });
      });
    },
    before: function(selector) {
      return this.each(function(iterator, element) {
        return jNet.each(jNet(selector), function(iteratorSelector, elementSelector) {
          return element.parentNode.insertBefore(elementSelector, element);
        });
      });
    },
    text: function(content) {
      var list;
      if (typeof content !== "undefined") {
        return this.each(function(iterator, element) {
          var prototype, result;
          prototype = "innerText";
          if (typeof element[prototype] === "undefined") {
            prototype = "value";
          }
          result = content;
          if (typeof content === "function") {
            result = content(jNet(element).text(), element);
          }
          if (result) {
            element[prototype] = result;
          }
        });
      } else {
        list = [];
        this.each(function(iterator, element) {
          return list.push(element.innerText || element.value);
        });
        return returnList(list);
      }
    },
    closest: function(selector) {
      var closest, list;
      closest = function(node, selector) {
        return node.closest(selector);
      };
      if (typeof Element.prototype.closest === "undefined") {
        closest = function(node, selector) {
          while (node) {
            if (node.matches(selector)) {
              return node;
            } else {
              node = node.parentElement;
            }
          }
          return null;
        };
      }
      list = [];
      this.each(function(iterator, element) {
        var isExists, newElement;
        newElement = closest(element, selector);
        isExists = false;
        jNet.each(list, function(key, value) {
          if (value === newElement) {
            isExists = true;
          }
        });
        if (!isExists) {
          list.push(newElement);
        }
      });
      return new jNetObject(list);
    },
    show: function(interval) {
      var items;
      if (typeof interval === "undefined") {
        interval = 1000;
      }
      this.each(function(iterator, element) {
        jNet.dynamics.animate(element, {
          opacity: 1,
          scale: 1
        }, {
          type: jNet.dynamics.spring,
          frequency: 200,
          friction: 270,
          duration: interval * 4 / 5,
          delay: iterator * 40
        });
      });
      items = this.find('*');
      jNet.each(items, function(iterator, element) {
        jNet.dynamics.css(element, {
          opacity: 0,
          translateY: 20
        });
        jNet.dynamics.animate(element, {
          opacity: 1,
          translateY: 0
        }, {
          type: jNet.dynamics.spring,
          frequency: 300,
          friction: 435,
          duration: interval,
          delay: 100 + iterator * 40
        });
      });
    },
    hide: function(interval) {
      if (typeof interval === "undefined") {
        interval = 1000;
      }
      this.each(function(iterator, element) {
        jNet.dynamics.animate(element, {
          opacity: 0,
          scale: 0.1
        }, {
          type: jNet.dynamics.easeInOut,
          duration: interval,
          friction: 100,
          delay: iterator * 40
        });
      });
    }
  };


  /**
   * Main Object of a Framework.
   *  With the aid of developer can manager
   *      of elements dom tree and created/destroys events
   *
   * @param object
   * @returns {*}
   */

  jNet = function(object, doc) {
    var jnObject;
    if (typeof doc !== "undefined") {
      return jNet(doc).find(object);
    }
    if (typeof object === "function") {
      jnObject = jNet(document);
      if (document.readyState === "complete") {
        object();
        return jnObject;
      }
      return jnObject.ready(object);
    } else if (typeof object === "string") {
      return new jNetObject(object);
    } else if (typeof object === "object") {
      return new jNetObject(object);
    }
  };

  jNet.fn = jNet.prototype = {
    each: function(object, callback) {
      var iterator, key, length, objects, results, results1, value;
      if (object instanceof jNetObject) {
        return object.each(callback);
      } else if (Array.isArray(object)) {
        length = object.length;
        iterator = 0;
        results = [];
        while (iterator < length) {
          callback(iterator, object[iterator], object);
          results.push(++iterator);
        }
        return results;
      } else if (typeof object === "object") {
        objects = Object.keys(object);
        length = object.length;
        iterator = 0;
        results1 = [];
        while (iterator < length) {
          key = objects[iterator];
          value = object[key];
          callback(key, value, object);
          results1.push(++iterator);
        }
        return results1;
      }
    },
    toString: function() {
      return "jNetFramework";
    }
  };


  /**
   * set pointer in jNetObject.prototype
   */

  jNet.oFn = jNetObject.fn;


  /**
   * method toString override in global object
   */

  jNet.toString = jNet.fn.toString;


  /**
   * method clone in global Object
   */

  jNet.clone = jNet.oFn.clone;


  /**
   * method each in global Object
   */

  jNet.each = jNet.fn.each;


  /**
   * Export framework to :
   *  window
   *  document
   *  exports
   *  define
   */


  /**
   * Check exists and typeof equal function
   *  and check exists define.and
   *
   * #1 - fixed AMD
   */

  if (typeof define === "function" && define.amd) {
    define(function() {
      return {
        "jNet": jNet
      };
    });
  }


  /**
   * current method extend jNetObject
   *   with helped fn
   */

  jNet.extend = function(object) {
    return this.each(object, function(prototype, value) {
      jNet.oFn[prototype] = value;
    });
  };


  /**
   * Append in prototype new methods for working jNet Framework, jNetObject
   */

  jNet.each(["click", "contextmenu", "dblclick", "mouseup", "mousedown", "mouseout", "mouseover", "mousemove", "keyup", "keydown", "keypress", "copy", "selectstart", "selectionchange", "select"], function(iterator, property) {
    jNet.oFn[property] = function(listener, useCapture) {
      return this.on(property, listener, useCapture);
    };
  });


  /**
   *  jNet Framework used:
   *
   *    superagent framework for working in network
   *      Project in GitHub:
   *          @link https://github.com/visionmedia/superagent
   *
   *    js-cookie framework for working with cookies
   *      Project in GitHub:
   *          @link https://github.com/js-cookie/js-cookie
   *
   *    dynamics.js framework for working with 'animation'
   *       Project in GitHub
   *          @link https://github.com/michaelvillar/dynamics.js
   */


  /**
   * included superagent
   * @link https://github.com/visionmedia/superagent
   */

  jNet.fetch = typeof require === "function" ? require("superagent") : void 0;


  /**
   * included js-cookie
   * @link https://github.com/js-cookie/js-cookie
   */

  jNet.cookies = typeof require === "function" ? require("js-cookie") : void 0;


  /**
   * included dynamics.js
   * @link https://github.com/michaelvillar/dynamics.js
   */

  jNet.dynamics = typeof require === "function" ? require("dynamics.js") : void 0;


  /**
   * check exists window and
   *  set jNet in window
   */

  if (typeof window !== "undefined" && window !== null) {
    window.jNet = jNet;
  }


  /**
   * check exists document and
   *  set jNet in document
   */

  if (typeof document !== "undefined" && document !== null) {
    document.jNet = jNet;
  }


  /**
   * check exists exports and
   *  set jNet in exports
   */

  if (typeof exports !== "undefined" && exports !== null) {
    exports.jNet = jNet;
  }

}).call(this);

//# sourceMappingURL=core.js.map
