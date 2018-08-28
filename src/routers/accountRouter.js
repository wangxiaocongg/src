



//1. 导入express
const express = require("express");
const path = require("path");

//2. 创建路由对象
const accountRouter = express.Router();

//导入控制器

const accountctrl = require(path.join(__dirname,"../controllers/accountController.js"))

//3、处理具体的请求
// 获取登录页面的请求
accountRouter.get('/login',accountctrl.getLoginPage);

// 获取注册页面的请求
accountRouter.get("/register",accountctrl.getRegisterPage)

module.exports = accountRouter;