<template>
  <div id="app">
    <MainMenu v-if="isSignedIn"/>
    <router-view :key="$route.fullPath" ></router-view>     
  </div>
</template>

<script>
import MainMenu from './components/menus/MainMenu.vue';
import { Auth } from 'aws-amplify';
import { AmplifyEventBus } from 'aws-amplify-vue';

export default {
  name: 'App',

  components: {
    MainMenu,
  },
  data: () => (
  {  
    signedIn : false
  }),  
  computed: 
  {
    isSignedIn()
    {
      return this.signedIn;
    },    
  },
  async beforeCreate() 
  {
    await Auth.currentAuthenticatedUser()
    .then(user => 
    {
      console.log('authenticated - main');
      this.signedIn=true;
      // this.$router.push({name: 'home'})
    })
    .catch(err => 
    {
      console.log('not authenticated'); 
      // this.$router.push({name: 'signin'})
    });

    AmplifyEventBus.$on('authState', info => 
    {
      if (info === 'signedIn') {
        this.signedIn = true
        this.$router.push({name: 'home'})
      }

      if (info === 'signedOut') {
        this.signedIn = false
        this.$router.push({name: 'authentication'})
      }
    });
  },   
}
</script>

<style>
.lightBackground
{
  background: #f7f7f7;
}  

.darkPrimary
{
  background: #1976d2;
  
}

#app {
/*  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;*/

  /*background-image: linear-gradient(180deg, #ff8a00, #e52e71) !important;*/
  
}
</style>
