import Vue from 'vue'
import Router from 'vue-router'
import OrderDashboard from '@/components/OrderDashboard'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'OrderDashboard',
      component: OrderDashboard
    }
  ]
})
