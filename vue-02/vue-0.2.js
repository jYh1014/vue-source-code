
//step1:
//参数options:{el:"#demo",data:{message:"hello"},render:function createElement(){}}

(function () {
  //创建虚拟dom
  function vnode(tag, data, children, text, elm) {
    this.tag = tag;
    this.data = data;
    this.children = children;
    this.text = text;
    this.elm = elm;
  }

  //创建节点
  function createElm(vnode) {
    console.log(vnode)
    let data = vnode.data
    let tag = vnode.tag
    let children = vnode.children
    if (tag) {
      vnode.elm = document.createElement(tag)
      if (data) {
        let attrs = data
        traversalObject(attrs, vnode.elm)
      }
      if (children) {
        createChildren(vnode, children)
      }
    } else {
      vnode.elm = document.createTextNode(vnode.text)
    }
    return vnode.elm
  }
  function createElement(tag, data, children, text) {
    return new vnode(tag, data, normalizeChildren(children), createTextVNode(text))
  }

  function normalizeChildren(children) {
    if (typeof children == 'string') {
      return [createTextVNode(children)]
    }
    return children
  }

  function createTextVNode(text) {
    return new vnode(undefined, undefined, undefined, String(text))
  }

  function traversalObject(obj, elm) {//深层遍历对象
    for (let key in obj) {
      if (typeof obj[key] == 'object') {
        traversalObject(obj[key], elm)
      } else {
        elm.setAttribute(key, obj[key])
      }

    }
  }
  function createChildren(vnode, children) {
    for (let i = 0; i < children.length; i++) {
      vnode.elm.appendChild(createElm(children[i]))
    }
  }
  function Vue(options) {
    debugger
    this.$options = options
    initData(this)
    this.mount(document.querySelector(options.el))
  }
  Vue.prototype.mount = function (el) {
    this.$el = el
    let vnode = this.$options.render.call(this)
    this.patch(this.$el, vnode)
  }
  Vue.prototype.patch = function (oldVnode, vnode) {

    let isRealElement = oldVnode.nodeType !== undefined
    if (isRealElement) {
      createElm(vnode)
      var parent = oldVnode.parentNode
      if (parent) {
        parent.insertBefore(vnode.elm, oldVnode)
        parent.removeChild(oldVnode)
      }
    }
    return vnode.elm
  }

  function initData(vm) {

    let data = vm.$data = vm.$options.data
    let keys = Object.keys(data)
    let i = keys.length
    while (i--) {
      proxy(vm, keys[i])
    }
  }
  function proxy(vm, key) {
    Object.defineProperty(vm, key, {
      configurable: true,
      enumerable: true,
      get: function () {
        return vm.$data[key]
      },
      set: function (val) {
        vm.$data[key] = val
      }
    })
  }
  let vue = new Vue({
    el: '#app',
    data: {
      message: 'hello'
    },
    render: function () {
      return createElement(
        'div',
        {
          'class': 'outer',

          attrs: {
            id: 'content'
          },

        },
        [
          createElement(
            'h2',
            {
              'class': 'inner'
            },
            this.message
          )
        ]
      )
    }
  })

})()

