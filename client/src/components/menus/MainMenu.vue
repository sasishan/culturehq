<template>
  <div> 
  <nav class="navbar navbar-expand-lg navbar-dark bg-green">
    <a class="navbar-brand" href="#"><b>Sprout</b></a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="nav navbar-nav" id="myTabMD" role="tablist">
          <li class="nav-item" v-for="(route, index) in routes" :key="index">
            <MenuItem :data="route" />
          </li>

<!--           <li class="nav-item">
            <a class="nav-link active" id="home-tab-md" data-toggle="tab" href="#culture-md" role="tab" aria-controls="home-md"
              aria-selected="true"><small>Home</small></a>
          </li>        
          <li class="nav-item">
            <a class="nav-link" id="home-tab-md" data-toggle="tab" href="#culture-md" role="tab" aria-controls="home-md"
              aria-selected="true"><small>Culture</small></a>
          </li>
          <li class="nav-item">
            <a class="nav-link" id="profile-tab-md" data-toggle="tab" href="#one-on-ones" role="tab" aria-controls="profile-md"
              aria-selected="false"><small>1-on-1s</small></a>
          </li> -->
        </ul>     
        <ul class="navbar-nav flex-row ml-md-auto d-none d-md-flex small">
          <li class="nav-item dropdown text-white">
            <img class="rounded-circle mr-3" src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" width="40px"/> 
          </li>
          <li class="nav-item dropdown text-white mt-1">
            <button class="btn btn-sm btn-white" @click="signOut"><small>Sign Out</small></button>
          </li>
        </ul>
    </div>
  </nav> 
  </div> 
</template>

<script>
import MenuItem from './MenuItem';
// import SignIn from './SignIn';
// import Avatar from './Avatar'
import { Auth } from 'aws-amplify';
import { AmplifyEventBus } from 'aws-amplify-vue';
export default {
  name: 'MainMenu',
  components: 
  {
    MenuItem
  },
  props: 
  {
    
  },  
  computed: 
  {
    routes() 
    {
      return this.$router.options.routes;
    },
    isSignedIn()
    {
      return this.signedIn;
    },    
  },
  data: () => (
  {  
      signedIn : false
  }),
    
  mounted()
  {
  },
  created()
  {
    this.initialize();
  },
  methods:
  {
    initialize () {
    },
    signOut()
    {
      this.$Amplify.Auth.signOut()
        .then(() => 
        {
          return AmplifyEventBus.$emit('authState', 'signedOut')
          
        })
        .catch(e => console.log(e.message));
      },
      setError: function(e) {
        this.error = this.$Amplify.I18n.get(e.message || e);
        this.logger.error(this.error)
      }     
  }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>