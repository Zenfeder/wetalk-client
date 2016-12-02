import Vue from 'vue'
// import VueSocketio from 'vue-socket.io'

import App from './App' // 根组件
import router from './router'
import store from './store/index' 
import filter from './filter'
// import api from './common/api.js'

// Vue.use(VueSocketio, api.host)

filter(Vue)

new Vue({
	store: store,
	router: router,
	render: h => h(App)
}).$mount('#root')
