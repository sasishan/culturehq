<template>
  <div class="myContainer col-12 mt-4 mb-5 minHeight">
    <div class="tab-content">
      <div class="row">
        <div class="myContainer pt-1 col-9 ">
          <h5 class="mt-3 mb-3"><b>HR Administrator</b></h5>
        </div>
      </div>
      <div class="">
        <div class="myContainer pt-1 col-9 bg-white borderGrey1">
          <nav>
            <div class="nav nav-pills mt-2" id="nav-tab" role="tablist">                        
              <a class="nav-item nav-link active" id="nav-templates-tab" data-toggle="tab" href="#nav-templates" role="tab" aria-controls="nav-home" aria-selected="true"><small><b>1-on-1 Templates</b></small></a>
              <a class="nav-item nav-link " id="nav-planning-tab" data-toggle="tab" href="#nav-planning" role="tab" aria-controls="nav-profile" aria-selected="false"><small><b>Direct Reports</b></small></a>                
              <a class="nav-item nav-link" id="nav-insights-tab" data-toggle="tab" href="#nav-insights" role="tab" aria-controls="nav-home" aria-selected="true"><small><b>Analytics</b></small></a>                
            </div>
          </nav>
          <div class="tab-content mt-4 mb-4" id="nav-tabContent"  style="border: 1px solid #DDD;">
            <div class="tab-pane fade show active" id="nav-templates" role="tabpanel" aria-labelledby="nav-templates-tab">
              <Templates/>
            </div>              
            <div class="tab-pane fade show" id="nav-schedule" role="tabpanel" aria-labelledby="nav-schedule-tab">
            </div>
            <div class="tab-pane fade show " id="nav-planning" role="tabpanel" aria-labelledby="nav-planning-tab">
            </div>         
                                   
          </div>
        </div>
      </div>
    </div>
  </div>    
</template>

<script>
import Templates from './tabPages/HR_Templates';

export default {
  name: 'HRAdmin',
  components: 
  {
    Templates
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