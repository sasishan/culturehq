<template>
  <span>
    <h6 class="card-title mb-n2">
      <small>
          <b>{{surveyQuestion.lastSent | moment("ddd DD MMM")}}  
          <span class="badge badge-secondary ml-2 mt-1" v-for="culture in surveyQuestion.cultures" 
            :key="culture.cultureId">
          {{culture.culture}}
          </span></b>
        </small>                   
    </h6>                 
    <div class="card-text">  
      <div class="row">
        <div class="col-8">
          <table style="height: 100%; width: 100%;">
            <tbody>
              <tr>
                <td class="align-middle text-left">                        
                  {{surveyQuestion.question}}
                </td>
              </tr>
            </tbody>
          </table>                         
        </div>
        <div class="col-1 backgroundGrey2">
          <table class="ml-n1" style="height: 100%; width: 100%;">
              <tr>
                <td class="align-middle text-center">                        
                  <span class="ml-2" :class="scoreColor" v-if="responseScore!='Not enough data'"> 
                    <b>{{responseScore}}</b>
                  </span>
                  <span  :class="scoreColor" v-if="responseScore=='Not enough data'"> 
                    <small>{{responseScore}}</small>
                  </span>                  
                </td>
              </tr>
          </table>                        
        </div>
        <div class="col-3">
          <canvas :id="canvasId" style="border: 1px solid #DDD; padding: 0px"></canvas>
        </div>
      </div>
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