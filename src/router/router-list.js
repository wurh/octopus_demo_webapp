import Discover from '@/pages/discover/discover'; //首页发现页
import Account from '@/pages/account/account'; //个人中心页
import Sexchoice from '@/pages/sexchoice/sexchoice'; //选择标签页
import Login from '@/pages/login/login'; //登录页
import Splice from '@/pages/splice/splice'; //商品集合页(专题)
import List from '@/pages/list/list'; //分类列表页
import Tagchoice from '@/pages/tagchoice/tagchoice'; //标签选择页
import Article from '@/pages/article/article'; //文章详情页
import Scene from '@/pages/scene/scene'; //场景详情页
import Checkout from '@/pages/checkout/checkout'; //确认支付页
import Detail from '@/pages/detail/detail'; //商品详情页
import groupDetail from '@/pages/groupdetail/detail'; //拼团商品详情页
import storeDetail from '@/pages/storedetail/detail'; //团长店铺商品详情页
import Orders from '@/pages/orders/orders'; //订单列表页
import GroupOrders from '@/pages/grouporders/grouporders'; //团购订单列表页
import Address from '@/pages/address/address'; //新增地址页
import Topic from '@/pages/topic/topic'; //商品专题页(档期)
import Group from '@/pages/group/group'; //商品参团页
import Showorder from '@/pages/showorder/showorder'; // 晒单页
import Paysuccess from '@/pages/paysuccess/paysuccess'; //支付成功页
import Payfail from '@/pages/payfail/payfail'; //支付失败页
import OrderDetail from '@/pages/orderdetail/orderdetail'; //订单详情
import Commission from '@/pages/commission/commission'; //团长推广页
import Salesdetail from '@/pages/salesdetail/salesdetail'; //团长推广订单详情
import LoginReturn from '@/pages/wechat/login_return'; // 微信登录返回页
import Register from '@/pages/register/register'; //注册页
import Confirm from '@/pages/confirm/confirm'; //验证页面
import Forgotpassword from '@/pages/forgotpassword/forgotpassword'; //忘记密码页
import Resetpassword from '@/pages/resetpassword/resetpassword'; //忘记密码重置页面
import Changepassword from '@/pages/changepassword/changepassword'; //改变密码吧页面
import Setting from '@/pages/setting/setting'; // 设置页面
import Userdetail from '@/pages/userdetail/userdetail'; //用户信息页
import Contactus from '@/pages/contactus/contactus'; //联系我们页面
import storechoosegoods from '@/pages/storechoosegoods/storechoosegoods'; // 团长中心-选货
import storeManage from '@/pages/storemanage/storemanage'; // 店铺管理
import storeInfo from '@/pages/storeinfo/storeinfo'; // 店铺管理
import storeSaleList from '@/pages/storesalelist/storesalelist'; // C端店铺页
import Storeaccount from '@/pages/storeaccount/storeaccount'; //团长个人中心
import Storename from '@/pages/storename/storename'; //团长店铺名称
import Storenotice from '@/pages/storenotice/storenotice'; //团长店铺公告
import Storeemail from '@/pages/storeemail/storeemail'; //团长店铺邮箱
import Storeaddress from '@/pages/storeaddress/storeaddress'; //团长店铺地址
import Storeorders from '@/pages/storeorders/storeorders'; //b端订单列表页
import Storeorderdetail from '@/pages/storeorderdetail/storeorderdetail'; //b端订单详情页
import Personal from '@/pages/personal/personal'; //团长个人中心首页
import Personalinfo from '@/pages/personalinfo/personalinfo'; //团长个人中心个人资料
import cart from '@/pages/cart/cart'; //购物车
import applyStore from '@/pages/applystore/applystore'; //店长申请页面
import applySuccess from '@/pages/applysuccess/applysuccess'; //店长申请提交成功页面
import applyReviewing from '@/pages/applyreviewing/applyreviewing'; //店长申请审核中面
import applyReviewfail from '@/pages/applyreviewfail/applyreviewfail'; //店长申请审核不通过面
import normalQuestion from '@/pages/normalquestion/normalquestion'; //常见问题
import aboutStore from '@/pages/aboutstore/aboutstore'; //关于章鱼掌柜
import siteMap from '@/pages/sitemap/sitemap'; //站点导航


export default [{
  //   path: '/',
  //   name: 'account',
  //   component: Account,
  //   desc: "C端个人中心",
  //   meta: {
  //     requireAuth: true
  //   },
  // },
  // {
    path: '/',
    name: 'discover',
    component: Discover,
    desc: "c端发现页"
    // meta: {
    //     keepAlive: true, // 此组件需要被缓存

    // }
  },
  {
    path: '/discover',
    name: 'discover',
    component: Discover,
    desc: "c端发现页",
    // meta: {
    //     keepAlive: true, // 此组件需要被缓存

    // }
  },
  {
    path: '/discover/:typeId',
    name: 'discover',
    component: Discover,
    desc: "c端发现页",
    hide: true
    // meta: {
    //     keepAlive: true, // 此组件需要被缓存

    // }
  },
  {
    path: '/account',
    name: 'account',
    component: Account,
    desc: "C端个人中心"
  },
  {
    path: '/account/:storeid',
    name: 'account',
    component: Account,
    desc: "C端个人中心(店铺)",
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/sexchoice',
    name: 'sexchoice',
    component: Sexchoice,
    meta: {
      requireAuth: true,
    },
    desc: "C端性别选择"
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    desc: "登录页"
  },
  {
    path: '/splice/:id',
    name: 'splice',
    component: Splice,
    hide: true
  },
  {
    path: '/list/:id',
    name: 'list',
    component: List,
    desc: "列表页"
  },
  {
    path: '/tagchoice',
    name: 'tagchoice',
    component: Tagchoice,
    meta: {
      requireAuth: true,
    },
    desc: "标签选择页",
    hide: true
  },
  {
    path: '/accounttag',
    name: 'accounttag',
    component: Tagchoice,
    meta: {
      requireAuth: true,
    },
    desc: "标签更改页",
    hide: true
  },
  {
    path: '/article',
    name: 'article',
    component: Article,
    hide: true
  },
  {
    path: '/scene/:id',
    name: 'scene',
    component: Scene,
    desc: "场景详情页",
    hide: true
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: Checkout,
    meta: {
      requireAuth: true,
    },
    desc: "支付页"
  },
  {
    path: '/checkout/:storeid',
    name: 'checkout',
    component: Checkout,
    meta: {
      requireAuth: true,
    },
    desc: "支付页",
    hide: true
  },
  {
    path: '/detail/:productId',
    name: 'detail',
    component: groupDetail,
    desc: "c端详情页（拼团）"
  },
  {
    path: '/detail/:storeid/:productId',
    name: 'detail',
    component: Detail,
    desc: "c端详情页（团长）"
  },
  {
    path: '/orders/order',
    name: 'orders',
    component: Orders,
    meta: {
      requireAuth: true,
    },
    desc: "c端普通订单页"
  },
  {
    path: '/orders/group',
    name: 'grouporders',
    component: GroupOrders,
    meta: {
      requireAuth: true,
    },
    desc: "c端团购订单页"
  },
  {
    path: '/address',
    name: 'address',
    component: Address,
    meta: {
      requireAuth: true,
    },
    desc: "地址填写页"
  },
  {
    path: '/topic/:id',
    name: 'topic',
    component: Topic,
    desc: "商品专题页(档期)",
    hide: true

  },
  {
    path: '/group/:groupId',
    name: 'group',
    component: Group,
    desc: "参团页",
    hide: true

  },
  {
    path: '/showorder/:postId',
    name: 'showorder',
    component: Showorder,
    desc: "晒单页",
    hide: true
  },
  {
    path: '/paysuccess/:orderId',
    name: 'paysuccess',
    component: Paysuccess,
    meta: {
      requireAuth: true,
    },
    desc: "c端支付成功页"
  },
  {
    path: '/payfail/:orderId',
    name: 'payfail',
    component: Payfail,
    meta: {
      requireAuth: true,
    },
    desc: "c端支付失败页"
  },
  {
    path: '/orderdetail',
    name: 'orderdetail',
    component: OrderDetail,
    meta: {
      requireAuth: true,
    },
    desc: "c端订单详情页"
  },
  {
    path: '/loginreturn',
    name: 'loginreturn',
    component: LoginReturn,
    hide: true
  },
  {
    path: '/commission',
    name: 'commission',
    component: Commission,
    meta: {
      requireAuth: true,
    },
    desc: "拼团个人中心页",
    hide: true
  },
  // {
  //   path: '/salesorders',
  //   name: 'salesorders',
  //   component: Salesorders,
  //   meta: {
  //     requireAuth: true,
  //   },
  //   desc: "团长推广订单页"
  // },
  {
    path: '/salesdetail',
    name: 'salesdetail',
    component: Salesdetail,
    meta: {
      requireAuth: true,
    },
    desc: "团长推广订单详情页",
    hide: true
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    desc: "注册页"
  },
  {
    path: '/confirm',
    name: 'confirm',
    component: Confirm,
    desc: "注册确认页"
  },
  {
    path: '/forgotpassword',
    name: 'forgotpassword',
    component: Forgotpassword,
    desc: "忘记密码页"
  },
  {
    path: '/resetpassword',
    name: 'resetpassword',
    component: Resetpassword,
    desc: "重置密码页"
  },
  {
    path: '/changepassword',
    name: 'changepassword',
    component: Changepassword,
    meta: {
      requireAuth: true,
    },
    desc: "修改密码页"
  },
  {
    path: '/setting',
    name: 'setting',
    component: Setting,
    meta: {
      requireAuth: true,
    },
    desc: "设置页",
    hide: true
  },
  {
    path: '/userdetail',
    name: 'userdetail',
    component: Userdetail,
    desc: "用户信息页"
  },
  {
    path: '/contactus',
    name: 'contactus',
    component: Contactus,
    desc: "contact us"
  },
  {
    path: '/store/detail/:productId',
    name: 'storedetail',
    component: storeDetail,
    desc: "团购详情页",
    meta: {
      requireAuth: true,
      mustStorer: true
    },
  },
  {
    path: '/store/manage',
    name: 'storemanage',
    component: storeManage,
    desc: "店铺管理",
    meta: {
      requireAuth: true,
      mustStorer: true
    },
  },
  {
    path: '/store/account',
    name: 'storeaccount',
    component: Storeaccount,
    desc: "店铺信息",
    meta: {
      requireAuth: true,
      // mustStorer: true
    },
  },
  {
    path: '/store/salelist/:storeid',
    name: 'storesalelist',
    component: storeSaleList,
    desc: "c端店铺页",
    meta: {
      requireAuth: true
    },
  },
  {
    path: '/store/info/:storeid',
    name: 'storeinfo',
    component: storeInfo,
    desc: "c端店铺信息页",
    meta: {
      requireAuth: true
    },
  },
  {
    path: '/store/choosegoods',
    name: 'storechoosegoods',
    component: storechoosegoods,
    desc: "选货首页",
    meta: {
      requireAuth: true,
      mustStorer: true
    },
  },
  {
    path: '/store/name/:storeid',
    name: 'storename',
    component: Storename,
    desc: "店铺名称修改",
    meta: {
      requireAuth: true,
      mustStorer: true
    },
  },
  {
    path: '/store/notice/:storeid',
    name: 'storenotice',
    component: Storenotice,
    desc: "店铺公告修改",
    meta: {
      requireAuth: true,
      mustStorer: true
    },
  },
  {
    path: '/store/email/:storeid',
    name: 'storeemail',
    component: Storeemail,
    desc: "店铺邮箱修改",
    meta: {
      requireAuth: true,
      mustStorer: true
    },
  },
  {
    path: '/store/address/:storeid',
    name: 'storeaddress',
    component: Storeaddress,
    desc: "店铺地址修改",
    meta: {
      requireAuth: true,
      mustStorer: true
    },
  },
  {
    path: '/store/orders',
    name: 'Storeorders',
    component: Storeorders,
    desc: "店铺订单列表页",
    meta: {
      requireAuth: true,
      mustStorer: true
    },
  },
  {
    path: '/store/orderdetail',
    name: 'Storeorderdetail',
    component: Storeorderdetail,
    desc: "店铺订单详情页",
    meta: {
      requireAuth: true,
      mustStorer: true
    },
  },
  {
    path: '/store/personal',
    name: 'personal',
    component: Personal,
    desc: "团长个人中心首页",
    meta: {
      requireAuth: true,
      mustStorer: true
    },
  },
  {
    path: '/store/personalinfo',
    name: 'personalinfo',
    component: Personalinfo,
    desc: "团长个人资料",
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/cart/:storeid',
    name: 'cart',
    component: cart,
    desc: "购物车页",
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/applystore',
    name: 'applyStore',
    component: applyStore,
    desc: "合伙人申请页",
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/applysuccess',
    name: 'applySuccess',
    component: applySuccess,
    desc: "合伙人申请提交成功页",
    meta: {
      requireAuth: true,
    },
  }, 
  {
    path: '/applyreviewing',
    name: 'applyReviewing',
    component: applyReviewing,
    desc: "合伙人申请审核中页",
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/applyreviewfail',
    name: 'applyReviewfail',
    component: applyReviewfail,
    desc: "合伙人申请审核不通过页",
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/normalquestion',
    name: 'normalquestion',
    component: normalQuestion,
    desc: "常见问题"
  },
  {
    path: '/aboutstore',
    name: 'aboutStore',
    component: aboutStore,
    desc: "关于章鱼掌柜"
  },
  {
    path: '/map',
    name: 'map',
    component: siteMap,
    hide: true
  },
  {
    path: '*',
    name: 'index',
    redirect: '/',
    hide: true,
    meta: {
      requireAuth: true
    },
  }
];