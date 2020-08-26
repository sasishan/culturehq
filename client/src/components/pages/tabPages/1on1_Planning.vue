<template>
  <div class="row col-12">
    <div class="col-3 backgroundGrey2 minHeight" >
      <div v-if="isSummaryMode()">
        <h6 class="small mt-4 mb-3"><b>Upcoming 1:1s</b></h6>
        <hr>
        <div class="listItem small text-muted mt-2 ">8/20 @ 3PM - John</div>
        <div class="listItem small text-muted mt-2">8/21 @ 11AM - Steve</div>
        <div class="listItem small text-muted mt-2">8/21 @ 11AM - Rob</div>
      </div>
      <div v-if="isPlannerMode()">
        <h6 class="small mt-4 mb-3"><b>Template</b></h6>
        <div class="dropdown">
          <button class="col-12 btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {{selectedTemplate.title}}
          </button>
          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" >
            <a class="dropdown-item" href="#" v-for="(template,index) in templateBank" :key="index" @click="selectTemplate(template)">{{template.title}}</a>
          </div>
        </div>
        <hr>        
        <h6 class="small mt-4 mb-3"><b></b></h6>
        <span v-for="(culture, index) in questionCultureFilter" :key="index">
           <div class="small mb-2 mt-2"><b>{{culture.name}}</b></div>
          <span v-for="(question,index) in questionBank" :key="index">
            <span v-if="matchesFilter(culture, question)">
              <button type="button" class="col-12 text-left btn btn-outline-secondary mb-1" 
                :class="[ questionIsSelected(question) ? 'active' : '']" @click="toggleQuestionSelection(question)"><small>{{question.question}}</small>
              </button>       
              <br>      
            </span>
          </span>  
        </span>      
      </div>
    </div>
    <div class="col-9 bg-white">
      <div class="mt-3 mb-5 mr-n4">
        <span class="h6 ml-2 mb-3"><b>1-on-1 with John Smith - 8/20 at 3pm</b>
          <button type="button" class="btn btn-sm btn-outline-secondary btn-outline-grey float-right ml-2" @click="showSummary('id')" v-if="isPlannerMode() || is1on1Mode()"><small>Cancel</small></button>
          <button type="button" class="btn btn-sm btn-outline-secondary btn-outline-grey float-right ml-2" v-if="isPlannerMode() || is1on1Mode()" @click="showSummary('id')"><small>Save</small></button>
        <button type="button" class="btn btn-sm btn-success float-right ml-2" v-if="isSummaryMode()" @click="start1on1()" :disabled="lengthOfDictionary(selectedQuestions)==0"><small>Start 1:1</small></button>
      </span><hr>
    </div>
      <div class="ml-2 mb-3">
      </div>      
      <!-- SUMMARY -->
      <div class="card sharp-card shadow-sm mt-4 mr-n4" v-if="isSummaryMode()">
        <div class="card-header ">
          <button type="button" class="btn btn-sm btn-outline-secondary btn-outline-grey float-right" @click="showPlanner('id')"><small>Modify</small></button>
          <div class="h6 mb-2">Template: <b>{{selectedTemplate.title}}</b></div>     
   <!--          <div class="">
              <span class="badge badge-warning p-1 mr-2">Caring</span>
              <span class="badge badge-warning p-1 mr-2 ">Learning</span>
              <span class="badge badge-warning p-1 mr-2 ">Enjoyment</span>            
            </div>  -->              
        </div>
        <div class="card-body">
          <span v-for="(category,qIndex) in selectedTemplate.questionCategories" :key="qIndex">
              <h5>{{category.name}}</h5>
              <table class="table table-condensed mt-4" v-if="questionsInCategory(category).length>0">
                <tbody>
                  <tr v-for="(question) in questionsInCategory(category)" :key='question.question'>
                    <td><small>Q{{getQuestionIndex(question)+1}}</small></td>
                    <td><small>{{question.question}}</small></td>
                    <td><small>
                      <span class="badge badge-warning ml-2 mt-1" v-for="culture in question.cultures" :key="culture.name">
                      {{culture}}
                      </span>
                      </small>
                    </td>
                  </tr>                  
                </tbody>           
              </table> 
              <div v-else><p class="small">No questions selected yet..</p><br></div>
            </span>
        </div>                          
      </div>
      <!-- PLANNER  -->
        <div v-if="isPlannerMode()">
          <div class="text-center mt-n4">
            <small>Click on the toggle buttons below to view potential 1-on-1 questions for that category.</small><br>
            <div class="h6 mt-3">
              <small><b>Template Sections</b></small>             
            </div>
            <span v-for="(category, index) in selectedTemplate.questionCategories" :key="index">
              <div class="btn-group" role="group">
                <button type="button" class="ml-2 btn btn-outline-primary btn-sm mt-1" 
                    :class="[ isCategorySelected(category) ? 'active' : '']" @click="toggleCategory(category)"><small>{{category.name}}</small></button> 
              </div>
            </span>
            <br>
            <span v-if="selectedCategory!=undefined">
              <h6 class="mt-4"><small><b>Culture Driving Questions:</b></small></h6>
              <span v-for="(culture) in cultureOptions" :key="culture.name">
                <div class="btn-group" role="group">
                  <button type="button" class="ml-2 btn btn-outline-success btn-sm mt-1" :disabled="!cultureHasQuestions(culture)" 
                    :class="[ isCultureSelected(culture) ? 'active' : '']" @click="toggleCultureSelection(culture)"><small>{{culture.name}}</small></button> 
                </div>
              </span>               
            </span>                    
          </div>  
        </div>
      <div class="card sharp-card shadow-sm mt-4 mr-n4" v-if="isPlannerMode()">
        <div class="card-header ">
          Template: <b>{{selectedTemplate.title}}</b>
        </div>
        <div class="card-body">
        <span >
          <!-- v-if="notEmpty(selectedQuestions)" -->
          <span v-for="(category,qIndex) in selectedTemplate.questionCategories" :key="qIndex">
              <h5>{{category.name}}</h5>
              <table class="table table-condensed mt-4">
                <tbody>
                  <tr class='drag-el drop-zone' 
                      draggable
                      @dragstart='startDrag($event, question)'
                      @dragend='endDrag($event)'
                      @drop='onDrop($event, index)' 
                      @dragover='dragover($event)'
                      @dragleave='dragleave($event)'
                      @dragover.prevent
                      @dragenter.prevent 
                      v-for="(question, index) in questionsInCategory(category)" :key='question.question'>
                    <td><small>Q{{index+1}}</small></td>
                    <td><small> {{question.question}}</small></td>
                    <td><small>
                      <span class="badge badge-warning ml-2 mt-1" v-for="culture in question.cultures" :key="culture.name">
                      {{culture}}
                      </span>
                      </small>
                    </td>
                    <td>
                      <i class="fa fa-trash ml-3" style="cursor: hand" @click="toggleQuestionSelection(question)"></i>      
                    </td>
                  </tr>                  
                  <tr>
                    <td></td>
                    <td>
                      <small>
                      <input type="text" class="col-12"
                        v-model="newQuestion.question" placeholder="Add a custom question" 
                        v-on:keyup.enter="addCustomQuestion(newQuestion.question)"/>
                      </small>
                    </td>
                    <td></td>
                    <td>
                      <i class="fa fa-plus ml-3" style="cursor: hand" @click="addCustomQuestion(newQuestion.question)"></i>
                    </td>
                  </tr>     
                </tbody>           
              </table>              
            </span>
 
          </span>   
        </div>                          
      </div>
      <div class="mr-n4" v-if="is1on1Mode()">
        <OneOnOneInput :user="1" :questions="selectedQuestions"/>
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
import Comms from '../../Comms';
import { URLS } from '../../../Constants.js';
import OneOnOneInput from './1on1_Input';

export default {
  name: 'OneOnOne_Planning',
  components: 
  {
    OneOnOneInput
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
    templateBank:[],
    showLastNotes: false,
    selectedTemplate:{},
    selectedCategory:null,
    selectedQuestions:{},
    questionCultureFilter:[],
    newQuestion:{question:""},
    display:"summary",
  }),
  async mounted()
  {
    await this.load(URLS.oneOnOneQuestionBank, this.questionBank, this.initializeQuestionBank);
    await this.load(URLS.questionCultures, this.cultureOptions, this.initializeQuestionCultures);
    await this.load(URLS.oneOnOneTemplates, this.templateBank, this.initializeOneOnOneTemplates);

    this.selectedTemplate=this.templateBank[0];

    // this.load1on1QuestionBank();
    // this.load1on1QuestionCultures();
    // this.load1on1Templates();
  },
  created()
  {
    this.initialize();
  },
  methods:
  {
    initialize () {
    },
    lengthOfDictionary(dictionary)
    {
      return Object.keys(dictionary).length
    },
    getQuestionIndex(question)
    {
      var i=0;
      for (let [questionId, q] of Object.entries(this.selectedQuestions))
      {
          if (question.questionId==questionId)
          {
            return i;
          }
          i++;
      }      
      return -1;
    },
    questionsInCategory(category) 
    {
      var questions=[];
      for (let [questionId, question] of Object.entries(this.selectedQuestions))
      {
          if (this.isInCategory(question, category))
          {
            questions.push(question);
          }
      }
      return questions;
    },    
    notEmpty(object)
    {
      return Object.keys(object).length
    },
    initializeQuestionCultures(cultures, questionCultures)
    {
      for (var i=0; i< cultures.length; i++)
      {
        cultures[i].isSelected=false;
        questionCultures.push(cultures[i]);
      } 
    },
    initializeQuestionBank(questions, questionBank)
    {
      for (var i=0; i< questions.length; i++)
      {
        questionBank.push(questions[i]);
      }      
    },
    initializeOneOnOneTemplates(templates, templateBank)
    {
      for (var i=0; i< templates.length; i++)
      {
        for (var j=0; j<templates[i].questionCategories.length; j++)
        {
          templates[i].questionCategories[j].isSelected=false;
        }
        templateBank.push(templates[i]);
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
    async load(url, loadVariable, intializeFunction)
    {
      var data = await Comms.get(url).catch((error) => 
      { 
        console.log(error);
        return [];
      });

      if (data)
      {
        intializeFunction(data, loadVariable);
      }
    },
    selectTemplate(template)
    {
      this.selectedTemplate=template;
    },  
    cultureHasQuestions(culture)
    {
      for (var i=0; i<this.questionBank.length; i++)
      { 
        var q = this.questionBank[i];
        
        if (this.matchesFilter(culture, q))
        {
          return true;
        }
      }
      return false;
    },
    matchesFilter(culture, question)
    {
      if (question.cultures.includes(culture.name) && (question.categories.includes(this.selectedCategory.name)))
      {
        return true;
      }
      return false;
    },
    questionIsSelected(question)
    {
      // console.log(this.selectedQuestions);
      return (this.selectedQuestions[question.questionId])
    },
    isSummaryMode()
    {
      return this.display=='summary';
    },
    isPlannerMode()
    {
      return this.display=='planner';
    },  
    is1on1Mode()
    {
      return this.display=='1on1';
    }, 
    showSummary(id)
    {
      this.display='summary';
    },
    showPlanner(oneOneOneId)
    {
      this.display='planner';
    },
    isCategorySelected(category)
    {
      return this.selectedCategory==category;
    },
    isCultureSelected(culture)
    {
        return this.questionCultureFilter.includes(culture);
    },    
    addQuestionFilterCriteria(criteria)
    {
      if (!this.questionCultureFilter.includes(criteria))
      {
        criteria.isSelected=true;
        this.questionCultureFilter.push(criteria);
      }
    },
    removeQuestionFilterCriteria(criteria)
    {
      for (var i=0; i<this.questionCultureFilter.length; i++)
        {
          if (this.questionCultureFilter[i]==criteria)
          {
            criteria.isSelected=false;
            this.questionCultureFilter.splice(i, 1);
            break;
          }
        } 
    },   
    toggleCategory(category)
    {
      // console.log(category);
      if (this.selectedCategory!=null && this.selectedCategory.categoryId==category.categoryId)
      {
        this.selectedCategory.isSelected=false;
        this.selectedCategory=null;
      }
      else
      {
        if (this.selectedCategory!=null)
        {
          this.selectedCategory.isSelected=false;  
        }
        
        this.selectedCategory = category;
        this.selectedCategory.isSelected=true;
      }
    },
    clearCultureSelection()
    {
      for (var i=0; i<this.questionCultureFilter.length; i++)
      {
        var criteria = this.questionCultureFilter[i];//0, 1);
        this.removeQuestionFilterCriteria(criteria);
      }
    },
    toggleCultureSelection(criteria)
    {
      // this.clearCultureSelection();
      // criteria.isSelected=!criteria.isSelected;

      var alreadySelected = this.isCultureSelected(criteria);
      this.clearCultureSelection();
      if (!alreadySelected)
      {
        this.addQuestionFilterCriteria(criteria);        
      }
      else
      {
        this.removeQuestionFilterCriteria(criteria);
      }
    },
    toggleQuestionSelection(question)
    {
      if (this.selectedQuestions[question.questionId]!=undefined)
      {
        // Vue = window.vue;
        this.$delete(this.selectedQuestions, question.questionId); 
      }
      else
      {
        // Vue = window.vue;
        this.$set(this.selectedQuestions, question.questionId, question);
      }
    },
    isInCategory(question, category)
    {
      return (question.categories.includes(category.name))
    },
    start1on1()
    {
      this.display='1on1';
    }
  }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>