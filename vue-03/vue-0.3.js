
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
  function emptyNodeAt (elm) {
    return new vnode(elm.tagName.toLowerCase(), {}, [], undefined, elm)
  }
  function sameVnode (vnode1, vnode2) {
    return vnode1.tag === vnode2.tag
  }

  function patchVnode (oldVnode, vnode) {
    var elm = vnode.elm = oldVnode.elm;
    var oldCh = oldVnode.children;
    var ch = vnode.children;

    if (!vnode.text) {
      if (oldCh && ch) {
        updateChildren(oldCh, ch);
      }
    } else if (oldVnode.text !== vnode.text) {
      elm.textContent = vnode.text;
    }
  }

  function updateChildren (oldCh, newCh) {
    // assume that every element node has only one child to simplify our diff algorithm
    if (sameVnode(oldCh[0], newCh[0])) {
      patchVnode(oldCh[0], newCh[0])
    } else {
      patch(oldCh[0], newCh[0])
    }
  }

  function Vue (options) {
    debugger
    var vm = this;
    vm.$options = options;
    
    initData(vm);
    vm.mount(document.querySelector(options.el))
  }
  Vue.prototype.mount = function (el) {
    var vm = this;
    vm.$el = el;
    vm.update(vm.render())
  }
  Vue.prototype.update = function (vnode) {
    var vm = this;
    var prevVnode = vm._vnode;
    vm._vnode = vnode;
    if (!prevVnode) {
      vm.$el = vm.patch(vm.$el, vnode);
    } else {
      vm.$el = vm.patch(prevVnode, vnode);
    }
  }
  Vue.prototype.render = function () {
    var vm = this;
    return vm.$options.render.call(vm)
  }
  function patch (oldVnode, vnode) {
    var isRealElement = oldVnode.nodeType !== undefined; // virtual node has no `nodeType` property
    if (!isRealElement && sameVnode(oldVnode, vnode)) {
      patchVnode(oldVnode, vnode);
    } else {
      if (isRealElement) {
        oldVnode = emptyNodeAt(oldVnode);
      }
      var elm = oldVnode.elm;
      var parent = elm.parentNode;
      
      createElm(vnode);

      parent.insertBefore(vnode.elm, elm);
      parent.removeChild(elm);
    }

    return vnode.elm
  }
  Vue.prototype.patch = patch
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
 
  let vm = new Vue({
    el: '#app',
    data: {
      message: 'hello ppp'
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

