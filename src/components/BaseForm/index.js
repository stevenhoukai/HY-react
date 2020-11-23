// src/components/BaseForm/index.js
import React from 'react';
import {Input, Select, Form, Button, Checkbox, DatePicker} from "antd";
import moment from 'moment';
import Utils from '../../utils/utils';
import intl from 'react-intl-universal';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const dateFormatSingle = 'YYYY-MM';
const enddate = moment().subtract('-1','month').format(dateFormat);
const begindate = moment().format(dateFormat);

const dailyreportenddate = moment().subtract('-31','day').format(dateFormat);
const dailyreportbegindate = moment().format(dateFormat);

const FormItem = Form.Item;

class FilterForm extends React.Component {

  handleFilterSubmit = () => {
    let fieldsValue = this.props.form.getFieldsValue();// 获取表单的值
    this.props.filterSubmit(fieldsValue); // 将子组件的值传递到父组件(order.js)
  };

  reset = () => {
    this.props.form.resetFields(); // 重置表单的方法
  };

  initFormList = () => {
    const {getFieldDecorator} = this.props.form;
    const formList = this.props.formList; // 从父组件Order.js 中获取该对象进行使用
    const formItemList = [];
    if (formList && formList.length > 0) {
      formList.forEach((item, i) => {
        let label = item.label;
        let field = item.field;
        let label1 = item.label1;
        let label2 = item.label2;
        let field1 = item.field1;
        let field2 = item.field2;
        let initialValue = item.initialValue || ''; //默认给空字符串
        let placeholder = item.placeholder;
        let placeholder1 = item.placeholder1;
        let placeholder2 = item.placeholder2;
        let width = item.width || 150;
        let formStyle = item.style || {};
        

        if (item.type === '时间查询') {
          const begin_time = <FormItem label={label1} key={field1}>
            {
              getFieldDecorator([field1], {
                initialValue: ''
              })(
                <DatePicker 
                placeholder={placeholder1} 
                format={dateFormat} 
                style={{width: width}}
                />
              )
            }
          </FormItem>;
          formItemList.push(begin_time);

          const end_time = <FormItem label={label2} colon={false} key={field2}>
            {
              getFieldDecorator([field2], {
                initialValue: ''
              })(
                <DatePicker 
                placeholder={placeholder2} 
                format={dateFormat} 
                style={{width: width}}
                />
              )
            }
          </FormItem>;
          formItemList.push(end_time);
        } else if (item.type === '报表日期') {
          const begin_time = <FormItem label={label1} key={field1}>
            {
              getFieldDecorator([field1], {
                initialValue: moment(dailyreportbegindate, dateFormat)
              })(
                <DatePicker 
                placeholder={placeholder1} 
                format={dateFormat} />
              )
            }
          </FormItem>;
          formItemList.push(begin_time);

          const end_time = <FormItem label={label2} colon={false} key={field2}>
            {
              getFieldDecorator([field2], {
                initialValue: moment(dailyreportenddate, dateFormat)
              })(
                <DatePicker 
                placeholder={placeholder2} 
                format={dateFormat} />
              )
            }
          </FormItem>;
          formItemList.push(end_time);
        }else if (item.type === '报表日期单') {
          const begin_time = <FormItem label={label} key={field}>
            {
              getFieldDecorator([field], {
                initialValue: moment(dailyreportbegindate, dateFormatSingle)
              })(
                <MonthPicker 
                defaultValue={moment(begindate, dateFormatSingle)} 
                // showTime={true} 
                placeholder={placeholder} 
                format={dateFormatSingle} 
                // picker="month"
                />
              )
            }
          </FormItem>;
          formItemList.push(begin_time);
        }else if (item.type === 'INPUT') {
          // 中括号 [变量]  ,会将其看作变量对待
          formStyle.width = width;
          const INPUT = <FormItem label={label} key={field}>
            {
              getFieldDecorator([field], {
                initialValue: initialValue
              })(
                <Input type='text' style={formStyle} placeholder={placeholder}/>
              )
            }
          </FormItem>;
          formItemList.push(INPUT);
        } else if (item.type === 'SELECT') {
          // 中括号 [变量]  ,会将其看作变量对待
          const SELECT = <FormItem label={label} key={field}>
            {
              getFieldDecorator([field], {
                initialValue: initialValue
              })(
                <Select
                  style={{width: width}}
                  placeholder={placeholder}
                >
                  {Utils.getOptionList(item.list)}
                </Select>
              )
            }
          </FormItem>;
          formItemList.push(SELECT);
        } else if (item.type === 'CHECKBOX') {
          const CHECKBOX = <FormItem label={label} key={field}>
            {
              getFieldDecorator([field], {
                valuePropName: 'checked', // 设置checkbox的属性
                initialValue: initialValue // true | false
              })(
                <Checkbox>
                  {label}
                </Checkbox>
              )
            }
          </FormItem>;
          formItemList.push(CHECKBOX);
        } else if (item.type === 'DATE') {
          const Date = <FormItem label={label} key={field}>
            {
              getFieldDecorator([field])(
                <DatePicker showTime={true} placeholder={placeholder} format="YYYY-MM-DD HH:mm:ss"/>
              )
            }
          </FormItem>;
          formItemList.push(Date);
        } 
      });
    }
    return formItemList;
  };

  render() {
    return (
      <Form layout="inline">
        {this.initFormList()}
        <FormItem>
          <Button type="primary" style={{margin: '0 20px'}} onClick={this.handleFilterSubmit}>{intl.get('commons-query')}</Button>
          <Button onClick={this.reset}>{intl.get('commons-reset')}</Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create({})(FilterForm);

