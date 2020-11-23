import React from 'react';
import { Card, Button, Modal, Form, Input, Radio, TextArea, Select, DatePicker, message } from "antd";
import Utils from './../../../utils/utils';
import ETable from './../../../components/ETable';
import BaseForm from './../../../components/BaseForm';
import {getConfigurationList, deleteConfiguration, updateConfiguration} from './../../../api/index'
import {  formateDateTime } from '../../../utils/dateUtils'
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;

export default class InterfaceConfiguration extends React.Component {

  params = {
    page: 1
  };

  state = {
    isVisible: false
  };

  formList = [
    {
      type: 'INPUT',
      label: '配置编码',
      field: 'configCode',
      placeholder: '请输入配置编号',
      width: 130,
    },
    {
      type: 'INPUT',
      label: '配置名称',
      field: 'configName',
      placeholder: '请输入配置名称',
      width: 130,
    }
  ];

  componentDidMount() {
    this.requestList();
  }

  // 处理表单查询
  handleFilter = (params) => {
    this.params = params; // 从子组件传来的值赋值给 params
    this.requestList();
  };

  requestList = async () => {
    let params = this.params;
    let urlParams = '';
    if (this.params){
      urlParams = Object.keys(params).map(function (key) {
        return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
      }).join("&");
    }
    const ret = await getConfigurationList(urlParams)
    if (ret.code === 20000) {
      const list = ret.result.item_list;
      this.setState({
        list,
        pagination: Utils.pagination(ret, (current) => {
          this.params.page = current;
          this.requestList();
        }),
        selectedRowKeys:'',
        selectedItem:''
      });
    } else {
      Modal.info({
        title: "提示",
        content: ret.msg
      });
    }
    //关闭loading画面
    // loading = document.getElementById('ajaxLoading');
    // loading.style.display = 'none';
  };

  // 功能区操作
  handleOperate = (type) => {
    
    let out_this = this;
    let operate = {
      'create':(item)=>{
        this.setState({
          type,
          isVisible: true,
          title: '新增'
        });
      },
      'edit':(item)=>{
        if (!item) {
          Modal.info({
            title: '提示',
            content: '请选择一条记录'
          });
          return;
        }
        this.setState({
          type,
          isVisible: true,
          title: '编辑',
          configurationInfo: item
        });
      },
      'detail':(item)=>{
        if (!item) {
          Modal.info({
            title: '提示',
            content: '请选择一条记录'
          });
          return;
        }
  
        this.setState({
          type,
          isVisible: true,
          title: '详情',
          configurationInfo: item
        });
      },
      'delete':(item)=>{
        if (!item) {
          Modal.info({
            title: '提示',
            content: '请选择一条记录'
          });
          return;
        }
        let _this = out_this;
        Modal.confirm({
          title: '确认删除',
          content: '是否要删除当前选中的记录，序号为:' + item.id,
          async onOk() {
            const retdata = await deleteConfiguration({id:item.id});
            if (retdata.code === 20000) {
                _this.setState({
                isVisible: false,
                });
                _this.requestList();
            }else {
              Modal.info({
                title: '提示',
                content: retdata.msg
              });
            }
          }
        });
      }
    };
    
    return operate[type](this.state.selectedItem);
  };


  handleSubmitNew =  (e) => {
    e.preventDefault()

    this.configurationForm.props.form.validateFields(async (err,values)=>{
      
      if(!err){
        let type = this.state.type;
        let data = this.configurationForm.props.form.getFieldsValue();
      
        const retdata = await updateConfiguration(type, data);
        if (retdata.code === 20000) {
            this.configurationForm.props.form.resetFields();
            this.setState({
              isVisible: false,
              // selectedRowKeys:'' // 查询完后,单选框失去焦点
            });
            Modal.info({
              title: "提示",
              content: retdata.msg
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

  render() {
    const columns = [
      {
        title: '序号',
        dataIndex: 'id'
      },
      {
        title: '配置编码',
        dataIndex: 'configCode'
      },
      {
        title: '配置名称',
        dataIndex: 'configName'
      },
      {
        title: '接口地址',
        dataIndex: 'url'
      },
      {
        title: '是否需要账户密码',
        dataIndex: 'userinfoRequired',
        render:(value)=>{
          return value === "1" ? '是':'否'
        }
      },
      {
        title: '用户名',
        dataIndex: 'username',
      },
      {
        title: '密码',
        dataIndex: 'password',
        render:()=>{
          return '***';
        }
      },
      {
        title: '备注',
        dataIndex: 'remark'
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
          <BaseForm formList={this.formList} filterSubmit={this.handleFilter} />
        </Card>
        <Card style={{ marginTop: 10 }} className="operate-wrap">
          <Button type="primary" icon="plus" onClick={() => this.handleOperate('create')}>创建</Button>
          <Button type="primary" icon="edit" onClick={() => this.handleOperate('edit')}>编辑</Button>
          <Button type="primary" icon="file-search" onClick={() => this.handleOperate('detail')}>详情</Button>
          <Button type="danger" icon="delete" onClick={() => this.handleOperate('delete')}>删除</Button>
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
            this.configurationForm.props.form.resetFields();
            this.setState({
              isVisible: false,
              configurationInfo: ''
            });
          }}
          width={600}
          {...footer}
        >
          <ConfigurationForm type={this.state.type} configurationInfo={this.state.configurationInfo}
            wrappedComponentRef={(inst) => this.configurationForm = inst} />
        </Modal>
      </div>
    );
  }
}

class ConfigurationForm extends React.Component {
  userinfoRequiredValue = (value)=>{
    return value === '1' ? '是' : '否'
  }
  render() {
    let type = this.props.type;
    let configurationInfo = this.props.configurationInfo || {};
    
    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 18
      }
    };

    const { getFieldDecorator } = this.props.form;
    
    return (
      <Form layout="horizontal">
        <FormItem label="" {...formItemLayout}>
          {
              getFieldDecorator('id', {
                initialValue: configurationInfo.id,
              })(
                <Input type="hidden" placeholder="配置Id"/>
              )
          }
        </FormItem>
        <FormItem label="配置编码" {...formItemLayout} >
        {
          configurationInfo && type==="detail" ? configurationInfo.configCode :
            getFieldDecorator('configCode', {
              initialValue: configurationInfo.configCode, 
            })(
              <Input placeholder="配置编码"/>
            )
        }
        </FormItem>
        <FormItem label="配置名称" {...formItemLayout} >
        {
          configurationInfo && type==="detail" ? configurationInfo.configName :
            getFieldDecorator('configName', {
              initialValue: configurationInfo.configName,
            })(
              <Input placeholder="配置名称"/>
            )
        }
        </FormItem>
        <FormItem label="接口地址" {...formItemLayout} >
        {
          configurationInfo && type==="detail" ? configurationInfo.url :
            getFieldDecorator('url', {
              initialValue: configurationInfo.url,
            })(
              <Input placeholder="接口地址"/>
            )
        }
        </FormItem> 
        <FormItem label="是否需要账户密码" {...formItemLayout}>
          {
            configurationInfo && type==="detail" ? this.userinfoRequiredValue(configurationInfo.userinfoRequired) :
              getFieldDecorator('userinfoRequired', {
                initialValue: configurationInfo.userinfoRequired
              })(
                <Select>
                  <Option value={'0'}>否</Option>
                  <Option value={'1'}>是</Option>
                </Select>
              )
          }
        </FormItem>
        <FormItem label="用户名" {...formItemLayout}>
        {
            configurationInfo && type==="detail" ? configurationInfo.username :
            getFieldDecorator('username', {
              initialValue: configurationInfo.username,
            })(
              <Input placeholder="用户名"/>
            )
        }
        </FormItem>
        <FormItem label="密&nbsp;&nbsp;&nbsp;&nbsp;码" {...formItemLayout}>
        {
          configurationInfo && type==="detail" ? configurationInfo.password :
            getFieldDecorator('password', {
              initialValue: configurationInfo.password,
            })(
              <Input.Password placeholder="密码"/>
            )
        }
        </FormItem>
        <FormItem label="备&nbsp;&nbsp;&nbsp;&nbsp;注" {...formItemLayout}>
        {
          configurationInfo && type==="detail" ? configurationInfo.remark :
            getFieldDecorator('remark', {
              initialValue: configurationInfo.remark,
            })(
              <Input.TextArea placeholder="备注"/>
            )
        }
        </FormItem>
      </Form>
    );
  }
}

ConfigurationForm = Form.create({})(ConfigurationForm);