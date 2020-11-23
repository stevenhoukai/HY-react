// src/components/ETable/index.js
import React from 'react'
import {Table} from 'antd'
import  "./index.less"
export default class ETable extends React.Component {

  state = {}
  //处理行点击事件
  onRowClick = (record, index) => {
    let rowSelection = this.props.rowSelection;
    if(rowSelection === 'checkbox'){
      let selectedRowKeys = this.props.selectedRowKeys;
      let selectedIds = this.props.selectedIds;
      let selectedItem = this.props.selectedItem || [];
      if (selectedIds) {
        const i = selectedIds.indexOf(record.id);
        if (i === -1) {//避免重复添加
          selectedIds.push(record.id)
          selectedRowKeys.push(index);
          selectedItem.push(record);
        }else{
          selectedIds.splice(i,1);
          selectedRowKeys.splice(i,1);
          selectedItem.splice(i,1);
        }
      } else {
        selectedIds = [record.id];
        selectedRowKeys = [index]
        selectedItem = [record];
      }
      this.props.updateSelectedItem(selectedRowKeys,selectedItem || {},selectedIds);
    }else{
      let selectKey = [index];
      const selectedRowKeys = this.props.selectedRowKeys;
      if (selectedRowKeys && selectedRowKeys[0] === index){
        return;
      }
      this.props.updateSelectedItem(selectKey,record || {});
    }
  };

  // 选择框变更
  onSelectChange = (selectedRowKeys, selectedRows) => {
    let rowSelection = this.props.rowSelection;
    const selectedIds = [];
    if(rowSelection === 'checkbox'){
      selectedRows.map((item)=>{
        selectedIds.push(item.id);
      });
      this.setState({
        selectedRowKeys,
        selectedIds:selectedIds,
        selectedItem: selectedRows[0]
      });
    }
    this.props.updateSelectedItem(selectedRowKeys,selectedRows[0],selectedIds);
  };

  onSelectAll = (selected, selectedRows, changeRows) => {
    let selectedIds = [];
    let selectKey = [];
    selectedRows.forEach((item,i)=> {
      selectedIds.push(item.id);
      selectKey.push(i);
    });
    this.props.updateSelectedItem(selectKey,selectedRows[0] || {},selectedIds);
  }

  getOptions = () => {
    let p = this.props;
    const name_list = {
      "手机号码":96,
      "用户姓名":70,
      "密码":70,
      "角色ID":64,
      "用户编码":100,
      "用户名称":100,
      "id":40,
      "邮箱":100,
      "状态":80,
      "性别":80,
      "用户类别":100,
      "统一认证号":100,
      "姓名":100,
      "部门":100,
      "序号":60,
      "操作时间":100,
      "模块名称":120,
      "操作用户编码":120,
      "操作用户名称":120,
      "操作类型":100,
      "操作对象":100,
      "操作备注":400,
    };
    if (p.columns && p.columns.length > 0) {
      p.columns.forEach((item)=> {
        //开始/结束 时间
        if(!item.title){
          return
        }
        if(!item.width){
          if(item.title.indexOf("时间") > -1 && item.title.indexOf("持续时间") < 0){
            item.width = 150
          }else if(item.title.indexOf("图片") > -1){
            item.width = 86
          }else if(item.title.indexOf("权限") > -1 || item.title.indexOf("负责城市") > -1){
            item.width = '40%';
            item.className = "text-left";
          }else{
            if(name_list[item.title]){
              item.width = name_list[item.title];
            }
          }
        }
        item.bordered = true;
      });
    }
    const { selectedRowKeys } = this.props;
    const rowSelection = {
      type: 'radio',
      selectedRowKeys,
      onChange: this.onSelectChange,
      onSelect:(record, selected, selectedRows)=>{
        console.log('...')
      },
      onSelectAll:this.onSelectAll
    };
    let row_selection = this.props.rowSelection;
    // 当属性未false或者null时，说明没有单选或者复选列
    if(row_selection===false || row_selection === null){
      row_selection = false;
    }else if(row_selection === 'checkbox'){
      //设置类型未复选框
      rowSelection.type = 'checkbox';
    }else{
      //默认未单选
      row_selection = 'radio';
    }
    return <Table 
      className="card-wrap page-table"
      bordered
      {...this.props}
      rowSelection={row_selection?rowSelection:null}
      onRow={(record,index) => ({
        onClick: ()=>{
          if(!row_selection){
            return;
          }
          this.onRowClick(record,index)
        }
      })}
    />
  };
  render = () => {
    return (
      <div>
        {this.getOptions()}
      </div>
    )
  }
}