import React from 'react'
import './index.less'
import intl from 'react-intl-universal';
import { Button } from "antd";
import { Link } from "react-router-dom";

export default class Exception extends React.Component {
   render(){
       return (
           <div className="home-wrap">
               {/* {intl.get('home-slogan')} */}
               访问页面出错！
               <a >
                 <Link to="/home">返回欢迎页</Link>
               </a>
           </div>
       );
   }
}