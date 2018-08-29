

//导入
const path = require("path")
const MongoClient = require("mongodb").MongoClient;
const captchapng = require("captchapng");


//连接数据库
const url = "mongodb://localhost:27017";

const dbName = "szhmqd21";

// 最终处理，返回登录页面给浏览器
exports.getLoginPage = (req,res)=>{
    res.sendFile(path.join(__dirname,"../statics/views/login.html"))
}

//  最终处理，返回注册页面给浏览器
exports.getRegisterPage = (req,res)=>{
    res.sendFile(path.join(__dirname,"../statics/views/register.html"))
}

//最终处理，把用户名密码保存起来，并且返回结果给浏览器
exports.register = (req,res)=>{
    const result = { status:0,message:"注册成功"};
    //  console.log(req.body)
    //  console.log(req.)
 //1.去数据库中查询，用户民是否已经存在，如果已经存在，则返回用户名存在给浏览器

 MongoClient.connect(url,{ useNewUrlParser: true },(err,client)=>{
     // 拿到了数据操作的db对象
     const db = client.db(dbName)
        // 拿到集合
     const collection = db.collection("accountInfo");
     // 先根据用户名查询
    //  console.log(req.body)

    // collection.find({}).toArray((err,docs)=>{
    //     console.log(docs)
    //     return;
    // }

     collection.findOne({ username:　req.body.username},(err,doc)=>{
         if(doc){
             //用户不存在
             //关掉数据库的链接
             client.close()

             //更改返回的状态
             result.status = 1;
             result.message = "用户名已经存在";
             res.json(result);
         }else{
             //用户名不存在
             //2.如果用户名不存在，则先要把我们的数据插入到数据库中，然后返回注册成功给浏览器
             collection.insertOne(req.body,(ree,resuly2)=>{
                //关掉和数据库的链接
                client.close();

                if(resuly2 == null) {
                    result.status = 2;
                    result.message = "注册失败";
                }
                res.json(result)
             })
         }
     })
 })
}

/**
 * 最终处理，返回图片验证码
 */

exports.getVcodeImage = (req, res) => {
    const vcode = parseInt(Math.random() * 9000 + 1000);
  
    // 把刚刚随机生成的验证码，存储到session中
    req.session.vcode = vcode;
  
    var p = new captchapng(80, 30, vcode); // width,height,numeric captcha
    p.color(0, 0, 0, 0); // First color: background (red, green, blue, alpha)
    p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)
  
    var img = p.getBase64();
    var imgbase64 = new Buffer(img, "base64");
    res.writeHead(200, {
      "Content-Type": "image/png"
    });
    res.end(imgbase64);
  };


  /**
 * 最终处理，登录处理
 */
exports.login = (req, res) => {
    const result = { status: 0, message: "登录成功" };
  
    // 校验验证码
    if (req.body.vcode != req.session.vcode) {
      result.status = 1;
      result.message = "验证码不正确";
  
      res.json(result);
      return;
    }
  
    // 去数据库中，使用username & password 去校验
    MongoClient.connect(
      url,
      { useNewUrlParser: true },
      function(err, client) {
        // 获取db对象
        const db = client.db(dbName);
  
        // 拿着要操作的集合
        const collection = db.collection("accountInfo");
  
        collection.findOne(
          { username: req.body.username, password: req.body.password },
          (err, doc) => {
            // 关闭掉数据库连接
            client.close();
            if (doc == null) {
              result.status = 2;
              result.message = "用户名或密码错误";
            }
  
            res.json(result);
          }
        );
      }
    );
  };