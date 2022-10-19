import createElement from './src/createElement'
import render from './src/render'

const handleInput = (e) => {
  r(e.target.value)
}
const input = (props) => {
  return createElement('div', { style: 'color: ' + props.color }, 'function component')
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

render(
  createElement(
    'div',
    { style: 'color: blue' },
    123,
    createElement(input, { color: 'red' }),
    createElement('div', null, 333333),
  ),
  document.querySelector('#app')
)
