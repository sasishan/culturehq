<template>
  <div class="gradientColor">
    <div class="container">   
      <div class="row justify-content-center">      
        <div class="col-lg-11">
          <div class="row marketing">
            <div class="col-3 text-center">
              <h3 class="text-white">Hi Sasi!</h3>
              <span class="text-white">{{ new Date() | moment("dddd, MMMM Do YYYY") }}</span>
            </div>
            <div class="col-9 small">
              <div class="card p-2 mb-2 noborder" style="background-color: rgba(245, 245, 245, 0.7); ">
                <p>
                  <u><b>2:00 pm: 1-on-1 with Tony</b></u><br>
                  <ul>
                  <li>Close 2 open actions items due from the last 1-on-1. Review and close actions <a href="">here</a> </li>
                  <li>Review Tony's feedback in this 1-on-1. See feedback guidance <a href="">here</a></li>
                  <li>Discuss 1 new question to drive Learning traits  <a href="">Review 1-1 Questions</a></li>
                  </ul>
                </p>                
              </div>
              <div class="card p-2 noborder mb-2" style="background-color: rgba(245, 245, 245, 0.7); ">
                <p> 
                  <u><b>Due today, 4pm</b></u><br>
                  Provide status updates on your 2 upcoming goals <a href="">here </a> 
                </p>  
                <span class="badge badge-primary col-1" style="opacity: 1; ">results</span>             
              </div>    
              <div class="card p-2 noborder" style="background-color: rgba(245, 245, 245, 0.7); ">
                <p> 
                  <u><b>Feedback, Due in 5 days</b></u><br>
                  <ul>
                  <li>Tim Smith has requested feedback. Respond <a href="">here </a> </li>
                  <li>Ryan Banks has requested feedback Respond <a href="">here </a> </li>
                  </ul>
                </p>
                <span>
                  <span class="badge badge-primary col-1" style="opacity: 1; ">learning</span>    
                  <span class="badge badge-primary col-1" style="opacity: 1; ">caring</span>  
                </span>
              </div>                                
            </div>              
          </div>
        </div>
      </div>
    </div>
  </div>    
</template>

<script>
// import MainMenu from '../menus/MainMenu';
export default {
  name: 'Home',
  components: 
  {
  },
  props: 
  {
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
    initialize () 
    {
    },
  }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>