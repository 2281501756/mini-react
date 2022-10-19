import createElement from './src/createElement'
import render, { useState } from './src/render'

const handleInput = (e) => {
  r(e.target.value)
}

const input = (props) => {
  return createElement('div', { style: 'color: ' + props.color }, 'function component')
}
const app = (props) => {
  const [value, setValue] = useState(0)
  const handle = () => {
    setValue((prev) => {
      return prev + 1
    })
  }
  return createElement(
    'div',
    {
      style: 'color: red',
      onclick: handle,
    },
    value
  )
}

// const r = (value) => {
//   render(
//     createElement(
//       'div',
//       {},
//       createElement('input', { oninput: handleInput }),
//       createElement('div', null, value),
//       createElement(input)
//     ),
//     document.querySelector('#app')
//   )
// }

// r('hello world')

render(createElement(app), document.querySelector('#app'))
