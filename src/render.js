const render = (element, container) => {
  const dom =
    element.type === 'TEXT_ELEMEN'
      ? document.createTextNode(element.props.nodeValue)
      : document.createElement(element.type)
  Object.keys(element.props)
    .filter((key) => key !== 'children')
    .forEach((key) => {
      dom[key] = element.props[key]
    })
  element.props.children.forEach((child) => {
    render(child, dom)
  })
  container.appendChild(dom)
}

export default render
