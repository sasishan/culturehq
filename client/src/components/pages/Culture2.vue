<template>
  <div class="myContainer col-12 mt-4">
    <div class="tab-content">
      <div class="row">
        <div class="myContainer pt-1 col-9 transparent minHeight">
          <h5 class="mt-3 mb-3"><b>Culture Score</b></h5>
          <div v-if="surveyQuestions.initialized==false">
             <!-- <pulse-loader color="#1976d2" size="10px" ></pulse-loader> -->
          </div>     
          <div class="card mt-3 mb-4 p-4 small"> 
            <div class="text-center" v-if="!isLoaded">
              <pulse-loader color="#1976d2" size="10px" ></pulse-loader>
            </div>     
            <span v-if="isLoaded">                  
              <p>Questions Asked: {{cultureSummary.totalQuestions}}</p>
              <p>Total Responses Received: {{cultureSummary.totalResponses}}</p>              
            </span>
            <canvas id="CultureSummary" width="400" height="100"></canvas>                      
          </div>
          <hr>
          <h5 class="mt-3 mb-3"><b>Survey Responses</b></h5>
          <span v-for="(surveyQuestion) in surveyQuestions" :key="surveyQuestion.questionId" style="cursor:pointer">
          <div class="card sharp-card shadow-sm mt-3 mb-4"  data-toggle="modal" data-target="#questionDetailsModal" @click="showQuestionDetails(surveyQuestion)">
<!--               <div class="card-header">
                <span class="titleColor2"><b>{{surveyQuestion.question}}</b></span>                                
                                      {{surveyQuestion.lastSent | moment("ddd DD MMM")}}  
                      <span class="badge badge-secondary ml-2 mt-1" v-for="culture in surveyQuestion.cultures" 
                        :key="culture.cultureId">
                      {{culture.culture}}
                      </span>
              </div> -->
            <div class="card-body">
              <div class="text-center" v-if="!isLoaded">
                <pulse-loader color="#1976d2" size="10px" ></pulse-loader>
              </div>
                <h6 class="card-title" v-if="isLoaded">
                  <small>
                      <b>{{surveyQuestion.lastSent | moment("ddd DD MMM")}}  
                      <span class="badge badge-secondary ml-2 mt-1" v-for="culture in surveyQuestion.cultures" 
                        :key="culture.cultureId">
                      {{culture.culture}}
                      </span></b>
                    </small>                   
<!--                   <small><b>Overall Score:</b></small>
                  <span :class="getTotalResponseScoreColor(surveyQuestion.questionId)"> 
                    {{getTotalResponseScore(surveyQuestion.questionId)}}
                  </span><br><br>
                  <small>Responses: {{getNumberResponses(surveyQuestion.questionId)}}</small> -->
                </h6>                 
                <div class="card-text">  
                  <div class="row col-12">
                       
                  </div>
                  <div class="row ">
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
                    <div class="col-1 lightBackground">
                      <table style="height: 100%; width: 100%;">
                        <tbody>
                          <tr>
                            <td class="align-middle text-center">                        
                              <span :class="getTotalResponseScoreColor(calculatedResponses, surveyQuestion.questionId)"> 
                                <b>{{getTotalResponseScore(calculatedResponses, surveyQuestion.questionId)}}</b>
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>                        
                    </div>
                    <div class="col-3"><canvas :id="surveyQuestion.questionId" ></canvas></div>
                  </div>
                 <!--  <hr>
                  <div>
                    <span v-for="response in calculatedResponsesByManager" :key="response.managerId">
                      <div class="row">
                        <div class="col-9">{{response.managerName}}</div>
                        <div class="col-4"><canvas :id="getBarId(surveyQuestion.questionId, response.managerName)" ></canvas></div>
                      </div>
                    </span>
                  </div> -->
                  <!-- <br>
                  <hr class="col-6">
                  <h6 class="card-title">
                      Question Insight & Actions
                  </h6>
                  <div class="myContainer" v-html="surveyQuestion.recommendation" v-if="surveyQuestion.recommendation"></div>
                  <div class="myContainer" v-if="surveyQuestion.recommendation==undefined">None found.</div> -->
                </div>
              </div>
            </div>              
          </span>
        </div>
      </div>
    </div>

    <div class="modal fade" id="questionDetailsModal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
      <div class="modal-dialog modal-md" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h6 class="modal-title" id="modalLabel">{{selectedSurveyQuestion.question}}</h6>
          </div>
          <div class="modal-body">
            <label><b>By Manager</b></label>
            <span v-for="response in calculatedResponsesByManager" :key="response.managerId">
              <div class="row col-12 mt-4">
                <div class="col-6">
                  {{response.managerName}}
                  <br>
                  <small># of Responses: {{getNumberResponses(response, selectedSurveyQuestion.questionId)}}</small>
                </div>
                <div class="col-1">
                  <span :class="getTotalResponseScoreColor(response, selectedSurveyQuestion.questionId)"> 
                    <b>{{getTotalResponseScore(response, selectedSurveyQuestion.questionId)}}</b>
                  </span>
                </div>                
                <div class="col-5"><canvas :id="getBarId(response.managerName)" ></canvas></div>
              </div>
            </span>        
            <hr class="col-6">
            <h6 class="card-title">
                Question Insight & Actions
            </h6>
            <div class="myContainer" v-html="selectedSurveyQuestion.recommendation" v-if="selectedSurveyQuestion.recommendation"></div>
            <div class="myContainer" v-if="selectedSurveyQuestion.recommendation==undefined">None found.</div>               
          </div>
          <div class="modal-footer">            
            <button type="button" class="btn btn-secondary" data-dismiss="modal" >Close</button>          
          </div>

        </div>
      </div>
    </div>     
  </div>    
</template>

<script>
// import MainMenu from '../menus/MainMenu';
import Comms from '../Comms';
import { URLS } from '../../Constants.js';
import { ChartColors } from '../../Constants.js';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
const axios = require('axios');

export default {
  name: 'Home',
  components: 
  {
    PulseLoader
  },
  props: 
  {
  },  
  computed: 
  {
  },
  data: () => (
  {  
    isLoaded:false,
    surveyResponses:{},
    allManagers:[],
    surveyQuestions:{ initialized: false },
    selectedSurveyQuestion:{},
    calculatedResponses:{},   
    calculatedResponsesByManager:{},
    cultureOptions:[],
    cultureSummary:{totalResponses:0, totalQuestions:0}
  }),
  mounted()
  {
    this.initialize();

  },
  created()
  {
    
  },
  methods:
  {
    async initialize () 
    {
      var that = this;
      
      await this.loadExtendedManagers();
      await this.loadSurveyQuestions();
      await this.loadSurveyResponses();
      await this.loadCultureOptions();
      this.calculateResponses(this.surveyQuestions, this.surveyResponses);        
      this.isLoaded=true;

      this.calculateCultureSummary();
      await this.loadQuestionRecommendations();
      this.renderCharts();
    },
    async loadQuestionRecommendations()
    {

      var url= URLS.questionRecommendation;
      var payload={scores:[]};
      for (var i=0; i<this.surveyQuestions.length;i++)
      {
        payload.scores.push( 
          { 
            questionId: this.surveyQuestions[i].questionId, 
            score: this.getTotalResponseScore(this.calculatedResponses, this.surveyQuestions[i].questionId)
          });
      }

      var that =this;
      Comms.post(url, payload, function(error, recommendations)
      {
        if (recommendations)
        {
          for (var i=0; i<recommendations.length;i++)
          {
            for (var j=0; j<that.surveyQuestions.length; j++)
            {
              if (that.surveyQuestions[j].questionId==recommendations[i].questionId)
              {
                // this.$set(this.selectedQuestions, question.questionId, question);
                that.$set(that.surveyQuestions[j], 'recommendation', recommendations[i].recommendation);
                // that.surveyQuestions[j].recommendation=recommendations[i].recommendation;
              }
            }            
          }
        }
      });
    },
    showQuestionDetails(question)
    {
      this.selectedSurveyQuestion=question;
      for(var managerId in this.calculatedResponsesByManager)
      {
        var calculatedResponses=this.calculatedResponsesByManager[managerId];
        this.renderOneManagerChart(question.questionId, calculatedResponses);
      }        
    },
    getBarId(name)
    {
      return name;
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
    calculateCultureSummary()
    {
      var cultureLabels=[];
      var data=[];
      var number=[];
      for (var i=0; i<this.cultureOptions.length; i++)
      {
        cultureLabels.push(this.cultureOptions[i].name);
        data.push(0);
        number.push(0);
      } 

      for (var j=0; j<this.surveyQuestions.length; j++)
      {
        this.cultureSummary.totalQuestions+=1;
        if (this.surveyQuestions[j].cultures.length>0)
        {
          for (var l=0; l<this.surveyQuestions[j].cultures.length;l++)
          {
            var cultureName = this.surveyQuestions[j].cultures[l].culture;
            var cultureId = this.surveyQuestions[j].cultures[l].cultureId;
            for (var k=0; k<cultureLabels.length;k++)
            {
              if (cultureName==cultureLabels[k])
              {
                var score = this.getTotalResponseScore(this.calculatedResponses, this.surveyQuestions[j].questionId);
                if (score!='Not enough data')
                {
                  data[k]+=parseFloat(score);
                  number[k]+=1;
                  
                  this.cultureSummary.totalResponses+=this.getNumberResponses(this.calculatedResponses, this.surveyQuestions[j].questionId);
                }
                break;
              }
            }  
          }
        }
      }       
      for (i=0; i<data.length;i++)
      {
        data[i]=(data[i]/number[i]);
      }
      this.renderBarChart('bar', ChartColors.cultureBackgroundColors,  ChartColors.cultureBorderColors, 'CultureSummary', cultureLabels, data);
      
    },    
    renderCharts()
    {
      for (var i=0; i<this.surveyQuestions.length; i++)
      {
        this.renderOneChart(this.surveyQuestions[i].questionId);
        // for(var managerId in this.calculatedResponsesByManager)
        // {
        //   var calculatedResponses=this.calculatedResponsesByManager[managerId];
        //   this.renderOneManagerChart(this.surveyQuestions[i].questionId, calculatedResponses);
        // }        
      }
    },
    async loadExtendedManagers()
    {
      var url= URLS.getExtendedManagers;

      var response = await Comms.get(url).catch((error) => 
      { 
        return {};
      });

      if (response)
      {
        this.allManagers = [];
        for (var i=0; i< response.length; i++)
        {
          this.allManagers.push(response[i]);
        }        
      }

      console.log(this.allManagers);
      return this.allManagers;      
    },
    async loadSurveyQuestions()
    {
      var url= URLS.surveyQuestionsPublished;

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
    
    async loadSurveyResponses()
    {
      var myUserId='054eb51b-a7b3-4cdc-8fe2-39f6d84ce27a';
      var url= URLS.surveyResponses;

      var response = await Comms.get(url).catch((error) => 
      { 
        return {};
      });

      this.surveyResponses = {};

      this.surveyResponses[myUserId]=[];
      for (var j=0; j<this.allManagers.length; j++)
      {
        this.surveyResponses[this.allManagers[j].userId]=[];
      }

      if (response)
      {
        for (var i=0; i< response.length; i++)
        {
          if (this.surveyResponses[response[i].managerId]==undefined)
          {
            console.log('WEIRD -this should not happen!');
            this.surveyResponses[response[i].managerId]=[];
          }

          this.surveyResponses[response[i].managerId].push(response[i]);
        }
      }
      // console.log(this.surveyResponses);
      return this.surveyResponses;
    }, 
    getTotalResponseScoreColor(calculatedResponses, qId)
    {
      var color=""
      if (qId && calculatedResponses[qId])
      {
        var score = this.getTotalResponseScore(calculatedResponses, qId);

        if (score<3)
        {
          color = "text-danger";
        }
        else if (score>=3)
        {
          color = "text-success"; 
        }
      }
      return color;
    },
    getTotalResponseScore(calculatedResponses, qId)
    {
      if (qId && calculatedResponses[qId] && this.getNumberResponses(calculatedResponses, qId)>0)
      {
        return ((calculatedResponses[qId].totalValue/(this.getNumberResponses(calculatedResponses, qId))).toFixed(1));
      }
      else
      {
        return 'Not enough data';
      }
    },    
    getNumberResponses(calculatedResponses, qId)
    {
      if (qId && calculatedResponses[qId])
      {
        return calculatedResponses[qId].numResponses;
      }
      else
      {
        return 0;
      }
    },
    renderOneManagerChart(qId, calculatedResponses)
    {
      // console.log(qId, calculatedResponses)
      if (qId && calculatedResponses[qId])
      {
        var name = calculatedResponses.managerName;
        var labels=[];

        labels = Object.keys(calculatedResponses[qId].answers);       
        var data=Object.values(calculatedResponses[qId].answers);
        
        // console.log(labels, data, this.getBarId(qId,name))
        this.renderBarChart('bar', ChartColors.questionBackgroundColors,  ChartColors.questionBorderColors, this.getBarId(name), labels, data);
        // return this.calculatedResponses[qId].answers;
      }
      else
      {
        return [];
      }
    },       
    renderOneChart(qId)
    {
      if (qId && this.calculatedResponses[qId])
      {
        var labels=[];

        labels = Object.keys(this.calculatedResponses[qId].answers);       
        var data=Object.values(this.calculatedResponses[qId].answers);
        
        this.renderBarChart('bar', ChartColors.questionBackgroundColors,  ChartColors.questionBorderColors, qId, labels, data);
        // return this.calculatedResponses[qId].answers;
      }
      else
      {
        return [];
      }
    },          
    getNewCalculatedItem(question)
    {
      var newItem = {question: question, answers: { }, totalValue: 0, numResponses: 0};
      return newItem;
    },
    buildResponsesTemplate(surveyQuestions, calculatedResponses)
    {
      // calculatedResponses={};
      for (var i=0; i< surveyQuestions.length; i++)
      {
        var question = surveyQuestions[i];
        calculatedResponses[question.questionId]=this.getNewCalculatedItem(question);

        var calculatedResponse = calculatedResponses[question.questionId];
        for (var k=0; k<question.answers.options.length; k++)
        {
          var option = question.answers.options[k];
          calculatedResponse.answers[option.text]=0;
        }
      }      
    },
    analyzeResponses(surveyResponses, calculatedResponses)
    {
      var calculatedResponse, surveyResponse, option, k;

      for (var j=0; j< surveyResponses.length; j++)
      {         
        surveyResponse = surveyResponses[j]
        calculatedResponse = calculatedResponses[surveyResponse.questionId];
        if (calculatedResponse==undefined)
        {
          continue;
        }

        for (k=0; k<calculatedResponse.question.answers.options.length; k++)
        {
          option = calculatedResponse.question.answers.options[k];

          if (surveyResponse.answer.toLowerCase()==option.answer.toLowerCase())
          {
            calculatedResponse.answers[option.text]+=1;
            calculatedResponse.numResponses+=1;
            // console.log(option.value);
            calculatedResponse.totalValue+=option.value;

          } 
        }
      }
    },
    newResponsesTemplateForManager(responsesUnderManager)
    {
      var template={ managerName:""};
      if (responsesUnderManager.length>0)
      {
        var name = responsesUnderManager[0].managerFName+" "+responsesUnderManager[0].managerLName;
        template.managerName = name;
      }
      return template;
    },
    calculateResponses(surveyQuestions, surveyResponses)
    {
      this.calculatedResponses={};
      //build an aggregrated calculatedresponse
      this.buildResponsesTemplate(surveyQuestions, this.calculatedResponses);

      for(var managerId in this.surveyResponses)
      {
          // if (this.surveyResponses.hasOwnProperty(managerId)){
        var responsesUnderManager=this.surveyResponses[managerId];

        if (this.calculatedResponsesByManager[managerId]==undefined)
        {
          this.calculatedResponsesByManager[managerId]= this.newResponsesTemplateForManager(responsesUnderManager);
        }

        //aggregate responses for this manager
        this.analyzeResponses(responsesUnderManager, this.calculatedResponses);

        //analyze individual manager responses
        this.buildResponsesTemplate(surveyQuestions, this.calculatedResponsesByManager[managerId]);
        this.analyzeResponses(responsesUnderManager, this.calculatedResponsesByManager[managerId]);
              // work with key and value
          // }
      }
      // console.log(this.calculatedResponsesByManager)
    },    
    sortByKey(array, key)
    {
        return array.sort(function(a, b)
        {
            var x = a[key]; var y = b[key];
            return ((x >y) ? -1 : ((x < y) ? 1 : 0));
        });
    },
    renderBarChart(chartType, bgColors, borderColors, id, labels, responseArray)
    {
      // console.log(document.getElementById(id));
      if (document.getElementById(id)==null)
      {
        return;
      }

      // var questionBackgroundColors=  [
      //                 'rgba(75, 192, 192, 0.2)',
      //                 'rgba(75, 192, 192, 0.2)',                            
      //                 'rgba(255, 206, 86, 0.2)',
      //                 'rgba(255, 206, 86, 0.2)',                      
      //                 'rgba(255, 99, 132, 0.2)',
      //                 'rgba(54, 162, 235, 0.2)',
      //                 'rgba(153, 102, 255, 0.2)',
      //                 'rgba(255, 159, 64, 0.2)'];

      // var questionBorderColors = 
      // [ 'rgba(75, 192, 192, 1)',
      //   'rgba(75, 192, 192, 1)',
      //   'rgba(255, 206, 86, 1)',                      
      //   'rgba(255, 206, 86, 1)',                            
      //   'rgba(255, 99, 132, 1)',
      //   'rgba(54, 162, 235, 1)',
      //   'rgba(153, 102, 255, 1)',
      //   'rgba(255, 159, 64, 1)' ]

      var ctx = document.getElementById(id).getContext('2d');
      var myChart = new Chart(ctx, {
          type: chartType,
          data: {
              labels: labels,
              datasets: [{
                  label: '',
                  data: responseArray,
                  backgroundColor: bgColors,
                  borderColor: borderColors,
                  borderWidth: 1,
              }]
          },
          options: {
              legend: 
              {
                  display: false,
              } ,
              scales: 
              {
                  xAxes:[{
                    gridLines: {
                      
                    },                    
                    ticks: {
                      display: false,
                      autoSkip: false,
                      fontSize: 10,
                    }
                  }],
                  yAxes: [{

                   gridLines: {
                      display: false,
                    },                     
                    ticks: {
                      display: false,
                      autoSkip: false,
                      beginAtZero: true,
                      max: 5,
                      min: 0,
                      stepSize: 1,
                      fontSize: 10                              
                    }                           
                  }]
              }
          }
      });
    },        
  }, 
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.regForm {
  /*background-image: linear-gradient(180deg, #ff8a00, #e52e71);*/
  border-radius: 2px;
  background: #FFF !important;
  min-height: 1000px;
  /*color: white;*/
  border: "1px black";
  margin: 20px auto;
  padding: 40px;
  width: 70%;
  min-width: 300px;
}

.backgroundBlank
{
  background: transparent !important;
}

</style>