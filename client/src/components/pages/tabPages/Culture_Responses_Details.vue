<template>
  <span>
    <div class="row ml-2 p-2 mr-2 mt-2 lightBackground" >              
      <div class="col-5">
        {{response.managerName}} <span v-if="isMe">(You)</span>
      </div>
      <div class="col-2">
        <small>{{numberOfResponses}}</small>
      </div>

      <div class="col-1">
        <span :class="scoreColor"> 
          <b>{{responseScore}}</b>
        </span>
      </div>   
      <div class="col-1">
      </div>                           
      <div class="col-3">
        <canvas :id="canvasId"  style="background: white; border: 1px solid #DDD; padding: 0px" ></canvas>
      </div>
    </div>
  </span>
</template>
<script>

// import Comms from './Comms';

export default {
  name: 'Culture_Responses_Details',
  components: 
  {
  },
  props: 
  {
    selectedSurveyQuestion:{},
    response:{},
    numberOfResponses:{},
    responseScore: {},
    scoreColor:{},
    canvasId: {},
    recommendation:{},
    isMe:{}
  },  
  computed: 
  {
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
    // getTotalResponseScore(calculatedResponses, qId)
    // {
    //   if (qId && calculatedResponses[qId] && this.getNumberResponses(calculatedResponses, qId)>0)
    //   {
    //     return ((calculatedResponses[qId].totalValue/(this.getNumberResponses(calculatedResponses, qId))).toFixed(1));
    //   }
    //   else
    //   {
    //     return 'Not enough data';
    //   }
    // },    
    // getNumberResponses(calculatedResponses, qId)
    // {
    //   if (qId && calculatedResponses[qId])
    //   {
    //     return calculatedResponses[qId].numResponses;
    //   }
    //   else
    //   {
    //     return 0;
    //   }
    // },

  }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>