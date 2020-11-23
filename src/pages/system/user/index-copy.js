import React from 'react';
import {Card, Button, Modal, Form, Input, Select, message} from "antd";
import Utils from '../../../utils/utils';
import ETable from '../../../components/ETable';
import BaseForm from '../../../components/BaseForm';
import {reqUsers,reqAddOrUpdateUser,reqDeleteUser,reqAllCorps,reqResetPwd} from '../../../api/index'
import { formateDateTime} from '../../../utils/dateUtils'
const FormItem = Form.Item;
const Option = Select.Option;


export default class User extends React.Component {

  params = {
    page: 1,
    userCode:"",
    userName:"",
    mobile:""
  };

  state = {
    isVisible: false,
  };

  formList = [
    {
      type: 'INPUT',
      label: '统一认证号',
      field: 'userCode',
      placeholder: '请输入统一认证号',
      width: 130,
    },
    {
      type: 'INPUT',
      label: '姓名',
      field: 'userName',
      placeholder: '请输入用户姓名',
      width: 130,
    }, 
    {
      type: 'INPUT',
      label: '用户手机号',
      field: 'mobile',
      placeholder: '请输入用户手机号',
      width: 140,
    }, 
    // {
    //   type: 'DATE',
    //   label: '请选择入职日期',
    //   field: 'user_date',
    //   placeholder: '请输入日期',
    // }
  ];

  componentDidMount() {
    this.requestList();
  }

  // 处理表单查询
  handleFilter = (params) => {
    this.params = params; // 从子组件传来的值赋值给 params
    this.params.page = 1;
    this.requestList();
  };


  requestList = async () => {
    //默认非条件查询,页面打开加载全部数据
    //第三个参数为是否开始loading加载画面,开发过程建议关闭
    //不推荐这种方式，没有封装post
    //axios.requestList(this, '/user/list', this.params, false);
    //另外一种实现方式，缺点是每次都要手工开启和关闭loading画面
    // const page = params.page;
    // reqUsers(page);
    //开启loading画面
    // let loading = document.getElementById('ajaxLoading');
    // loading.style.display = 'block';
    const retdata = await reqUsers(this.params.page,this.params.userCode,this.params.userName,this.params.mobile)
    
    if (retdata.code === 20000) {
      const list = retdata.result.item_list
      this.setState({
        list,
        pagination: Utils.pagination(retdata, (current) => {
          this.params.page = current;
          this.requestList();
        })
        
      });
    }else{
      Modal.info({
        title: "提示",
        content: retdata.msg
      });
    }
    this.setState({
       selectedRowKeys:'',
       selectedItem:'' 
    });
  };

  test = async(type) => {
    // let json = JSON.parse();
    // let json = {
    //   "home-slogan" : "Welcome To ICBC Agent System",
    //   "header-showlang":"Lang"}
    // const retdata = await reqUsertest(json);
  }

  // 功能区操作
  handleOperate = async(type) => {

    const retdata = await reqAllCorps();
    if (retdata.code === 20000) {
      this.setState({
        corpCodeList: retdata.result.item_list,
      });
    }
    let item = this.state.selectedItem;
    let out_this = this;
    if (type === 'create') {
      this.setState({
        type,
        isVisible: true,
        title: '创建用户',
      });
    } else if (type === 'edit') {
      if (!item) {
        Modal.info({
          title: '提示',
          content: '请选择一个用户'
        });
        return;
      }
      this.setState({
        type,
        isVisible: true,
        title: '编辑用户',
        userInfo: item
      });
    } else if (type === 'detail') {
      if (!item) {
        Modal.info({
          title: '提示',
          content: '请选择一个用户'
        });
        return;
      }

      this.setState({
        type,
        isVisible: true,
        title: '用户详情',
        userInfo: item
      });
    } else if (type === 'reset') {
      if (!item) {
        Modal.info({
          title: '提示',
          content: '请选择一个用户'
        });
        return;
      }
      let _this = out_this;
      Modal.confirm({
        title: '密码重置',
        content: '是否要重置该用户密码，人员编码为:' + item.userCode,
        async onOk() {
        const retdata = await reqResetPwd(item.userId);
        if (retdata.code === 20000) {
          message.info("重置成功")
          // _this.setState({
          // isVisible: false,
          // });
          Modal.info({
            title: '提示',
            content: retdata.msg
          });
        }
        }
      });
    } else {
      if (!item) {
        Modal.info({
          title: '提示',
          content: '请选择一个用户'
        });
        return;
      }
      let _this = out_this;
      Modal.confirm({
        title: '确认删除',
        content: '是否要删除当前选中的用户，编码为:' + item.userCode,
        async onOk() {
          const retdata = await reqDeleteUser(item.userId);
          if (retdata.code === 20000) {
          message.info(retdata.msg)
          _this.setState({
          isVisible: false,
          });
          _this.requestList();
        }else if(retdata.code === 20001){
          message.info(retdata.msg)
          _this.setState({
            isVisible: false,
            });
            _this.requestList();
        }
        }
      });
    }
  };


  

  handleSubmitNew =  (e) => {
    e.preventDefault()
    this.userForm.props.form.validateFields(async (err,values)=>{
      if(!err){
        let type = this.state.type;
        let data = this.userForm.props.form.getFieldsValue();
        const retdata = await reqAddOrUpdateUser(type,data);
        if (retdata.code === 20000) {
            message.info(retdata.msg)
            this.userForm.props.form.resetFields();
            this.setState({
              isVisible: false,
              userInfo: ''
            });
            this.requestList();
        }else{
          Modal.info({
          title: "提示",
          content: retdata.msg
        });
        }
      }
    })
  };





  // 创建或更新用户提交
  handleSubmit = async () => {
    let type = this.state.type;
    let data = this.userForm.props.form.getFieldsValue();
    const retdata = await reqAddOrUpdateUser(type,data);
    if (retdata.code === 20000) {
        this.userForm.props.form.resetFields();
        this.setState({
          isVisible: false,
          // selectedRowKeys:'' // 查询完后,单选框失去焦点
        });
        this.requestList();
        Modal.info({
          title: "提示",
          content: "操作成功"
        });
    }else{
      // message(retdata.msg);
      Modal.info({
      title: "提示",
      content: retdata.msg
    });
    }
  };

  render() {
    const columns = [
      {
        title: 'id',
        dataIndex: 'userId'
      }, 
      {
        title: '统一认证号',
        dataIndex: 'userCode'
      }, 
      {
        title: '姓名',
        dataIndex: 'userName'
      },
      {
        title: '部门',
        dataIndex: 'userDept'
      },
      // {
      //   title: '公司',
      //   dataIndex: 'corpId'
      // },
      {
        title: '性别',
        dataIndex: 'sex',
        render(sex) {
          return sex === 1 ? '男' : sex === 0?'女':'';
        }
      }, 
      // {
      //   title: '状态',
      //   dataIndex: 'status',
      //   render(status) {
      //     let config = {
      //       '0': '禁用',
      //       '1': '启用',
      //     };
      //     return config[status];
      //   }
      // }, 
      {
        title: '用户类别',
        dataIndex: 'usertype',
        render(abc) {
          let config = {
            '0': '业务员',
            '1': '管理员',
            '2': '业务主管',
          };
          return config[abc];
        }
      }, 
      {
        title: '手机号码',
        dataIndex: 'mobile'
      }, 
      {
        title: '邮箱',
        dataIndex: 'email'
      }, {
        title: '创建时间',
        dataIndex: 'createTime',
        render:formateDateTime
      },{
        title: '更新时间',
        dataIndex: 'updateTime',
        render:formateDateTime
      },
    ];

    let footer = {};

    if (this.state.type === 'detail') {
      footer = {
        footer: null
      };
    }

    return (
      <div>
        <Card>
          <BaseForm formList={this.formList} filterSubmit={this.handleFilter}/>
        </Card>

        <Card style={{marginTop: 10}} className="operate-wrap">
          <Button type="primary" icon="plus" onClick={() => this.handleOperate('create')}>创建员工</Button>
          <Button type="primary" icon="edit" onClick={() => this.handleOperate('edit')}>编辑员工</Button>
          <Button type="primary" icon="edit" onClick={() => this.handleOperate('reset')}>重置密码</Button>
          <Button type="danger" icon="delete" onClick={() => this.handleOperate('delete')}>删除员工</Button>
          {/* <Button type="danger" icon="delete" onClick={() => this.test()}>测试员工</Button> */}
        </Card>

        <div className="content-wrap">
          <ETable
            columns={columns}
            updateSelectedItem={Utils.updateSelectedItem.bind(this)}
            selectedRowKeys={this.state.selectedRowKeys}
            selectedItem={this.state.selectedItem}
            dataSource={this.state.list}
            pagination={this.state.pagination}
          />
        </div>
        <Modal
          title={this.state.title}
          visible={this.state.isVisible}
          onOk={this.handleSubmitNew}
          onCancel={() => {
            this.userForm.props.form.resetFields();
            this.setState({
              isVisible: false,
              userInfo: ''
            });
          }}
          destroyOnClose 
          width={600}
          {...footer}
        >
          <UserForm type={this.state.type} userInfo={this.state.userInfo} corpCodeList={this.state.corpCodeList}
                    wrappedComponentRef={(inst) => this.userForm = inst}/>
        </Modal>
      </div>
    );
  }
}

class UserForm extends React.Component {

  state = {
    macaomobile: true
  };

  // handleSearch = async(keywords) => {
  //   //请求后端搜索接口
  //   const retdata = await getAllCompany(keywords);
  //       if (retdata.code === 20000) {
  //           const list = retdata.result.item_list;
  //           this.setState({
  //               list
  //           });
  //       } else {
  //           message.error("获取表单页数据异常！ error=" + retdata.msg)
  //       }
  // }

  componentWillMount() {
    let type = this.props.type;
    let userInfo = this.props.userInfo || {};
    let mobile = userInfo.mobile || {};
    if(type==='create'){
      this.setState(
        {
          macaomobile: true,
        }
      );
    }else if(type==='edit' && mobile.length > 10) {
      this.setState(
        {
          macaomobile: false,
        }
      );
    }else{
      this.setState(
        {
          macaomobile: true,
        }
      );
    }
  }
  
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


  getCorps = (corpId) => {
    let config = {
      '0': "禁用",
      '1': '启用',
    };
    return config[corpId];
  };

  getStatus = (status) => {
    let config = {
      '0': "禁用",
      '1': '启用',
    };
    return config[status];
  };

  getSex = (sex) => {
    let config = {
      '0': "女",
      '1': '男',
    };
    return config[sex];
  };

  getUserType = (usertype) => {
    let config = {
      '0': "业务员",
      '1': '管理员',
      '2': '业务主管',
    };
    return config[usertype];
  };

  render() {
    let type = this.props.type;
    let userInfo = this.props.userInfo || {};
    let mobile = userInfo.mobile || {};
    let corpCodeList = this.props.corpCodeList;
    const formItemLayout = {
      labelCol: {
        span: 5
      },
      wrapperCol: {
        span: 19
      }
    };

    const {getFieldDecorator} = this.props.form;
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: type==='create'? 853 : type==='edit' && mobile.length > 10 ? 86 : 853, 
    })(
      <Select style={{width: 70}} onChange={this.handleMobileChange}>
        <Option value={86}>+86</Option>
        <Option value={853}>+853</Option>
      </Select>
    );
    return (
      <Form layout="horizontal">
        <FormItem label="" {...formItemLayout}>
          {
            userInfo && type === 'detail' ? userInfo.userId :
              getFieldDecorator('userId', {
                initialValue: userInfo.userId,
              })(
                <Input type="hidden" placeholder="用户Id"/>
              )
          }
        </FormItem>
        <FormItem label="" {...formItemLayout}>
          {
            userInfo && type === 'detail' ? userInfo.password :
              getFieldDecorator('password', {
                initialValue: userInfo.password,
              })(
                <Input type="hidden" placeholder="用户密码"/>
              )
          }
        </FormItem>
        {/* <FormItem label="" {...formItemLayout}>
          {
            userInfo && type === 'detail' ? userInfo.userCreateTime :
              getFieldDecorator('userCreateTime', {
                initialValue: userInfo.userCreateTime,
              })(
                <Input type="hidden" placeholder="用户创建时间"/>
              )
          }
        </FormItem> */}
        <FormItem label="统一认证号" {...formItemLayout} >
          {
            userInfo && type === 'detail' ? userInfo.userCode :
              getFieldDecorator('userCode', {
                initialValue: userInfo.userCode,
                rules: [
                  {
                    required: true,
                    message: '请输入统一认证号'
                  },
                  {
                    min: 3,
                    message: '统一认证号至少为3个字符'
                  },
                  {
                    max: 16,
                    message: '统一认证号最多为16个字符'
                  },
                  {
                    whitespace: true,
                    message: '统一认证号中不能有空格'
                  }
                ]
              })(
                <Input type="text" placeholder="请输入统一认证号"/>
              )
          }
        </FormItem>
        <FormItem label="姓名" {...formItemLayout}>
          {
            userInfo && type === 'detail' ? userInfo.userName :
              getFieldDecorator('userName', {
                initialValue: userInfo.userName,
                rules: [
                  {
                    required: true,
                    message: '请输入用户姓名'
                  },
                  {
                    min: 3,
                    message: '姓名至少为3个字符'
                  },
                  {
                    max: 16,
                    message: '姓名最多为16个字符'
                  },
                  {
                    whitespace: true,
                    message: '姓名中不能有空格'
                  }
                ]
              })(
                <Input type="text" placeholder="请输入用户姓名"/>
              )
          }
        </FormItem>
        <FormItem label="部门" {...formItemLayout}>
          {
            userInfo && type === 'detail' ? userInfo.userDept :
              getFieldDecorator('userDept', {
                initialValue: userInfo.userDept,
                rules: [
                  {
                    required: true,
                    message: '请输入部门'
                  }
                ]
              })(
                <Input type="text" placeholder="请输入部门"/>
              )
          }
        </FormItem>
        <FormItem label="性别" {...formItemLayout}>
          {
            userInfo && type === 'detail' ? this.getSex(userInfo.sex) :
              getFieldDecorator('sex', {
                initialValue: userInfo.sex,
                rules: [
                  {
                    required: true,
                    message: '请输入性别'
                  }
                ]
              })(
                // <RadioGroup>
                //   <Radio value={0} checked="checked">女</Radio>
                //   <Radio value={1}>男</Radio>
                // </RadioGroup>
                <Select 
                placeholder="请选择"
                 >
                  <Option value={0}>女</Option>
                  <Option value={1}>男</Option>
                </Select>
              )
          }
        </FormItem>
        <FormItem label="用户类别" {...formItemLayout}>
          {
            userInfo && type === 'detail' ? this.getUserType(userInfo.usertype) :
              getFieldDecorator('usertype', {
                initialValue: userInfo.usertype,
                rules: [
                  {
                    required: true,
                    message: '请输入用户類別'
                  }
                ]
              })(
                <Select 
                placeholder="请选择"
                 >
                  <Option value={0}>业务员</Option>
                  <Option value={2}>业务主管</Option>
                  <Option value={1}>管理员</Option>
                </Select>
              )
          }
        </FormItem>
        <FormItem label="所属公司" {...formItemLayout}>
          {
            userInfo && type === 'detail' ? this.getCorps(userInfo.corpId) :
              getFieldDecorator('corpId', {
                initialValue: userInfo.corpId,
                rules: [
                  {
                    required: true,
                    message: '请输入所屬公司'
                  }
                ]
              })(
                <Select
                // mode="multiple"         //多选模式
                placeholder="请选择"
                filterOption={false}    //关闭自动筛选
                // onSearch={this.handleSearch} 
                >
                {
                    corpCodeList.map((corpitem, index) => (
                        <Option key={index} value={corpitem.id}>{corpitem.companyEncode}</Option>
                    ))
                }
                </Select>
              )
          }
        </FormItem>
        <FormItem label="状态" {...formItemLayout}>
          {
            userInfo && type === 'detail' ? this.getStatus(userInfo.status) :
              getFieldDecorator('status', {
                initialValue: 1
              })(
                <Select disabled>
                  <Option value={0}>禁用</Option>
                  <Option value={1}>启用</Option>
                </Select>
              )
          }
        </FormItem>
        <FormItem label="邮箱" {...formItemLayout}>
          {
            userInfo && type === 'detail' ? userInfo.email :
              getFieldDecorator('email', {
                initialValue: userInfo.email,
                rules: [
                  {
                    type: 'email',
                    message: '请输入正确的邮箱地址'
                  },
                  {
                    required: true,
                    message: '请填写邮箱地址'
                  }
                ]
              })(
                <Input type="text" placeholder="请输入邮箱地址"/>
              )
          }
        </FormItem>
        <FormItem label="联系电话" {...formItemLayout}>
          {
            userInfo && type === 'detail' ? userInfo.mobile :
              getFieldDecorator('mobile', {
                initialValue: userInfo.mobile,
                rules: [
                  this.state.macaomobile === true ? {
                    len: 8,
                    // pattern: /^[1][3,4,5,7,8][0-9]{9}$/,"^(5|6|8|9)\\d{7}$"
                    // pattern: /^[5,6,8,9]{8}$/,
                    pattern:"^(5|6|8|9)\\d{7}$",
                    required: true,
                    message: '请输入正确的8位澳门联系电话'
                  } : {
                    len: 11,
                    pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
                    // pattern: /^[5,6,8,9]{8}$/,
                    // pattern:"^(5|6|8|9)\\d{7}$",
                    required: true,
                    message: '请输入正确的11位内地联系电话'
                  } 
                ]
              })(
                <Input addonBefore={prefixSelector}/>
              )
          }
        </FormItem>
      </Form>
    );
  }
}

UserForm = Form.create({})(UserForm);