<template>
  <span>
    <div class="card-text">  
      <div class="mb-3">
        <small><b>Overall Score:</b></small>
        <span class="ml-2" :class="scoreColor"> 
          <b>{{responseScore}}</b>
        </span>
      </div>
      <p class="card-text">           
        <canvas :id="canvasId" width="400" height="100" style="border: 0px solid #DDD;"></canvas>
      </p>
    </div>
  </span>
</template>
<script>

// import Comms from './Comms';

export default {
  name: 'Culture_Responses_Summary',
  components: 
  {
  },
  props: 
  {
    surveyQuestion:{},
    numberOfResponses:{},
    responseScore: {},
    scoreColor:{},
    canvasId: {},
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
  }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>