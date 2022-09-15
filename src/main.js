// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueBootstrap4Table from 'vue-bootstrap4-table'

// fix bug cho filter select
import 'bootstrap/dist/css/bootstrap.min.css'
import 'jquery/src/jquery.js'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'font-awesome/css/font-awesome.min.css'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import Row from "vue-bootstrap4-table"
import CheckBox from "vue-bootstrap4-table"
import SelectAllRowsCheckBox from "vue-bootstrap4-table"
import SortIcon from "vue-bootstrap4-table"
import Pagination from "vue-bootstrap4-table"
import FilterOrder from "vue-bootstrap4-table"
import MultiSelect from "vue-bootstrap4-table"
import VueColumnsResizable from 'vue-columns-resizable'
// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
Vue.use(VueBootstrap4Table)
Vue.use(Row)
Vue.use(CheckBox)
Vue.use(SelectAllRowsCheckBox)
Vue.use(SortIcon)
Vue.use(Pagination)
Vue.use(FilterOrder)
Vue.use(MultiSelect)
Vue.use(VueColumnsResizable);
// Vue.use(jQuery)

Vue.config.productionTip = false
export const eventBus = new Vue()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
