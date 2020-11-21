<template>
  <div class="myContainer col-12 mb-5 minHeight">
    <div class="row">
      <div class="myContainer pt-1 col-lg-9 ">
        <h5 class="mt-3 mb-3"><b>Administrator</b></h5>
      </div>
    </div>
    <div class="">
      <div class="myContainer pt-1 col-lg-9 bg-white borderGrey1">
        <nav>
          <div class="nav nav-pills mt-2" id="nav-tab" role="tablist">                        
            <a class="nav-item nav-link active" id="nav-templates-tab" data-toggle="tab" href="#nav-templates" role="tab" aria-controls="nav-home" aria-selected="true"><small><b>Daily Questions</b></small></a>
            <a class="nav-item nav-link " id="nav-logs-tab" data-toggle="tab" href="#nav-logs" role="tab" aria-controls="nav-profile" aria-selected="false"><small><b>Responses Logs</b></small></a>                
            <a class="nav-item nav-link " id="nav-users-tab" data-toggle="tab" href="#nav-users" role="tab" aria-controls="nav-profile" aria-selected="false"><small><b>Employees</b></small></a>                
          </div>
        </nav>
        <div class="tab-content mt-4 mb-4" id="nav-tabContent"  style="border: 1px solid #DDD;">
          <div class="tab-pane fade show active" id="nav-templates" role="tabpanel" aria-labelledby="nav-templates-tab">
            <Admin_DailySurvey/>
          </div>              
          <div class="tab-pane fade show" id="nav-logs" role="tabpanel" aria-labelledby="nav-logs-tab">
            <Admin_SendLogs />
          </div>
          <div class="tab-pane fade show" id="nav-users" role="tabpanel" aria-labelledby="nav-users-tab">
            <Admin_Users />
          </div>            
          <div class="tab-pane fade show " id="nav-planning" role="tabpanel" aria-labelledby="nav-planning-tab">
          </div>         
        </div>
      </div>
    </div>
  </div>    
</template>

<script>
import Admin_DailySurvey from './tabPages/Admin_DailySurvey';
import Admin_SendLogs from './tabPages/Admin_SendLogs';
import Admin_Users from './tabPages/Admin_Users';

export default {
  name: 'Admin',
  components: 
  {
    Admin_DailySurvey,
    Admin_SendLogs,
    Admin_Users
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