import createElement from './src/createElement'
import render from './src/render'

const handleInput = (e) => {
  r(e.target.value)
}

const r = (value) => {
  render(
    createElement(
      'div',
      {},
      createElement('input', { oninput: handleInput }),
      createElement('div', null, value)
    ),
    document.querySelector('#app')
  )
}

r('hello world')

setTimeout(() => {
  render(createElement('div', null, 'Hello world'))
}, 3000)
