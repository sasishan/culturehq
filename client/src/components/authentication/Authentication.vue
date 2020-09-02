<template>
  <div class="container">    
    <h1 class="text-center mt-5"><b>CultureHQ</b></h1>  
      <SignIn v-if="shouldBeSignInPage" @error="setErrorMessage" @clearError="clearErrorMessage"></SignIn>
      <Forgot v-if="shouldBeForgotPage" @authState="authStateChanged"></Forgot>
      <p class="text-center text-danger mt-3" v-if="errorExists">Error: {{error.message}}</p>
      <p class="text-center mt-3" v-if="!errorExists">.</p>
      <div class="text-center" v-if="shouldBeSignInPage">
        <p class="mt-4 small">
          Forgot your password? <span class="ml-2 text-primary" style="cursor: pointer" @click="forgot">Reset password</span>
        </p> 
      </div>
      <div class="text-center" v-if="shouldBeForgotPage">
        <div class=" mt-4 small">
          Back to<span class="ml-2 text-primary" style="cursor: pointer" @click="signIn">Sign in</span>
        </div>
      </div>       
  </div>
</template>
<script>
import SignIn from './SignIn';
import { Auth } from 'aws-amplify'
// import SignUp from './SignUp';
import Forgot from './Forgot';

export default 
{
  name: 'Authentication',
  data: () => (
  {  
    formState: 'signIn',
    errorExists:false
  }),
  components: 
  {
    SignIn, 
    Forgot
    // SignUp,
    // Forgot
  },
  async beforeCreate() 
  {
    await Auth.currentAuthenticatedUser()
    .then(user => 
    {
      this.$router.push({name: 'home'})
      this.signedIn=true;
      // this.$router.push({name: 'home'})
    })
    .catch(err => 
    {
      // this.$router.push({name: 'signin'})
    });
  },     
  computed:
  {
    shouldBeSignInPage()
    {
      return (this.formState=='signIn' || this.formState=='confirmSignUp');
    },
    shouldBeSignUpPage()
    {
      return (this.formState=='signUp');
    },
    shouldBeForgotPage()
    {
      return (this.formState=='forgot');
    }
  },
  methods:
  {
    clearErrorMessage()
    {
      this.error = {};
      this.errorExists=false;
    },
    setErrorMessage(error)
    {
      this.error = error;
      this.errorExists=true;
    },    
    authStateChanged(value)
    {
      this.formState=value;  
    },
    signUp()
    {
      this.formState='signUp';
    },
    signIn()
    {
      this.formState='signIn';
    }
    ,
    forgot()
    {
      this.formState='forgot';
    }    
  },
  mounted()
  {
  },
  beforeDestroy()
  {
  },
}
</script>