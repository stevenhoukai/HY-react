var Mock = require("mockjs")
var express = require("express")
var router = express.Router();
router.use("/profile",function (req,res) {
    //调用mock方法模拟数据
    var data = Mock.mock({
            'list': [{
                'id': 1,
                'id2': 2
            }]
        }
    );
    return res.json(data);
})

router.use("/companyFileList",function (req,res) {
    //调用mock方法模拟数据
    var data = Mock.mock({
            'code':0,
            'list': [{
                'id':0,
                'companyEncode':'123',
                'companyName':'用友',
                'companyDescription':'澳门分公司',
                'drcrAccount':'123',
                'importType':'2',
                'companyhone':'12344556',
                'personalPhone':'1232',
                'companyStatus':'正常',
                'companyContact':'1232',
                'personalContact':'4423',
                'address1':'222',
                'address2':'333',
                'address3':'444',
                'Email1':'1',
                'Email2':'2',
                'createTime':'3',
                'updateTime':'4',
                'yn':'0',
                'comment':'12313'
            },{
                'id':0,
                'companyEncode':'123',
                'companyName':'用友',
                'companyDescription':'珠海分公司',
                'drcrAccount':'123',
                'importType':'2',
                'companyhone':'12344556',
                'personalPhone':'1232',
                'companyStatus':'正常',
                'companyContact':'1232',
                'personalContact':'4423',
                'address1':'222',
                'address2':'333',
                'address3':'444',
                'Email1':'1',
                'Email2':'2',
                'createTime':'3',
                'updateTime':'4',
                'yn':'0',
                'comment':'12313'
            },{
                'id':0,
                'companyEncode':'123',
                'companyName':'用友',
                'companyDescription':'总公司',
                'drcrAccount':'123',
                'importType':'2',
                'companyhone':'12344556',
                'personalPhone':'1232',
                'companyStatus':'正常',
                'companyContact':'1232',
                'personalContact':'4423',
                'address1':'222',
                'address2':'333',
                'address3':'444',
                'Email1':'1',
                'Email2':'2',
                'createTime':'3',
                'updateTime':'4',
                'yn':'0',
                'comment':'12313'
            },{
                'id':0,
                'companyEncode':'123',
                'companyName':'用友',
                'companyDescription':'澳门分公司',
                'drcrAccount':'123',
                'importType':'2',
                'companyhone':'12344556',
                'personalPhone':'1232',
                'companyStatus':'正常',
                'companyContact':'1232',
                'personalContact':'4423',
                'address1':'222',
                'address2':'333',
                'address3':'444',
                'Email1':'1',
                'Email2':'2',
                'createTime':'3',
                'updateTime':'4',
                'yn':'0',
                'comment':'12313'
            }]
        }
    );
    return res.json(data);
})
router.use("/list1",function (req,res) {
    //调用mock方法模拟数据
    var data = Mock.mock({
            // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
            'list|1-10': [{
                // 属性 id 是一个自增数，起始值为 1，每次增 1
                'id|+1': 1
            }]
        }
    );
    return res.json(data);
})
module.exports = router;