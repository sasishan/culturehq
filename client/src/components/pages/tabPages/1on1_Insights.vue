<template>
  <div class="row col-12">
    <div class="col-3 backgroundGrey2 minHeight">
      <h6 class="small mt-4 mb-3"><b>Test</b></h6>
        <hr>
        <div class="listItem small text-muted mt-2 ">Test</div>

    </div>
    <div class="col-9 bg-white">
    <div class="mt-3 mb-5">
        <span class="h5 ml-2 mb-3"><b>Title</b>
        <button type="button" class="btn btn-sm btn-primary float-right"><small>New</small></button>
      </span><br>
    </div>
      <div class="card sharp-card  shadow-sm mt-2">
        <div class="card-header whiteBackground">
          <span><b>1-on-1s</b></span>
          <button type="button" class="btn btn-sm btn-outline-primary float-right"><small>Modify</small></button>
        </div>
        <div class="card-body">
          <h6 class="card-title small">
            <b>Details</b>
          </h6>                 
          <p class="card-text small">
            <table class="table table-sm">               
              <tr>
                <td>
                  Occurence:
                </td>
                <td>
                  Every <span class="text-default"><b>2 weeks</b></span> on <span class="text-default"><b>Wednesday</b></span>
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
  name: 'OneOnOne_Input',
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