// src/pages/permission/index.js
import React from "react";
import { Card, Button, Form, Modal, Input, Select, Tree, Transfer } from "antd";
import ETable from "../../../components/ETable";
import Utils from "../../../utils/utils";
import axios from "../../../axios";
import menuConfig from "../../../config/menuConfig";
import {reqRoles,reqAddOrUpdateRole,reqRolePermission,reqRoleUserList,reqUserPermission} from '../../../api/index'

const FormItem = Form.Item;
const Option = Select.Option;
const { TreeNode } = Tree;
// 或 const TreeNode = Tree.TreeNode

export default class PermissionUser extends React.Component {

  params = {
    page: 1,
    roleCode:"",
    roleName:""
  };

  state = {
    isRoleVisible: false
  };

  componentWillMount() {
    // 通过生命周期函数加载接口
    // axios.requestList(this, "/role/list", {}, true);
    this.requestList();
  }
让
  // requestList = () => {
  //   axios.requestList(this, "/role/list", {}, true);
  // };

  requestList = async () => {
    // let loading = document.getElementById('ajaxLoading');
    // loading.style.display = 'block';

    const retdata = await reqRoles(this.params.page,this.params.roleCode,this.params.roleName)
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
    //关闭loading画面
    // loading = document.getElementById('ajaxLoading');
    // loading.style.display = 'none';
  };




  // 打开创建角色弹框
  handleRole = () => {
    this.setState({
      isRoleVisible: true
    });
  };

  // 角色提交保存
  handleRoleSubmit = (e) => {
    // const data = this.roleForm.props.form.getFieldsValue();
    // console.log(data);
    e.preventDefault()
    this.roleForm.props.form.validateFields(async (err,values)=>{
      if(!err){
        // let type = "this.state.type";
        let type = "add";
        let data = this.roleForm.props.form.getFieldsValue();
        //另外一种实现
        //开启loading画面
        // let loading = document.getElementById('ajaxLoading');
        // loading.style.display = 'block';
        const retdata = await reqAddOrUpdateRole(type,data);
        if (retdata.code === 20000) {
            this.roleForm.props.form.resetFields();
            this.setState({
              isRoleVisible: false,
              selectedRowKeys:'' // 查询完后,单选框失去焦点
            });
            this.requestList();
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
    // axios
    //   .ajax({
    //     url: "/role/create", // //Easy Mock中只有｛"code": 0｝
    //     data: {
    //       params: data
    //     }
    //   })
    //   .then(res => {
    //     if (res.code == 0) {
    //       this.setState({
    //         isRoleVisible: false //关闭弹框
    //       });
    //       this.roleForm.props.form.resetFields(); // 调用表单重置(清空表单数据)
    //       this.requestList(); //刷新列表数据
    //     }
    //   });
  };

  // 权限设置
  handlePermission = () => {
    let item = this.state.selectedItem; //取出当前选中的项
    if (!item) {
      Modal.info({
        title: "温馨提示",
        content: "请选择一个角色"
      });
      return;
    }
    this.setState({
      isPermVisible: true,
      detailInfo: item,
      menuInfo: item.menus
    });
  };

  handlePermEditSubmit = async () => {
    // 获取表单的值 ,添加wrappedComponentRef属性
    let data = this.permForm.props.form.getFieldsValue();
    // data.roleId = this.state.selectedItem.roleId; // 将角色id传回
    data.menus = this.state.menuInfo; // 需要将menus数据  传到接口

    //使用统一封装
    // let loading = document.getElementById('ajaxLoading');
    // loading.style.display = 'block';
    const retdata = await reqRolePermission(data.roleId,data.menus);
    if (retdata.code === 20000) {
        this.setState({
          isPermVisible: false,
          selectedRowKeys:'' // 查询完后,单选框失去焦点
        });
        this.requestList();
        Modal.info({
          title: "提示",
          content: "操作成功"
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

    // 将数据传入接口
    // axios
    //   .ajax({
    //     url: "/permission/edit",
    //     data: {
    //       params: {
    //         ...data
    //       }
    //     }
    //   })
    //   .then(res => {
    //     if (res) {
    //       // 提交成功,   1. 关闭页面, 2. 重新请求数据
    //       this.setState({
    //         isPermVisible: false
    //       });
    //       this.requestList(); //刷新列表数据
    //     }
    //   });
  };

  // 用户授权
  handleUserAuth = () => {
    let item = this.state.selectedItem;
    if (!item) {
      Modal.info({
        title: "温馨提示",
        content: "请选择一个角色"
      });
      return;
    }

    this.setState({
      isUserVisible: true,
      detailInfo: item
    });
    // 获取目标数据
    this.getRoleUserList(item.roleId);
  };

  // 获取用户角色列表
  getRoleUserList = async (roleId) => {
    // id: 角色id , 获取角色id
    // axios
    //   .ajax({
    //     url: "/role/user_list",
    //     data: {
    //       params: {
    //         id
    //       }
    //     }
    //   })
    //   .then(res => {
    //     if (res) {
    //       //请求成功,筛选目标用户
    //       this.getAuthUserList(res.result);
    //     }
    //   });
    // let loading = document.getElementById('ajaxLoading');
    // loading.style.display = 'block';
    const retdata = await reqRoleUserList(roleId);
    if (retdata.code === 20000) {
          //请求role_user的list成功,筛选目标用户
          this.getAuthUserList(retdata.result.item_list);
    }else{
      Modal.info({
      title: "提示",
      content: retdata.msg
    });
    }
    //关闭loading画面
    // loading = document.getElementById('ajaxLoading');
    // loading.style.display = 'none';
  };

  // 筛选目标用户
  getAuthUserList = dataSource => {
    // 将数据(目标用户,全量用户)进行过滤的方法
    const mockData = [];
    const targetKeys = [];
    if (dataSource && dataSource.length > 0) {
      // 有数据
      for (let i = 0; i < dataSource.length; i++) {
        const data = {
          key: dataSource[i].userId,
          title: dataSource[i].userCode,
          status: dataSource[i].rolestatus
        };

        if (data.status == 1) {
          // 如果status是1 说明是目标用户,加到targetKeys数组
          targetKeys.push(data.key);
        }
        // 否则 说明是全量数据, 加入全量数组列表
        mockData.push(data);
      }
      // 将全量数据,目标数据存入setState
      this.setState({
        mockData,
        targetKeys
      });
    }
  };

  // 用户授权提交
  handleUserSubmit = async () => {
    let data = {};
    data.user_ids = this.state.targetKeys;
    data.roleId = this.state.selectedItem.roleId;
    // axios.ajax({
    //   url:'/role/user_role_edit',
    //   data:{
    //     params:{// 等同于{user_id:data.user_ids,  role_id:data.role_id}
    //       ...data 
    //     }
    //   }
    // }).then((res)=>{
    //   if(res){
    //     this.setState({
    //       isUserVisible:false
    //     });
    //     this.requestList();
    //   }
    // })
    const retdata = await reqUserPermission(data.user_ids,data.roleId);
    if (retdata.code === 20000) {
        this.setState({
          isUserVisible: false,
          selectedRowKeys:'' // 查询完后,单选框失去焦点
        });
        this.requestList();
        Modal.info({
          title: "提示",
          content: "用户授权成功"
        });
    }else{
      Modal.info({
      title: "提示",
      content: retdata.msg
    });
    }
  };

  render() {
    const columns = [
      {
        title: "角色ID",
        dataIndex: "roleId"
      },
      {
        title: "角色编码",
        dataIndex: "roleCode"
      },
      {
        title: "角色名称",
        dataIndex: "roleName"
      },
      {
        title: "创建时间",
        dataIndex: "createTime",
        render: Utils.formateDate
      },
      {
        title: "更新时间",
        dataIndex: "updateTime",
        render: Utils.formateDate
      },
      // {
      //   title: "角色状态",
      //   dataIndex: "status",
      //   render(status) {
      //     return status == 1 ? "停用" : "启用";
      //   }
      // },
      {
        title: "授权时间",
        dataIndex: "authTime",
        render: Utils.formateDate
      },
      {
        title: "授权人编码",
        dataIndex: "authUserCode"
      }
    ];
    return (
      <div>
        <Card>
          <Button type="primary" onClick={this.handleRole}>
            创建角色
          </Button>
          <Button
            type="primary"
            style={{ marginLeft: 10, marginRight: 10 }}
            onClick={this.handlePermission}
          >
            设置权限
          </Button>
          <Button type="primary" onClick={this.handleUserAuth}>
            用户授权
          </Button>
        </Card>
        <div className="content-wrap">
          <ETable
            dataSource={this.state.list}
            columns={columns}
            updateSelectedItem={Utils.updateSelectedItem.bind(this)}
            selectedRowKeys={this.state.selectedRowKeys}
            selectedItem={this.state.selectedItem}
            pagination={this.state.pagination}
          />
        </div>
        <Modal
          title="创建角色"
          visible={this.state.isRoleVisible}
          onOk={this.handleRoleSubmit}
          onCancel={() => {
            this.roleForm.props.form.resetFields(); // 表单重置
            this.setState({
              isRoleVisible: false
            });
          }}
        >
          <RoleForm
            wrappedComponentRef={inst => {
              this.roleForm = inst;
            }}
          />
        </Modal>
        <Modal
          title="设置权限"
          visible={this.state.isPermVisible}
          width={600}
          onOk={this.handlePermEditSubmit}
          onCancel={() => {
            this.setState({
              isPermVisible: false
            });
          }}
        >
          <PermEditForm
            wrappedComponentRef={inst => {
              this.permForm = inst;
            }}
            detailInfo={this.state.detailInfo}
            menuInfo={this.state.menuInfo}
            patchMenuInfo={checkedKeys => {
              this.setState({
                menuInfo: checkedKeys
              });
            }}
          />
        </Modal>
        <Modal
          title="用户授权"
          visible={this.state.isUserVisible}
          width={800}
          onOk={this.handleUserSubmit}
          onCancel={() => {
            this.setState({
              isUserVisible: false
            });
          }}
        >
          <RoleAuthForm
            wrappedComponentRef={inst => {
              this.userAuthForm = inst;
            }}
            detailInfo={this.state.detailInfo}
            targetKeys={this.state.targetKeys}
            mockData={this.state.mockData}
            patchUserInfo={(targetKeys)=>{
              this.setState({ targetKeys });
            }}
          />
        </Modal>
      </div>
    );
  }
}

// 子组件一-------角色绑定
class RoleForm extends React.Component {
  render() {
    const formItemLayout = {
      labelCol: {
        span: 5
      },
      wrapperCol: {
        span: 19
      }
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="horizontal">
        <FormItem label="角色编码" {...formItemLayout}>
          {getFieldDecorator("roleCode",{
            rules: [
              {
                required: true,
                message: '请输入角色编码'
              },
              {
                min: 3,
                message: '编码至少为3个字符'
              },
              {
                max: 16,
                message: '编码最多为16个字符'
              },
              {
                whitespace: true,
                message: '编码中不能有空格'
              }
            ]
          })(
            <Input type="text" placeholder="请输入角色编码" />
          )}
        </FormItem>
        <FormItem label="角色名称" {...formItemLayout}>
          {getFieldDecorator("roleName")(
            <Input type="text" placeholder="请输入角色名称" />
          )}
        </FormItem>
        <FormItem label="角色状态" {...formItemLayout}>
          {getFieldDecorator("status",{
            initialValue: 0
          })(
            <Select>
              <Option value={0}>启用</Option>
              <Option value={1}>停用</Option>
            </Select>
          )}
        </FormItem>
      </Form>
    );
  }
}

RoleForm = Form.create({})(RoleForm);

// 子组件二---------设置权限
class PermEditForm extends React.Component {
  onCheck = checkedKeys => {
    // 将当前选中的项传回父组件  PermEditForm
    this.props.patchMenuInfo(checkedKeys);
  };

  // 递归渲染权限列表
  /**
   *
   * @param data:menuConfig.js 导入的权限列表
   */
  renderTreeNodes = data => {
    // 判断当前是否有子节点,如果有子节点children继续遍历,直到没有子节点为止
    return data.map(item => {
      if (item.children) {
        // 判断当前是否有子节点
        return (
          <TreeNode title={item.title} key={item.key}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      } else {
        return <TreeNode title={item.title} key={item.key} />;
        // 也可写作
        // return <TreeNode {...item}/>
      }
    });
  };

  render() {
    const formItemLayout = {
      labelCol: {
        span: 5
      },
      wrapperCol: {
        span: 19
      }
    };
    const { getFieldDecorator } = this.props.form;
    const detail_info = this.props.detailInfo;
    const menu_info = this.props.menuInfo;
    // console.log(detail_info);
    return (
      <Form layout="horizontal">
        <FormItem label="" {...formItemLayout}>
          {
              getFieldDecorator('roleId', {
                initialValue: detail_info.roleId,
              })(
                <Input type="hidden" placeholder="角色Id"/>
              )
          }
        </FormItem>
        <FormItem label="角色名称" {...formItemLayout}>
          <Input disabled placeholder={detail_info.roleCode} />
        </FormItem>
        {/* <FormItem label="状态" {...formItemLayout}>
          {getFieldDecorator("status", {
            initialValue: detail_info.status + ""
          })(
            <Select>
              <Option value="0">启用</Option>
              <Option value="1">停用</Option>
            </Select>
          )}
        </FormItem> */}
        <Tree
          checkable
          defaultExpandAll
          onCheck={checkedKeys => {
            // checkedKeys: 当前选中的节点
            this.onCheck(checkedKeys);
          }}
          checkedKeys={menu_info}
        >
          <TreeNode title="平台权限" key="platform_all">
            {this.renderTreeNodes(menuConfig)}
          </TreeNode>
        </Tree>
      </Form>
    );
  }
}

PermEditForm = Form.create({})(PermEditForm);

// 子组件三---------用户授权
class RoleAuthForm extends React.Component {
  filterOption = (inputValue, option) => {
    return option.title.indexOf(inputValue) > -1;
  };

  handleChange = (targetKeys)=>{
    this.props.patchUserInfo(targetKeys);
  };
  render() {
    const formItemLayout = {
      labelCol: {
        span: 5
      },
      wrapperCol: {
        span: 19
      }
    };
    const detail_info = this.props.detailInfo;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="horizontal">
        <FormItem label="" {...formItemLayout}>
          {
              getFieldDecorator('roleId', {
                initialValue: detail_info.roleId,
              })(
                <Input type="hidden" placeholder="角色Id"/>
              )
          }
        </FormItem>
        <FormItem label="角色编码" {...formItemLayout}>
          <Input disabled placeholder={detail_info.roleCode} />
        </FormItem>

        <FormItem label="选择用户" {...formItemLayout}>
          <Transfer
            listStyle={{ width: 250, height: 400 }}
            dataSource={this.props.mockData}
            titles={["待选用户", "已选用户"]}
            showSearch
            searchPlaceholder="输入用户名"
            filterOption={this.filterOption} //过滤选项
            targetKeys={this.props.targetKeys} //目标数据源
            onChange={this.handleChange} //控制目标数据源
            render={item => item.title} //渲染数据
          />
        </FormItem>
      </Form>
    );
  }
}
RoleAuthForm = Form.create({})(RoleAuthForm);
