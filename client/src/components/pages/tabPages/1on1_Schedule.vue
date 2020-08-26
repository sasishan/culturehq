<template>
<div class="row col-12">
  <div class="col-3 backgroundGrey2 minHeight">
    <h6 class="small mt-4 mb-3"><b>Upcoming 1:1s</b></h6>
      <hr>
      <div class="listItem small text-muted mt-2 ">8/20 @ 3PM - John</div>
      <div class="listItem small text-muted mt-2">8/21 @ 11AM - Steve</div>
      <div class="listItem small text-muted mt-2">8/21 @ 11AM - Rob</div>

    <h6 class="small mt-5 mb-3"><b>Regular Cadence</b></h6>
      <hr>
      <div class="listItem small titleColor mt-2 "><b>Wednesdays 3PM - John</b></div>
      <div class="listItem small text-muted mt-2">Thursdays 11AM - Steve</div>
      <div class="listItem small text-muted mt-2">Friday 11AM - Rob</div>                                           
  </div>
<div class="col-9">
  <div class="mt-3 mb-5 mr-n4">
      <span class="h5 ml-2 mb-3"><b>Schedule</b>
      <button type="button" class="btn btn-sm btn-primary float-right"><small>New Cadence</small></button>
    </span>
    <hr>
  </div>
    <div class="card sharp-card shadow-sm ml-2 mr-n4 mt-2">
      <div class="card-header">
        <span class="titleColor1"><b>1-on-1's with John Smith</b></span>
        <button type="button" class="btn btn-sm btn-outline-primary float-right"><small>Modify</small></button>
      </div>
      <div class="card-body">
        <h6 class="card-title small">
          <b>Cadence Details</b>
        </h6>                 
        <p class="card-text small">
          <table class="table table-sm">               
            <tr>
              <td>
                <b>Occurence:</b>
              </td>
              <td>
                Every <span class="text-default"><i>2 weeks</i></span> on <span class="text-default"><i>Wednesday</i></span>
              </td>
            </tr>
            <tr>
              <td>
                <b>Meeting Subject</b>
              </td>
              <td>
                1-on-1 John:Sasi
              </td>
            </tr>
            <tr>
              <td>
                <b>Reminder  </b>
              </td>
              <td>
                Send preparation reminder <span class="text-default"><i> 24 hours before</i></span>
              </td>
            </tr>                                
          </table>
        </p>  
      </div>                          
    </div>
  </div>
</div>
</template>

<script>

// import Comms from './Comms';

export default {
  name: 'OneOnOne_Schedules',
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