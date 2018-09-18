
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
      // for(let key in attrs){
      //   //attrs = {a:{m:'',n:''},b:{}}
      //   if(typeof attrs[key] == 'object'){

      //   }
      //   vnode.elm.setAttribute(key,attrs[key])
      // }
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

function patch(oldVnode, vnode){
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

function render () {
  return new vnode(
    'div',
    {
      'class': {'outer': true},
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
        [new vnode(undefined, undefined, undefined, 'Hello world')]
      )
    ]
  )
}

function mount(el){
  let vnode = render(el)
  patch(el, vnode)
}

mount(document.querySelector("#app"))
})()

