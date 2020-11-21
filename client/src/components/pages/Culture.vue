<template>
  <div class="myContainer backgroundGrey2 col-12 mt-1">
    <div class="row">
      <div class="myContainer pt-1 col-lg-9">
        <h5 class="mt-3 mb-3"><b>Culture</b></h5>
      </div>
    </div>
    <div class="myContainer pt-1 col-lg-9 bg-white borderGrey1">
      <nav>
        <div class="nav nav-pills mt-2" id="nav-tab" role="tablist">                        
          <a class="nav-item nav-link active" id="nav-resopnses-tab" data-toggle="tab" href="#nav-resopnses" role="tab" aria-controls="nav-home" aria-selected="true"><small><b>Responses</b></small></a>
          <!-- <a class="nav-item nav-link " id="nav-culture-tab" data-toggle="tab" href="#nav-culture" role="tab" aria-controls="nav-profile" aria-selected="false"><small><b>Culture Score</b></small></a>                 -->
        </div>
      </nav>
      <div class="tab-content mt-4 mb-4" id="nav-tabContent"  style="border: 0px solid #DDD;">
        <div class="tab-pane fade show active" id="nav-resopnses" role="tabpanel" aria-labelledby="nav-resopnses-tab">
          <Culture_Responses :surveyQuestions="surveyQuestions" :surveyResponses="surveyResponses" :cultureOptions="cultureOptions"/>
        </div>              
        <div class="tab-pane fade show" id="nav-culture" role="tabpanel" aria-labelledby="nav-culture-tab">
          <!-- <Admin_SendLogs /> -->
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
// import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import Culture_Responses from './tabPages/Culture_Responses';
const axios = require('axios');

export default {
  name: 'Home',
  components: 
  {
    // PulseLoader,
    Culture_Responses
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
      
      // await this.loadExtendedManagers();
      // await this.loadSurveyQuestions();
      // await this.loadSurveyResponses();
      // await this.loadCultureOptions();
      // console.log('loaded');
      // this.calculateResponses(this.surveyQuestions, this.surveyResponses);        
      // this.isLoaded=true;

      // this.calculateCultureSummary();
      // await this.loadQuestionRecommendations();
      //this.renderCharts();
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
.lightBackground
{
  background: #f7f7f7;
}  


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