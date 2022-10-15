import { createElement } from './src/createElement'
console.log(
  createElement('h1', { style: 'big' }, createElement('h2', null, 123), createElement('b'), '123')
)
