import NUser from "../pages/system/user";
import NTask from "../pages/system/task";
import NPermission from '../pages/system/permission';
import InterfaceConfiguration from '../pages/system/configuration';
import LogMonitor from '../pages/system/logmonitor'
import CompanyFile from '../pages/companyFile';
import Dailyreport from '../pages/report/dailyreport';
import Monthlyreport from '../pages/report/monthlyreport';
import Protocalreport from '../pages/report/protocalreport';
import SubProtocalreport from '../pages/report/subprotocalreport';


/*
注意這裡的幾個標示很重要,如果開發一個菜單，只需要在這裡配置即可，router會根据這個自動渲染
ismenu 0 : yes 1 : no
isleaf 0 : no  1 : yes
ismenu 为yes 表示这是一个菜单
isleaf 为yes 标示这是一个叶子结点
具體參考系統設置->用戶管理->按鈕设置
*/
const menuList = [
    // {
    //     title: '首页',
    //     key: '/home',
    //     icon: 'home',
    //     ismenu: '0',
    //     isleaf: '1',
    //     component: Home,
    // },
    {
        title: '基础档案',
        key: '/collection',
        icon: 'file',
        ismenu: '0',
        isleaf: '0',
        children: [
            {
                title: '公司档案信息',
                key: '/collection/companyFile',
                icon: 'file',
                ismenu: '0',
                isleaf: '1',
                component: CompanyFile,
            },
        ]
    },
    {
        title: '报表',
        key: '/report',
        icon: 'area-chart',
        ismenu: '0',
        isleaf: '0',
        children: [
            {
                title: '代理业务日报表',
                key: '/report/dailysummry',
                icon: 'area-chart',
                ismenu: '0',
                isleaf: '1',
                component: Dailyreport,
            },
            {
                title: '代理业务月报表',
                key: '/report/monthsummry',
                icon: 'area-chart',
                ismenu: '0',
                isleaf: '1',
                component: Monthlyreport,
            },
            {
                title: '主协议统计报表',
                key: '/report/protocal',
                icon: 'area-chart',
                ismenu: '0',
                isleaf: '1',
                component: Protocalreport,
            },
            {
                title: '子协议统计报表',
                key: '/report/subprotocal',
                icon: 'area-chart',
                ismenu: '0',
                isleaf: '1',
                component: SubProtocalreport,
            },
        ]
    },
    {
        title: '系统设置',
        key: '/system',
        icon: 'setting',
        ismenu: '0',
        isleaf: '0',
        children: [
            {
                title: '用户管理',
                key: '/system/user',
                icon: 'user',
                ismenu: '0',
                isleaf: '1',
                component: NUser,
                children: [
                    {
                        title: '创建用户',
                        key: '/system/user/add',
                        icon: 'setting',
                        ismenu: '1',
                    },
                    {
                        title: '删除用户',
                        key: '/system/user/delete',
                        icon: 'setting',
                        ismenu: '1',
                    },
                    {
                        title: '修改用户',
                        key: '/system/user/update',
                        icon: 'setting',
                        ismenu: '1',
                    },
                    {
                        title: '重置密码',
                        key: '/system/user/resetpwd',
                        icon: 'setting',
                        ismenu: '1',
                    },
                ]
            },
            {
                title: '权限设置',
                key: '/system/role',
                icon: 'key',
                ismenu: '0',
                isleaf: '1',
                component: NPermission,
                children: [
                    {
                        title: '创建角色',
                        key: '/system/role/add',
                        icon: 'setting',
                        ismenu: '1',
                    },
                    {
                        title: '设置权限',
                        key: '/system/role/permission',
                        icon: 'setting',
                        ismenu: '1',
                    },
                    {
                        title: '用户授权',
                        key: '/system/role/role_user_edit',
                        icon: 'setting',
                        ismenu: '1',
                    },
                    {
                        title: '删除角色',
                        key: '/system/role/delete',
                        icon: 'setting',
                        ismenu: '1',
                    },
                ]
            },
            {
                title: '定时任务管理',
                key: '/system/task',
                icon: 'alert',
                ismenu: '0',
                isleaf: '1',
                component: NTask,
            },
            {
                title: '接口配置管理',
                key: '/system/interfaceConfiguration',
                icon: 'setting',
                ismenu: '0',
                isleaf: '1',
                component: InterfaceConfiguration,
            },
            {
                title: '日志监控管理',
                key: '/system/logmonitor',
                icon: 'info-circle',
                ismenu: '0',
                isleaf: '1',
                component: LogMonitor,
            }
        ]
    },
];
export default menuList;



