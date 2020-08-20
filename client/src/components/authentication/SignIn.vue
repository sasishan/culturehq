<template>
  <div class="container">
    <div class="row center">
      <div class="card mx-auto shadow-sm mt-4" style="min-width: 20rem;">
        <div class="card-header darkPrimary text-white">
          {{ formState === 'signIn' ? 'Please Sign In' : 'Complete Sign Up' }}
        </div>        
        <div class="card-body">
          <span v-if="formState=='signIn'">
            <input type="email" v-model="form.login" id="inputEmail" class="form-control" placeholder="Email address" required autofocus>
            <input type="password" v-model="form.password" id="inputPass" class="form-control mt-3" placeholder="password" required v-on:keyup.enter="signIn">
              <pulse-loader class="mt-4 ml-2 float-left" color="#1976d2" size="10px" :loading="signingIn"></pulse-loader>
              <button class="btn btn-primary darkPrimary mt-4 float-right shadow-sm" :class="signingIn? 'disabled': ''" @click="signIn">Sign In</button>
          </span>

          <span v-if="formState=='confirmSignUp'">   
            <input type="email" v-model="form.login" id ="email" class="form-control" placeholder="Email address" required autofocus>
            <input type="text" v-model="code" id="Confirmation" class="form-control mt-3" placeholder="Confirmation Code">
            <button class="btn btn-primary darkPrimary mt-4 float-right shadow-sm" @click="confirmSignUp">Confirm Code</button>
            <p class="ml-1 pa-3">Resend Code</p>
          </span>           
        </div>
      </div>
    </div>  

  </div>
</template>

<script>
import { Auth } from 'aws-amplify';
import { AmplifyEventBus } from 'aws-amplify-vue';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
// import { URLS } from '../config.js';

export default {
  name: 'SignIn',
  components: 
  {
    PulseLoader
  },
  props: 
  {
  },  
  computed: 
  {
  },
  data: () => (
  {  
    formState: 'signIn',
    form: {
        login: '',
        password: ''
      },
    code:'',
    error:{},
    errorExists:false,
    signingIn:false  
  }),
  mounted()
  {
  },
  created()
  {
  },
  methods:
  {
    async confirmUser(username, id, callback)
    {
      var person = 
      {
        username: username,
        userId: id
      };
      // return callback(null, result);
      // var url = URLS.RegisterNewUser;      
      // Comms.anonymousPost(url, person, function (error, result)
      // {
      //   if (error)
      //   {
      //     console.log(error);
      //     return callback(error, null);
      //   }
      //   console.log('Person registered');
      //   return callback(null, result);
      // });   
    },      
    clearError(error)
    {
      this.$emit('clearError');
    },    
    setError(error)
    {
      this.$emit('error', error);
    },
    async resendCode()
    {
        this.clearError();  
        const login = this.form.login;

        this.$Amplify.Auth.resendSignUp(login)
            .then(() => {
              console.log('resending code');
              this.setError({message: 'Code has been resent.'})
              return;
            })
            .catch(e => this.setError(e));
    },
    async confirmSignUp()
    {
        this.clearError();  
        this.form.password='';
        const login = this.form.login;
        const code = this.code;

        this.$Amplify.Auth.confirmSignUp(login, code)
          .then(data => 
          {
            AmplifyEventBus.$emit('authState', 'signIn');

            this.formState='signIn';
          })
          .catch(e => this.setError(e));
    },
    signingInComplete(eventName)
    {
      this.signingIn=false;
      AmplifyEventBus.$emit('authState', eventName);
    },
    async signIn()
    {
      this.clearError();  
      this.signingIn=true;

      const { login, password } = this.form;

      Auth.signIn(login, password)
      .then(data => 
      {
        if (data.challengeName === 'SMS_MFA' || data.challengeName === 'SOFTWARE_TOKEN_MFA') 
        {
          AmplifyEventBus.$emit('localUser', data);
          // return AmplifyEventBus.$emit('authState', 'confirmSignIn')
          return this.signingInComplete('confirmSignIn');
        } 
        else if (data.challengeName === 'NEW_PASSWORD_REQUIRED') 
        {
          AmplifyEventBus.$emit('localUser', data);
          // return AmplifyEventBus.$emit('authState', 'requireNewPassword');
          return this.signingInComplete('requireNewPassword');
        } 
        else if (data.challengeName === 'MFA_SETUP') 
        {
          AmplifyEventBus.$emit('localUser', data);
          // return AmplifyEventBus.$emit('authState', 'setMfa');
          return this.signingInComplete('setMfa');
        } 
        else if (data.challengeName === 'CUSTOM_CHALLENGE' &&
          data.challengeParam &&
          data.challengeParam.trigger === 'true'
        ) 
        {
          AmplifyEventBus.$emit('localUser', data);
          // return AmplifyEventBus.$emit('authState', 'customConfirmSignIn')
          return this.signingInComplete('customConfirmSignIn');
        } 
        else 
        {
          // return AmplifyEventBus.$emit('authState', 'signedIn');
          return this.signingInComplete('signedIn');
        }
      })
      .catch((e) => {
        if (e.code && e.code === 'UserNotConfirmedException')
        {
          AmplifyEventBus.$emit('localUser', {username: login });
          // AmplifyEventBus.$emit('authState', 'confirmSignUp');
          this.signingInComplete('confirmSignUp');
          this.formState = 'confirmSignUp';
        } 
        else 
        {
          // console.log(e);
          this.signingIn=false;
          this.setError(e);
        }
      });
    }
  },
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.sharp-card {
    border-radius: 0;
} 
</style>