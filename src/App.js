import React, { Component } from 'react';
import './App.css';
import zh_CN from 'antd/es/locale/zh_CN';
import zh_TW from 'antd/es/locale/zh_TW';
import en_US from 'antd/es/locale/en_US';
import intl from 'react-intl-universal';
import { ConfigProvider } from 'antd';
import {emit} from './emit'



const locales = {
  'en-US': require('./locales/en-US.json'),
  'zh-CN': require('./locales/zh-CN.json'),
  'zh-TW': require('./locales/zh-TW.json'),
};


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
        antdLang: zh_CN,  // 修改antd  组件的国际化
    }
  }
  componentDidMount() {
    emit.on('change_language', lang => this.loadLocales(lang)); // 监听语言改变事件
    this.loadLocales(); // 初始化语言
  }
  loadLocales(lang = 'zh-CN') {
    intl.init({
        currentLocale: lang,  // 设置初始语音
        locales,
    }).then(() => {
        this.setState({
            antdLang: lang === 'zh-CN' ? zh_CN : lang === 'en-US' ? en_US : zh_TW
        });
    });
  }

  render() {
    return (
      <ConfigProvider locale={this.state.antdLang}> 
      <div>
        {this.props.children}
      </div>
      </ConfigProvider>
    );
  }
}

export default App;
