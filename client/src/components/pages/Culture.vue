<template>
  <div class="myContainer col-12 mt-4">
    <div class="tab-content">
      <div class="row">
        <div class="myContainer pt-1 col-9 transparent minHeight">
          <h5 class="mt-3 mb-3"><b>Culture Survey Overview</b></h5>
          <div v-if="surveyQuestions.initialized==false">
             <pulse-loader color="#1976d2" size="10px" ></pulse-loader>
          </div>     
          <span v-for="(surveyQuestion) in surveyQuestions" :key="surveyQuestion.questionId">
            <div class="card sharp-card shadow-sm mt-3 mb-4">              
              <div class="card-header">
                <span class="titleColor2"><b>{{surveyQuestion.question}}</b></span>                                
                <small>
                    <span class="badge badge-secondary ml-2 mt-1" v-for="culture in surveyQuestion.cultures" :key="culture">
                    {{culture}}
                    </span>
                </small><br>
                <small>{{surveyQuestion.lastSent}}</small>
              </div>
              <div class="card-body">
                <div class="text-center" v-if="!isLoaded">
                  <pulse-loader color="#1976d2" size="10px" ></pulse-loader>
                </div>
                <small>               
                  
                  <h6 class="card-title" v-if="isLoaded">
                    <small><b>Overall Score:</b></small>
                    <span :class="getTotalResponseScoreColor(surveyQuestion.questionId)"> 
                      {{getTotalResponseScore(surveyQuestion.questionId)}}
                    </span><br><br>
                    <small>Responses: {{getNumberResponses(surveyQuestion.questionId)}}</small>
                  </h6>                 
                  <p class="card-text">
                    <canvas :id="surveyQuestion.questionId" width="400" height="100"></canvas>
                    <hr>
                    <h6 class="card-title">
                        Trends
                    </h6>
                    --- Future: show graph of trending scores for this question
                    <br>
                    <h6 class="card-title">
                        Recommendations
                    </h6>
                    --- Future: based on the score types of 1-on-1 questions to ask, actions to take 
                </small>
              </div>
            </div>              
          </span>
        </div>
      </div>
    </div>
  </div>  
</template>

<script>
// import MainMenu from '../menus/MainMenu';
import Comms from '../Comms';
import { URLS } from '../../Constants.js';
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
    surveyQuestions:{ initialized: false },
    calculatedResponses:{},   
  }),
  mounted()
  {
    this.initialize();

    // var cultures = [ "Caring", "Purpose", "Learning", "Enjoyment", "Results", "Authority", "Safety", "Order" ];
    // var custom = [ "Check-In", "Conclusions", "Flight Risk"];
    // for (var i=0; i< this.qbank.length; i++)
    // {
    //   // var qid = this.qbank[i].Id;
    //   var question = this.qbank[i].Question;
    //   var string1 ='insert into QuestionBank1on1(Question) values("'+question+'")';
    //   this.queries.push(string1);
    //   for (var j=0; j< this.qbank[i].Culture.length; j++)
    //   {
    //     var culture = this.qbank[i].Culture[j];
    //     var index = cultures.indexOf(culture);
    //     var index2 = custom.indexOf(culture);
    //     var string2="";
    //     if (index>=0)
    //     {
    //       string2 ='insert into mapping_QuestionBank_Cultures(questionId, cultureId) values('+(i+1)+','+(index+1)+')';
    //       this.queries.push(string2);
    //     }
    //     else if (index2>=0)
    //     {
    //       string2 ="insert into mapping_QuestionBank_CustomCategories(questionId, categoryId, companyId) values("+(i+1)+","+(index2+1)+", 1)";
    //       this.queries.push(string2);
    //     }
    //   }
    // }
    // console.log(this.queries[0], this.queries[1]);
  },
  created()
  {
    
  },
  methods:
  {
    async initialize () 
    {
      var that = this;
      
      await this.loadSurveyQuestions();
      await this.loadSurveyResponses();
      this.calculateResponses(this.surveyQuestions, this.surveyResponses);  
      this.renderCharts();
      this.isLoaded=true;
    },
    renderCharts()
    {
      for (var i=0; i<this.surveyQuestions.length; i++)
      {
        this.renderOneChart(this.surveyQuestions[i].questionId);
      }
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
    async loadSurveyResponses()
    {

      var url= URLS.surveyResponses;

      var response = await Comms.get(url).catch((error) => 
      { 
        return {};
      });

      if (response && response.Items)
      {
        this.surveyResponses = [];
        for (var i=0; i< response.Items.length; i++)
        {
          this.surveyResponses.push(response.Items[i]);
        }
      }
      return this.surveyResponses;
    }, 
    getTotalResponseScoreColor(qId)
    {
      var color=""
      if (qId && this.calculatedResponses[qId])
      {
        var score = this.getTotalResponseScore(qId);

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
    getTotalResponseScore(qId)
    {
      if (qId && this.calculatedResponses[qId] && this.getNumberResponses(qId)>0)
      {
        return ((this.calculatedResponses[qId].totalValue/(this.getNumberResponses(qId))).toFixed(1));
      }
      else
      {
        return 'Not enough data';
      }
    },    
    getNumberResponses(qId)
    {
      if (qId && this.calculatedResponses[qId])
      {
        return this.calculatedResponses[qId].numResponses;
      }
      else
      {
        return 0;
      }
    },
    renderOneChart(qId)
    {
      if (qId && this.calculatedResponses[qId])
      {
        var labels=[];

        labels = Object.keys(this.calculatedResponses[qId].answers);       
        var data=Object.values(this.calculatedResponses[qId].answers);
        
        this.renderBarChart(qId, labels, data);
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
    calculateResponses(surveyQuestions, surveyResponses)
    {
      this.calculatedResponses={};
      this.buildResponsesTemplate(surveyQuestions, this.calculatedResponses);

      this.analyzeResponses(surveyResponses, this.calculatedResponses);

    },    
    sortByKey(array, key)
    {
        return array.sort(function(a, b)
        {
            var x = a[key]; var y = b[key];
            return ((x >y) ? -1 : ((x < y) ? 1 : 0));
        });
    },
    renderBarChart(id, labels, responseArray)
    {
      var ctx = document.getElementById(id).getContext('2d');
      var myChart = new Chart(ctx, {
          type: 'bar',
          data: {
              labels: labels,
              datasets: [{
                  label: '',
                  data: responseArray,
                  backgroundColor: [
                      'rgba(75, 192, 192, 0.2)',
                      'rgba(75, 192, 192, 0.2)',                            
                      'rgba(255, 206, 86, 0.2)',
                      'rgba(255, 206, 86, 0.2)',                      
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(153, 102, 255, 0.2)',
                      'rgba(255, 159, 64, 0.2)'
                  ],
                  borderColor: [
                      'rgba(75, 192, 192, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(255, 206, 86, 1)',                      
                      'rgba(255, 206, 86, 1)',                            
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(153, 102, 255, 1)',
                      'rgba(255, 159, 64, 1)'
                  ],
                  borderWidth: 1
              }]
          },
          options: {
                    legend: 
                    {
                        display: false,
                    } ,
              scales: {
                  yAxes: [{
                      ticks: {
                          beginAtZero: true,
                                max: 5,
                                min: 0,
                                stepSize: 1                                
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