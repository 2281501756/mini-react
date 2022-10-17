const createElement = (type, props, ...children) => {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        return typeof child === 'object' ? child : createTextElement(child)
      }),
    },
  }
}

const createTextElement = (text) => {
  return {
    type: 'TEXT_ELEMEN',
    props: {
      nodeValue: text,
      children: [],
    },
  }
}

export default createElement
