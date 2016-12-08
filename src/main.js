import Vue from 'vue'
import Search from './components/Search'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Landing = {
  template: '<Search/>',
  components: { Search }
}
const Graph = { template: '<div>bar</div>' }

const routes = [
  { path: '/', component: Landing },
  { path: '/graph', component: Graph }
]

const router = new VueRouter({
  routes: routes
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router: router
}).$mount('#app')

