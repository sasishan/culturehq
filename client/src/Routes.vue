<script>

import Home from './components/pages/Home.vue';
import Culture from './components/pages/Culture.vue';
import OneOnOnes from './components/pages/1on1s.vue';
import Authentication from './components/authentication/Authentication.vue';

const routes = [
	{ path: '/', redirect: { name: "home" }, meta:{} },
    { path: '/home', name: 'home', component: Home, meta: { display: true, label: 'Home', requiresAuth: true }},
    { path: '/culture', name: 'culture', component: Culture, meta: { display: true, label: 'Culture', requiresAuth: true }},
    { path: '/1on1s', name: '1on1s', component: OneOnOnes, meta: { display: true, label: '1-on-1s', requiresAuth: true }},
	{ path: '/Admin', name: 'Admin', component: OneOnOnes, meta: { display: true, label: 'Admin', requiresAuth: true }},
    { path: '/authentication', name: 'authentication', component: Authentication, meta:{  display: false, requiresAuth: false }}  
    // { path: '/goals/:id', name: 'goals', component: OneGoalPage, meta: { requiresAuth: true }, params: true},

];

export default routes

</script>