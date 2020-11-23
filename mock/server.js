var express = require("express")
var app = express();
var router = express.Router();
app.get('/', function(req, res) {
    res.send('hello world');
});
// var bodyParser = require('body-parser');
// app.use(bodyParser.json());  //body-parser 解析json格式数据
// app.use(bodyParser.urlencoded({            //此项必须在 bodyParser.json 下面,为参数编码
//     extended: true
// }));
router.use("/test",require('./test'));
router.use("/table",require('./test'));
app.use("/api",router);
app.listen(3001);