module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', '@vue/standard'],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  },
  extends: [
    'eslint:recommended', // 继承Eslint中推荐的（打钩的）规则项http://eslint.cn/docs/rules/
    'plugin:vue/essential', // 此项是用来配置vue.js风格
    'prettier' // 把prettier中设置的规则添加进来，让它覆盖上面设置的规则。这样就不会和上面的规则冲突了
  ]
}
