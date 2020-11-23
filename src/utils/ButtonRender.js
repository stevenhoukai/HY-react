/*
包含n个日期时间处理的工具函数模块
*/

/*
  格式化日期时间类型
*/
export function ButtonRender(data, pagerouter) {
  return data.map(item => {
    //如果item有子元素,遍历自己,再次调用,直到子节点加载完毕
    if((item.ismenu == '0') && (item.isleaf === '1') && (item.key === pagerouter)){
      if (item.children) {
        
        item.children.map(button => {
          if(hasButtonAuth(button)){
          return (
          // <SubMenu title={
          //   <span>
          //     <Icon type={item.icon} />
          //     <span>{item.title}</span>
          //   </span>
          // } key={item.key}>
          //   {this.renderMenu(item.children)}
          // </SubMenu>

          <Button 
          type="primary" 
          icon="plus" 
          onClick={() => this.handleOperate('create')}>
          测试按钮
          </Button>
        );
          }
        })
        // return (
        //   <SubMenu title={
        //     <span>
        //       <Icon type={item.icon} />
        //       <span>{item.title}</span>
        //     </span>
        //   } key={item.key}>
        //     {this.renderMenu(item.children)}
        //   </SubMenu>
        // );
      }
      // return (
      //   <Menu.Item title={item.title} key={item.key}>
      //     <NavLink to={item.key}>
      //     <Icon type={item.icon} />
      //     <span>{item.title}</span>
      //     </NavLink>
      //   </Menu.Item> 
      // );
    }
  });
}

  /*
  判断当前登陆用户对Button是否有权限
   */
function hasAuth(item) {
    let menus = memoryUtils.user.menus
    let userType = memoryUtils.user.userType
    if((userType===1 || menus.indexOf(item.key)!==-1)) {
      return true
    } 
    return false
}


function hasButtonAuth(button) {
  let menus = memoryUtils.user.menus
  let userType = memoryUtils.user.userType
  if((userType===1 || menus.indexOf(button.key)!==-1)) {
    return true
  } 
  return false
}
