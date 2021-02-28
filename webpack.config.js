const path = require("path");
const fs = require("fs");
const cheerio = require('cheerio');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TransferWebpackPlugin = require("transfer-webpack-plugin");
const htmlWebpackPlugin = require("html-webpack-plugin");
const HtmlBeautifyPlugin = require("@nurminen/html-beautify-webpack-plugin");

const handleHeader = (htmlStr, pageName) => {
  const $ = cheerio.load(htmlStr, null, false);
  const anchors = $(".nav-container a");
  for (let i = 0; i < anchors.length; i++) {
    const a = anchors[i];
    if (a.attribs.href === pageName) {
      a.parent.attribs.class = "active";
      a.attribs = {};
      break;
    }
  }
  return $.html();
}

const getFileStr = (fragmentPath, pageName) => {
  let str = "";
  try {
    str = fs.readFileSync(fragmentPath, "utf-8");
    if (path.basename(fragmentPath) === "header.html") {
      str = handleHeader(str, pageName);
    }
  } catch (err) {
    console.error(err);
  }
  return str;
};

const pages = fs.readdirSync(path.resolve(__dirname, "src/pages"));
const loadHtmlPlugns = function (env) {
  const inject = env !== "production";
  const footer = getFileStr("src/layout/footer.html");
  const aside = getFileStr("src/components/news-aside.html");
  const pagination = getFileStr("src/components/pagination.html");
  const pageArr = pages.map(page => {
    const option = {
      filename: "pages/" + page,
      template: "src/pages/" + page,
      minify: false,
      inject,
      header: getFileStr("src/layout/header.html", page),
      footer
    };
    switch (page) {
      case "xinwenzixun.html":
        option.aside = aside;
        option.pagination = pagination;
        break;
      case "xinwenxiangqing.html":
        option.aside = aside;
        break;
      case "chanpinku.html":
        option.pagination = pagination;
        break;
    }
    return new htmlWebpackPlugin(option);
  });
  return pageArr;
};

module.exports = function (env, argv) {
  return {
    // mode: env = "production" ? 'production' : 'development',
    mode: "development",
    entry: "./src/index.js",
    output: {     // webpack-dev-server 不会读取该该属性
      filename: "bundle.js",
      path: path.resolve(__dirname, "dist"),
      publicPath: "/",  // 默认值
    },
    devServer: {
      before(app, server, compiler) {
        const watchFiles = ['.html', '.pug'];

        compiler.hooks.done.tap('done', () => {
          const changedFiles = Object.keys(compiler.watchFileSystem.watcher.mtimes);

          if (
            this.hot &&
            changedFiles.some(filePath => watchFiles.includes(path.parse(filePath).ext))
          ) {
            server.sockWrite(server.sockets, 'content-changed');
          }
        });
      },
      // 没生效
      // contentBase: [
      //   path.resolve(__dirname, "src/layout"),
      //   path.resolve(__dirname, "src/pages")
      // ],
      openPage: 'pages/shouye.html',
      compress: true,
      hot: true,
    },
    module: {
      rules: [{
        test: /\.(css|png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      }]
    },
    plugins: [
      new CleanWebpackPlugin({
        root: path.resolve(__dirname, "dist"),
        dry: false, // 启用删除文件
      }),
      new TransferWebpackPlugin(
        [
          { from: "src/js", to: "js" },
          { from: "src/css", to: "css" },
          { from: "src/images", to: "images" },
        ],
        path.resolve(__dirname, "./")
      ),
      ...loadHtmlPlugns(env),
      new HtmlBeautifyPlugin({
        config: {
          html: {
            end_with_newline: true,
            indent_size: 2,
            indent_with_tabs: false,
            indent_inner_html: true,
            preserve_newlines: true,
            unformatted: ["p", "i", "b", "span"],
          },
        },
        replace: ['type="text/javascript"'],
      }),
    ],
  }
};
