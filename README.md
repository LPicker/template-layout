# 一个可以开发传统静态页面的模板工程

传统 PC 端页面包含公共的`header`、`footer`，使用传统方式开发，几乎每个页面都需要复制一份`header`、`footer`，如此带来了修改维护上的重复工作。

本项目致力于解决此问题而生。

/src 目录是开发使用的源代码，/dist 目录是生成的用于真实环境下的代码。其中每一个配置的页面都包含引入的页眉页脚。

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
│   ├── components      // 公共代码片段目录，目前仅支持完全重复的片段，不支持变量
│   ├── css
│   ├── images
│   ├── index.js
│   ├── layout          // header、footer等公共文件目录
│   └── pages           // 页面目录
└── webpack.config.js   // 主要的构建逻辑在这个配置文件中
```

## 使用步骤

- clone 本项目
- 安装：`npm i`
- 调试：`npm start`
- 打包：`npm run build`