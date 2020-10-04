<template>
  <div class="myContainer col-12 mt-4 mb-5 minHeight">
    <div class="tab-content">
      <div class="row">
        <div class="myContainer pt-1 col-9 ">
          <h5 class="mt-3 mb-3"><b>1-on-1 Question Builder</b></h5>
        </div>
      </div>
      <div class="">
        <div class="myContainer pt-1 col-9 bg-white borderGrey1">
          <!-- QUESTION BUILDER -->
          <h5 class="mt-n4 mb-1"><small><b></b></small></h5>
          <div v-if="isLoaded==false">
            <h6>Loading....</h6>
          </div>
          <div id="Input" v-if="isLoaded==true" class="myContainer">      
            <div class="text-center">
              <h6 class="mt-4"><small><b>Culture Driving Questions:</b></small></h6>
              <span v-for="(culture) in cultureOptions" :key="culture.name">
                <div class="btn-group" role="group">
                  <button type="button" class="ml-2 btn btn-outline-success btn-sm mt-1"
                    :class="[ isCultureSelected(culture) ? 'active' : '']" @click="toggleCultureSelection(culture)"><small>{{culture.name}}</small></button> 
                </div>
              </span>        
            </div>  
            <br>
            <hr>
            <span class="h5"><small><b>Your 1-on-1 Questions </b></small>
              <button v-if="lengthOfDictionary(selectedQuestions)>0" @click="copyToClipboard(selectedQuestions)" class="btn btn-sm btn-link ml-2 mb-1 float-right"><small>copy to clipboard</small></button>
              <br>
            </span> 
            <p v-if="lengthOfDictionary(selectedQuestions)==0"><span class="text-center"><small>Questions you select below will be listed here.</small></span></p>
            <span v-if="lengthOfDictionary(selectedQuestions)>0">
              <table class="table table-condensed mt-4 ">
                <tr v-for="(question, questionId, index) in selectedQuestions"
                      class='drag-el drop-zone' 
                      :key='questionId' 
                      draggable
                      @dragstart='startDrag($event, question)'
                      @dragend='endDrag($event)'
                  @drop='onDrop($event, index)' 
                  @dragover='dragover($event)'
                  @dragleave='dragleave($event)'
                  @dragover.prevent
                  @dragenter.prevent>
                  <td><small>Q{{index+1}}</small></td>
                  <td><small> {{question.question}}</small></td>
                  <td><small>
                    <span class="badge badge-warning ml-2 mt-1 p-1" v-for="(culture, index) in question.cultures" :key="index">
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
                    <small><input type="text" v-model="newQuestion.Question" placeholder="Add a custom question" v-on:keyup.enter="addCustomQuestion(newQuestion.Question)"/></small>
                  </td>
                  <td></td>
                  <td>
                    <i class="fa fa-plus ml-3" style="cursor: hand" @click="addCustomQuestion(newQuestion.Question)"></i>
                  </td>
                </tr>
              </table>
              <span class="" v-if="lengthOfDictionary(selectedQuestions)>0"><small><small>Drag  & drop to rearrange</small></small></span>    
            </span>     

            <span v-if="questionCultureFilter.length>0">
              <hr class="mt-5"> 
              <h5 class="mt-2"><small><b>Question Bank:</b></small></h5>
              <small>To add questions to your list, click any of the buttons listed below. Highlighted questions indicate that they've been selected already.</small>
              <span v-for="culture in questionCultureFilter" :key="culture.name">                
                <div class="card mt-4" style="width: 100%;">
                  <div class="card-header">
                    <h6 class="card-title">{{culture.name}}
                      <!-- <button class="btn btn-sm btn-outline-default float-right" @click="removeCulture(culture)"> x </button> -->
                    </h6>
                  </div>        
                  <div class="card-body">   
                    <span v-for="(question,index) in questionBank" :key="index">
                      <!-- <span v-if="isValidCultureQuestion(culture, question)">AAA</span> -->
                      <span v-if="isValidCultureQuestion(culture, question)">
                      <!-- {{question.Question}} -->
                        <button type="button" class="col-12 text-left ml-1 btn btn-outline-secondary mb-1" 
                          :class="[ questionIsSelected(question) ? 'active' : '']" @click="toggleQuestionSelection(question)"><small>{{question.question}}</small>
                        </button>       
                        <br>      
                      </span>
                      
                    </span>
                    <!-- <button type="button" class="btn btn-sm col-12 btn-secondary ml-1" @click="showMore[culture.name]=true">show more</button> -->
                    </div>
                </div>      
              </span>   
            </span>                 
          </div>
        </div>
      </div>
    </div>
  </div>    
</template>
<script>

import { URLS } from '../../Constants.js';
import Comms from '../Comms';
export default {
  name: 'QuestionBuilder',
  components: 
  {
  },
  props: 
  {
  },  
  computed: 
  {
  },
  data: () => (
  {  
    isLoaded: true,
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
    this.toggleCultureSelection(this.cultureOptions[0]);
    this.isLoaded=true;
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
      if (question.cultures.includes(culture.name))
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
    questionIsSelected(question)
    {
      // console.log(this.selectedQuestions);
      return (this.selectedQuestions[question.questionId])
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
      if (!criteria)
      {
        return;
      }
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
      if (alreadySelected)
      {
        return;
      }
      this.clearCultureSelection();
      // if (!alreadySelected)
      // {
        this.addQuestionFilterCriteria(criteria);        
      // }
      // else
      // {
        // this.removeQuestionFilterCriteria(criteria);
      // }
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
<style>
.minHeight
{
  min-height: 500px;
}


.listItem
{
  margin-top: 5px;
}

.borderGrey1
{
  border: 1px solid #DDD;
}

.backgroundGrey1
{
  background: #FFF;
}

.backgroundGrey2
{
  background: #EEE;
}

.backgroundGrey3
{
  background: #DDD;
}

.backgroundGrey4
{
  background: #CCC;
}

.myContainer 
{
  margin: auto;
  /*padding: 20px;*/
 /*margin-left: 100px;*/
 /*margin-right: 20px;*/

}
.sidebar{
  border-radius: 2px;
  background: #EEE !important;
  min-height: 1000px;
  /*color: white;*/
  /*border: "1px black";*/
  margin-left: 20px;
  margin-top: auto;
  margin-bottom: auto;
  padding: 40px;
  width: 70%;
  min-width: 300px;
}

.nav-pills .nav-link.active, .nav-pills .show>.nav-link {
    /*color: #ff8a00;*/
    color: #1976d2;
    background: none; 
    border-bottom: 5px solid #ff8a00;
    /*border-bottom: 5px solid #1976d2;*/
    border-bottom-right-radius: 0px;
    border-bottom-left-radius: 0px;
}

nav .nav a{
  /*color: #ffc076;*/
  color: #8fc0f1;
  
  }

.nav-pills {
    border-bottom: 1px solid #ff8a00;
    /*border-bottom: 1px solid #1976d2;*/
}

/*TABS*/

</style>