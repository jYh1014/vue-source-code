
//step1:
//参数options:{el:"#demo",data:{message:"hello"},render:function createElement(){}}
function Vue(options){
  return 
}

(function(){
  //创建虚拟dom
function vnode(tag, data, children, text){
  this.tag = tag
  this.data = data
  this.children = children
  this.text = text
}

//创建节点
function createElement(vnode){
  let data = vnode.data
  let tag = vnode.tag
  let children = vnode.children
  if(tag){
    vnode.elm = document.createElement(tag) 
    if(data){
      let attrs = data
     
      traversalObject(attrs, vnode.elm)
    }
    if(children){
      createChildren(vnode, children)
    }
  }else{
    vnode.elm = document.createTextNode(vnode.text)
  }
  return vnode.elm
}
function traversalObject(obj, elm){//深层遍历对象
  for(let key in obj){
    if(typeof obj[key] == 'object'){
      traversalObject(obj[key], elm)
    }else{
     elm.setAttribute(key,obj[key])
    }
    
  }
}
function createChildren(vnode, children){
  for(let i = 0;i < children.length; i ++){
    vnode.elm.appendChild(createElement(children[i]))
  }
}
function Vue(options){
  this.$options = options
  initData(this)
  this.mount(document.querySelector(options.el))
}
Vue.prototype.mount = function(el){
  this.$el = el
  let vnode = this.$options.render.call(this)
  this.patch(this.$el, vnode)
}
Vue.prototype.patch = function(oldVnode, vnode){
  createElement(vnode)
  let isRealElement = oldVnode.nodeType !== undefined
  if(isRealElement){
    var parent = oldVnode.parentNode
    if(parent){
      parent.insertBefore(vnode.elm, oldVnode)
      parent.removeChild(oldVnode)
    }
  }
  return vnode.elm
}

function initData(vm){
  let data = vm.$data = vm.$options.data
  let keys = Object.keys(data)
  let i = keys.length
  while(i --){
    proxy(vm, keys[i])
  }
}
function proxy(vm, key){
  Object.defineProperty(vm, key, {
    configurable: true,
    enumerable: true,
    get: function(){
      return vm.$data[key]
    },
    set: function(val){
      vm.$data[key] = val
    }
  })
}
let vue = new Vue({
  el: '#app',
  data: {
    message: 'hello'
  },
  render: function(){
    console.log(this.message)
    return new vnode(
      'div',
      {
        'class': 'outer',
        
        attrs: {
          id: 'content'
        }
      },
      [
        new vnode(
          'h2',
          { 
            'class': 'inner'
          },
          [new vnode(undefined, undefined, undefined, this.message)]
        )
      ]
    )
  }
})

})()

