import Vue from 'vue'
import Router from 'vue-router'

const LazyLoading = file => () => import(`@/pages/${file}.vue`)

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component:  LazyLoading('login')
    },{
      path: '/register',
      name: 'register',
      component: LazyLoading('register')
    },{
      path: '/test',
      name: 'test',
      component: LazyLoading('test')
    },{
    	path: '/',
      name: 'home',
      component: LazyLoading('app'),
      children: [{
	      path: '',
	      name: 'main',
	      component: LazyLoading('main')
	    },{
	      path: '/room/addRoom',
	      name: 'addRoom',
	      component: LazyLoading('room/addRoom')
	    },{
	      path: '/room/roomList',
	      name: 'roomList',
	      component: LazyLoading('room/roomList')
	    },{
	      path: '/manage/manageHome',
	      name: 'manageHome',
	      component: LazyLoading('manage/home')
	    },{
	      path: '/manage/basicSetting',
	      name: 'basicSetting',
	      component: LazyLoading('manage/basic')
	    },{
        path: '/house/houseSetting',
        name: 'houseSetting',
        component: LazyLoading('house/houseSetting')
      },{
        path: '/house/houseList',
        name: 'houseList',
        component: LazyLoading('house/houseList')
      },{
        path: '/simulate',
        name: 'simulate',
        component: LazyLoading('simulate/simulate')
      },{
        path: '/simulate/register',
        name: 'toCRegister',
        component: LazyLoading('simulate/register')
      },{
        path: '/user/userList',
        name: 'userList',
        component: LazyLoading('manage/user')
      },{
        path: '/order/orderList',
        name: 'orderList',
        component: LazyLoading('manage/order')
      },]
    },
  ]
})

// router.beforeEach((to, from, next) => {
// 	let userInfo = sessionStorage.getItem('token');
//   if(userInfo) {
//   	next();
//   } else {
//   	if(to.path == '/login' || to.path == '/register') {
//   		next();
//   	} else {
//   		next('/login');
//   	}
//   }
// })

export default router