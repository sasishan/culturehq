<template>
  <div class="col-12">
    <br>
    <table class="table small">
      <thead>
        <tr>
          <th>Sent</th>
          <th>To</th>
          <th>QId</th>
          <th>Question</th>
          <th>Responded?</th>
        </tr>
      </thead>   
      <tbody>
      <tr v-for="log in logs" :key="log.id" class="mt-2">
        <td>{{ log.dateSent  | moment("MM/DD/YY HH:MM:ss") }} </td>
        <td>{{log.toEmail}}</td>
        <td>{{log.questionId}}</td>
        <td>{{log.question}}</td>
        <td>{{log.responded}}</td>
        <td></td>
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
  name: 'AddGoal',
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
    logs:[],
    surveyResponses:[]
  }),
  async mounted()
  {
    await this.loadLogs();
    await this.loadSurveyResponses();
    this.buildLogs();
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
    async loadLogs()
    {
      var url= URLS.getLogs;

      var response = await Comms.get(url).catch((error) => 
      { 
        return {};
      });

      if (response)
      {
        this.logs = [];
        for (var i=0; i< response.length; i++)
        {
          response[i].responded="No";
          this.logs.push(response[i]);
        }        
      }

      return this.logs;
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