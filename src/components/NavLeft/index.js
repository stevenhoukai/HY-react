// src/components/NavLeft/index.js
import React from "react";
import MenuConfig from "./../../config/menuConfig"; //导入menuConfig这个文件
import MenuConfigus from "./../../config/menuConfigus"; //导入menuConfig这个文件
import MenuConfigtw from "./../../config/menuConfigtw"; //导入menuConfig这个文件
import {Menu,Icon} from "antd"; //导入子组件菜单
import {NavLink} from "react-router-dom";
import "./index.less";
import {connect} from "react-redux"; // 连接器
import {switchMenu} from "./../../redux/action"; //事件行为
import memoryUtils from '../../utils/memoryUtils'
import intl from 'react-intl-universal';

const SubMenu = Menu.SubMenu;

class NavLeft extends React.Component {
  state = {
    currentKey: ""
  };
  handleClick = ({item, key}) => {
    if (key === this.state.currentKey) {
      return false;
    }
    // 事件派发，自动调用reducer，通过reducer保存到store对象中
    const {dispatch} = this.props;
    dispatch(switchMenu(item.props.title));
    this.setState({
      currentKey: key
    });
  };

  /*
   * 获取到对象后,可以通过setState将对象存进去 ,这是React的一个特色
   * */
  componentWillMount() {
    //通过MenuConfig读取文件
    //通过递归(遍历)实现菜单(是一个List)的渲染
    
    const menuTreeNode = this.renderMenu(MenuConfig);
    const menuTreeNodeus = this.renderMenu(MenuConfigus);
    const menuTreeNodetw = this.renderMenu(MenuConfigtw);
    let currentKey = window.location.hash.replace(/#|\?.*$/g, "");
    //通过setState存入state
    this.setState({
      currentKey,
      menuTreeNode,
      menuTreeNodeus,
      menuTreeNodetw
    });
  }

  homeHandleClick = () => {
    const {dispatch} = this.props;
    dispatch(switchMenu('首页'));
    this.setState({
      currentKey: ""
    });
  };

   /*
  判断当前登陆用户对item是否有权限
   */
  hasAuth = (item) => {
    // const {key} = item

    const menus = memoryUtils.user.menus.toString();
    const userType = memoryUtils.user.userType
    /*
    1. 如果当前用户是admin级别
    2. 如果当前item是公开的
    3. 当前用户有此item的权限: key有没有menus中
     */
    // if(usercode==='admin' || usercode==='root' || menus.indexOf(item.key)!==-1) {
    console.log(menus.indexOf(item.key));
    if((userType===1 || menus.indexOf(item.key)!==-1)) {
      return true
    } else if(item.children){ // 4. 如果当前用户有此item的某个子item的权限
      return !!item.children.find(child =>  menus.indexOf(child.key)!==-1)
    }
    return false
  }



  //菜单渲染
  renderMenu = data => {
    return data.map(item => {
      //如果item有子元素,遍历自己,再次调用,直到子节点加载完毕
      if(this.hasAuth(item) && (item.ismenu == '0')){
        if (item.children && (item.isleaf === '0')) {
          return (
            <SubMenu title={
              <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
            } key={item.key}>
              {this.renderMenu(item.children)}
            </SubMenu>
          );
        }
        return (
          <Menu.Item title={item.title} key={item.key}>
            <NavLink to={item.key}>
            <Icon type={item.icon} />
            <span>{item.title}</span>
            </NavLink>
          </Menu.Item> 
        );
      }
    });
  };

  render() {
    // var style = {
    //     backgroundColor:'red'
    // }
    return (
      <div>
        <NavLink to="/home" onClick={this.homeHandleClick}>
          <div className="logo">
            <img src="/assets/icbclogo.png" alt=""/>
            <img src="" alt=""/>
            <h1>{intl.get('left-title')}</h1>
          </div>
        </NavLink>
        <Menu
          onClick={this.handleClick}
          selectedKeys={[this.state.currentKey]}
          theme="dark"
          mode='inline'
          // mode='vertical'
        >
          <Menu.Item title='首页' key='/home'>
            <NavLink to='/home'>
            <Icon type='home' />
            <span>首页</span>
            </NavLink>
          </Menu.Item> 
          {
            this.state.menuTreeNode
          /* {intl.get('left-menulang')==='zh'?this.state.menuTreeNode:intl.get('left-menulang')==='us'?this.state.menuTreeNodeus:this.state.menuTreeNodetw} */
          }
        </Menu>
      </div>
    );
  }
}

export default connect()(NavLeft);
