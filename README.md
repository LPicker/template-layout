# 一个可以开发传统静态页面的模板工程

传统 PC 端页面包含公共的`header`、`footer`，使用传统方式开发，几乎每个页面都需要复制一份`header`、`footer`，如此带来了修改维护上的重复工作。
本项目致力于解决此问题而生。

## 目录说明

```
template-layout
├── README.md
├── dist                // 构建输出目录
│   ├── bundle.js
│   ├── css
│   ├── images
│   └── pages
├── package-lock.json
├── package.json
├── src                 // 源代码目录
│   ├── css
│   ├── images
│   ├── index.js
│   ├── layout         // header、footer等公共文件目录
│   └── pages          // 页面目录
└── webpack.config.js   // 主要的构建逻辑在这个配置文件中
```

## 使用步骤

- clone 本项目
- 安装：`npm i`
- 调试：`npm start`
- 打包：`npm run build`