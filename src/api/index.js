/* 
包含应用中所有请求接口的函数: 接口请求函数
函数的返回值都是promise对象
*/

import ajax from './ajax'

import memoryUtils from "../utils/memoryUtils";

const BASE = '/yymacau'

//const BASE = 'http://yyicbcreacthost.com:8199'


// // 发送jsonp请求得到天气信息
// export const reqWeather = (city) => {
//     // 执行器函数: 内部去执行异步任务,
//     // 成功了调用resolve(), 失败了不调用reject(), 直接提示错误
//     return new Promise((resolve, reject) => {
//         const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
//         jsonp(url, {}, (error, data) => {
//             if (!error && data.error === 0) { // 成功的
//                 const {dayPictureUrl, weather} = data.results[0].weather_data[0]
//                 resolve({dayPictureUrl, weather})
//             } else { // 失败的
//                 message.error('获取天气信息失败')
//             }
//         })
//     })
//
// }

// 请求登陆
export const reqLogin = (usercode, password) => ajax.post(BASE + '/pro/system/user/login', { usercode, password })

// 请求登陆sso
export const reqLoginSSO = (usercode, password) => ajax.post(BASE + '/pro/system/user/loginsso', { usercode, password })

// 请求登出
export const reqLogout = (usercode) => ajax.post(BASE + '/pro/system/user/logout', { usercode })

// 请求修改密码
export const reqChangePwd = (user) => ajax.post(BASE + '/pro/system/user/changepwd', user)

// 请求重置密码
export const reqResetPwd = (userId) => ajax.post(BASE + '/pro/system/user/resetpwd', {
    userId
})

//请求找回密码
export const reqFindPwd = (usercode, email, mobile) => ajax.post(BASE + '/pro/system/login/findpwd', { usercode, email, mobile })

// 获取所有角色的列表
export const reqRoles = (page, roleCode, roleName) => ajax(BASE + '/pro/system/role/list', {
    params: {
        page,
        roleCode,
        roleName
    }
})

// 添加/更新角色
export const reqAddOrUpdateRole = (type, role) => ajax.post(BASE + '/pro/system/role/' + (type === 'add' ? 'add' : 'update'), role)


//角色授权
export const reqRolePermission = (roleId, menus) => ajax.post(BASE + '/pro/system/role/permission', {
    roleId,
    menuString: JSON.stringify(menus)
})

//用户授权->查询用户列表
export const reqRoleUserList = (roleId) => ajax(BASE + '/pro/system/role/userlist', {
    params: {
        roleId
    }
})
// 删除指定角色
export const reqRoleDelete = (roleId) => ajax.post(BASE + '/pro/system/role/delete', {
    roleId
})
//用户授权
export const reqUserPermission = (userIds, roleId) => ajax.post(BASE + '/pro/system/role/role_user_edit', {
    userIds: JSON.stringify(userIds),
    roleId
})

// 获取所有任务的列表
export const reqTasks = (page) => ajax(BASE + '/quartz/system/task/list', {
    params: {
        page
    }
}
)

// 获取正在运行任务的列表
export const reqTasksRunning = (page) => ajax(BASE + '/quartz/system/task/runninglist', {
    params: {
        page
    }
}
)
//暂停任务
export const reqPauseTask = (taskId) => ajax.post(BASE + '/quartz/system/task/pause', {
    taskId
})

//开启任务
export const reqResumeTask = (taskId) => ajax.post(BASE + '/quartz/system/task/resume', {
    taskId
})

//立即运行任务
export const reqRunTask = (taskId) => ajax.post(BASE + '/quartz/system/task/run', {
    taskId
})

// 添加/更新simple任务
export const reqAddOrUpdateSimpleTask = (type, task) => ajax.post(BASE + '/quartz/system/task/simple/' + (type === 'addsimple' ? 'add' : 'update'),
    task
)

// 添加/更新Cron任务
export const reqAddOrUpdateCronTask = (type, task) => ajax.post(BASE + '/quartz/system/task/cron/' + (type === 'addcron' ? 'add' : 'update'), task)

// 删除指定任务
export const reqDeleteTask = (jobGroupName, jobName) => ajax.post(BASE + '/quartz/system/task/delete', {
    jobGroupName,
    jobName
})

// 添加/更新用户
export const reqAddOrUpdateUser = (type, user) => ajax.post(BASE + '/pro/system/user/' + (type === 'create' ? 'add' : 'update'), user)

// 删除指定用户
export const reqDeleteUser = (userId) => ajax.post(BASE + '/pro/system/user/delete', {
    userId
})

//点开卡片时需要返回公司列表
export const reqAllCorps = () => ajax(BASE + '/pro/system/user/corplist', {
    params: {}
}
)

// 获取所有用户的列表
export const reqUsers = (page, userCode, userName, mobile) => ajax(BASE + '/pro/system/user/list', {
    params: {
        page,
        userCode,
        userName,
        mobile
    }
}
)

// 获取所有增删改日志的列表
export const reqLogs = (page, logModule, handleType, handleUser, handleBeginDate, handleEndDate) => ajax(BASE + '/pro/system/log/list', {
    params: {
        page,
        logModule,
        handleType,
        handleUser,
        handleBeginDate,
        handleEndDate
    }
}
)

//接口信息配置
//列表
export const getConfigurationList = (urlParams) => ajax.get(
    BASE + '/pro/system/interfaceConfiguration/lists?' + urlParams
)
// 创建/更新配置信息
export const updateConfiguration = (type, params) => ajax.post(
    BASE + '/pro/system/interfaceConfiguration/' + (type === 'create' ? 'add' : 'updatefrom'), params
)
// 删除配置信息
export const deleteConfiguration = (params) => ajax.post(
    BASE + '/pro/system/interfaceConfiguration/delete', params
)

//公司档案页接口
export const getCompanyFileList = (params) => ajax.post(
    BASE + '/pro/collection/companyFile/getList', params);//获取列表数据（首次进入，查询）
export const addCompanyFile = companyFileForm => ajax.post(
    BASE + '/pro/collection/companyFile/add', companyFileForm);//新增公司档案数据
export const updateCompanyFile = (companyFileForm) => ajax.post(
    BASE + '/pro/collection/companyFile/update', companyFileForm);//修改公司档案数据
export const deleteCompanyFile = (params) => ajax.post(
    BASE + '/pro/collection/companyFile/delete', params);//删除公司档案数据
export const getTemplate = (params) => ajax.post(
    BASE + '/pro/collection/companyFile/getTemplate', params);//删除公司档案数据


// 获取所有时间段日报汇总
export const reqDailySummry = (page, handleBeginDate, handleEndDate, corpcode) => ajax(BASE + '/report/dailysummry/list', {
    params: {
        page,
        handleBeginDate,
        handleEndDate,
        corpcode
    }
}
)
// 获取所有时间段协议汇总
export const reqProtocalReport = (page, handleBeginDate, handleEndDate) => ajax(BASE + '/report/protocal/list', {
    params: {
        page,
        handleBeginDate,
        handleEndDate
    }
}
)

// 获取所有时间段子协议汇总
export const reqSubProtocalReport = (page, handleBeginDate, handleEndDate) => ajax(BASE + '/report/subprotocal/list', {
    params: {
        page,
        handleBeginDate,
        handleEndDate
    }
}
)
// 获取所有时间段月报汇总
export const reqMonthlySummry = (page, handleDate) => ajax(BASE + '/report/monthlysummry/list', {
    params: {
        page,
        handleDate
    }
}
)

/**
 * add by fmm
 * 客户子协议导出新申请
 */
export const exportNewApplyFile = (params) => { return fetchUtil('/collection/customerAgreementFile/exportNewApplyFile', params) }

/**
 * add by fmm
 * 导入退税并生成TXT
 */
export const generateImport = (params) => { return fetchUtil('/imports/generateImport/exportTxt', params) }

/**
 * add by fmm
 * 获取退税日期list
 */
export const getGenerateDateList = () => { return ajaxUtil('/imports/generateImport/getDateList') }
/**
 * add by fmm
 * @param {*} url 
 * @param {*} params 
 */
export const fetchUtil = (url, params) => fetch(
    BASE + url, {
    method: 'POST',
    body: JSON.stringify(params),
    credentials: 'include',
    headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + memoryUtils.user.token,
        'UserInfo': memoryUtils.user.usercode + "&" + memoryUtils.user.userName + "&" + memoryUtils.user.corpCode
    })
});//导出fova处理结果



/**
 * 
 * @param {} url 
 * @param {*} params 
 */
export const ajaxUtil = (url, params) => ajax.post(
    BASE + url, params)







