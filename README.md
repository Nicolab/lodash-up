# lodash-up

Lodash + some common mixins.
Works in server and browser.


## Install

```sh
npm install lodash-up
```

or with _Yarn_:

```sh
yarn add lodash-up
```


## Usage

```js
let _ = require('lodash-up');
```

See the [source code](https://github.com/Nicolab/lodash-up/blob/master/src/index.js) for the functions list.

> If you do not want to load all Lodash or if you have a custom entry point for Lodash,
> use an alias to the _lodash_ name.

Include the `lodash-up` path to your JS transpiler.

Webpack config example:

```js
module: {
  rules: [
    {
      // "include" is commonly used to match the directories
      include: [
        path.resolve(__dirname, 'node_modules/lodash-up')
      ],
    }
  ]
}
```

## LICENSE

[MIT](https://github.com/Nicolab/lodash-up/blob/master/LICENSE) (c) 2015, Nicolas Tallefourtane.


## Author

| [![Nicolas Tallefourtane - Nicolab.net](https://www.gravatar.com/avatar/d7dd0f4769f3aa48a3ecb308f0b457fc?s=64)](https://nicolab.net) |
|---|
| [Nicolas Talle](https://nicolab.net) |
