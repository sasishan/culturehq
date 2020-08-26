import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'; 

// eslint-disable-next-line no-unused-vars
import Amplify, { Auth } from 'aws-amplify';
import  * as AmplifyModules from 'aws-amplify';
import { AmplifyPlugin } from 'aws-amplify-vue';

Vue.config.productionTip = false

Amplify.configure({
    Auth: {
        //see details: https://aws-amplify.github.io/docs/js/authentication#manual-setup
        // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
        identityPoolId: 'us-west-2:cf46e7cc-43c4-41e1-9887-92916cca6d5f',
        
        // REQUIRED - Amazon Cognito Region
        region: 'us-west-2',

        // OPTIONAL - Amazon Cognito Federated Identity Pool Region 
        // Required only if it's different from Amazon Cognito Region
        identityPoolRegion: 'us-west-2',

        // OPTIONAL - Amazon Cognito User Pool ID
        userPoolId: 'us-west-2_r1pPxWnDM',

        // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
        userPoolWebClientId: '68ros0jmp40l83b82f0re4vjqp',

        // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
        mandatorySignIn: true,
    }
});


import routes from './Routes.vue'
const router  = new VueRouter ({routes});
Vue.use(VueRouter);
router.beforeEach((to, from, next) => 
{
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // this route requires auth, check if logged in
        // if not, redirect to login page.
        Auth.currentSession()
        .then(function(session)
        {
            if (session)
            {
                next();
            }
            else
            {
                next({
                    name: 'authentication',
                    query: { redirect: to.fullPath } })                
            }
        }, 
        function(err) {
            // console.log(err);
            next({
                    name: 'authentication',
                    query: { redirect: to.fullPath } })  
        });
    }
    else
    {
        next();
    }
})


Vue.use(AmplifyPlugin, AmplifyModules);
Vue.use(require('vue-moment'));

new Vue({	
	router,
	render: h => h(App),
}).$mount('#app')
