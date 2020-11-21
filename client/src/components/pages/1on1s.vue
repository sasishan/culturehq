<template>
  <div class="myContainer col-12 mb-5 minHeight">
    <div class="tab-content">
      <div class="row">
        <div class="myContainer pt-1 col-9 ">
          <h5 class="mt-3 mb-3"><b>1-on-1s</b></h5>
        </div>
      </div>
      <div class="">
        <div class="myContainer pt-1 col-9 bg-white borderGrey1">
          <nav>
            <div class="nav nav-pills mt-2" id="nav-tab" role="tablist">            
              <a class="nav-item nav-link active" id="nav-planning-tab" data-toggle="tab" href="#nav-planning" role="tab" aria-controls="nav-profile" aria-selected="false"><small><b>1-on-1</b></small></a>              
              <a class="nav-item nav-link" id="nav-schedule-tab" data-toggle="tab" href="#nav-schedule" role="tab" aria-controls="nav-home" aria-selected="true"><small><b>Schedule Set-up</b></small></a>
              <a class="nav-item nav-link" id="nav-insights-tab" data-toggle="tab" href="#nav-insights" role="tab" aria-controls="nav-home" aria-selected="true"><small><b>Culture Insights</b></small></a>                
            </div>
          </nav>
          <div class="tab-content mt-4 mb-4" id="nav-tabContent"  style="border: 1px solid #DDD;">
            <div class="tab-pane fade show" id="nav-insights" role="tabpanel" aria-labelledby="nav-insights-tab">
            <!-- <Insights />                -->
            </div>              
            <div class="tab-pane fade show" id="nav-schedule" role="tabpanel" aria-labelledby="nav-schedule-tab">
            <Schedules />               
            </div>
            <div class="tab-pane fade show active" id="nav-planning" role="tabpanel" aria-labelledby="nav-planning-tab">
              <Planning />
            </div>         
          </div>
        </div>
      </div>
    </div>
  </div>    
</template>

<script>
import Planning from './tabPages/1on1_Planning';
import Schedules from './tabPages/1on1_Schedule';
import Input from './tabPages/1on1_Input';

export default {
  name: 'OneOnOnes',
  components: 
  {
    Planning,
    Schedules,
    // Input
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
.minHeight
{
  min-height: 500px;
}


.listItem
{
  margin-top: 5px;
}

.borderGrey1
{
  border: 1px solid #DDD;
}

.backgroundGrey1
{
  background: #FFF;
}

.backgroundGrey2
{
  background: #EEE;
}

.backgroundGrey3
{
  background: #DDD;
}

.backgroundGrey4
{
  background: #CCC;
}

.myContainer 
{
 margin: auto;
 
 /*margin-left: 100px;*/
 /*margin-right: 20px;*/

}
.sidebar{
  border-radius: 2px;
  background: #EEE !important;
  min-height: 1000px;
  /*color: white;*/
  /*border: "1px black";*/
  margin-left: 20px;
  margin-top: auto;
  margin-bottom: auto;
  padding: 40px;
  width: 70%;
  min-width: 300px;
}

.nav-pills .nav-link.active, .nav-pills .show>.nav-link {
    /*color: #ff8a00;*/
    color: #1976d2;
    background: none; 
    border-bottom: 5px solid #ff8a00;
    /*border-bottom: 5px solid #1976d2;*/
    border-bottom-right-radius: 0px;
    border-bottom-left-radius: 0px;
}

nav .nav a{
  /*color: #ffc076;*/
  color: #8fc0f1;
  
  }

.nav-pills {
    border-bottom: 1px solid #ff8a00;
    /*border-bottom: 1px solid #1976d2;*/
}

/*TABS*/

</style>