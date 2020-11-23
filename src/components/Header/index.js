// src/components/Header/index.js
import React from "react";
/*
Header组件 分两部分建立两行Row
第一行是用户的个人信息(这里以后要通过变量传输进来)
* */
import {Row, Col, Modal,message,Select,Dropdown,Menu,Form,Input,Avatar,Icon,Button} from "antd";
import "./index.less";
import Util from "../../utils/utils"; //导入公共机制
import {connect} from "react-redux";
import {switchMenu} from "../../redux/action"; //连接器
// import {Menu} from "antd/lib/menu";
import MenuConfig from "./../../config/menuConfig"; //导入menuConfig这个文件
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { reqLogout,reqChangePwd } from '../../api'
import {emit} from '../../emit'
import intl from 'react-intl-universal';
const FormItem = Form.Item;

class Header extends React.Component {
  //声明 state变量 在setState之前要声明变量
  state = {};

  componentWillMount() {
    
    this.setState({
      userName: "",
    });
    /*
        创建定时器,每隔一秒获取时间
        * 获取时间的方法
        */
    setInterval(() => {
      // new Date();
      let sysTime = Util.formateDate(new Date().getTime());
      this.setState({
        sysTime
      });
    }, 1000);
    // this.getWeatherAPIData(); //在这里调用下天气
  }

  // 处理页面刷新的修改面包屑的代码
  handleMenUpdate = (data) => {
    let currentKey = window.location.hash.replace(/#|\?.*$/g, "");
    const {dispatch} = this.props;

    let obj = []; //创建数组,将需要的数据放入其中,代码无形中使用了工厂模式👍,将需要值进行了处理
    data.map(item => {
      if (item.children) {// 如果有children属性,将其展开放入数组中
        obj.push(...item.children);
      } else{
        obj.push(item);
      }
    });
    const menuName = obj;
    menuName.forEach((item)=>{
      if(currentKey===item.key){
        dispatch(switchMenu(item.title))
      }
    })
  };

  /* 判断页面是否刷新,定义生命周期方法 ,如果页面刷新,重新给menuName值*/
  componentDidMount() {
    this.handleMenUpdate(MenuConfig);
  }

  /*定义得到API天气的方法*/
  getWeatherAPIData() {
    //通过jsonp的方式  调用百度Api接口
    //1.安装jsonp插件             yarn add jsonp --save
    //2.对jsonp插件进行的封装   新建文件夹axios-----index.js
    //3.通过axios插件来发送jsonp()方法
    //通过字符串的方式发送url
    //地区动态储存,定义变量   city            // url:'http://api.map.baidu.com/telematics/v3/weather?location='+this.city+'&output=json&ak=3p49MVra6urFRGOT9s8UBWr2'
    //对中文进行编码,转为页面字符
    // 编码后通过   .then  进行接收

    // let city = "澳门";
    
    // axios
    //   .jsonp({
    //     // url:'http://api.map.baidu.com/telematics/v3/weather?location='+this.city+'&output=json&ak=3p49MVra6urFRGOT9s8UBWr2'
    //     url:
    //       "http://api.map.baidu.com/telematics/v3/weather?location=" +
    //       encodeURIComponent(city) +
    //       "&output=json&ak=3p49MVra6urFRGOT9s8UBWr2"
    //   })
    //   .then(res => {
    //     //通过这里拿到返回值,可以先看下返回值是什么
    //
    //     if (res.status == "success") {
    //       //状态成功取得数据进行使用
    //       let data = res.results[0].weather_data[0];
    //       this.setState({
    //         //将状态设置进去
    //         date: data.date,
    //         dayPictureUrl: data.dayPictureUrl,
    //         weather: data.weather
    //       });
    //     }
    //   });
  }

// changePassword = () => {
//     Modal.confirm({
//       title: '修改账户密码',
//       onOk: async () => {
//         const localuser = storageUtils.getUser();
//         const usercode = localuser.usercode;
//         const result = await reqLogout(usercode)
//         if(result.code===20000){
//           storageUtils.removeUser()
//           // 内存中的
//           memoryUtils.user = {}
//           // 跳转到登陆界面
//           window.location.href = "/#/login"
//           message.success("已退出")
//         }else{
//           //注销失败
//           message.error(result.msg)
//         }
//       },
//       onCancel() {
//         console.log('Cancel');
//       },
//     })
//   };

  showExitConfirm = () => {
    // 显示确认提示
    Modal.confirm({
      title: '确认退出吗?',
      onOk: async () => {
        // console.log('OK');
        // 确定后, 删除存储的用户信息
        // local中的
        // const localuser = storageUtils.getUser();
        // if(!localuser){
        //   window.location.href = "/#/login"
        //   message.success("已退出")
        // }
        // const token = localuser.token;
        // const usercode = localuser.usercode;
        // const userid = localuser._id

        //测试用
        // storageUtils.removeUser()
        // memoryUtils.user = {}
        // window.location.href = "/#/login"
        // message.success("已退出")
        // return
        //
        //测试登出
        // storageUtils.removeUser()
        // memoryUtils.user = {}
        // window.location.href = "/#/login"
        // message.success("已退出")
        //测试登录
        //想服务器发送注销退出请求，服务器处理token成功之后删除本地token信息
        // const result = await reqLogout(usercode)
        
        // if(result.code===20000){
        //   storageUtils.removeUser()
        //   // 内存中的
        //   memoryUtils.user = {}
        //   // 跳转到登陆界面
        //   window.location.href = "/#/login"
        //   message.success("已退出")
        // }else{
        //   //注销失败
        //   message.error(result.msg)
        // }
        storageUtils.removeUser()
        // 内存中的
        memoryUtils.user = {}
        // 跳转到登陆界面
        window.location.href = "/#/login"
        message.success("已退出")
      },
      onCancel() {
        console.log('Cancel');
      },
    })
  };

  ShowChangePassword = ()=>{
    this.setState({
      isVisible: true,
      title: '修改密码',
      userInfo: memoryUtils.user
    });
  }

  handleSubmitChangePwd =  (e) => {
    e.preventDefault()
    this.userForm.props.form.validateFields(async (err,values)=>{
      if(!err){
        let data = this.userForm.props.form.getFieldsValue();
        let newUserPassword = data.newUserPassword;
        let ensureNewUserPassword = data.ensureNewUserPassword;
        if(newUserPassword!==ensureNewUserPassword){
          Modal.info({
            title: "提示",
            content: "新密码与确认密码不一致"
          });
          return;
        }
        const retdata = await reqChangePwd(data);
        if (retdata.code === 20000) {
            this.userForm.props.form.resetFields();
            this.setState({
              isVisible: false,
            });
            Modal.info({
              title: "提示",
              content: retdata.msg
            });
        }else{
          Modal.info({
          title: "提示",
          content: retdata.msg
        });
        }
        //关闭loading画面
        // loading = document.getElementById('ajaxLoading');
        // loading.style.display = 'none';
      }
    })
  };


  handleChange(val) {
    // 发送消息
    emit.emit('change_language', val);
  }

  render() {
    // 取出menuType 用作二级导航(父组件Common.js传来)
    const user = memoryUtils.user
    // 这里不用做判断，父组件admin已经判断过了，没值会直接跳转到登录页，这里取出的user一定是有值的
    // if (!user.userId) {
    //   // this.props.history.replace('/login') // 事件回调函数中进行路由跳转
    //   return <Redirect to="/login"/> // 自动跳转到指定的路由路径
    // }
    // const infocentermenu = (
    //   <Menu className='menu'>
    //       <Menu.Item>你好 - {intl.get('header-welcome')}, {user.userName}</Menu.Item>
    //       <Menu.Item>个人信息</Menu.Item>
    //       <Menu.Item><span onClick={this.changePassword}>修改密码</span></Menu.Item>
    //       <Menu.Item><span onClick={this.showExitConfirm}>退出登录</span></Menu.Item>
    //   </Menu>
    // )
    const infocentermenu = (
      <Menu>
        <Menu.Item>
        <Icon type='user' />
        <span><a>{intl.get('header-welcome')}, {user.userName}</a></span>
        </Menu.Item>
        <Menu.Item>
        <Icon type='file' />
        <span><a>{intl.get('header-corp')} - {user.corpCode}</a></span>
        </Menu.Item>
        <Menu.Item onClick={this.ShowChangePassword}>
        <Icon type='edit' />
        <span><a>{intl.get('header-chgpwd')}</a></span>
        </Menu.Item>
        <Menu.Item onClick={this.showExitConfirm}>
        <Icon type='logout' />
        <span><a>{intl.get('header-logout')}</a></span>
        </Menu.Item>
      </Menu>
    );



    const menuType = this.props.menuType;
    return (
      <div className="header">
        <Row className="header-top">
          {menuType ? (
            <Col span="6" className="logo">
              <img src="/assets/logo-ant.svg" alt=""/>
              <span>ICBC 代理系统</span>
            </Col>
          ) : (
            ""
          )}
          <Col span={menuType ? 18 : 24}>
            <span>
            {/* <span> <a>{user.corpCode} , {user.userName}</a> </span> */}
            
            {/* <Dropdown overlay={infocentermenu}> */}
            <span>
              {/* <a> */}
               
                <Avatar style={{ backgroundColor: '#87d068' }} icon="user" />&nbsp;&nbsp;
                {user.corpCode} , {user.userName}&nbsp;&nbsp;
            {/* {intl.get('header-infocenter')} 用户中心直接用avatar图标代替*/}

            {/* </a> */}
            </span>
            {/* </Dropdown>  */}
            <Button type="primary" icon="edit" onClick={this.ShowChangePassword}>修改密码</Button>&nbsp;&nbsp;
            <Button type="danger" icon="logout" onClick={this.showExitConfirm}>退出</Button>
            </span>
            <a>{intl.get('header-showlang')}&nbsp;:&nbsp;</a>
            <Select defaultValue="中文简体" onChange={this.handleChange.bind(this)}>
                    <Select.Option value="zh-CN">中文简体</Select.Option>
                    <Select.Option value="en-US">English</Select.Option>
                    <Select.Option value="zh-TW">中文繁體</Select.Option>
            </Select>
          </Col>
        </Row>
        {menuType ? (
          ""
        ) : (
          <Row className="breadcrumb">
            <Col span="4" className="breadcrumb-title">
              {/* 首页 */}
              {this.props.menuName}
            </Col>
            <Col span="20" className="weather">
              <span className="date">{this.state.sysTime}</span>
              <span className="weather-img">
                <img src={this.state.dayPictureUrl} alt=""/>
              </span>
              <span className="weather-detail">
                {this.state.weather}
                {/*{this.state.date}*/}
              </span>
            </Col>
          </Row>
        )}
<Modal
          title={this.state.title}
          visible={this.state.isVisible}
          onOk={this.handleSubmitChangePwd}
          onCancel={() => {
            this.userForm.props.form.resetFields();
            this.setState({
              isVisible: false,
              userInfo: ''
            });
          }}
          width={800}
        
        >
          <ChangePwdForm  userInfo={this.state.userInfo} 
          wrappedComponentRef={(inst) => this.userForm = inst}
          />
        </Modal>

      </div>
      
    );
  }
}

//添加修改密码表单
class ChangePwdForm extends React.Component {

  render() {
    let userInfo = this.props.userInfo || {};
    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 18
      }
    };
    const {getFieldDecorator} = this.props.form;
    return (
      <Form layout="horizontal">
        <FormItem label="" {...formItemLayout}>
          {
              getFieldDecorator('userId', {
                initialValue: userInfo.userId,
              })(
                <Input type="hidden" placeholder="用户Id"/>
              )
          }
        </FormItem>
        <FormItem label="用户旧密码" {...formItemLayout} >
          {
              getFieldDecorator('oldUserPassword', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '请输入用户旧密码'
                  },
                //   {
                //     min: 3,
                //     message: '密码至少为3个字符'
                //   },
                //   {
                //     max: 16,
                //     message: '密码最多为16个字符'
                //   },
                //   {
                //     whitespace: true,
                //     message: '密码中不能有空格'
                //   }
                ]
              })(
                // <Input type="password" placeholder="请输入用户旧密码"/>
                <Input.Password placeholder="请输入用户旧密码"/>
              )
          }
        </FormItem>
        <FormItem label="用户新密码" {...formItemLayout} >
          {
              getFieldDecorator('newUserPassword', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '请输入用户新密码'
                  },
                  {
                    min: 6,
                    message: '密码至少为6个字符'
                  },
                  {
                    max: 10,
                    message: '密码最多为10个字符'
                  },
                //   {
                //     whitespace: true,
                //     message: '密码中不能有空格'
                //   }
                ]
              })(
                // <Input type="password" placeholder="请输入用户新密码"/>
                <Input.Password placeholder="请输入用户新密码"/>
              )
          }
        </FormItem>
        <FormItem label="确认新密码" {...formItemLayout} >
          {
              getFieldDecorator('ensureNewUserPassword', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '请确认用户新密码'
                  },
                  {
                    min: 6,
                    message: '密码至少为6个字符'
                  },
                  {
                    max: 10,
                    message: '密码最多为10个字符'
                  },
                //   {
                //     whitespace: true,
                //     message: '密码中不能有空格'
                //   }
                ]
              })(
                // <Input type="password" placeholder="请确认用户新密码"/>
                <Input.Password placeholder="请确认用户新密码"/>
              )
          }
        </FormItem>
      </Form>
    );
  }
}

ChangePwdForm = Form.create({})(ChangePwdForm);





//将state.menuName 绑定到 props 的menuName
const mapStateToProps = state => {
  console.log(state);
  return {
    menuName: state.menuName,
    userName: state.userName
  };
};
export default connect(mapStateToProps)(Header);
