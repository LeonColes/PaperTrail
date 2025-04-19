module.exports = {
  // 指定为根配置文件，不再向上查找其他配置
  root: true,
  
  // 指定环境，提供预定义的全局变量
  env: {
    browser: true,    // 浏览器环境
    es2021: true,     // ES2021 特性
    node: true        // Node.js 环境
  },
  
  // 继承的配置集合，按顺序应用
  extends: [
    'eslint:recommended',                    // ESLint 推荐规则
    'plugin:@typescript-eslint/recommended', // TypeScript 推荐规则
    'plugin:react/recommended',              // React 推荐规则
    'plugin:react/jsx-runtime'               // 支持 React 17+ 新 JSX 转换
  ],
  
  // 指定解析器
  parser: '@typescript-eslint/parser',
  
  // 解析器选项
  parserOptions: {
    ecmaFeatures: {
      jsx: true // 启用 JSX 语法支持 (适用于 .jsx 和 .tsx 文件)
    },
    ecmaVersion: 'latest', // 使用最新的 ECMAScript 版本
    sourceType: 'module'   // 使用 ES 模块
  },
  
  // 使用的插件
  plugins: [
    'react',
    '@typescript-eslint'
  ],
  
  // React 相关设置
  settings: {
    react: {
      version: 'detect' // 自动检测 React 版本
    }
  },
  
  // 自定义规则
  rules: {
    // 禁用 any 类型，提高类型安全性
    '@typescript-eslint/no-explicit-any': 'error',
    
    // 强制使用单引号，提高一致性
    'quotes': ['error', 'single'],
    
    // 要求使用分号，明确语句结束
    'semi': ['error', 'always'],
    
    // React 17+ 不需要导入 React
    'react/react-in-jsx-scope': 'off',
    
    // 忽略 Reshaped 库的自定义属性
    'react/no-unknown-property': ['error', { 
      ignore: ['w-full', 'h-full', 'direction', 'gap', 'justify', 'align'] 
    }]
  }
}