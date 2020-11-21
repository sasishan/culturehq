<template>
<div>
  Sort by:  <Culture_Sort_Dropdown class="ml-2" @sortBy="selectSort" @sortDirectionChanged="selectSortDirection" :selectedSortField="selectedSortField" :sortDirectionStart="selectedSortFieldDirection" :showNoDataQuestions="showNoData"
  @toggleShowNoDataQuestions="showNoData=!showNoData"/>

  <div class="transparent minHeight">
    <span v-for="surveyQuestion in getSurveyQuestions" :key="surveyQuestion.questionId" style="cursor:pointer">    

      <div class="card sharp-card shadow-sm mt-3 mb-4"  data-toggle="modal" data-target="#questionDetailsModal" @click="showQuestionDetails(surveyQuestion)" v-show="showNoData==true || getTotalResponseScore(calculatedResponses, surveyQuestion.questionId)>0">

        <div class="card-body mt-n2 mb-n2">
          <div class="text-center" v-if="!isLoaded">
            <pulse-loader color="#1976d2" size="10px" ></pulse-loader>
          </div>
          <Culture_Responses_Summary 
            v-if="isLoaded"
            :surveyQuestion=surveyQuestion 
            :numberOfResponses="getNumberResponses(calculatedResponses, surveyQuestion.questionId)" 
            :responseScore= "getTotalResponseScore(calculatedResponses, surveyQuestion.questionId)" 
            :scoreColor="getTotalResponseScoreColor(calculatedResponses, surveyQuestion.questionId)"
            :canvasId= "surveyQuestion.questionId"         
            />
        </div>
      </div>              
    </span>
  </div>

  <div class="modal fade" id="questionDetailsModal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header card-header">
          <h6 class="modal-title" id="modalLabel">{{selectedSurveyQuestion.question}}</h6>
        </div>
        <div class="modal-body">
          <label><b>By Manager</b></label>
          <div class="row ml-1 mr-2 mt-2">
            <div class="col-4"><small><b>Manager</b></small></div>
            <div class="col-5 col-lg-2"><small><b># Responses</b></small></div>
            <div class="col-1"><small><b>Score</b></small></div>
            <div class="col-1"></div>
            <div class="col-2" v-show="!isMobile()"><small><b>Responses</b></small></div>
          </div>
          <span v-for="response in calculatedResponsesByManager" :key="response.managerId">
            <Culture_Responses_Details 
              v-if="response.depth==-1"
              :isMe="response.depth==-1"
              :selectedSurveyQuestion=selectedSurveyQuestion 
              :response=response 
              :numberOfResponses="getNumberResponses(response, selectedSurveyQuestion.questionId)" 
              :responseScore= "getTotalResponseScore(response, selectedSurveyQuestion.questionId)" 
              :scoreColor="getTotalResponseScoreColor(response, selectedSurveyQuestion.questionId)"
              :canvasId= "getBarId(response.managerName)" 
              :recommendation="selectedSurveyQuestion.recommendation"
              />
          </span>           
          <span v-for="response in calculatedResponsesByManager" :key="response.managerId">
            <Culture_Responses_Details 
              v-if="response.depth>-1"
              :isMe="response.depth==-1"
              :selectedSurveyQuestion=selectedSurveyQuestion 
              :response=response 
              :numberOfResponses="getNumberResponses(response, selectedSurveyQuestion.questionId)" 
              :responseScore= "getTotalResponseScore(response, selectedSurveyQuestion.questionId)" 
              :scoreColor="getTotalResponseScoreColor(response, selectedSurveyQuestion.questionId)"
              :canvasId= "getBarId(response.managerName)" 
              />
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
import Comms from '../../Comms';
import { URLS } from '../../../Constants.js';
import { ChartColors } from '../../../Constants.js';
import Culture_Responses_Details from './Culture_Responses_Details.vue';
import Culture_Responses_Summary from './Culture_Responses_Summary.vue';
import Culture_Sort_Dropdown from './Culture_Sort_Dropdown.vue';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
const axios = require('axios');

export default {
  name: 'Home',
  components: 
  {
    PulseLoader, 
    Culture_Responses_Details,
    Culture_Responses_Summary,
    Culture_Sort_Dropdown
  },
  props: 
  {
    // surveyQuestions:{ initialized: false },

  },  
  computed: 
  {
    getSurveyQuestions()
    {
      // console.log(this.surveyQuestions);
      // console.log(this.surveyQuestions)
      var array= Object.values(this.surveyQuestions);

      return this.sortedArray(array, this.getSortField(), this.selectedSortFieldDirection)
    },    
  },
  data: () => (
  {  
    isLoaded:false,
    myUserId:{},
    allManagers:[],
    surveyQuestions:{ initialized: false },
    selectedSurveyQuestion:{},
    surveyResponses:{},
    cultureOptions:{},    
    calculatedResponses:{},   
    calculatedResponsesByManager:{},
    cultureSummary:{totalResponses:0, totalQuestions:0},
    selectedSortField: "Date",
    selectedSortFieldDirection: 1,
    showNoData: false,
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
    isMobile() {
       if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
         return true
       } else {
         return false
       }
     }, 
    selectSort(field)
    {
      // console.log(field);
      this.selectedSortField=field;    
    },
    selectSortDirection(direction)
    {
      // console.log(field);
      this.selectedSortFieldDirection=direction;    
    },    
    sortedArray(toSort, field, direction)
    {
        return toSort.sort((a, b) => a[field] < b[field] ? direction: (direction*-1) );
    },    
    getSortField()
    {
      var field = 'questionId';
      if (this.selectedSortField=='Date')
      {
        field = 'lastSent';
      }
      else if (this.selectedSortField=='Score')
      {
        field = 'score';
      }
      else if (this.selectedSortField=='Culture')
      {
        field = 'cultureForSorting';
      }

      return field;
    },
    async initialize () 
    {
      var that = this;
      
      await this.loadExtendedManagers();
      await this.loadSurveyQuestions();
      await this.loadSurveyResponses();
      await this.loadCultureOptions();
      // console.log('here');
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
            this.surveyQuestions[j].cultureForSorting = cultureName; //for sorting
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
                  this.surveyQuestions[j].score = score; //for sorting

                }
                else
                {
                  this.surveyQuestions[j].score = -1; //for sorting  
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

      // console.log(this.allManagers);
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
      var url= URLS.surveyResponses;

      var response = await Comms.get(url).catch((error) => 
      { 
        return {};
      });

      this.surveyResponses = {};

      // this.surveyResponses[myUserId]=[];
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
            // console.log('WEIRD -this should not happen!');
            this.myUserId = response[i].managerId;
            this.surveyResponses[response[i].managerId]=[];
          }

          this.surveyResponses[response[i].managerId].push(response[i]);
        }
      }

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
        var score =  ((calculatedResponses[qId].totalValue/(this.getNumberResponses(calculatedResponses, qId))).toFixed(1));

        return score;
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
      var template={ managerName:"", depth: -1};
      if (responsesUnderManager.length>0)
      {
        var name = responsesUnderManager[0].managerFName+" "+responsesUnderManager[0].managerLName;
        template.managerName = name;

        // console.log(this.allManagers)
        for (var i=0; i<this.allManagers.length; i++)
        {
          if (this.allManagers[i].userId==responsesUnderManager[0].managerId)
          {
            template.depth=this.allManagers[i].depth;
          }
        }
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
    renderTrendChart(chartType, bgColors, borderColors, id, labels, responseArray)
    {
      if (document.getElementById(id)==null)
      {
        return;
      }

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
                      // display: false,                 
                    },          
                    barPercentage: 1.3,          
                    ticks: {
                      display: false,
                      autoSkip: false,
                      fontSize: 10,
                    }
                  }],
                  yAxes: [{
                    display:false, 
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
    renderBarChart(chartType, bgColors, borderColors, id, labels, responseArray)
    {
      if (document.getElementById(id)==null)
      {
        return;
      }

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
                      // display: false,                 
                    },          
                    barPercentage: 1.3,          
                    ticks: {
                      display: false,
                      autoSkip: false,
                      fontSize: 10,
                    }
                  }],
                  yAxes: [{
                    display:false, 
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
</style>