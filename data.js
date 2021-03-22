/**
 *
 */
const cheerio = require("cheerio");
const superagent = require("superagent");
const fs = require("fs");

// 代理
const proxy = ""; // 设置代理
const header = {
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.6",
  Host: "localhost",
  "User-Agent":
    "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Mobile Safari/537.36",
  "Cache-Control": "max-age=0",
  Connection: "keep-alive",
};

async function request(url, dealFunc, header, proxy) {
  // 发起请求
  return await superagent
    .get(url)
    // .set("header", header)
    .end(dealFunc);
}

// 文件写
function writeFile(path, data) {
  // if (fs.existsSync(path)) {
  //   console.log("文件已存在");
  // }else{
  //   console.log("该路径不存在");
  // }
  fs.writeFile(path, data, (log) => {
    console.log(log);
  });
  // fs.open(path,'ax',function (err,data) {
  //   if (err) {
  //     throw err
  //   }
  //   console.log(data);
  // })
}

let basePath="../static/source/"
const getHotData = async () => {
  //热播
  await request(
    "https://movie.douban.com/cinema/nowplaying/hangzhou/",
    (err, res) => {
      if (err) {
        console.log(err);
      } else {
        let $ = cheerio.load(res.text);
        let hotData = "";
        $("#nowplaying ul.lists .list-item").each(async (i, elem) => {
          const href = $(elem)
            .find(".stitle a")
            .attr("href");
          hotData += href + "\n";
        });

        writeFile(basePath+"/hot.txt", hotData);
      }
    }
  );
};
exports.getHotData = getHotData;
