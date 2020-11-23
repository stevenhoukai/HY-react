import React from 'react';
import {Card, Button, Modal, Form, Input, Select, message,Tooltip} from "antd";
import Utils from '../../../utils/utils';
import ETable from '../../../components/ETable';
import BaseForm from '../../../components/BaseForm';
import {reqMonthlySummry} from '../../../api/index'
import {formateDateTime} from '../../../utils/dateUtils'
import memoryUtils from '../../../utils/memoryUtils'
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
const dateFormat = 'YYYY-MM-DD';

export default class MonthlyReport extends React.Component {

  params = {
    page: 1,
    // logModule:"",
    // handleType:"",
    // handleUser:"",
    handleDate:moment().valueOf(),
  };

  state = {
    isVisible: false,
  };

  formList = [
    // {
    //   type: 'SELECT',
    //   label: '日志模块',
    //   field: 'logModule',
    //   placeholder: '请选择日志模块',
    //   width: 160,
    //   list: [
    //     {id:'0',name:'币种'},
    //     {id:'1',name:'业务种类'},
    //     {id:'2',name:'公司档案信息'},
    //     {id:'3',name:'公司协议档案信息'},
    //     {id:'4',name:'公司客户档案信息'},
    //     {id:'5',name:'模板格式字段档案'},
    //     {id:'6',name:'Txt模板管理'},
    //     {id:'7',name:'Excel模板管理'},
    //     {id:'8',name:'Pdf模板管理'},
    //     {id:'9',name:'客户文件导入'},
    //     {id:'10',name:'代发薪资'},
    //     {id:'11',name:'用户管理'},
    //     {id:'12',name:'权限管理'},
    //     {id:'13',name:'定时任务管理'},
    //     {id:'14',name:'接口配置管理'},
    //     // '0': '基础档案',
    //     // '1': '模板管理',
    //     // '2': '代收代付',
    //     // '3': '代发薪资',
    //     // '4': '系统设置',
    //     // {id:'0',name:'基础档案'},
    //     // {id:'1',name:'模板管理'},
    //     // {id:'2',name:'代收代付'},
    //     // {id:'3',name:'代发薪资'},
    //     // {id:'4',name:'系统设置'},
    //   ]
    // },
    // {
    //   type: 'SELECT',
    //   label: '操作类型',
    //   field: 'handleType',
    //   placeholder: '请输入操作类型',
    //   width: 80,
    //   list: [
    //     {id:'0',name:'新增'},
    //     {id:'1',name:'修改'},
    //     {id:'2',name:'删除'},
    //   ]
    // }, 
    // {
    //   type: 'INPUT',
    //   label: '操作用户',
    //   field: 'handleUser',
    //   placeholder: '请输入操作用户',
    //   width: 140,
    // }, 
    {
      type: '报表日期单',
      label: '年月',
      field: 'handleDate',
      placeholder: '请输入日期',
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
    let handledate = this.params.handleDate;

    if(handledate === null || handledate === '' ){
      Modal.info({
        title: "提示",
        content: "日期不能为空"
      });
      return;
    }
    


    const retdata = await reqMonthlySummry(this.params.page,this.params.handleDate.valueOf())
    
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
              let filename = moment(this.params.handleDate).format(dateFormat) + '-monthly.xls';
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
    '/report/monthlysummry/exportexcel', {
        method: 'POST',
        body: JSON.stringify({ 
          // logModule : this.params.logModule,
          // handleType : this.params.handleType,
          // handleUser : this.params.handleUser,
          // handleBeginDate : this.params.handleBeginDate.valueOf(),
          // handleEndDate : this.params.handleEndDate.valueOf()
          handleDate : this.params.handleDate.valueOf()
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
        title: '月报',
        dataIndex: 'maintitle',
        children: [
          {
            title: '扣账日期',
            dataIndex: 'autopay_date'
          }, 
          // {
          //   title: '产品种类',
          //   dataIndex: 'company_txn_type'
          // }, 
          {
            title: '账号',
            dataIndex: 'company_dr_cr_ac'
          }, 
          {
            title: '公司名称',
            dataIndex: 'company_desc',
          }, 
          {
            title: '币种',
            dataIndex: 'txn_ccy'
          }, 
          {
            title: '金额',
            dataIndex: 'txn_amt'
          }, 
          {
            title: '交易笔数',
            dataIndex: 'rec_cnt'
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
