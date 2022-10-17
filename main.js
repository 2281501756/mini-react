import createElement from './src/createElement'
import render from './src/render'

render(
  createElement(
    'h1',
    { style: 'color: red' },
    createElement('h2', { style: 'color: blue' }, 'h2标签'),
    createElement('a', { href: 'http://baidu.com' }, '百度链接'),
    'h1标签'
  ),
  document.querySelector('#app')
)
