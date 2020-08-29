<script>

import Home from './components/pages/Home.vue';
import Culture from './components/pages/Culture.vue';
import QuestionBuilder from './components/pages/QuestionBuilder.vue';
import Admin from './components/pages/Admin.vue';
import Authentication from './components/authentication/Authentication.vue';

const routes = [
	{ path: '/', redirect: { name: "culture" }, meta:{} },
    { path: '/home', name: 'home', component: Home, meta: { display: false, label: 'Home', requiresAuth: true }},
    { path: '/culture', name: 'culture', component: Culture, meta: { display: true, label: 'Culture', requiresAuth: true }},
    { path: '/questionbuilder', name: 'questions', component: QuestionBuilder, meta: { display: true, label: '1-on-1s', requiresAuth: true }},    
    // { path: '/1on1s', name: '1on1s', component: OneOnOnes, meta: { display: true, label: '1-on-1s', requiresAuth: true }},
	// { path: '/hradmin', name: 'HR Admin', component: HRAdmin, meta: { display: true, label: 'HR Admin', requiresAuth: true }},
	{ path: '/admin', name: 'Admin', component: Admin, meta: { display: true, label: 'Admin', requiresAuth: true }},
    { path: '/authentication', name: 'authentication', component: Authentication, meta:{  display: false, requiresAuth: false }},
    // { path: '/1on1s/start', name: 'start-1on1', component: OneOnOnes, meta: { display: false, label: 'Start 1-on-1', requiresAuth: true }}

];

export default routes

</script>