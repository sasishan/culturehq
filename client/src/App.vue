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

.darkPrimary
{
  background: #1976d2;
  
}

#app {
  /*font-family: Open Sans,sans-serif;*/
  /*font-family: Avenir, Helvetica, Arial, sans-serif;*/
  /*-webkit-font-smoothing: antialiased;*/
  /*-moz-osx-font-smoothing: grayscale;*/
  /*text-align: center;*/
  /*color: #2c3e50;*/

  /*background-image: linear-gradient(180deg, #ff8a00, #e52e71) !important;*/
  
}

.minHeight
{
  min-height: 500px;
}

.listItem
{
  margin-top: 5px;
}

.borderGreen
{
  border: 1px solid #41b883;
}

.borderGrey1
{
  border: 1px solid #CCC;
}

.borderGrey2
{
  border: 1px solid #BBB;
}


.backgroundGrey1
{
  background: #FFF;
}

.backgroundGrey2
{
  background: #EEE;
}

.backgroundGrey3
{
  background: #f8f9fe;
}

.backgroundGrey4
{
  background: #CCC;
}

.myContainer 
{
  margin: auto;
  /*padding-left: 10px;*/
  /*padding-right: 10px;*/
  /*padding: 20px;*/
 /*margin-left: 100px;*/
 /*margin-right: 20px;*/

}
.sidebar{
  border-radius: 2px;
  background: #EEE !important;
  min-height: 1000px;
  /*color: white;*/
  /*border: "1px black";*/
  margin-left: 20px;
  margin-top: auto;
  margin-bottom: auto;
  padding: 40px;
  width: 70%;
  min-width: 300px;
}

.nav-pills .nav-link.active, .nav-pills .show>.nav-link {
    /*color: #ff8a00;*/
    color: #1976d2;
    background: none; 
    /*border-bottom: 5px solid #ff8a00;*/
    border-bottom: 5px solid #41b883;
    
    /*border-bottom: 5px solid #1976d2;*/
    border-bottom-right-radius: 0px;
    border-bottom-left-radius: 0px;
}

nav .nav a{
  /*color: #ffc076;*/
  color: #8fc0f1;
  
  }

.nav-pills {
    /*border-bottom: 1px solid #ff8a00;*/
    border-bottom: 1px solid #41b883;
    
    /*border-bottom: 1px solid #1976d2;*/
}


  .bg-green
  {    
    background: #28a745 !important;
  }
/* Style the input fields */

  input {
    padding: 10px;
    width: 100%;
    font-size: 12px;
    border: 1px solid #aaaaaa;
  }

  .drop-zone {
    background-color: #eee;
    margin-bottom: 10px;
    padding: 10px;
  }

  .drag-el {
    background-color: #fff;
    margin-bottom: 10px;
    padding: 5px;
  }

  .gradientColor
  {
    /*background-image: linear-gradient(180deg, #ff8a00, #ff4a00);*/
    /*background-image: linear-gradient(180deg, #ff8a00, #e52e71);*/
    /*//e52e71    */
    /*de7c09*/    
    /*background-image: linear-gradient(180deg, #ff7500, #ff7500);*/
    /*background-image: linear-gradient(180deg, #9acbff, #9acbff);*/
    
    /*background-image: linear-gradient(180deg, #428bca, #428bca);*/
    /*background-image: linear-gradient(180deg, #ddd, #ddd);*/
    /*background: #428bca;*/
    background: #ff8a00;
    padding-top: 40px;
    padding-bottom: 40px;
    /*min-height: 800px;*/
    /*//e52e71    */
    /*de7c09*/
  } 

  .titleColor
  {
    /*color: #ff8a00;*/
    color: #428bca;
  }

  .titleColor2
  {
    color: #ff8a00;
  }

  .subtitleColor
  {
    color: #e52e71;
  }

  .whiteBackground
  {
    background: #FFF;
  }      

  .yellowBackground1
  {
    background: #ffe3c3;
  }      

  .noborder{
    border: 0;
  }

  .sharp-card {
      border-radius: 0;
  } 

  .btn-outline-grey {
    color: #000;
    border-color: #AAA;
  }


  .clickable
  {
    cursor: pointer;
  }

 .lightBackground
{
  background: #f7f7f7;
}  


.regForm {
  /*background-image: linear-gradient(180deg, #ff8a00, #e52e71);*/
  border-radius: 2px;
  background: #FFF !important;
  min-height: 1000px;
  /*color: white;*/
  border: "1px black";
  margin: 20px auto;
  padding: 40px;
  width: 70%;
  min-width: 300px;
}

.backgroundBlank
{
  background: transparent !important;
} 


.menu-font
{
  font-size: 0.9em;
  /*font-weight: 500;*/
}

.btn-white {
  background-color: hsl(0, 0%, 100%) !important;
  border-color: #AAA;
  /*color: #333 !important;*/
}
</style>
