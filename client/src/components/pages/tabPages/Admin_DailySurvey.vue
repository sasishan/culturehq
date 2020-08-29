<template>
  <div>
    
    <div class="p-4">
      <h6>Survey Questions</h6>
      <button type="button" class="btn btn-outline-primary btn-sm" data-toggle="modal" data-target="#newQuestionModal"><small>New Question</small></button>     
      <div class="card sharp-card mt-4" v-for="question in surveyQuestions" :key="question.questionId">
        <div class="card-header ">
          <button type="button" class="btn btn-outline-primary ml-2 btn-sm float-right" data-toggle="modal" @click="selectedQuestion=question" data-target="#sendModal"><small>Send Question</small></button>     
          <button type="button" class="btn btn-outline-secondary btn-sm float-right" data-toggle="modal" data-target="#publishModal" @click="selectedQuestion=question">
            <small><span v-if="question.publish=='Y'">Published</span><span v-if="question.publish=='N'" class="text-danger">Not Published</span></small>
          </button>     
          <small>{{question.questionId}}: {{question.question}}
          </small>            
          <span class="badge badge-secondary ml-2 mt-1" v-for="culture in question.cultures" :key="culture.culture">
          <small>{{culture.culture}}</small>
          </span><br>          
        </div>
        <div class="card-body">
          <div v-for="option in question.answers.options" :key="option.value">
            {{option.answer}} - {{option.text}} ({{option.value}})
          </div>
          <!-- <span v-for="option in question.answers.options"> -->
            <!-- {{option}} -->
          <!-- <span>  -->
          
        </div>
      </div>
    </div>
    <div class="modal fade" id="publishModal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalLabel">Publish Question</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 mb-4"> 
            Confirm toggle publishing of this question (it will show/not show in survey results)?
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="publishQuestion(selectedQuestion)" data-dismiss="modal" >Yes</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="reset">No</button>          
          </div>

        </div>
      </div>
    </div>   

    <div class="modal fade" id="sendModal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalLabel">Send Survey Question</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 mb-4"> 
              <h6>Question: {{selectedQuestion.question}}</h6>

            </div>
            <label>Emails:</label>
            <input type="text" class="col-12" v-model="emailAddresses" placeholder="Enter email addresses separated by commas"/>
            <div class="mt-2 text-success"><b>{{message}}</b></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="sendQuestion(selectedQuestion)" :disabled="getDisableState">Send</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="reset">{{cancelMessage}}</button>          
          </div>

        </div>
      </div>
    </div>    

    <div class="modal fade" id="newQuestionModal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalLabel">New Survey Question</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <label>Question Text:</label>
            <input type="text" class="col-12" v-model="newQuestion.question" placeholder="Enter question text"/>
            <label class="mt-4">Answers Text:</label>
            <textarea rows="8" class="col-12" v-model="newQuestion.answersText" />
            <div class="mt-2 text-success"><b>{{newQuestionMessage}}</b></div>
            <label class="mt-4">Cultures:</label><br>
            <span v-for="(culture, index) in newQuestion.cultures" :key="index">{{culture.name}} </span>
            <br>
            <button class="badge badge-secondary ml-2 mt-1" v-for="culture in cultureOptions" :key="culture.name" @click="toggleCulture(newQuestion,culture)">
            {{culture.name}}
            </button>            
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="createNewQuestion(newQuestion)" :disabled="getDisableCreateState">Create</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="reset">Cancel</button>          
          </div>

        </div>
      </div>
    </div> 

  </div>
</template>

<script>

// import Comms from './Comms';
import Comms from '../../Comms';
import { URLS } from '../../../Constants.js';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';

export default {
  name: 'Admin_DailySurvey',
  components: 
  {
  },
  props: 
  {
    test: {}
  },  
  data: () => (
  {  
    surveyQuestions:[],
    selectedQuestion:{},
    emailAddresses:"",
    disableSend:false,
    disableCreateState:false,
    cancelMessage: "",
    message:"",
    newQuestionMessage:"",
    newQuestion:{ },
    cultureOptions:[]
  }),
  async mounted()
  {
    await this.loadSurveyQuestions();
    await this.loadCultureOptions();
    // console.log('loaded')
  },
  created()
  {
    // this.initialize();
    this.reset();
  },
  computed:
  {
    getDisableState()
    {
      if (this.emailAddresses=="" || this.disableSend==true)
      {
        return true;
      }
      else
      {
        return false;
      }
    },
    getDisableCreateState()
    {
      if (this.newQuestion.question=="" || this.newQuestion.answersText=="" || this.disableCreateState==true)
      {
        return true;
      }
      else
      {
        return false;
      }
    }
  },
  methods:
  {
    reset () {
      this.cancelMessage= "Close and Don't Send";
      this.message="";
      this.newQuestionMessage="";
      this.disableSend=false;
      this.disableCreateState=false;

      this.newQuestion=
      {
        publish: 'N', 
        question:"", 
        cultures:[],
        answers:
        {
        "numOptions": 6,     
          "options": 
          [ 
            { 
              "answer": "a",
              "text": "Strongly Agree",
              "value": 5       
            },       
            {         
              "answer": "b", 
              "text": "Agree", 
              "value": 4       
            },       
            {         
              "answer": "c",  
              "text": "Neutral", 
              "value": 3       
            },       
            {         
              "answer": "d",        
              "text": "Disagree", 
              "value": 2       
            },       
            {         
              "answer": "e",         
              "text": "Strongly Disagree",         
              "value": 1       
            },       
            {         
              "answer": "f",         
              "text": "Prefer not to answer",         
              "value": 0       
            }     
          ],     
          "type": "multichoice"   
        }        
      }

      this.newQuestion.answersText = JSON.stringify(this.newQuestion.answers);
    }, 
    async loadCultureOptions()
    {
      var url= URLS.questionCultures;

      var response = await Comms.get(url).catch((error) => 
      { 
        console.log(error);
        return {};
      });

      if (response)
      {
        this.cultureOptions = [];
        for (var i=0; i< response.length; i++)
        {
          this.cultureOptions.push(response[i]);
        }        
      }

      return this.cultureOptions;
    },      
    async loadSurveyQuestions()
    {
      var url= URLS.surveyQuestions;

      var response = await Comms.get(url).catch((error) => 
      { 
        return {};
      });

      if (response)
      {
        this.surveyQuestions = [];
        for (var i=0; i< response.length; i++)
        {
          this.surveyQuestions.push(response[i]);
        }        
      }

      return this.surveyQuestions;
    },   
    async sendQuestion(question)
    {
      if (this.emailAddresses=="")
      {
        return;
      }

      var emails = this.emailAddresses.split(',');
      this.disableSend=true;
      // console.log(emails);

      var url= URLS.sendOneQuestion;
      var parameters = { questionId: question.questionId, emails: emails };
      var that = this;
      Comms.post(url, parameters, function(error, result)
      {
        if (result)
        {
          that.cancelMessage = "Close";
          that.message="Success! This question has been emailed."
        }
      });
    },
    createNewQuestion(newQuestion)
    {
      if (this.newQuestion.question=="")
      {
        return;
      }

      this.disableCreateState=true;
      // console.log(emails);

      var url= URLS.createNewQuestion;
      newQuestion.answers = JSON.parse(newQuestion.answersText);
      var parameters = { question: newQuestion };
      var that = this;
      Comms.post(url, parameters, function(error, result)
      {
        if (result)
        {
          that.cancelMessage = "Close";
          that.newQuestionMessage="Success! This question has been created."
        }
      });    
    },
    publishQuestion(question)
    {
      var url= URLS.publishQuestion + question.questionId+"/publish";
      if (question.publish=='Y')
      {
        question.publish='N';
      }
      else
      {
        question.publish='Y';
      }
      var parameters = { publish: question.publish };
      var that = this;
      Comms.post(url, parameters, function(error, result)
      {
        if (error)
        {
          console.log(error);
        }
      });      
    },
    toggleCulture(question, culture)
    {

      for (var i=0; i<question.cultures.length; i++)
      {
        if (question.cultures[i].cultureId==culture.cultureId)
        {
          question.cultures.splice(i, 1);
          return;
        }
      }
      question.cultures.push(culture);
      console.log(question);
    }
  }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>