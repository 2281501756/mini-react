const createElement = (type, props, ...children) => {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        return typeof child === 'object' ? child : createTextElement(child)
      }),
    },
    dom: null,
    sibling: null,
    parent: null,
  }
}

const createTextElement = (text) => {
  return {
    type: 'TEXT_ELEMEN',
    props: {
      nodeValue: text,
      children: [],
    },
    dom: null,
    sibling: null,
    parent: null,
  }
}

export default createElement
