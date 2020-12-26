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
    // return "";
  }
  return str;
};

module.exports = {
  mode: "development",
  // entry: './src/index.js',
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    // publicPath: "/dist/",
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    watchContentBase: true,
    compress: true,
    hot: true,
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
    new htmlWebpackPlugin({
      template: "src/pages/index.html",
      minify: false,
      header: getFileStr("src/layout/header.html"),
      footer: getFileStr("src/layout/footer.html"),
    }),
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
      replace: [' type="text/javascript"'],
    }),
  ],
};
