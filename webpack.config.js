const path = require("path");
const fs = require("fs");
const cheerio = require('cheerio');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TransferWebpackPlugin = require("transfer-webpack-plugin");
const htmlWebpackPlugin = require("html-webpack-plugin");
const HtmlBeautifyPlugin = require("@nurminen/html-beautify-webpack-plugin");

const getFileStr = (path, htmlName) => {
  let str = "";
  try {
    str = fs.readFileSync(path, "utf-8");
    const $ = cheerio.load(str, null, false);
    const anchors = $(".nav-container a");
    for (let i = 0; i < anchors.length; i++) {
      const a = anchors[i];
      if (a.attribs.href === htmlName) {
        a.parent.attribs.class = "active";
        a.attribs = {};
        break;
      }
    }
    str = $.html();
  } catch (err) {
    console.err(err)
  }
  return str;
};

const pages = fs.readdirSync(path.resolve(__dirname, "src/pages"));
const loadHtmlPlugns = function (env) {
  const inject = env !== "production";
  return pages.map((page) => new htmlWebpackPlugin({
    filename: "pages/" + page,
    template: "src/pages/" + page,
    inject,
    minify: false,
    header: getFileStr("src/layout/header.html", page),
    footer: getFileStr("src/layout/footer.html", page),
  }))
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
        //   test: /\.css$/,
        //   use: "css-loader"
        // },
        // {
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
