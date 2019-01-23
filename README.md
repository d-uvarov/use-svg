# use-svg-sprite
 
## Installation
```bash
$ npm install use-svg-sprite
```

**webpack.config.js**
```js
module.exports = {
  module: {
    rules: [
      { 
        test: /\.vue$/,
        loader: 'use-svg-sprite',
        options: {
            path:  "./svg-folder",
            output: "./public/svg/my.svg",
            publicPath: "/svg/",
        }
      }
    ]
  }
}
```

## Usage

```
svg-folder/
├── my.svg
├── stars.svg
└── child-folder
    ├──my2.svg
    └──some.svg
```

**Vuejs component**
```html
<template>
    <div>
        <icon id="my" />
        <ul>
            <li><icon id="star" /></li>
            <li><icon id="child-folder/some" /></li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "myComponent"
    }
</script>
```