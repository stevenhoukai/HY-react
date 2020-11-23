import React from 'react';
import { Button, Card, Col, Form, Icon, Input, message, Modal, Row, Select } from 'antd';
import ETable from './../../components/ETable';
import Utils from "../../utils/utils";
import BaseForm from "../../components/BaseForm";
import {
    addCompanyFile,
    deleteCompanyFile,
    getCompanyFileList,
    getTemplate,
} from "../../api/index"

const Option = Select.Option;
const FormItem = Form.Item;
let id = 0;
export default class companyFile extends React.Component {

    state = {
        list: [],
        templateList: [],
        businessList: [],
        ccyList: [],
        companyInfo: {
            id: null,
            companyEncode: '',
            companyName: '',
            companyDescription: '',
            drCrAccount: '',
            companyPhone: '',
            personalPhone: '',
            companyStatus: '',
            companyContact: '',
            fax: '',
            personalContact: '',
            fileType: null,
            excelTemplateType: '',
            txtTemplateType: '',
            exportFileType: null,
            exportExcelTemplateType: '',
            exportTxtTemplateType: '',
            exportPdfTemplateType: '',
            address1: '',
            accountName: '',
            accountNameEng: '',
            email1: '',
            email2: '',
            createTime: '',
            updateTime: '',
            accountList: [],
            exportTemplateMinunit: '',
        },
        id: null,
        isShow: false,
        okText: '',
        cancelText: ''
    };

    params = {
        page: 1,
        companyEnCode: '',
        companyName: ''
    };

    formList = [
        {
            type: 'INPUT',
            label: '公司编码',
            field: 'companyEncode',
            width: 180,
        },
        {
            type: 'INPUT',
            label: '公司名称',
            field: 'companyName',
            width: 200,
        }
    ];

    componentDidMount(){
    }


    // 功能区操作
    handleOperate = (type) => {
        let item = this.state.selectedItem;
        if (type === 'add') {
            this.setState({
                type,
                isShow: true,
                title: '创建公司信息',
                okText: '新增',
                cancelText: '取消'
            });
            this.state.id = null;
        } else if (type === 'edit') {
            if (!item) {
                Modal.info({
                    title: '提示',
                    content: '请选择一个公司'
                });
                return;
            }
            this.setState({
                type,
                isShow: true,
                title: '编辑公司信息',
                okText: '保存',
                cancelText: '取消',
                companyInfo: item
            });
            this.state.id = item.id;
        } else if (type === 'detail') {
            if (!item) {
                Modal.info({
                    title: '提示',
                    content: '请选择一个公司'
                });
                return;
            }
            this.setState({
                type,
                isShow: true,
                title: '公司详情',
                cancelText: '取消',
                companyInfo: item
            });
        } else {
            if (!item) {
                Modal.info({
                    title: '提示',
                    content: '请选择一个公司'
                });
                return;
            }
            Modal.confirm({
                title: '确认删除',
                content: '是否要删除当前选中的公司?',
                onOk: async () => {
                    const retdata = await deleteCompanyFile(item);
                    if (retdata.code === 20000) {
                        message.success("删除成功！");
                        this.setState({
                            isShow: false,
                            selectedRowKeys: '' // 查询完后,单选框失去焦点
                        });
                        this.requestList();
                    } else {
                        message.error("删除失败！ error=" + retdata.msg)
                    }
                }
            });
        }
    };

    getTemplate = async () => {
        const retdata = await getTemplate();
        if (retdata.code === 20000) {
            this.excelTypeList = retdata.result.item_list.excelTypeList;
            this.txtTypeList = retdata.result.item_list.txtTypeList;
            this.pdfTypeList = retdata.result.item_list.pdfTypeList;
        } else {
        }
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.companyForm.props.form.validateFields(async (err, values) => {
            if (!err) {
                let data = this.companyForm.props.form.getFieldsValue();
                data['id'] = this.state.id;
                data['companyStatus'] = 1;
                const retdata = await addCompanyFile(data);
                if (retdata.code === 20000) {
                    message.success(this.state.okText + "成功！");
                    this.state.isShow = false;
                    this.companyForm.props.form.resetFields();
                    this.state.companyInfo = '';
                    this.requestList();
                } else {
                    message.error(this.state.okText + "失败！ error=" + retdata.msg);
                }
            }
        });
    };

    requestList = async () => {
        const retdata = await getCompanyFileList(this.params);
        if (retdata.code === 20000) {
            const list = retdata.result.item_list;
            this.setState({
                list,
                pagination: Utils.pagination(retdata, (current) => {
                    this.params.page = current;
                    this.requestList();
                })
            });
        } else {
            message.error("获取表单页数据异常！ error=" + retdata.msg)
        }
        this.setState({
            selectedRowKeys: ''
        });
    };

    //处理表单查询
    handleFilter = (params) => {
        this.params = params;
        this.params.page = 1;
        this.requestList();
    };

    render() {
        const columns = [
            {
                title: '公司编码',
                dataIndex: 'companyEncode'
            }, {
                title: '公司名称',
                dataIndex: 'companyName'
            }, {
                title: '公司账号',
                dataIndex: 'companyAccount'
            }, {
                title: '公司电话',
                dataIndex: 'companyPhone',
            }, {
                title: '个人电话',
                dataIndex: 'personalPhone'
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
                <Card>
                    <BaseForm formList={this.formList} filterSubmit={this.handleFilter} />
                </Card>
                <Card style={{ marginTop: 10 }} className="operate-wrap">
                    <Button type="primary" icon="add" onClick={() => this.handleOperate('add')}>新增</Button>
                    <Button type="primary" icon="edit" onClick={() => this.handleOperate('edit')}>修改</Button>
                    <Button type="primary" onClick={() => this.handleOperate('detail')}>详情查看</Button>
                    <Button type="danger" icon="delete" onClick={() => this.handleOperate('delete')}>删除</Button>
                </Card>
                <div className="content-wrap">
                    <ETable columns={columns}
                        updateSelectedItem={Utils.updateSelectedItem.bind(this)}
                        selectedRowKeys={this.state.selectedRowKeys}
                        selectedItem={this.state.selectedItem}
                        dataSource={this.state.list}
                        pagination={this.state.pagination} />
                </div>
                <Modal
                    title={this.state.title}
                    visible={this.state.isShow}
                    okText={this.state.okText}
                    cancelText={this.state.cancelText}
                    maskClosable={false}
                    onCancel={() => {
                        this.companyForm.props.form.resetFields();
                        this.setState({
                            isShow: false,
                            companyInfo: '',
                        });
                    }}
                    onOk={this.handleSubmit}
                    width={1500}
                    {...footer}
                >
                    <CompanyForm
                        type={this.state.type}
                        companyInfo={this.state.companyInfo}
                        excelList={this.excelTypeList}
                        txtList={this.txtTypeList}
                        pdfList={this.pdfTypeList}
                        businessList={this.state.businessList}
                        ccyList={this.state.ccyList}
                        wrappedComponentRef={
                            (inst) => this.companyForm = inst
                        } />
                </Modal>
            </div>
        );
    }
}

class CompanyForm extends React.Component {

    params = {
        exportTxtIsShow: true,
        exportExcelIsShow: true,
        exportPdfIsShow: true,
        txtIsShow: true,
        excelIsShow: true,
    };
    getStatus = (status) => {
        let config = {
            '0': "禁用",
            '1': '启用',
        };
        return config[status];
    };

    getCurrencyUnit = (status) => {
        let config = {
            '1': '分',
            '2': "角",
            '3': '元',
            '4': "厘",
            '5': '毫',
        };
        return config[status];
    };

    getFileType = (status) => {
        let config = {
            '0': "txt",
            '1': 'excel',
            '2': 'txt+excel',
        };
        return config[status];
    };
    getExportFileType = (status) => {
        let config = {
            '0': "txt",
            '1': 'excel',
            '2': 'pdf',
        };
        return config[status];
    };
    setFileType = (value) => {
        this.fileType = value;
        if (value === '1') {
            this.params.txtIsShow = true;
            this.params.excelIsShow = false;
        }
        if (value === '0') {
            this.params.txtIsShow = false;
            this.params.excelIsShow = true;
        }
        if (value === '2') {
            this.params.txtIsShow = false;
            this.params.excelIsShow = false;
        }
    };
    setExportFileType = (value) => {
        this.fileType = value;
        if (value === '0') {
            this.params.exportTxtIsShow = false;
            this.params.exportExcelIsShow = true;
            this.params.exportPdfIsShow = true;
        }
        if (value === '1') {
            this.params.exportTxtIsShow = true;
            this.params.exportExcelIsShow = false;
            this.params.exportPdfIsShow = true;
        }
        if (value === '2') {
            this.params.exportTxtIsShow = true;
            this.params.exportExcelIsShow = true;
            this.params.exportPdfIsShow = false;
        }
        if (value === '3') {
            this.params.exportTxtIsShow = false;
            this.params.exportExcelIsShow = false;
            this.params.exportPdfIsShow = false;
        }
    };
    checkWord = (rule, value, callback) => {
        if (value) {
            if (/[\u4E00-\u9FA5]/g.test(value)) {
                callback(new Error('编码不能输入汉字!'));
            } else {
                callback();
            }
        }
        callback();
    };

    addAccount = () => {
        const { form } = this.props;
        const titleKeys = form.getFieldValue('titleKeys');
        const nextTitleKeys = titleKeys.concat(id++);
        form.setFieldsValue({
            titleKeys: nextTitleKeys,
        });
    };

    removeTitle = k => {
        const { form } = this.props;
        const titleKeys = form.getFieldValue('titleKeys');
        if (titleKeys.length === 1) {
            return;
        }
        form.setFieldsValue({
            titleKeys: titleKeys.filter(key1 => key1 !== k),
        });
    };
    transferToUpperCase = value => {
        const { form } = this.props;
        let companyEncodeStr = form.getFieldValue('companyEncode');
        
        this.props.form.setFieldsValue({companyEncode: companyEncodeStr.toUpperCase()})
    }
    getCCYname = code => {
        let ccyList = this.props.ccyList;
        if (ccyList.length !== 0) {
            for (var i = 0; i < ccyList.length; i++) {
                if (ccyList[i].currencyCode === code) {
                    return ccyList[i].currencyName;
                }
            }
        }
        return "";
    };
    validateAccount = (rule, value, callback) => {
        try{
            if (! /^\d{19}$/g.test(value)) {
                callback('请输入 19 位账号信息!');
            } else {
                callback();
            }
        }catch(err){
            callback(err);
        }
    };
    render() {
        let type = this.props.type;
        let companyInfo = this.props.companyInfo || {};
        let txtTemplateList = this.props.txtList || [];
        let excelTemplateList = this.props.excelList || [];
        let isDetail = type === 'detail';
        const formItemLayout = {
            labelCol: {
                span: 6
            },
            wrapperCol: {
                span: 18
            }
        };
        const companyAccountformItemLayout = {
            labelCol: {
                span: 2
            },
            wrapperCol: {
                span: 22
            }
        };
        const detailItemLayout = {
            labelCol: {
                span: 12
            },
            wrapperCol: {
                span: 12
            }
        };
        const { getFieldDecorator, getFieldValue } = this.props.form;
        let businessList = this.props.businessList || [];
        let ccyList = this.props.ccyList || [];
        getFieldDecorator('titleKeys', { initialValue: companyInfo.accountList || [] });
        const titleKeys = getFieldValue('titleKeys');
        const companyAccountItems = titleKeys.map((k, accountIndex) => (
            
            <Row gutter={24} style={{marginTop:'10px' }}>
                <Col span={7} style={{ textAlign: 'right'}}>
                    <FormItem>
                        {getFieldDecorator(`accountList[${accountIndex}].businessTypeCode`, {
                            initialValue: k.businessTypeCode,
                        })(<Select placeholder="业务类型">{
                            businessList.map(data =>
                                <Option value={data.businessTypeCode}>
                                    {data.businessTypeName}
                                </Option>)
                        }</Select>)}
                    </FormItem>
                </Col>
                <Col span={7} style={{ textAlign: 'right' }}>
                    <FormItem>
                        {getFieldDecorator(`accountList[${accountIndex}].ccy`, {
                            initialValue: k.ccy,
                        })(<Select placeholder="币种">{
                            ccyList.map(data =>
                                <Option value={data.currencyCode.toString()}>
                                    {data.currencyName}
                                </Option>)
                        }</Select>)}
                    </FormItem>
                </Col>
                <Col span={7} style={{ textAlign: 'right' }}>
                    <FormItem>
                        {getFieldDecorator(`accountList[${accountIndex}].companyAccount`, {
                            initialValue: k.companyAccount,
                            rules: [{
                                required:true,
                                message:'请输入账号'
                            },{
                                validator:this.validateAccount
                            }]
                        })(<Input placeholder="账号" style={{ marginRight: 8 }} />)
                        }
                    </FormItem>
                </Col>
                <Col span={3} style={{ textAlign: 'right' }}>
                    {titleKeys.length > 1 ? (
                        <Icon
                            className="dynamic-delete-button"
                            type="minus-circle-o"
                            onClick={() => this.removeTitle(k)}
                        />
                    ) : null}
                </Col>
            </Row>
        ));
        return (
            <Form layout="horizontal">
                <Row gutter={24}>
                    <Col span={12} style={{ textAlign: 'right' }}>
                        <FormItem label="公司编码" {...formItemLayout} >
                            {
                                getFieldDecorator('companyEncode', {
                                    initialValue: companyInfo.companyEncode,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入公司编码'
                                        }, {
                                            whitespace: true,
                                            message: '编码中不能有空格'
                                        },
                                        { validator: this.checkWord }
                                    ]
                                })(<Input type="text" disabled={isDetail} onBlur={this.transferToUpperCase}/>)
                            }
                        </FormItem>
                        <FormItem label="公司名称" {...formItemLayout}>
                            {
                                getFieldDecorator('companyName', {
                                    initialValue: companyInfo.companyName,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入公司名称'
                                        },
                                        {
                                            whitespace: true,
                                            message: '名称中不能有空格'
                                        }
                                    ]
                                })(<Input type="text" disabled={isDetail} />)
                            }
                        </FormItem>
                        <FormItem label="地址一" {...formItemLayout}>
                            {
                                getFieldDecorator('address1', {
                                    initialValue: companyInfo.address1,
                                    rules: []
                                })(<Input type="text" disabled={isDetail} />)
                            }
                        </FormItem>
                        <FormItem label="户名" {...formItemLayout}>
                            {
                                getFieldDecorator('accountName', {
                                    initialValue: companyInfo.accountName,
                                    rules: [{
                                        whitespace: true,
                                        message: '名称中不能有空格'
                                    }]
                                })(<Input type="text" disabled={isDetail} />)
                            }
                        </FormItem>
                        <FormItem label="英文账户名" {...formItemLayout}>
                            {
                                getFieldDecorator('accountNameEng', {
                                    initialValue: companyInfo.accountNameEng,
                                    rules: [{
                                        whitespace: true,
                                        message: '名称中不能有空格'
                                    }]
                                })(<Input type="text" disabled={isDetail} />)
                            }
                        </FormItem>
                        <FormItem label="是否账单编号必填" {...formItemLayout}>
                            {
                                    getFieldDecorator('isRequiredBillNumber', {
                                        initialValue: type==='add'?1:companyInfo.isRequiredBillNumber,
                                        rules: [{
                                            required:true,
                                            message:'必选'
                                        }]
                                    })(<Select disabled={isDetail}>
                                        <Option value={0}>否</Option>
                                        <Option value={1}>是</Option>
                                    </Select>)
                            }
                        </FormItem>
                        <Row gutter={24}>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <FormItem label="导入文件类型" {...detailItemLayout}>
                                    {
                                        companyInfo && type === 'detail' ?
                                            (<Input type="text"
                                                value={this.getFileType(companyInfo.fileType)}
                                                disabled />) :
                                            getFieldDecorator('fileType', {
                                                initialValue: companyInfo.fileType,
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请选择导入文件类型'
                                                    }
                                                ]
                                            })(<Select
                                                onChange={this.setFileType}>
                                                <Option value={'0'}>txt</Option>
                                                <Option value={'1'}>excel</Option>
                                                <Option value={'2'}>txt+excel</Option>
                                            </Select>)
                                    }
                                </FormItem>
                            </Col>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <FormItem label="excel模板" {...detailItemLayout}>
                                    {
                                        companyInfo && type === 'detail' ?
                                            (<Input type="text"
                                                value={companyInfo.excelTemplateType}
                                                disabled />) :
                                            getFieldDecorator('excelTemplateType', {
                                                initialValue: companyInfo.excelTemplateType,
                                            })(
                                                <Select
                                                    showSearch
                                                    optionFilterProp="excelTemplateType"
                                                    disabled={this.params.excelIsShow}
                                                    value={companyInfo.excelTemplateType}
                                                    filterOption={(input, option) =>
                                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }>
                                                    {
                                                        excelTemplateList.map(data => {
                                                            if (this.fileType != null) {
                                                                return <Option value={data.excelTemplateCode}>
                                                                    {data.excelTemplateName}
                                                                </Option>
                                                            }
                                                        })
                                                    }
                                                </Select>
                                            )
                                    }
                                </FormItem>
                                <FormItem label="txt模板" {...detailItemLayout}>
                                    {
                                        companyInfo && type === 'detail' ?
                                            (<Input type="text"
                                                value={companyInfo.txtTemplateType}
                                                disabled />) :
                                            getFieldDecorator('txtTemplateType', {
                                                initialValue: companyInfo.txtTemplateType,
                                            })(
                                                <Select
                                                    showSearch
                                                    optionFilterProp="txtTemplateType"
                                                    disabled={this.params.txtIsShow}
                                                    value={companyInfo.txtTemplateType}
                                                    filterOption={(input, option) =>
                                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }>
                                                    {
                                                        txtTemplateList.map(data => {
                                                            if (this.fileType != null) {
                                                                return <Option value={data.txtTemplateCode.toString()}>
                                                                    {data.txtTemplateName}
                                                                </Option>
                                                            }
                                                        })
                                                    }
                                                </Select>
                                            )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <FormItem label="Excel 模板金额单位" {...formItemLayout}>
                            {
                                companyInfo && type === 'detail' ?
                                    (<Input type="text"
                                        value={this.getCurrencyUnit(companyInfo.exportTemplateMinunit)}
                                        disabled />) :
                                    getFieldDecorator('exportTemplateMinunit', {
                                        initialValue: type === 'add' ? '3' : companyInfo.exportTemplateMinunit,
                                        rules: [{
                                            required: true,
                                            message: '请选择模板金额单位'
                                        }]
                                    })(<Select disabled={type === 'detail'}>
                                        <Option value={'1'}>分</Option>
                                        {/* <Option value={'2'}>角</Option> */}
                                        <Option value={'3'}>元</Option>
                                        {/* <Option value={'4'}>厘</Option> */}
                                        {/* <Option value={'5'}>毫</Option> */}
                                    </Select>)
                            }
                        </FormItem>
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                        <FormItem label="公司电话" {...formItemLayout}>
                            {
                                companyInfo && type === 'detail' ?
                                    (<Input type="text"
                                        value={companyInfo.companyPhone}
                                        disabled />) :
                                    getFieldDecorator('companyPhone', {
                                        initialValue: companyInfo.companyPhone,
                                        rules: [{
                                            whitespace: true,
                                            message: '电话号码中不能有空格'
                                        }, {
                                            pattern: "^[0-9]*$",
                                            message: '请输入正确的数字号码'
                                        }]
                                    })(<Input type="text" />)
                            }
                        </FormItem>
                        <FormItem label="公司联络人" {...formItemLayout}>
                            {
                                companyInfo && type === 'detail' ?
                                    (<Input type="text"
                                        value={companyInfo.companyContact}
                                        disabled />) :
                                    getFieldDecorator('companyContact', {
                                        initialValue: companyInfo.companyContact,
                                        rules: [{
                                            whitespace: true,
                                            message: '联络人中不能有空格'
                                        }]
                                    })(<Input type="text" />)
                            }
                        </FormItem>
                        <FormItem label="传真FAX" {...formItemLayout}>
                            {
                                companyInfo && type === 'detail' ?
                                    (<Input type="text"
                                        value={companyInfo.fax}
                                        disabled />) :
                                    getFieldDecorator('fax', {
                                        initialValue: companyInfo.fax
                                    })(<Input type="text" />)
                            }
                        </FormItem>
                        <FormItem label="个人电话" {...formItemLayout}>
                            {
                                companyInfo && type === 'detail' ?
                                    (<Input type="text"
                                        value={companyInfo.personalPhone}
                                        disabled />) :
                                    getFieldDecorator('personalPhone', {
                                        initialValue: companyInfo.personalPhone,
                                        rules: [{
                                            pattern: "^[0-9]*$",
                                            message: '请输入正确的数字号码'
                                        }]
                                    })(<Input type="text" />)
                            }
                        </FormItem>
                        
                        <FormItem label="个人联络人" {...formItemLayout}>
                            {
                                companyInfo && type === 'detail' ?
                                    (<Input type="text"
                                        value={companyInfo.personalContact}
                                        disabled />) :
                                    getFieldDecorator('personalContact', {
                                        initialValue: companyInfo.personalContact,
                                        rules: [{
                                            whitespace: true,
                                            message: '联络人中不能有空格'
                                        }]
                                    })(<Input type="text" />)
                            }
                        </FormItem>
                        <FormItem label="联络E-mail1" {...formItemLayout}>
                            {
                                companyInfo && type === 'detail' ?
                                    (<Input type="text"
                                        value={companyInfo.email1}
                                        disabled />) :
                                    getFieldDecorator('email1', {
                                        initialValue: companyInfo.email1,
                                        rules: [{
                                            whitespace: true,
                                            message: '邮箱地址中不能有空格'
                                        }, {
                                            type: 'email',
                                            message: '请输入正确的邮箱地址'
                                        },]
                                    })(<Input type="text" />)
                            }
                        </FormItem>
                        <FormItem label="联络E-mail2" {...formItemLayout}>
                            {
                                companyInfo && type === 'detail' ?
                                    (<Input type="text"
                                        value={companyInfo.email2}
                                        disabled />) :
                                    getFieldDecorator('email2', {
                                        initialValue: companyInfo.email2,
                                        rules: [{
                                            whitespace: true,
                                            message: '邮箱地址中不能有空格'
                                        }, {
                                            type: 'email',
                                            message: '请输入正确的邮箱地址'
                                        },]
                                    })(<Input type="text" />)
                            }
                        </FormItem>
                                <FormItem label="导出特定模板" {...formItemLayout}>
                                    {
                                        companyInfo && type === 'detail' ?
                                            (<Input type="text"
                                                value={companyInfo.exportTxtTemplateType}
                                                disabled />) :
                                            getFieldDecorator('exportTxtTemplateType', {
                                                initialValue: companyInfo.exportTxtTemplateType,
                                            })(
                                                <Select
                                                    showSearch
                                                    optionFilterProp="txtTemplateType"
                                                    /* disabled={this.params.exportTxtIsShow} */
                                                    value={companyInfo.exportTxtTemplateType}
                                                    filterOption={(input, option) =>
                                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }>                                    
                                                    <Option value={"Standard"}>标准</Option>               
                                                    <Option value={"AIA"}>AIA</Option>
                                                    <Option value={"CEM"}>CEM</Option>
                                                    <Option value={"CZJ"}>财政局资料记录</Option>
                                                    <Option value={"CTM"}>CTM</Option>                                                    
                                                    <Option value={"SAAM"}>SAAM</Option>
                                                    <Option value={"SmartOne"}>数码通</Option>
                                                    <Option value={"CTCC"}>中国电信</Option>
                                                    <Option value={"SIB_OLD"}>社保(旧)</Option>
                                                    <Option value={"SIB_NEW"}>社保(新)</Option> 
                                                    <Option value={"MacauIns"}>澳門保險</Option>
                                                    <Option value={"Manulife"}>宏利保險</Option>
                                                </Select>
                                            )
                                    }
                                </FormItem>
                                {/* <FormItem label="pdf模板" {...detailItemLayout}>
                                    {
                                        companyInfo && type === 'detail' ?
                                            (<Input type="text"
                                                value={companyInfo.exportPdfTemplateType}
                                                disabled />) :
                                            getFieldDecorator('exportPdfTemplateType', {
                                                initialValue: companyInfo.exportPdfTemplateType,
                                            })(
                                                <Select
                                                    showSearch
                                                    optionFilterProp="exportPdfTemplateType"
                                                    disabled={this.params.exportPdfIsShow}
                                                    value={companyInfo.exportPdfTemplateType}
                                                    filterOption={(input, option) =>
                                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }>
                                                    <Option value={"AIA"}>AIA</Option>
                                                    <Option value={"CTM"}>CTM</Option>
                                                    <Option value={"ESP"}>ESP</Option>
                                                    <Option value={"Manulife"}>Manulife</Option>

                                                </Select>
                                            )
                                    }
                                </FormItem> */}
                           {/*  </Col> */}
                        {/* </Row> */}
                    </Col>
                </Row>
                <Row style={{marginTop:'20px'}}>
                    <FormItem label="公司账号信息" {...companyAccountformItemLayout}>
                        <Button type="primary" onClick={this.addAccount}>
                            <Icon type="plus" /> 添加公司账号信息
                        </Button>
                    </FormItem>
                    {companyAccountItems}
                </Row>
            </Form>
        );
    }
}

CompanyForm = Form.create({})(CompanyForm);