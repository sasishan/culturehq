<template>
  <div class="row col-12">
    <div class="col-3 backgroundGrey2 minHeight">
      <h6 class="small mt-4 mb-3"><b>Upcoming 1:1s</b></h6>
      <hr>
      <div class="listItem small text-muted mt-2 ">8/20 @ 3PM - John</div>
      <div class="listItem small text-muted mt-2">8/21 @ 11AM - Steve</div>
      <div class="listItem small text-muted mt-2">8/21 @ 11AM - Rob</div>
    </div>
    <div class="col-9 bg-white">
    <div class="mt-3 mb-5 mr-n4">
        <span class="h5 ml-2 mb-3"><b>8/20 @ 3PM with John Smith</b>
        <button type="button" class="btn btn-sm btn-primary float-right ml-2"><small>Start 1:1</small></button>
      </span><hr>
    </div>
      <div class="ml-2 mb-3">
        <span class="h6 small"><b>Culture Focus for this 1-on-1:</b></span>
        <span class="badge badge-warning ml-2 mt-1">Caring</span>
        <span class="badge badge-warning ml-2 mt-1">Learning</span>
        <span class="badge badge-warning ml-2 mt-1">Enjoyment</span>
      </div>
      <div class="card sharp-card shadow-sm mt-4 mr-n4">
        <div class="card-header whiteBackground">
          <span><b>Your Questions</b></span>
          
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
      <div class="mt-5">
        <hr class="col-8">
        <span class="small"><b>Past 1:1 Notes</b></span>
        <ul>
          <li><button type="button" class="btn btn-sm btn-link"><small>8/13/2020 Notes</small></button></li>
          <li><button type="button" class="btn btn-sm btn-link"><small>8/8/2020 Notes</small></button></li>
          <li><button type="button" class="btn btn-sm btn-link"><small>8/6/2020 Notes</small></button></li>
          <li><button type="button" class="btn btn-sm btn-link"><small>7/20/2020 Notes</small></button></li>
          <li><button type="button" class="btn btn-sm btn-link"><small>Older...</small></button></li>
        </ul>
      </div>
      
    </div>
  </div>
</template>

<script>

// import Comms from './Comms';

export default {
  name: 'OneOnOne_Planning',
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
    questionBank:[],
    cultureOptions:[],
    showLastNotes: false
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
    initializeQuestionCategories(categories, questionCategories)
    {
      for (var i=0; i< categories.length; i++)
      {
        questionCategories.push(categories[i]);
      } 
    },
    initializeQuestionBank(questions, questionBank)
    {
      for (var i=0; i< questions.length; i++)
      {
        questionBank.push(questions[i]);
      }      
    },
    isValidCultureQuestion(culture, question)
    {
      // console.log(question.Culture, culture.name);
      if (question.Culture.includes(culture.name))
      {
        return true;
      }
      return false;
    },
    async load1on1QuestionBank()
    {
      var url= URLS.oneOnOneQuestionBank;

      var response = await Comms.get(url).catch((error) => 
      { 
        console.log(error);
        return {};
      });

      if (response && response.data && response.data.questions)
      {
        this.questionBank = [];
        this.cultureOptions = [];
        this.initializeQuestionBank(this.response.data.questions);
        this.initializeQuestionCategories(this.response.data.cultureOptions);
      }

      if (response.data && response.data.cultureOptions)
      {
        
        for (var i=0; i< response.data.cultureOptions.length; i++)
        {
          that.cultureOptions.push(response.data.cultureOptions[i]);
        }                 
      }
      return this.surveyQuestions;
    },        
  }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>