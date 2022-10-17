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
  commit(wipRoot)
  wipRoot = null
}
const commit = (fiber) => {
  if (!fiber) return
  if (fiber.parent) fiber.parent.dom.appendChild(fiber.dom)
  commit(fiber.sibling)
  commit(fiber.children)
}
const render = (element, container) => {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
  }
  nextUnitOfWork = wipRoot
}

let nextUnitOfWork = null,
  wipRoot = null
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
  if (!fiber.dom) fiber.dom = createDOM(fiber)
  const children = fiber.props.children
  let index = 0,
    prevSibling = null
  while (index < children.length) {
    const t = children[index]
    const newFiber = {
      dom: null,
      props: t.props,
      parent: fiber,
      type: t.type,
    }
    if (index === 0) fiber.children = newFiber
    else prevSibling.sibling = newFiber
    prevSibling = newFiber
    index++
  }
  if (fiber.children) return fiber.children
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling
    nextFiber = nextFiber.parent
  }
}

export default render
