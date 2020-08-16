<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <a class="navbar-brand" href="#">CultureHQ</a>
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
    </div>
  </nav>  
</template>

<script>
import MenuItem from './MenuItem';

export default {
  name: 'MainMenu',
  components: 
  {
    MenuItem
  },
  props: 
  {
    test: {}
  },  
  computed: 
  {
    routes() 
    {
      return this.$router.options.routes;
    }    
  },
  data: () => (
  {  
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
  }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>