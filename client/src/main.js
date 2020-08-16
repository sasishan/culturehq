import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router';

Vue.config.productionTip = false

import routes from './Routes.vue'
const router  = new VueRouter ({routes});
Vue.use(VueRouter);

Vue.use(require('vue-moment'));

new Vue({	
	router,
	render: h => h(App),
}).$mount('#app')
