
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
    if(data.attrs){
      let attrs = data.attrs
      for(let key in attrs){
        vnode.elm.setAttribute(key,attrs[key])
      }
    }
    if(children){
      createChildren(vnode, children)
    }
  }else{
    vnode.elm = document.createTextNode(vnode.text)
  }
  return vnode.elm
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
      attrs: {
        'class': 'outer'
      }
    },
    [
      new vnode(
        'h2',
        { 
          attrs: {
            'class': 'inner'
          }
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

