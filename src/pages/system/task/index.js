import moment from 'moment';
import React from 'react';
import {Card, Button, Modal, Form, Input, DatePicker, message,Menu,Icon,Dropdown,InputNumber} from "antd";
import Utils from '../../../utils/utils';
import ETable from '../../../components/ETable';
import {reqAddOrUpdateSimpleTask,reqAddOrUpdateCronTask,reqDeleteTask,reqTasks,reqTasksRunning,reqPauseTask,reqResumeTask,reqRunTask} from '../../../api/index'
import {taskformateDateTime} from '../../../utils/dateUtils';
import CronBuilder from  'react-cron-builder';
import 'react-cron-builder/dist/bundle.css';
import './index.less';

const FormItem = Form.Item;


export default class User extends React.Component {


  params = {
    page: 1,
  };

  state = {
    isVisible: false,
    isSimpleVisible: false,
    isCronVisible: false,
    isBuildCronVisible: false
  };

  // formList = [
    // {
    //   type: 'INPUT',
    //   label: '任务编码',
    //   field: 'userCode',
    //   placeholder: '请输入任务编号',
    //   width: 130,
    // },
    // {
    //   type: 'INPUT',
    //   label: '任务名称',
    //   field: 'userName',
    //   placeholder: '请输入任务名称',
    //   width: 130,
    // }, 
    // {
    //   type: 'INPUT',
    //   label: '任务手机号',
    //   field: 'mobile',
    //   placeholder: '请输入任务手机号',
    //   width: 140,
    // }, 
    // {
    //   type: 'DATE',
    //   label: '请选择入职日期',
    //   field: 'user_date',
    //   placeholder: '请输入日期',
    // }
  // ];

  componentDidMount() {
    this.requestList();
  }

  // 处理表单查询
  handleFilter = () => {
    this.params.page = 1;
    this.requestList();
  };

  handleFilterRunning = () => {
    this.params.page = 1;
    this.requestListRunning();
  };
  // requestListByCond = async () => {
  //   //条件查询，根据输入条件进行查询
  //   let loading = document.getElementById('ajaxLoading');
  //   loading.style.display = 'block';
  // }

  requestList = async () => {
    //默认非条件查询,页面打开加载全部数据
    //第三个参数为是否开始loading加载画面,开发过程建议关闭
    //不推荐这种方式，没有封装post
    //axios.requestList(this, '/user/list', this.params, false);

    //另外一种实现方式，缺点是每次都要手工开启和关闭loading画面
    const retdata = await reqTasks(this.params.page)
    if (retdata.code === 20000) {
      const list = retdata.result.item_list
      this.setState({
        list,
        pagination: Utils.pagination(retdata, (current) => {
          this.params.page = current;
          this.requestList();
        }),
        selectedRowKeys:'',
        selectedItem:'' 
      });
    }else{
      // message(retdata.msg);
      Modal.info({
        title: "提示",
        content: retdata.msg
      });
    }
  };


  requestListRunning = async () => {
    //默认非条件查询,页面打开加载全部数据
    //第三个参数为是否开始loading加载画面,开发过程建议关闭
    //不推荐这种方式，没有封装post
    //axios.requestList(this, '/user/list', this.params, false);

    //另外一种实现方式，缺点是每次都要手工开启和关闭loading画面
    const retdata = await reqTasksRunning(this.params.page)
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
      // message(retdata.msg);
      Modal.info({
        title: "提示",
        content: retdata.msg
      });
    }
  };

  // 功能区操作
  handleOperate = async(type) => {
    let item = this.state.selectedItem;
    let out_this = this;
    if (type === 'create') {
      this.setState({
        type,
        isVisible: true,
        title: '创建任务',
      });
    } else if (type === 'edit') {
      if (!item) {
        Modal.info({
          title: '提示',
          content: '请选择一个任务'
        });
        return;
      }
      if(item.triggerType === 'Simple'){
        this.setState({
          type : 'editSimple',
          isVisible: true,
          title: '修改simple任务',
          taskInfo: item
        });
      }else{
        this.setState({
          type : 'editCron',
          isCronVisible: true,
          title: '修改Cron任务',
          taskInfo: item
        });
      }
      
    } else if (type === 'detail') {
      if (!item) {
        Modal.info({
          title: '提示',
          content: '请选择一个任务'
        });
        return;
      }

      this.setState({
        type,
        isVisible: true,
        title: '任务详情',
        taskInfo: item
      });
    } else if (type === 'delete'){
      if (!item) {
        Modal.info({
          title: '提示',
          content: '请选择一个任务'
        });
        return;
      }
      let _this = out_this;
      Modal.confirm({
        title: '确认删除',
        content: '是否要删除当前选中的任务，标示为:' + item.jobGroupName+'&'+item.jobName,
        async onOk() {
          const retdata = await reqDeleteTask(item.jobGroupName,item.jobName);
          if (retdata.code === 20000) {
          _this.setState({
          isVisible: false,
          selectedRowKeys:'' // 点击删除,单选框失去焦点:  空: null ''   参考网址https://blog.csdn.net/oscar999/article/details/9353713
          });
          _this.requestList();
        }
       }
      });
    }else if(type === 'pause'){
      if (!item) {
        Modal.info({
          title: '提示',
          content: '请选择一个任务'
        });
        return;
      }
      let _this = out_this;
      Modal.confirm({
        title: '确认暂停任务',
        content: '是否要暂停当前选中的任务，标示为:' + item.jobName+'&'+item.jobGroupName,
        async onOk() {
          const retdata = await reqPauseTask(item.jobName+'&'+item.jobGroupName);
          if (retdata.code === 20000) {
          _this.setState({
          isVisible: false,
          // selectedRowKeys:'' // 点击删除,单选框失去焦点:  空: null ''   参考网址https://blog.csdn.net/oscar999/article/details/9353713
          });
          _this.requestList();
          message.info(retdata.msg);
        }
       }
      });
      
    }else if(type === 'resume'){
      if (!item) {
        Modal.info({
          title: '提示',
          content: '请选择一个任务'
        });
        return;
      }
      let _this = out_this;
      Modal.confirm({
        title: '确认启动任务',
        content: '是否要启动当前选中的任务，标示为:' + item.jobName+'&'+item.jobGroupName,
        async onOk() {
          const retdata = await reqResumeTask(item.jobName+'&'+item.jobGroupName);
          if (retdata.code === 20000) {
          _this.setState({
          isVisible: false,
          });
          _this.requestList();
          message.info(retdata.msg);
        }
       }
      });
    }else if(type === 'runnow'){
      if (!item) {
        Modal.info({
          title: '提示',
          content: '请选择一个任务'
        });
        return;
      }
      let _this = out_this;
      Modal.confirm({
        title: '确认立即运行任务',
        content: '是否要立即运行当前选中的任务，标示为:' + item.jobName+'&'+item.jobGroupName,
        async onOk() {
          const retdata = await reqRunTask(item.jobName+'&'+item.jobGroupName);
          if (retdata.code === 20000) {
          _this.setState({
          isVisible: false,
          // selectedRowKeys:'' // 点击删除,单选框失去焦点:  空: null ''   参考网址https://blog.csdn.net/oscar999/article/details/9353713
          });
          _this.requestList();
          message.info(retdata.msg);
        }
       }
      });
    }else if(type === 'showCronBuilder'){
      this.setState({
        type : 'CronBuilder',
        isBuildCronVisible: true,
        title: 'Cron表达式生成器',
      });
    }
  };


  

  handleSubmitNew =  (e) => {
    e.preventDefault()
    this.TaskSimpleForm.props.form.validateFields(async (err,values)=>{
      if(!err){
        let type = this.state.type;
        let data = this.TaskSimpleForm.props.form.getFieldsValue();
        const { keys, paramvalues } = values;
        console.log('Received values of form: ', data);
        console.log('Merged values:', keys.map(key => paramvalues[key]));
        console.log(paramvalues);
        data.startTime = data.startTime.format('YYYY-MM-DD HH:mm:ss');
        data.endTime = data.endTime.format('YYYY-MM-DD HH:mm:ss');
        if(data.startTime > data.endTime){
          message.info("任务开始时间必须小于任务结束时间")
          return
        }
        //如果是添加simple任务
        if(type === 'addsimple'){
          const retdata = await reqAddOrUpdateSimpleTask(type,data);
          if (retdata.code === 20000) {
              this.TaskSimpleForm.props.form.resetFields();
              this.setState({
                isVisible: false,
                // selectedRowKeys:'' // 查询完后,单选框失去焦点
              });
              this.requestList();
              message.info(retdata.msg);
          }else{
            Modal.info({
            title: "提示",
            content: retdata.msg
          });
          }
        }else if(type === 'editSimple'){
          const retdata = await reqAddOrUpdateSimpleTask(type,data);
          if (retdata.code === 20000) {
              this.TaskSimpleForm.props.form.resetFields();
              this.setState({
                isVisible: false,
                // selectedRowKeys:'' // 查询完后,单选框失去焦点
              });
              this.requestList();
              message.info(retdata.msg);
          }else{
            Modal.info({
            title: "提示",
            content: retdata.msg
          });
          }
        }
      }
    })
  };


  handleSubmitNewCron =  (e) => {
    e.preventDefault()
    this.TaskCronForm.props.form.validateFields(async (err,values)=>{
      if(!err){
        let type = this.state.type;
        let data = this.TaskCronForm.props.form.getFieldsValue();
        data.startTime = data.startTime.format('YYYY-MM-DD HH:mm:ss');
        data.endTime = data.endTime.format('YYYY-MM-DD HH:mm:ss');
        if(data.startTime > data.endTime){
          message.info("任务开始时间必须小于任务结束时间")
          return
        }
        if(type === 'addcron'){
          const retdata = await reqAddOrUpdateCronTask(type,data);
          if (retdata.code === 20000) {
              this.TaskCronForm.props.form.resetFields();
              this.setState({
                isCronVisible: false,
                // selectedRowKeys:'' // 查询完后,单选框失去焦点
              });
              this.requestList();
              message.info(retdata.msg);
          }else{
            Modal.info({
            title: "提示",
            content: retdata.msg
          });
          }
        }else if(type === 'editCron'){
          const retdata = await reqAddOrUpdateCronTask(type,data);
          if (retdata.code === 20000) {
              this.TaskCronForm.props.form.resetFields();
              this.setState({
                isCronVisible: false,
                // selectedRowKeys:'' // 查询完后,单选框失去焦点
              });
              this.requestList();
              message.info(retdata.msg);
          }else{
            Modal.info({
            title: "提示",
            content: retdata.msg
          });
          }
        }
      }
    })
  };


  handleAddActionMenuClick = (e) => {
    if(e.key === 'addsimple'){
      // console.info(1);
      this.setState({
        type : 'addsimple',
        isVisible: true,
        isSimpleVisible: true,
        title: '创建Simple任务',
      });
    }else if (e.key === 'addcron'){
      // console.info(2);
      this.setState({
        type : 'addcron',
        // isVisible: true,
        isCronVisible: true,
        title: '创建cron任务',
      });
    }
  }

  handleSearchActionMenuClick = (e) => {
    if(e.key === 'searchAll'){
      // console.info(1);
      this.handleFilter()
    }else if (e.key === 'searchRun'){
      // console.info(2);
      this.handleFilterRunning()
    }
  }


  render() {

    const addActionsMenu = (
      <Menu onClick={this.handleAddActionMenuClick}>
        <Menu.Item key="addsimple" >
          <Icon type="plus" />
          Simple任务
        </Menu.Item>
        <Menu.Item key="addcron">
          <Icon type="plus" />
          Cron任务
        </Menu.Item>
      </Menu>
    );

    const searchActionsMenu = (
      <Menu onClick={this.handleSearchActionMenuClick}>
        <Menu.Item key="searchAll" >
          <Icon type="search" />
          全部任务
        </Menu.Item>
        <Menu.Item key="searchRun">
          <Icon type="search" />
          运行中任务
        </Menu.Item>
      </Menu>
    );



    const columns = [
      {
        title: '任务组',
        dataIndex: 'jobGroupName'
      },
      {
        title: '任务名称',
        dataIndex: 'jobName'
      }, 
      {
        title: '任务类型',
        dataIndex: 'triggerType'
      }, 
      {
        title: '任务状态',
        dataIndex: 'jobStatus',
        render(status) {
          let config = {
            'NORMAL': '正常',
            'PAUSED': '暂停',
            'BLOCKED': '阻塞/运行中',
            'COMPLETE':'完成',
            'RUNNING':'运行中',
            'ERROR':'错误'
          };
          return config[status];
        }
      },
      {
        title: '任务描述',
        dataIndex: 'description'
      },
      {
        title: '执行计划',
        dataIndex: 'jobTime'
      }, 
      {
        title: '执行类',
        dataIndex: 'jobClass'
      }, 
      {
        title: '开始时间',
        dataIndex: 'startTime',
        render:taskformateDateTime
      }, 
      {
        title: '结束时间',
        dataIndex: 'endTime',
        render:taskformateDateTime
      }, 
      {
        title: '上一次执行时间',
        dataIndex: 'previousFireTime',
        render:taskformateDateTime
      }, 
      {
        title: '下一次计划执行时间',
        dataIndex: 'nextFireTime',
        render:taskformateDateTime
      }
    ];

    let footer = {};

    if (this.state.type === 'detail') {
      footer = {
        footer: null
      };
    }

    return (
      <div>
        {/* <Card>
          <BaseForm formList={this.formList} filterSubmit={this.handleFilter}/>
        </Card> */}

        <Card style={{marginTop: 10}} className="operate-wrap">
          {/* <Button type="primary" icon="search" onClick={() => this.handleFilter()}>查询全部</Button>
          <Button type="primary" icon="search" onClick={() => this.handleFilterRunning()}>查询正在运行</Button> */}
          <Dropdown overlay={searchActionsMenu}>
          <Button type="primary" icon="search">
             查询任务 <Icon type="down" />
          </Button>
          </Dropdown>
          {/* <Button type="primary" icon="plus" onClick={() => this.handleOperate('create')}>新建任务</Button> */}
          <Dropdown overlay={addActionsMenu}>
          <Button type="primary" icon="plus">
             新建任务 <Icon type="down" />
          </Button>
          </Dropdown>
          <Button type="primary" icon="edit" onClick={() => this.handleOperate('edit')}>修改任务</Button>
          <Button type="primary" icon="search" onClick={() => this.handleOperate('showCronBuilder')}>Cron表达式生成</Button>
          <Button type="primary" icon="pause-circle" onClick={() => this.handleOperate('pause')}>暂停任务</Button>
          <Button type="primary" icon="play-circle" onClick={() => this.handleOperate('resume')}>继续任务</Button>
          <Button type="primary" icon="play-circle" onClick={() => this.handleOperate('runnow')}>立即运行任务</Button>
          <Button type="danger" icon="delete" onClick={() => this.handleOperate('delete')}>删除任务</Button>
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
            this.TaskSimpleForm.props.form.resetFields();
            this.setState({
              isVisible: false,
              isSimpleVisible: false,
              isCronVisible: false,
              taskInfo: ''
            });
          }}
          width={600}
          destroyOnClose
          {...footer}
        >
          <TaskSimpleForm type={this.state.type} taskInfo={this.state.taskInfo} simplev={this.state.isSimpleVisible} cronv={this.state.isCronVisible}
                    wrappedComponentRef={(inst) => this.TaskSimpleForm = inst}/>
        </Modal>
        <Modal
          title={this.state.title}
          visible={this.state.isCronVisible}
          onOk={this.handleSubmitNewCron}
          onCancel={() => {
            this.TaskCronForm.props.form.resetFields();
            this.setState({
              isVisible: false,
              isSimpleVisible: false,
              isCronVisible: false,
              taskInfo: ''
            });
          }}
          width={600}
          destroyOnClose
          {...footer}
        >
          <TaskCronForm type={this.state.type} taskInfo={this.state.taskInfo} simplev={this.state.isSimpleVisible} cronv={this.state.isCronVisible}
                    wrappedComponentRef={(inst) => this.TaskCronForm = inst}/>
        </Modal>


      
        <Modal
          title={this.state.title}
          visible={this.state.isBuildCronVisible}
          onOk={() => {
            
            this.setState({
              // isVisible: false,
              // isSimpleVisible: false,
              // isCronVisible: false,
             isBuildCronVisible: false
            });
          }}
          onCancel={() => {
            
            this.setState({
              // isVisible: false,
              // isSimpleVisible: false,
              // isCronVisible: false,
              isBuildCronVisible: false
            });
          }}
          width={600}
          {...footer}
          destroyOnClose
        >
          <BuildCronForm type={this.state.type} taskInfo={this.state.taskInfo} simplev={this.state.isSimpleVisible} cronv={this.state.isCronVisible}
                    wrappedComponentRef={(inst) => this.TaskCronForm = inst}/>
        </Modal>
      </div>
    );
  }
}


function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

function disabledDate(current) {
  // Can not select days before today and today
  return current && current < moment().endOf('day');
}

function disabledDateTime() {
  return {
    disabledHours: () => range(0, 24).splice(4, 20),
    disabledMinutes: () => range(30, 60),
    disabledSeconds: () => [55, 56],
  };
}

// function disabledRangeTime(_, type) {
//   if (type === 'start') {
//     return {
//       disabledHours: () => range(0, 60).splice(4, 20),
//       disabledMinutes: () => range(30, 60),
//       disabledSeconds: () => [55, 56],
//     };
//   }
//   return {
//     disabledHours: () => range(0, 60).splice(20, 4),
//     disabledMinutes: () => range(0, 31),
//     disabledSeconds: () => [55, 56],
//   };
// }

function onNumChange(value) {
  console.log('changed', value);
}





class TaskSimpleForm extends React.Component {

  params = {
    id : 0
  };
  

  componentWillMount() {
    let taskInfo = this.props.taskInfo || {};
    if(taskInfo.keys){
      this.params.id = taskInfo.keys.length ;
    }else{
      this.params.id = 0
    }
  }
  componentDidMount() {
    const { form } = this.props;
    let taskInfo = this.props.taskInfo || {};
    if(taskInfo.keys){
      let newObj = Object.assign([],taskInfo.keys);
      form.setFieldsValue({
        'keys': newObj,
      });
    }else{
      form.setFieldsValue({
        'keys': [],
      });
    }
  }

  remove = k => {
    let id = this.params.id;
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    // if (keys.length === 1) {
    //   return;
    // }

    // can use data-binding to set
    // form.setFieldsValue({
    //   keys: keys.filter(key => key !== k),
    // });
    keys.splice(id-1, 1);
    form.setFieldsValue({
        'keys': keys
    });
    id--;
    this.params.id = id;
    if(id === -1){
      id++;
      this.params.id = id;
    }
  };

  add = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    console.log(keys);
    if (keys.length === 10) {
      message.error('后台任务最大允许添加10个参数');
      return 
    }
    let id = this.params.id;
    // can use data-binding to get
    const nextKeys = keys.concat(id++);
    this.params.id = id;
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };


  render() {
    let type = this.props.type;
    let taskInfo = this.props.taskInfo || {};
    const formItemLayout = {
      labelCol: {
        span: 5
      },
      wrapperCol: {
        span: 19
      }
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };

    const {getFieldDecorator,getFieldValue} = this.props.form;

    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <Form.Item
        {...(index === 0 ? formItemLayout : formItemLayout)}
        label={index === 0 ? '参数'+k : '参数'+k}
        // label={<Input placeholder="please input paramcode" type= />}
        required={false}
        key={k}
      >
        {getFieldDecorator(`paramvalues[${k}]`, {
          initialValue: taskInfo.paramvalues?taskInfo.paramvalues[k]:'',
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              whitespace: true,
              message: "Please input value or delete this field.",
            },
          ],
        })(<Input placeholder="Please input parame value" style={{ width: '60%', marginRight: 8 }} />)}
        {keys.length >= 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => this.remove(k)}
          />
        ) : null}
      </Form.Item>
    ));

    return (
      <Form layout="horizontal">
        <FormItem label="任务名称" {...formItemLayout} >
          {
            taskInfo && type === 'detail' ? taskInfo.jobName :
              getFieldDecorator('jobName', {
                initialValue: taskInfo.jobName,
                rules: [
                  {
                    required: true,
                    message: '请输入任务名称'
                  },
                  {
                    min: 3,
                    message: '名称至少为3个字符'
                  },
                  {
                    max: 16,
                    message: '名称最多为16个字符'
                  },
                  {
                    whitespace: true,
                    message: '名称中不能有空格'
                  }
                ]
              })(
                <Input type="text" placeholder="请输入任务名称"/>
              )
          }
        </FormItem>
        <FormItem label="任务执行类" {...formItemLayout}>
          {
            taskInfo && type === 'detail' ? taskInfo.jobClass :
              getFieldDecorator('jobClass', {
                initialValue: taskInfo.jobClass,
                rules: [
                  {
                    required: true,
                    message: '请输入任务执行类'
                  },
                  {
                    whitespace: true,
                    message: '内容中不能有空格'
                  }
                ]
              })(
                <Input type="text" placeholder="请输入任务执行类"/>
              )
          }
        </FormItem>
        <FormItem label="任务开始时间" {...formItemLayout}>
          {
            taskInfo && type === 'detail' ? taskInfo.startTime :
              getFieldDecorator('startTime', {
                initialValue: 
                moment(taskInfo.startTime)
                ,
                rules: [
                  {
                    required: true,
                    message: '请输入任务开始时间'
                  }
                ]
              })(
                <DatePicker
      format="YYYY-MM-DD HH:mm:ss"
      // disabledDate={disabledDate}
      // disabledTime={disabledDateTime}
      showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}/>
              )
          }
        </FormItem>
        <FormItem label="任务结束时间" {...formItemLayout}>
          {
            taskInfo && type === 'detail' ? taskInfo.endTime :
              getFieldDecorator('endTime', {
                initialValue: moment(taskInfo.endTime),
                rules: [
                  {
                    required: true,
                    message: '请输入任务结束时间'
                  }
                ]
              })(
                <DatePicker
      format="YYYY-MM-DD HH:mm:ss"
      // disabledDate={disabledDate}
      // disabledTime={disabledDateTime}
      // defaultValue={moment('2015-01-01 00:00:00', "YYYY-MM-DD HH:mm:ss")}
      showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}/>
              )
          }
        </FormItem>
        <FormItem label="间隔时间(秒)" {...formItemLayout}>
          {
            taskInfo && type === 'detail' ? taskInfo.jobTime :
              getFieldDecorator('jobTime', {
                initialValue: taskInfo.jobTime,
                rules: [
                  {
                    required: true,
                    message: '间隔时间(秒)'
                  }
                ]
              })
              (
                // <Input type="text" placeholder="间隔时间(秒)"/>
                <InputNumber min={1} max={100000} defaultValue={300} onChange={onNumChange} 
                placeholder="请输入间隔时间"/>
              )
          }
        </FormItem>
        <FormItem label="任务描述" {...formItemLayout}>
          {
            taskInfo && type === 'detail' ? taskInfo.description :
              getFieldDecorator('description', {
                initialValue: taskInfo.description,
                rules: [
                  {
                    required: true,
                    message: '请输入任务描述'
                  }
                ]
              })(
                <Input type="text" placeholder="请输入任务描述"/>
              )
          }
        </FormItem>

        <FormItem label="参数列表" {...formItemLayout}>
          <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
            <Icon type="plus" /> 添加任务参数
          </Button>
        </FormItem>
        {formItems}
      </Form>
    );
  }
}

TaskSimpleForm = Form.create({})(TaskSimpleForm);






// function openBuildCronFrom(e) {
//     this.setState({
//       type : 'Buildcron',
//       // isVisible: true,
//       isBuildCronVisible: true,
//       title: 'Cron Builder',
//     });
  
// }






class TaskCronForm extends React.Component {

  openBuildCronFrom = (e) => {
    this.setState({
      type : 'Buildcron',
      // isVisible: true,
      isBuildCronVisible: true,
      isCronVisible: false,
      title: 'Cron Builder',
    });
  }
  params = {
    id : 0
  };
  

  componentWillMount() {
    let taskInfo = this.props.taskInfo || {};
    if(taskInfo.keys){
      this.params.id = taskInfo.keys.length ;
    }else{
      this.params.id = 0
    }
  }
  componentDidMount() {
    const { form } = this.props;
    let taskInfo = this.props.taskInfo || {};
    if(taskInfo.keys){
      let newObj = Object.assign([],taskInfo.keys);
      form.setFieldsValue({
        'keys': newObj,
      });
    }else{
      form.setFieldsValue({
        'keys': [],
      });
    }
  }

  remove = k => {
    let id = this.params.id;
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    // if (keys.length === 1) {
    //   return;
    // }

    // can use data-binding to set
    // form.setFieldsValue({
    //   keys: keys.filter(key => key !== k),
    // });
    keys.splice(id-1, 1);
    form.setFieldsValue({
        'keys': keys
    });
    id--;
    this.params.id = id;
    if(id === -1){
      id++;
      this.params.id = id;
    }
  };

  add = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    console.log(keys);
    if (keys.length === 10) {
      message.error('后台任务最大允许添加10个参数');
      return 
    }
    let id = this.params.id;
    // can use data-binding to get
    const nextKeys = keys.concat(id++);
    this.params.id = id;
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };



  
  render() {
    
    let type = this.props.type;
    let taskInfo = this.props.taskInfo || {};
    const formItemLayout = {
      labelCol: {
        span: 5
      },
      wrapperCol: {
        span: 19
      }
    };

    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };

    const {getFieldDecorator,getFieldValue} = this.props.form;

    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <Form.Item
        {...(index === 0 ? formItemLayout : formItemLayout)}
        label={index === 0 ? '参数'+k : '参数'+k}
        // label={<Input placeholder="please input paramcode" type= />}
        required={false}
        key={k}
      >
        {getFieldDecorator(`paramvalues[${k}]`, {
          initialValue: taskInfo.paramvalues?taskInfo.paramvalues[k]:'',
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              whitespace: true,
              message: "Please input value or delete this field.",
            },
          ],
        })(<Input placeholder="Please input parame value" style={{ width: '60%', marginRight: 8 }} />)}
        {keys.length >= 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => this.remove(k)}
          />
        ) : null}
      </Form.Item>
    ));


    return (
      <Form layout="horizontal">
        <FormItem label="任务名称" {...formItemLayout} >
          {
            taskInfo && type === 'detail' ? taskInfo.jobName :
              getFieldDecorator('jobName', {
                initialValue: taskInfo.jobName,
                rules: [
                  {
                    required: true,
                    message: '请输入任务名称'
                  },
                  {
                    min: 3,
                    message: '名称至少为3个字符'
                  },
                  {
                    max: 16,
                    message: '名称最多为16个字符'
                  },
                  {
                    whitespace: true,
                    message: '名称中不能有空格'
                  }
                ]
              })(
                <Input type="text" placeholder="请输入任务名称"/>
              )
          }
        </FormItem>
        <FormItem label="任务执行类" {...formItemLayout}>
          {
            taskInfo && type === 'detail' ? taskInfo.jobClass :
              getFieldDecorator('jobClass', {
                initialValue: taskInfo.jobClass,
                rules: [
                  {
                    required: true,
                    message: '请输入任务执行类'
                  },
                  {
                    whitespace: true,
                    message: '内容中不能有空格'
                  }
                ]
              })(
                <Input type="text" placeholder="请输入任务执行类"/>
              )
          }
        </FormItem>
        <FormItem label="任务开始时间" {...formItemLayout}>
          {
            taskInfo && type === 'detail' ? taskInfo.startTime :
              getFieldDecorator('startTime', {
                initialValue: 
                moment(taskInfo.startTime)
                ,
                rules: [
                  {
                    required: true,
                    message: '请输入任务开始时间'
                  }
                ]
              })(
                <DatePicker
      format="YYYY-MM-DD HH:mm:ss"
      // disabledDate={disabledDate}
      // disabledTime={disabledDateTime}
      showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}/>
              )
          }
        </FormItem>
        <FormItem label="任务结束时间" {...formItemLayout}>
          {
            taskInfo && type === 'detail' ? taskInfo.endTime :
              getFieldDecorator('endTime', {
                initialValue: moment(taskInfo.endTime),
                rules: [
                  {
                    required: true,
                    message: '请输入任务结束时间'
                  }
                ]
              })(
                <DatePicker
      format="YYYY-MM-DD HH:mm:ss"
      // disabledDate={disabledDate}
      // disabledTime={disabledDateTime}
      // defaultValue={moment('2015-01-01 00:00:00', "YYYY-MM-DD HH:mm:ss")}
      showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}/>
              )
          }
        </FormItem>
        <FormItem label="Cron表达式" {...formItemLayout}>
          {
            taskInfo && type === 'detail' ? taskInfo.jobTime :
              getFieldDecorator('jobTime', {
                initialValue: taskInfo.jobTime,
                rules: [
                  {
                    required: true,
                    message: 'Cron表达式'
                  }
                ]
              })
              (
                // <Input type="text" placeholder="间隔时间(秒)"/>
                <Input type="text" placeholder="Cron表达式"/>
                // <div style={{ marginBottom: 5 }}>
    //  {/* <Input addonAfter={<Button type="primary" icon="edit" onClick={this.openBuildCronFrom}>Cron编辑器</Button>} defaultValue="* * * * *" /> */}
    // </div>
              )
          }
        </FormItem>
        <FormItem label="任务描述" {...formItemLayout}>
          {
            taskInfo && type === 'detail' ? taskInfo.description :
              getFieldDecorator('description', {
                initialValue: taskInfo.description,
                rules: [
                  {
                    required: true,
                    message: '请输入任务描述'
                  }
                ]
              })(
                <Input type="text" placeholder="请输入任务描述"/>
              )
          }
        </FormItem>
        <FormItem label="参数列表" {...formItemLayout}>
          <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
            <Icon type="plus" /> 添加任务参数
          </Button>
        </FormItem>
        {formItems}
      </Form>
    );
  }
}

TaskCronForm = Form.create({})(TaskCronForm);


function cronChange(e) {
  console.info(e);
}

class BuildCronForm extends React.Component {

  
  render() {
    return (
        <div>
        <CronBuilder 
        cronExpression="*/4 2,12,22 * * 1-5"
        onChange={cronChange}
        // showResult={false}
        />
        </div>
    )
  }
}

BuildCronForm = Form.create({})(BuildCronForm);


