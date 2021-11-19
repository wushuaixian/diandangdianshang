import { UserLayout, BasicLayout } from '@/layouts'
import configurationCenter from './routes/configurationCenter' // 配置管理
import systemManagement from './routes/systemManagement/index'
import sysManagementRoute from './routes/sysManagement/'
import merchantsRoute from './routes/merchants'
import orderCenter from './routes/orderCenter/index'
import iframeRoute from './routes/iframe'
export const asyncRouterMap = [
  {
    path: '/print',
    name: 'print',
    meta: { title: '打印', target: true, permission: ['Workplace'] },
    component: () => import('@/views/print.js')
  },
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.home' },
    redirect: '/workplace',
    children: [
      {
        path: '/workplace',
        name: 'Workplace',
        component: () => import('@/views/dashboard/Workplace'),
        meta: { title: '工作台首页', keepAlive: true, permission: ['Workplace'] }
      },
      {
        path: '/enterprise',
        name: 'Enterprise',
        component: () => import('@/views/enterprise/index'),
        meta: { title: '企业管理', keepAlive: true, permission: ['EnterpriseManage'] }
      },
      {
        path:
          '/finance-manage/finance-payment-Cashier/:id/:orderCode/:paymentBalance/:payerType/:paymentBillCode/:mergePaymentType',
        name: 'FinancePaymentCashier',
        hidden: true,
        meta: { title: '收银台页面', keepAlive: true },
        component: () => import('@/views/finance/payment/Cashier')
      },
      {
        path: '/payment-manage-Alipay/:iconUrl/:realMoney/:sceneType/:orderCode/:cashierParams',
        name: 'AlipayPayment',
        hidden: true,
        component: () => import('@/views/finance/payment/paymentType/Alipay'),
        meta: {
          title: '支付宝支付',
          keepAlive: true
        }
      },
      {
        path: '/payment-paymentSuccessful',
        name: 'paymentSuccessful',
        hidden: true,
        component: () => import('@/views/finance/purchasers/Success/Success'),
        meta: {
          title: '支付成功',
          keepAlive: true
        }
      },
      {
        path: '/payment-paymentFaile/:cashierParams/:sceneType/:errorMsg',
        name: 'paymentFaile',
        hidden: true,
        component: () => import('@/views/finance/purchasers/failure/failure'),
        meta: {
          title: '支付失败',
          keepAlive: true
        }
      },
      {
        path: '/InProcess/:cashierParams/:orderCode/:sceneType',
        name: 'InProcess',
        component: () => import('@/views/finance/purchasers/InProcess/InProcess'),
        hidden: true,
        meta: {
          title: '处理中'
        }
      },
      {
        path: '/payment-manage-Wechat/:iconUrl/:realMoney/:sceneType/:orderCode/:cashierParams',
        name: 'WechatPayment',
        hidden: true,
        component: () => import('@/views/finance/payment/paymentType/Wechat'),
        meta: {
          title: '微信支付',
          keepAlive: true
        }
      },
      {
        path: '/offlinePayment',
        name: 'SysOperatorsHomeOfflinePayment',
        hidden: true,
        component: () => import('@/views/finance/suppliers/homePage/offlinePayment.vue'),
        meta: {
          title: '线下支付'
        }
      },
      ...merchantsRoute, // 采购商、供应商
      ...sysManagementRoute, // 运营平台
      ...configurationCenter, // 配置中心
      ...systemManagement, // 系统配置
      ...orderCenter, // 订单中心
      ...iframeRoute
    ]
  },

  {
    path: '/editVR/:id',
    name: 'editVR',
    hidden: true,
    component: () => import('@/views/sysManagement/vr/editVR/index'),
    meta: { title: 'VR管理' }
  },
  {
    path: '/message-list',
    name: 'MessageList',
    component: () => import('@/views/message/index'),
    hidden: true,
    meta: { title: '消息通知', keepAlive: true }
  },
  {
    path: '/editVR/:id',
    name: 'editVR',
    hidden: true,
    component: () => import('@/views/sysManagement/vr/editVR/index'),
    meta: { title: 'VR管理' }
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login'),
        meta: { title: '用户登录' }
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register'),
        meta: { title: '用户注册' }
      },
      {
        path: 'forgetpasswd',
        name: 'forgetpasswd',
        hidden: true,
        component: () => import('@/views/user/forgetPassword'),
        meta: {
          title: '忘记密码'
        }
      },
      {
        path: 'bind',
        name: 'bind',
        hidden: true,
        component: () => import('@/views/user/bind'),
        meta: {
          title: '绑定账号'
        }
      }
    ]
  },

  {
    path: '/finance-manage/finance-suppliers-deactivation',
    name: 'FinanceSuppliersdeactivation',
    hidden: true,
    component: () => import('@/views/finance/suppliers/paymentManagement/deactivation'),
    meta: {
      title: '账户激活引导',
      keepAlive: true
    }
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
