import React from 'react';
import {HashRouter, Route, Switch, Redirect} from "react-router-dom";
import App from "./App";
import Login from "./pages/login";
import LoginSSO from "./pages/loginsso";
import Admin from "./admin";
import Home from "./pages/home";
import Exception from "./pages/exception";
import MenuConfig from "./config/menuConfig";
import memoryUtils from './utils/memoryUtils'

export default class IRouter extends React.Component {

  state = {
    routers: {}
  };
  
  //路由渲染
  //author：steven
  //這裡很關鍵非常非常關鍵，主要靈感來源于antdpro框架，根據menuconfig動態渲染路由，
  //這樣前台就完成了權限校驗，後端只需要簡單的校驗token是否合法即可
  renderRouter = data => {
      return data.map(item => {
        const menus = memoryUtils.user.menus.toString();
        
        if(item.ismenu === '0' && item.isleaf === '0'){
          return this.renderRouter(item.children)
        } else if ((item.ismenu === '0' && item.isleaf === '1' && (menus.indexOf(item.key)!==-1))){
          return <Route path={item.key}  component={item.component}/>
        }
      });
  };

  renderRouterByAdmin = data => {
    return data.map(item => {
      if(item.ismenu === '0' && item.isleaf === '0'){
        return this.renderRouterByAdmin(item.children)
      } else if ((item.ismenu === '0' && item.isleaf === '1')){
        return <Route path={item.key}  component={item.component}/>
      }
    });
};

  componentWillMount(){
     //路由渲染
    //  console.log(memoryUtils.user)
    //  console.log(memoryUtils.user.menus)
    //这里需要做一次判断，否则登录页面会报错，管理页面需要根据用户类型动态进行路由渲染
     if(JSON.stringify(memoryUtils.user) == "{}"){
       return ;
     }
     let userType = memoryUtils.user.userType
     let routers = [];
     if(userType === 1){
      routers = this.renderRouterByAdmin(MenuConfig);
     }else{
      routers = this.renderRouter(MenuConfig);
     }
     this.setState({
      routers,
    });
  } 
  

  render() {
   
    return (
      <App>
      <HashRouter>
          <Switch>
            <Route path="/login" component={Login}/>
            <Route path="/loginsso" component={LoginSSO}/>
            <Route
              path="/"
              render={() => (
                <Admin>
                  <Switch>
                  <Route path="/home" component= {Home}/>
                  {this.state.routers}
                    {/* <Route path="/home" component= {Home}/>
                    <Route path="/system/role" component={NPermission}/>
                    <Route path="/system/user" component={NUser}/>
                    <Route path="/system/task" component={NTask}/>
                    <Route path="/system/interfaceConfiguration" component={InterfaceConfiguration}/>
                    <Route path="/system/logmonitor" component={LogMonitor}/>
                    <Route path="/imports/txt" component={Txt}/>
                    <Route path="/imports/pdf" component={Pdf}/>
                    <Route path="/imports/excel" component={Excel}/>
                    <Route path="/imports/formatField" component={FormatField}/>
                    <Route path="/imports/userImport" component={CustomerFileImport}/>
                    <Route path="/imports/modify" component={ModifyCustomerFileImport}/>
                    <Route path="/imports/generateImport" component={GenerateImport}/>
                    <Route path="/collection/companyFile" component={CompanyFile}/>
                    <Route path="/collection/businessFile" component={BusinessFile}/>
                    <Route path="/collection/dealSymbol" component={DealSymbol}/>
                    <Route path="/collection/companyCustomerFile" component={CompanyCustomerFile}/>
                    <Route path="/collection/companyAgreementFile" component={CompanyAgreementFile}/>
                    <Route path="/collection/currencyFile" component={CurrencyFile}/>
                    <Route path="/collection/companyBatchFile" component={CompanyBatchFile}/>
                    <Route path="/collection/batchFileDetail" component={BatchFileDetail}/>
                    <Route path="/compensation" component={ProxySalary}/>
                    <Route path="/report/dailysummry" component={Dailyreport}/>
                    <Route path="/report/monthsummry" component={Monthlyreport}/>
                    <Route path="/report/protocal" component={Protocalreport}/>
                    <Route path="/report/subprotocal" component={SubProtocalreport}/> */}
                    
                    {/* 异常处理，所有匹配不到的都跳转到该页面 */}
                  
                    <Route component={Exception}/>
                  </Switch>
                </Admin>
              )}
            />
          </Switch>
      </HashRouter>
      </App>
    );
  }
}
