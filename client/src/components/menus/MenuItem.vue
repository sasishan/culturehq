<template>
  <router-link exact-active-class="active" class="nav-link" :to="{name: data.name}" v-if="displayRoute">
    <small class="menu-font">{{data.meta.label || data.name}}</small>
  </router-link>
</template>

<script>
export default {
  name: 'MenuItem',
  components: 
  {
  },
  props: 
  {
    data: Object
  },  
  computed: 
  {
    displayRoute() 
    {
      if (this.data.meta.display === undefined || this.data.meta.display) {
        return true;
      }
      return false;
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