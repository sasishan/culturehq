<template>
  <div class="container">
    <div class="row center">
      <div class="card mx-auto shadow-sm mt-4" style="min-width: 20rem;">
        <div class="card-header darkPrimary text-white">
        Reset your Password
        </div>  
        <div class="card-body">
          <span v-if="formState=='resetPassword'">                  
            <input type="email" v-model="form.login" id="inputEmail" class="form-control" placeholder="Email address" required autofocus>
            <button class="btn btn-primary darkPrimary mt-4 float-right shadow-sm" @click="resetCode">Send Code</button>
          </span>
          <span v-if="formState=='resetCode'">   
            <input type="email" v-model="form.login"  class="form-control" placeholder="Email address" required autofocus>
            <input type="text" v-model="code" id="code" class="form-control" placeholder="Code" required autofocus>
            <input type="password" v-model="form.password" id="inputPass" class="form-control mt-3" placeholder="New password" required v-on:keyup.enter="signIn">            
            <button class="btn btn-primary darkPrimary mt-4 float-right shadow-sm" @click="verify">Submit</button>            
          </span>
          <p class="red--text ml-1 pa-3" v-if="errorExists">{{error.message}}</p>
        </div>
      </div>      
    </div>
  </div>  
<!--   <v-container
    class="fill-height"
    fluid>    
     <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-2  ">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Reset Your Password</v-toolbar-title>     
              <div class="flex-grow-1"></div>   
            </v-toolbar>
            <span v-if="formState=='resetPassword'">                  
              <v-card-text>
                <v-form>
                  <v-text-field
                    label="email"
                    v-model="form.login"
                    type="text"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn color="primary" @click="resetCode">Send Code</v-btn>
              </v-card-actions>
            </span>

            <span v-if="formState=='resetCode'">                  
              <v-card-text>
                <v-form>
                  <v-text-field
                    label="email"
                    required
                    v-model="form.login"
                    type="text"></v-text-field>
                  <v-text-field
                    label="Confirmation Code"
                    v-model="code">
                    </v-text-field>
                  <v-text-field
                    id="password"
                    required
                    label="New Password"
                    v-model="form.password"
                    type="password" ></v-text-field>                    
                </v-form>
              </v-card-text>
              <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn color="primary" @click="verify">Submit</v-btn>
              </v-card-actions>
              <p class="ml-1 pa-3">Resend Code</p>
            </span>            

            <p class="red--text ml-1 pa-3" v-if="errorExists">{{error.message}}</p>
          </v-card>
      </v-col>
    </v-row>
  </v-container> -->
</template>
<script>
import { Auth } from 'aws-amplify'
import { AmplifyEventBus } from 'aws-amplify-vue';
// import Comms from './Comms';
// import { URLS } from '../config.js';

export default 
{
  name: 'Forgot',
  data: () => (
  {  
    formState: 'resetPassword',
    form: {
        login: '',
      },
    code:'',
    error:{},
    errorExists:false
  }),
  components: 
  {
  },
  methods:
  {
    clearError()
    {
      this.error = {};
      this.errorExists=false;
    },
    setError(error)
    {
      this.error = error;
      this.errorExists=true;
    },    
    async resetCode()
    {
      this.clearError();  
      const login = this.form.login;

      this.$Amplify.Auth.forgotPassword(login)
        .then(() => {
          this.sent = true;
          this.setError({message: 'Code has been resent.'})
          this.formState='resetCode';
        })
        .catch(e => this.setError(e));
    },
    async verify() {
      this.clearError();  
      const login = this.form.login;
      const password = this.form.password;
      var vm = this;
      this.$Amplify.Auth.forgotPasswordSubmit(login, this.code, password)
        .then(() => {
          console.log('password changed!');
          AmplifyEventBus.$emit('authState', 'signIn');
          this.formState='signIn';
          console.log('password changed!');
          return vm.$emit('authState', 'signIn');
        })
        .catch(e => this.setError(e));
    },    
  },
  mounted()
  {
  },
}
</script>