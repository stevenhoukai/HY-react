import React from 'react';
import {Card, Button, Modal, Form, Input, Select, message,Tooltip} from "antd";
import Utils from '../../../utils/utils';
import ETable from '../../../components/ETable';
import BaseForm from '../../../components/BaseForm';
import {reqSubProtocalReport} from '../../../api/index'
// import {reqProtocalReport} from '../../../api/index'
import memoryUtils from '../../../utils/memoryUtils'
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
const dateFormat = 'YYYY-MM-DD';

export default class ProtocalReport extends React.Component {

  params = {
    page: 1,
    handleBeginDate:moment().valueOf(),
    handleEndDate:moment().subtract('-7','day').valueOf(),
  };

  state = {
    isVisible: false,
  };

  formList = [
    {
      type: '时间查询',
      label1: '生成日期',
      label2: '~',
      field1: 'handleBeginDate',
      field2: 'handleEndDate',
      placeholder1: '请输入生成开始日期',
      placeholder2: '请输入生成截止日期',
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
    if(begintime === null || endtime === null || begintime === '' || endtime === ''){
      Modal.info({
        title: "提示",
        content: "生成开始时间和结束时间不能为空"
      });
      return;
    }
    if(begintime > endtime){
      Modal.info({
        title: "提示",
        content: "生成结束时间不能早于开始时间"
      });
      return;
    }
    const retdata = await reqSubProtocalReport(this.params.page,this.params.handleBeginDate.valueOf()

    ,this.params.handleEndDate.valueOf())
    
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
              let blobUrl = window.URL.createObjectURL(blob);
              let a = document.getElementById('a_id');
              let filename = moment(this.params.handleBeginDate).format(dateFormat) + '-subprotocal.xls';
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

    '/report/subprotocal/exportexcel', {
        method: 'POST',
        body: JSON.stringify({ 
          // logModule : this.params.logModule,
          // handleType : this.params.handleType,
          // handleUser : this.params.handleUser,
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

  

  // handleSubmitNew =  (e) => {
  //   e.preventDefault()
  //   this.userForm.props.form.validateFields(async (err,values)=>{
  //     if(!err){
  //       let type = this.state.type;
  //       let data = this.userForm.props.form.getFieldsValue();
  //       const retdata = await reqAddOrUpdateUser(type,data);
  //       if (retdata.code === 20000) {
  //           message.info(retdata.msg)
  //           this.userForm.props.form.resetFields();
  //           this.setState({
  //             isVisible: false,
  //             userInfo: ''
  //           });
  //           this.requestList();
  //       }else{
  //         Modal.info({
  //         title: "提示",
  //         content: retdata.msg
  //       });
  //       }
  //     }
  //   })
  // };





  // // 创建或更新用户提交
  // handleSubmit = async () => {
  //   let type = this.state.type;
  //   let data = this.userForm.props.form.getFieldsValue();
  //   const retdata = await reqAddOrUpdateUser(type,data);
  //   if (retdata.code === 20000) {
  //       this.userForm.props.form.resetFields();
  //       this.setState({
  //         isVisible: false,
  //         // selectedRowKeys:'' // 查询完后,单选框失去焦点
  //       });
  //       this.requestList();
  //       Modal.info({
  //         title: "提示",
  //         content: "操作成功"
  //       });
  //   }else{
  //     // message(retdata.msg);
  //     Modal.info({
  //     title: "提示",
  //     content: retdata.msg
  //   });
  //   }
  // };

  render() {
    const columns = [      
      
      {
        title: '子協議報表',
        dataIndex: 'maintitle',
        children: [
          {
            title: '公司代碼',
            dataIndex: 'company_code'
          }, 
          {
            title: '合同編號',
            dataIndex: 'trade_code'
          }, 
          {
            title: '賬戶名稱',
            dataIndex: 'account_name'
          }, 
          {
            title: '賬號',
            dataIndex: 'fowa_account',
            width: 200,
          }, 
          {
            title: '子協議',
            dataIndex: 'sub_agreement_number'
          }, 
          {
            title: '主協議',
            dataIndex: 'main_agreement_number'
          }, 
          {
            title: '幣種',
            dataIndex: 'ccy'
          }, 
          {
            title: '交易狀態',
            dataIndex: 'customer_status'
          },
          {
            title: '建立日期',
            dataIndex: 'generate_date',
            render(text) {
              return text.substring(0,10);
            }
          },
          {
            title: '修改日期',
            dataIndex: 'modify_time',
            render(text) {
              return text.substring(0,10);
            }
          }, 
          {
            title: '取消日期',
            dataIndex: 'cancel_date',
            render(text) {
              return text.substring(0,10);
            }
          },
          {
            title: '报表日期',
            dataIndex: 'report_time',
            render(text) {
              return text.substring(0,10);
            }
          }, 
          {
            title: '受益人証件',
            dataIndex: 'beneficiary_id'
          }, 
          {
            title: '參考編號',
            dataIndex: 'reference_code'
          }, 
          {
            title: '參考交易',
            dataIndex: 'reference_transaction'
          }, 
          {
            title: '申請單編號',
            dataIndex: 'bill_number'
          }, 
          {
            title: '摘要',
            dataIndex: 'comments'
          }, 
          {
            title: '產品序號',
            dataIndex: 'product_index'
          }, 
          {
            title: '止付金額',
            dataIndex: 'stop_amount_per'
          }, 
        ]
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
          <Button type="primary" icon="download" onClick={() => this.handleOperate('exportExcel')}>导出报表</Button>
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
