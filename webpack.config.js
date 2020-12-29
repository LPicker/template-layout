const path = require("path");
const fs = require("fs");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TransferWebpackPlugin = require("transfer-webpack-plugin");
const htmlWebpackPlugin = require("html-webpack-plugin");
const HtmlBeautifyPlugin = require("@nurminen/html-beautify-webpack-plugin");

const getFileStr = (path) => {
  let str = "";
  try {
    str = fs.readFileSync(path, "utf-8");
  } catch (err) {
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
    header: getFileStr("src/layout/header.html"),
    footer: getFileStr("src/layout/footer.html"),
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
      // 没生效
      contentBase: [path.join(__dirname, "src/layout")],
      compress: true,
      hot: true,
    },
    module: {
      rules: [{
        test: /\.css$/,
        use: "css-loader"
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
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
