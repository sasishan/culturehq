<template>
  <div class="col-12">
	<button type="button" class="btn btn-sm btn-outline-primary float-right mb-2 mt-2"><small>New Employee</small></button>
    <br>
    <table class="table table-responsive small">
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Manager</th>
          <th></th>
          <!-- <th>Permissions</th> -->
        </tr>
      </thead>   
      <tbody>
      <tr v-for="user in users" :key="user.userId" class="mt-2">
        <td>{{user.fName}}</td>
        <td>{{user.lName}}</td>
        <td>{{user.email}}</td>
        <td>{{user.managerFName}} {{user.managerLName}}</td>
        <!-- <td>{{user.permissions}}</td> -->
        <td>Edit</td>
      </tr>
      </tbody>   
    </table>
  </div>
</template>

<script>

import Comms from '../../Comms';
import { URLS } from '../../../Constants.js';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';

export default {
  name: 'Admin_Users',
  components: 
  {
  },
  props: 
  {
    test: {}
  },  
  computed: 
  {
  },
  data: () => (
  {  
	users:[],
    logs:[],
    surveyResponses:[]
  }),
  async mounted()
  {
    await this.loadUsers();
    // await this.loadSurveyResponses();
    // this.buildLogs();
  },
  created()
  {

  },
  methods:
  {
    initialize () {
    },
    buildLogs()
    {
      for (var i=0; i<this.logs.length; i++)
      {
        var l = this.logs[i];
        for (var j=0; j<this.surveyResponses.length;j++)
        {

          var r = this.surveyResponses[j];

          if (l.questionId==JSON.parse(r.questionId) && l.toEmail.toLowerCase()==r.sender.toLowerCase())
          {

            l.responded="Yes";
            break;
          }
        }
      }
    },
    async loadUsers()
    {
      var url= URLS.getUsers;

      var response = await Comms.get(url).catch((error) => 
      { 
        return {};
      });

      if (response)
      {
        this.users = [];
        for (var i=0; i< response.length; i++)
        {
          // response[i].responded="No";
          this.users.push(response[i]);
        }        
      }


      return this.users;
    },  
    async loadSurveyResponses()
    {
      var url= URLS.surveyResponses;

      var response = await Comms.get(url).catch((error) => 
      { 
        return {};
      });

      if (response && response.Items)
      {
        this.surveyResponses = [];
        for (var i=0; i< response.Items.length; i++)
        {          
          this.surveyResponses.push(response.Items[i]);
        }
      }
      return this.surveyResponses;
    },         
  }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>