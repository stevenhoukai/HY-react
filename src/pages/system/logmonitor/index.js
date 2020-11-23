import React from 'react';
import {Card, Button, Modal, Form, Input, Select, message,Tooltip} from "antd";
import Utils from '../../../utils/utils';
import ETable from '../../../components/ETable';
import BaseForm from '../../../components/BaseForm';
import {reqLogs,reqAddOrUpdateUser,reqDeleteUser,reqAllCorps,reqResetPwd,reqUsertest} from '../../../api/index'
import { formateDateTime} from '../../../utils/dateUtils'
import memoryUtils from '../../../utils/memoryUtils'
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
const dateFormat = 'YYYY-MM-DD';

export default class LogMonitor extends React.Component {

  params = {
    page: 1,
    logModule:"",
    handleType:"",
    handleUser:"",
    handleBeginDate:moment().valueOf(),
    handleEndDate:moment().subtract('-1','month').valueOf(),
  };

  state = {
    isVisible: false,
  };

  formList = [
    {
      type: 'SELECT',
      label: '日志模块',
      field: 'logModule',
      placeholder: '请选择日志模块',
      width: 160,
      list: [
        {id:'0',name:'币种'},
        {id:'1',name:'业务种类'},
        {id:'2',name:'公司档案信息'},
        {id:'3',name:'公司协议档案信息'},
        {id:'4',name:'公司客户档案信息'},
        {id:'5',name:'模板格式字段档案'},
        {id:'6',name:'Txt模板管理'},
        {id:'7',name:'Excel模板管理'},
        {id:'8',name:'Pdf模板管理'},
        {id:'9',name:'客户文件导入'},
        {id:'10',name:'代发薪资'},
        {id:'11',name:'用户管理'},
        {id:'12',name:'权限管理'},
        {id:'13',name:'定时任务管理'},
        {id:'14',name:'接口配置管理'},
        // '0': '基础档案',
        // '1': '模板管理',
        // '2': '代收代付',
        // '3': '代发薪资',
        // '4': '系统设置',
        // {id:'0',name:'基础档案'},
        // {id:'1',name:'模板管理'},
        // {id:'2',name:'代收代付'},
        // {id:'3',name:'代发薪资'},
        // {id:'4',name:'系统设置'},
      ]
    },
    {
      type: 'SELECT',
      label: '操作类型',
      field: 'handleType',
      placeholder: '请输入操作类型',
      width: 80,
      list: [
        {id:'0',name:'新增'},
        {id:'1',name:'修改'},
        {id:'2',name:'删除'},
      ]
    }, 
    {
      type: 'INPUT',
      label: '操作用户',
      field: 'handleUser',
      placeholder: '请输入操作用户',
      width: 140,
    }, 
    {
      type: '时间查询',
      label1: '操作日期',
      label2: '~',
      field1: 'handleBeginDate',
      field2: 'handleEndDate',
      placeholder1: '请输入操作开始时间',
      placeholder2: '请输入操作截止时间',
    }
  ];

  componentDidMount() {
    // this.requestList();
  }

  // 处理表单查询
  handleFilter = (params) => {
    console.log(params);
    this.params = params; // 从子组件传来的值赋值给 params
    this.params.page = 1;
    this.requestList();
  };


  requestList = async () => {

    // page: 1,
    // logModule:"",
    // handleType:"",
    // handleUser:"",
    // handleBeginDate:"",
    // handleEndDate:"",
    // console.log(this.params);
    let begintime = this.params.handleBeginDate;
    let endtime = this.params.handleEndDate;

    console.log(begintime);
    console.log(endtime);
    if(begintime === null || endtime === null){
      Modal.info({
        title: "提示",
        content: "操作开始时间和结束时间不能为空"
      });
      return;
    }
    if(begintime > endtime){
      Modal.info({
        title: "提示",
        content: "操作结束时间不能早于开始时间"
      });
      return;
    }
    if((this.params.handleEndDate - this.params.handleBeginDate)/(3600000*24) > 31){
      Modal.info({
        title: "提示",
        content: "查询周期不能大于31天"
      });
      return;
    }


    const retdata = await reqLogs(this.params.page,this.params.logModule,this.params.handleType,this.params.handleUser,
      this.params.handleBeginDate.valueOf(),this.params.handleEndDate.valueOf())
    
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


  // 功能区操作
  handleOperate = async(type) => {


    console.log(type)
    if(type === 'exportExcel'){
      console.log(this.params);
      console.log(this.params);

      // location.href="/system/log/exportexcel"
      
      // let begintime = this.params.handleBeginDate;
      // let endtime = this.params.handleEndDate;
  
      // console.log(begintime);
      // console.log(endtime);
      // if(begintime === null || endtime === null){
      //   Modal.info({
      //     title: "提示",
      //     content: "请先查询出数据后再进行导出"
      //   });
      //   return;
      // }
      // this.exportEXCELFile(this.params)
      // Modal.info({
      //         title: '提示',
      //         content: '导出功能还未完成'
      //       });
      let loading = document.getElementById('ajaxLoading');
      loading.style.display = 'block';
      this.exportEXCELFile(this.params).then(
         (response) => {
          response.blob().then(blob => {
            //  var enc = new TextDecoder('utf-8') ;
            //  console.log(0,enc.decode(new Uint8Array(blob)));
            //  console.log(1,blob);
              let blobUrl = window.URL.createObjectURL(blob);
              let a = document.getElementById('a_id');
              let filename = '日志管理.xls';
              a.href = blobUrl;
              a.download = filename;
              a.click();
              window.URL.revokeObjectURL(blobUrl);
              loading.style.display = 'none';
          });
          }).catch((error) => {
                loading.style.display = 'none';
          });
      // this.exportEXCELFile(this.params)
      // .then(
      //     (res) => {
      //       const contentType = res.headers.get("Content-Type");
      //       console.log(contentType);
      //     // 根据返回contentType，处理是json，还是下载文件
      //     if (contentType.toLowerCase() == "application/json;charset=utf-8") {
      //         res.json().then(data => {
      //         alert(data.code);
      //     });
      //     } else if (contentType.toLowerCase() == "application/x-download;charset=utf-8") {
      //     // do export code here
      //     // res.blob().then(blob => {
      //     // // 创建一个a标签，用于下载
      //     // var a = document.createElement('a');
      //     // var url = window.URL.createObjectURL(blob);
      //     // var fileName = '被下载的文件.txt';
      //     // a.href = url;
      //     // a.download = fileName;
      //     // a.click();
      //     // window.URL.revokeObjectURL(url);
      //     // });
      //     // 如果代码能够执行到这里，说明后端给的是一个流文件，再执行上面导出的代码
      //     alert('download file');
      //     }
      //   }
      // ).catch((error) => {
      //             loading.style.display = 'none';
      // });
    }
  };

  exportEXCELFile = (params) => fetch(
    '/system/log/exportexcel', {
        method: 'POST',
        body: JSON.stringify({ 
          logModule : this.params.logModule,
          handleType : this.params.handleType,
          handleUser : this.params.handleUser,
          handleBeginDate : this.params.handleBeginDate.valueOf(),
          handleEndDate : this.params.handleEndDate.valueOf()
        }),
        credentials: 'include',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': "Bearer "+memoryUtils.user.token,
            'UserInfo': memoryUtils.user.usercode + "&" + memoryUtils.user.userName + "&" + memoryUtils.user.corpCode
        })
    });//导出EXCEL模板

  

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
        title: '序号',
        dataIndex: 'logId'
      }, 
      {
        title: '操作时间',
        dataIndex: 'handleTime',
        render:formateDateTime
      },
      {
        title: '模块名称',
        dataIndex: 'moduleName',
        render(status) {
          let config = {
            0 : '币种',
            1 : '业务种类',
            2 : '公司档案信息',
            3 : '公司协议档案信息',
            4 : '公司客户档案信息',
            5 : '模板格式字段档案',
            6 : 'Txt模板管理',
            7 : 'Excel模板管理',
            8 : 'Pdf模板管理',
            9 : '客户文件导入',
            10 : '代发薪资',
            11 : '用户管理',
            12 : '权限管理',
            13 : '定时任务管理',
            14 : '接口配置管理',
          };
          return config[status];
        }
      }, 
      {
        title: '操作用户编码',
        dataIndex: 'handleUsercode'
      },
      {
        title: '操作用户名称',
        dataIndex: 'handleUsername'
      },
      {
        title: '操作类型',
        dataIndex: 'handleType',
        render(status) {
          let config = {
            0 : '新增',
            1 : '修改',
            2 : '删除',
          };
          return config[status];
        }
      },
      {
        title: '操作对象',
        dataIndex: 'handleObject'
      },
      {
        title: '操作备注',
        dataIndex: 'handleMemo',

        onCell: () => {
          return {
            style: {
              maxWidth: 400,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow:'ellipsis',
              cursor:'pointer'
            }
          }
        },
      //   render(status) {
      //     let contentStr;
      //     let br=<br></br>;
      //     let result=null;
      //     contentStr=status.toString().split(",");
      //     if(contentStr.length<2){
      //      return status;
      //     }
      //     for(let j=0;j<contentStr.length;j++){
      //       if(j==0){
      //         result=contentStr[j];
      //       }else{
      //         result=<span>{result}{br}{contentStr[j]}</span>;
      //      }
      //     }
      //   return <div>{result}</div>;
      // }
      render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
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
          <Button type="primary" icon="download" onClick={() => this.handleOperate('exportExcel')}>导出日志</Button>
          {/* <Button type="primary" icon="edit" onClick={() => this.handleOperate('edit')}>编辑用户</Button>
          <Button type="primary" icon="edit" onClick={() => this.handleOperate('reset')}>重置密码</Button>
          <Button type="danger" icon="delete" onClick={() => this.handleOperate('delete')}>删除用户</Button> */}
          {/* <Button type="danger" icon="delete" onClick={() => this.test()}>测试员工</Button> */}
        </Card>
        <a id='a_id'></a>
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
        
      </div>
    );
  }
}
