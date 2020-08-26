<template>
  <div>
    <div class="card sharp-card" style="border: none;">      
      <div class="form-group  mt-4" v-for="(question, id, index) in questions" :key="index">
        <label for="exampleFormControlTextarea1"><small><b>Q{{index+1}} {{question.question}}</b></small></label>
        <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
      </div>      
    </div>

    <button type="button" class="ml-2 btn btn-sm btn-outline-secondary btn-outline-grey float-right" :disabled="true"><small>Publish for Review</small></button>

  </div>
</template>
<script>

// import Comms from './Comms';

export default {
  name: 'OneOnOne_Input',
  components: 
  {
    
  },
  props: 
  {
    questions: { notInitialized: true}
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