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

const render = (element, container) => {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element],
    },
  }
}

let nextUnitOfWork = null
const wordloop = (deadline) => {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    shouldYield = deadline.timeRemaining() < 1
  }
  requestIdleCallback(wordloop)
}
requestIdleCallback(wordloop)
const performUnitOfWork = (fiber) => {
  if (!fiber.dom) fiber.dom = createDOM(fiber)
  if (fiber.parent) fiber.parent.dom.appendChild(fiber.dom)

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
