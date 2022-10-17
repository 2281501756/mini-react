import createElement from './src/createElement'
import render from './src/render'
console.log(
  createElement(
    'h1',
    { style: 'color: red' },
    createElement('h2', null, 'h2标签'),
    createElement('b'),
    'h1标签'
  )
)

render(
  createElement(
    'h1',
    { style: 'color: red' },
    createElement('h2', null, 'h2标签'),
    createElement('a', { href: 'http://baidu.com' }, '百度链接'),
    'h1标签'
  ),
  document.querySelector('#app')
)
