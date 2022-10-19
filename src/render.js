const createDOM = (fiber) => {
  const dom =
    fiber.type === 'TEXT_ELEMEN'
      ? document.createTextNode(fiber.props.nodeValue)
      : document.createElement(fiber.type)
  Object.keys(fiber.props)
    .filter((key) => key !== 'children')
    .forEach((key) => {
      dom[key] = fiber.props[key]
    })
  return dom
}

const commitDOM = () => {
  deleteList.forEach((fiber) => {
    commit(fiber)
  })
  commit(wipRoot.children)
  currenRoot = wipRoot
  wipRoot = null
}
const commit = (fiber) => {
  if (!fiber) return
  let parentFiber = fiber.parent
  while (!parentFiber.dom) parentFiber = parentFiber.parent
  const parent = parentFiber.dom
  if (fiber.effectTag === 'ADD' && fiber.dom) {
    parent.appendChild(fiber.dom)
  } else if (fiber.effectTag === 'DELETE' && fiber.dom) {
    parentRemoveDom(fiber, parent)
  } else if (fiber.effectTag === 'UPDATE' && fiber.dom) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props)
  }
  commit(fiber.sibling)
  commit(fiber.children)
}
const parentRemoveDom = (fiber, parentDom) => {
  if (fiber.dom) {
    parentDom.removeChild(fiber.dom)
  } else {
    parentRemoveDom(fiber.children, parentDom)
  }
}
const isEvent = (key) => key.startsWith('on')
const updateDom = (dom, prevProps, nextProps) => {
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || prevProps[key] !== nextProps[key])
    .forEach((key) => {
      const name = key.toLowerCase().substring(2)
      dom.removeEventListener(name, prevProps[key])
    })
  Object.keys(nextProps)
    .filter(isEvent)
    .filter((key) => nextProps[key] !== prevProps[key])
    .forEach((key) => {
      const name = key.toLowerCase().substring(2)
      dom.addEventListener(name, nextProps[key])
    })

  Object.keys(prevProps)
    .filter((key) => key !== 'children')
    .filter((key) => !(key in nextProps))
    .forEach((key) => (dom[key] = ''))

  Object.keys(nextProps)
    .filter((key) => key !== 'children')
    .filter((key) => nextProps[key] !== prevProps[key])
    .forEach((key) => (dom[key] = nextProps[key]))
}
const render = (element, container) => {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currenRoot,
  }
  deleteList = []
  nextUnitOfWork = wipRoot
}

let nextUnitOfWork = null,
  wipRoot = null,
  currenRoot = null,
  deleteList = null
const wordloop = (deadline) => {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    shouldYield = deadline.timeRemaining() < 1
  }
  if (!nextUnitOfWork && wipRoot) commitDOM()
  requestIdleCallback(wordloop)
}
requestIdleCallback(wordloop)
const performUnitOfWork = (fiber) => {
  if (fiber.type instanceof Function) {
    updateFunctionComponent(fiber)
  } else updateHostComponent(fiber)

  if (fiber.children) return fiber.children
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling
    nextFiber = nextFiber.parent
  }
}
const updateHostComponent = (fiber) => {
  if (!fiber.dom) fiber.dom = createDOM(fiber)
  const children = fiber.props.children
  reconcileChildren(fiber, children)
}
const updateFunctionComponent = (fiber) => {
  const children = [fiber.type(fiber.props)]
  reconcileChildren(fiber, children)
}
const reconcileChildren = (wipFiber, elements) => {
  let index = 0,
    prevSibling = null,
    oldFiber = wipFiber.alternate && wipFiber.alternate.children
  while (index < elements.length || oldFiber) {
    const element = elements[index]
    const sameType = element && oldFiber && oldFiber.type === element.type
    let newFiber = null
    if (sameType) {
      // update
      newFiber = {
        dom: oldFiber.dom,
        type: oldFiber.type,
        props: element.props,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: 'UPDATE',
      }
    } else if (element && !sameType) {
      // add
      newFiber = {
        dom: null,
        type: element.type,
        props: element.props,
        parent: wipFiber,
        alternate: null,
        effectTag: 'ADD',
      }
    } else if (oldFiber && sameType) {
      // remove
      deleteList.push(oldFiber)
      oldFiber.effectTag = 'DELETE'
    }
    if (index === 0) wipFiber.children = newFiber
    else prevSibling.sibling = newFiber

    prevSibling = newFiber

    index++
    if (oldFiber) oldFiber = oldFiber.sibling
  }
}

export default render
