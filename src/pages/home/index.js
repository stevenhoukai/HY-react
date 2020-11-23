import React from 'react'
import './index.less'
import intl from 'react-intl-universal';

export default class Home extends React.Component {
   render(){
       return (
           <div className="home-wrap">
               {intl.get('home-slogan')}
           </div>
       );
   }
}