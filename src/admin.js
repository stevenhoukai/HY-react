import React from "react";
import { Row, Col  } from "antd";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NavLeft from "./components/NavLeft";
import './style/common.less'
import memoryUtils from './utils/memoryUtils'
// import Home from './pages/home'//在这里导入Home组件,以后使用路由进行更改
import { Redirect } from 'react-router-dom'

export default class Admin extends React.Component {
  render() {
    const user = memoryUtils.user
    if (!user.userId) {
      // this.props.history.replace('/login') // 事件回调函数中进行路由跳转
      return <Redirect to="/login"/> // 自动跳转到指定的路由路径
    }
    return (
      <Row className="container">
        <Col span="4" className="nav-left">
          <NavLeft />
        </Col>
        <Col span="20" className="main">
          {/* Right */}
          <Header/>
          <Row className="content">
            {/*content*/}
            {/* <Home/> */}
            {this.props.children}
          </Row>
          <Footer>Footer</Footer>
        </Col>
      </Row>
    );
  }
}
