// src\pages\login\index.js
import React from "react";
import { Form, Input, Button, message,Icon,Modal,Checkbox,Select } from "antd";
import Footer from "../../components/Footer";
import "./index.less";
import { connect } from "react-redux"; // 连接器
import { reqLogin,reqFindPwd } from '../../api'
import storageUtils from '../../utils/storageUtils'
import memoryUtils from '../../utils/memoryUtils'
import backpic from '../../images/bg5.jpg'
import BGParticle from '../../utils/BGParticle'
import { Redirect } from 'react-router-dom'
const FormItem = Form.Item;
const Option = Select.Option;

class Login extends React.Component {
  state = {};

  componentDidMount() {
    //每次进入登录页清除之前的登录信息

    this.particle = new BGParticle('backgroundBox')
    this.particle.init()
    // document.addEventListener("keydown",this.onKeyDown);
  }


  // componentWillUnmount() {
  //   document.removeEventListener("keydown",this.onKeyDown);
  // }


  // onKeyDown = (e) => {
  //   switch(e.keyCode){
  //     case 13 :
  //       message.info('111');
  //       break
  //   }
  // }

  // loginReq = params => {
  //   // 事件派发，自动调用reducer，通过reducer讲用户名保存到store对象中
  //   const { dispatch } = this.props;
  //   dispatch(switchUsers(params.username));
  //   window.location.href = "/#/home";
  // };
  //   loginReq = e => {
  //   e.preventDefault()
  //   this.props.form.validateFields(async (err, {username, password}) => {
  //     if (!err) {
  //       //测试用
  //       if(username==='admin'){
  //         this.props.history.replace('/')
  //         message.success('登陆成功!')
  //       }
  //       // try {} catch (error) {}
  //       // alert(`发登陆的ajax请求, username=${username}, password=${password}`)
  //       const result = await reqLogin(username, password)
  //       // 登陆成功
  //       if (result.status===0) {
  //         // 将user信息保存到local
  //         const user = result.data
  //         // localStorage.setItem('user_key', JSON.stringify(user))
  //         storageUtils.saveUser(user)
  //         // 保存到内存中
  //         memoryUtils.user = user

  //         // 跳转到管理界面
  //         this.props.history.replace('/')
  //         message.success('登陆成功!')
  //       } else { // 登陆失败
  //         message.error(result.msg)
  //       }
  //     } else {
  //       // alert('验证失败!')
  //     }
  //   })
  // };

  render() {
    return (
      <div className="login-page">
        <div id='backgroundBox' style={styles.backgroundBox} />
        <div className="login-header">
          <div className="logo">
            <img src="/assets/icbclogo.jpg" alt="ICBC代理管理系统" />
            ICBC代理管理系统
          </div>
        </div>
        <div className="login-content-wrap">
          <div className="login-content">
            <div className="word">
              共享管理 <br />
              引领新潮管理
            </div>
            <div className="login-box">
              <div className="error-msg-wrap">
                <div className={this.state.errorMsg ? "show" : ""}>
                  {this.state.errorMsg}
                </div>
              </div>
              <div className="title">Yonyou欢迎你</div>
              <LoginForm ref="login" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
export default connect()(Login);

class LoginForm extends React.Component {
  
  state = {};

  // loginSubmit = e => {
  //   e && e.preventDefault();
  //   const _this = this;
  //   this.props.form.validateFieldsAndScroll((err, values) => {
  //     if (!err) {
  //       var formValue = _this.props.form.getFieldsValue();
  //       _this.props.loginSubmit({
  //         username: formValue.username,
  //         password: formValue.password
  //       });
  //     }
  //   });
  // };
  componentDidMount() {
    document.addEventListener("keydown",this.onKeyDown);
  }


  componentWillUnmount() {
    document.removeEventListener("keydown",this.onKeyDown);
  }


  onKeyDown = (e) => {
    switch(e.keyCode){
      case 13 :
        this.loginSubmit();
        break
    }
  }


  ShowFindPassword = ()=>{
    this.setState({
      isVisible: true,
      title: '找回密码'
    });
  }


  handleSubmitFindPwd =  (e) => {
    e.preventDefault()
    this.userForm.props.form.validateFields(async (err,values)=>{
      if(!err){
        let data = this.userForm.props.form.getFieldsValue();
        // const {usercode,email,mobile} = values;
        // let newUserPassword = data.newUserPassword;
        // let ensureNewUserPassword = data.ensureNewUserPassword;
        // if(newUserPassword!==ensureNewUserPassword){
        //   Modal.info({
        //     title: "提示",
        //     content: "新密码与确认密码不一致"
        //   });
        //   return;
        // }
        const result = await reqFindPwd(data.usercode,data.email);
        console.log(result);
        // const retdata = {}
        if (result.code === 20000) {
            this.userForm.props.form.resetFields();
            this.setState({
              isVisible: false,
            });
            Modal.info({
              title: "提示",
              content: result.msg
            });
        }else{
          Modal.info({
          title: "提示",
          content: result.msg
        });
        }
            // Modal.info({
            //   title: "提示",
            //   content: "暫時還未開啟郵件或短信平台"
            // });
      }
    })
  };

  loginSubmit = e => {
    e && e.preventDefault();
    // const _this = this;
    this.props.form.validateFieldsAndScroll( async (err, {usercode, password}) => {
      if (!err) {
        //测试用
      //   if(usercode==='admin'){
      //     const user = {
      //       userId:1,
      //       usercode:'admin',
      //       userName:'admin',
      //     }
      //     storageUtils.saveUser(user)
      //     // 保存到内存中
      //     memoryUtils.user = user
      //     window.location.href = "/#/admin/home"
      //     message.success('登陆成功!')
      //     return
      // }
        //上面测试用
        
        const result = await reqLogin(usercode, password)
        // 登陆成功
        if (result.code===20000) {
          // 将user信息保存到local
          const userresult = result.result.item_list
          const user = {
            userId:userresult.userId,
            usercode:userresult.userCode,
            userName:userresult.userName,
            token:userresult.token,
            menus:userresult.menus,
            corpId:userresult.corpId,
            userType:userresult.userType,
            corpCode:userresult.corpCode,
          }
          storageUtils.saveUser(user)
          // 保存到内存中
          memoryUtils.user = user
          window.location.href = "/#/home"
          message.success('登陆成功!')
        } else { // 登陆失败
          message.error(result.msg)
        }
      } 
    });
  };

  checkUsername = (rule, value, callback) => {
    var reg = /^\w+$/;
    if (!value) {
      callback("请输入用户名!");
    } else if (!reg.test(value)) {
      callback("用户名只允许输入英文字母");
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    if (!value) {
      callback("请输入密码!");
    } else {
      callback();
    }
  };

  render() {
    const user = memoryUtils.user
    if (user.userId) {
      // this.props.history.replace('/login') // 事件回调函数中进行路由跳转
      return <Redirect to="/home"/> // 自动跳转到指定的路由路径
    }

    const { getFieldDecorator } = this.props.form;
    return (
      <div>
      <Form className="login-form">
        <FormItem>
          {getFieldDecorator("usercode", {
            initialValue: "",
            rules: [{ validator: this.checkUsername }]
          })(<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} 
          placeholder="username" />)}
        </FormItem>
        <FormItem>
          {getFieldDecorator("password", {
            initialValue: "",
            rules: [{ validator: this.checkPassword }]
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="password"
              wrappedcomponentref={inst => (this.pwd = inst)}
            />
          )}
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            onClick={this.loginSubmit}
            className="login-form-button"
          >
            登录
          </Button>
        </FormItem>
        <FormItem>
          {/* <a onClick={this.loginSubmit}>忘记密码？</a> */}
          <a className="login-form-forgot" onClick={this.ShowFindPassword} href="javascript:void(0)">
            忘记密码？
          </a>
          {/* <Button type="link" onClick={this.ShowFindPassword}>忘记密码？</Button> */}
        </FormItem>
      </Form>
      <Modal
      title={this.state.title}
      visible={this.state.isVisible}
      onOk={this.handleSubmitFindPwd}
      onCancel={() => {
        this.userForm.props.form.resetFields();
        this.setState({
          isVisible: false,
        });
      }}
      destroyOnClose
      width={700}
    >
      <FindPwdForm 
      wrappedComponentRef={(inst) => this.userForm = inst}
      />
    </Modal>
    </div>
    );
  }
}

const styles = {
  backgroundBox: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    // backgroundImage: 'url(https://github.com/zhangZhiHao1996/image-store/blob/master/react-admin-master/bg5.jpg?raw=true)',
    // backgroundImage: 'url(../../../../assets/images/bg5.jpg)',
    backgroundImage: 'url('+backpic+')',
    backgroundSize: '100% 100%',
    transition:'all .5s'
  }
}
LoginForm = Form.create({})(LoginForm);



//添加修改密码表单
class FindPwdForm extends React.Component {

  state = {
    mobilemessage: false,
    macaomobile: true
  };

  componentWillMount() {
    this.setState(
        {
          macaomobile: true,
        }
    );
  }

  // componentDidMount() {
  //   document.addEventListener("keydown",this.onKeyDown);
  // }


  // componentWillUnmount() {
  //   document.removeEventListener("keydown",this.onKeyDown);
  // }


  // onKeyDown = (e) => {
  //   switch(e.keyCode){
  //     case 13 :
  //       this.onOkClick();
  //       break
  //   }
  // }

  // onOkClick = (e) => {

  // }


  handleMobileChange = (value) => {
    // this.props.form.resetFields();
    if(value === 86){
      this.setState(
        {
          macaomobile: false,
        },
        // () => {
        //   this.props.form.validateFields(['mobile'], { force: true });
        // },
      );
    }else{
      this.setState(
        {
          macaomobile: true,
        },
        // () => {
        //   this.props.form.validateFields(['mobile'], { force: true });
        // },
      );
    }
  };

  handleChange = (e) => {
    this.props.form.resetFields();
    this.setState(
      {
        mobilemessage: e.target.checked,
      },
      () => {
        this.props.form.validateFields(['mobile'], { force: true });
      },
    );
  };

  
  

  render() {
    // let userInfo = this.props.userInfo || {};
    // let userInfo = {};
  const {getFieldDecorator} = this.props.form;
  const prefixSelector = getFieldDecorator('prefix', {
    initialValue: 853, 
  })(
    <Select style={{width: 70}} onChange={this.handleMobileChange} disabled={!this.state.mobilemessage}>
      <Option value={86}>+86</Option>
      <Option value={853}>+853</Option>
    </Select>
  );
    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 10
      }
    };
    return (
      <Form layout="horizontal">
        {/* <FormItem label="" {...formItemLayout}>
          {
              getFieldDecorator('userId', {
                initialValue: userInfo.userId,
              })(
                <Input type="hidden" placeholder="用户Id"/>
              )
          }
        </FormItem> */}
        <FormItem label="密碼找回方式" {...formItemLayout} >
        {
              getFieldDecorator('ifmobile', {
                initialValue: false,
                checked: false,
              })(
                <Checkbox checked={this.state.mobilemessage} onChange={this.handleChange}>
                    ×:郵件 √:手機
                </Checkbox>
              )
          }
        
        </FormItem>


        <FormItem label="用户编码" {...formItemLayout} >
          {
              getFieldDecorator('usercode', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '请输入用户编码'
                  },
                ]
              })(
                <Input type="text" placeholder="请输入用户编码"/>
              )
          }
        </FormItem>
        
        <FormItem label="邮箱" {...formItemLayout} >
          {
                getFieldDecorator('email', {
                initialValue: '',
                rules: [
                  {
                    required: !this.state.mobilemessage,
                    type: 'email',
                    message: '请输入正确的邮箱地址'
                  },
                  {
                    required: !this.state.mobilemessage,
                    message: '请填写邮箱地址'
                  }
                ]
              })(
                <Input type="text" placeholder="请输入邮箱地址" disabled={this.state.mobilemessage}/>
              )
           }
        </FormItem>
        <FormItem label="手机号" {...formItemLayout} >
        {
                getFieldDecorator('mobile', {
                initialValue: '',
                rules: [
                  this.state.mobilemessage && this.state.macaomobile === true ?
                  {
                    len: 8,
                    pattern:"^(5|6|8|9)\\d{7}$",
                    required: true,
                    message: '请输入正确的8位手机号码'
                  } : this.state.mobilemessage && !this.state.macaomobile === true ? 
                  {
                    len: 11,
                    pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
                    required: true,
                    message: '请输入正确的11位内地联系电话'
                  } :{

                  }
                ]
              })(
                <Input addonBefore={prefixSelector} disabled={!this.state.mobilemessage}/>
              )
          }
        </FormItem>
      </Form>
    );
  }
}

FindPwdForm = Form.create({})(FindPwdForm);





