import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import uploadMulti from './modules/uploadMulti'
import editor from './modules/editor'

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		user,
		uploadMulti,
		editor,
	},
	strict: process.env.NODE_ENV !== 'production'
})