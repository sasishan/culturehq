<template>
  <div class="row col-12">
    <div class="col-3 backgroundGrey2 minHeight">
      <h6 class="small mt-4 mb-3"><b>Templates</b></h6>
        <hr>
        <div v-for="template in templateBank" :key="template.templateId" >
          <button class="btn btn-sm btn-link" @click="selectedTemplate=template">
            <small>{{template.title}}</small>
          </button>
        </div>
    </div>
    <div class="col-9 bg-white">
    <div class="mt-3 mb-3">
      <button type="button" class="btn btn-sm btn-outline- float-right"><small>Add Section</small></button>
      <span class="h6 ml-2 mb-5"><b>{{selectedTemplate.title}} - {{selectedTemplate.description}}</b>
      </span><br>
    </div>
      <div class="card sharp-card shadow-sm mt-5"  v-for="section in selectedTemplate.questionCategories" :key="section.name">
        <div class="card-header">
          <button type="button" class="btn btn-sm btn-outline-primary float-right"><small>Modify</small></button>
          <span><b>{{section.name}}</b></span><br>
          <b><small>{{section.description}}</small></b>
          
        </div>
        <div class="card-body">
          <h6 class="card-title small">
            
          </h6>                 
          <p class="card-text small">
            <b>Questions</b><br>
            <table class="table table-sm mt-2">               
              <tr v-for="question in questionsInCategory(section)" :key="question.questionId">
                <td>
                  {{question.question}}
                </td>
                <td>
                  <small>
                  <span class="badge badge-warning ml-2 mt-1" v-for="culture in question.cultures" :key="culture.name">
                  {{culture}}
                  </span>
                  </small>
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
import Comms from '../../Comms';
import { URLS } from '../../../Constants.js';

export default {
  name: 'HR_Templates',
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
    templateBank:[],
    selectedTemplate:{},
    questionBank:[],
    cultureOptions:[]
  }),
  async mounted()
  {
    await this.load(URLS.oneOnOneQuestionBank, this.questionBank, this.initializeQuestionBank);
    await this.load(URLS.oneOnOneTemplates, this.templateBank, this.initializeOneOnOneTemplates);
    await this.load(URLS.questionCultures, this.cultureOptions, this.initializeQuestionCultures);
    this.selectedTemplate = this.templateBank[0];
  },
  created()
  {
    this.initialize();
  },
  methods:
  {
    initialize () {
    },
    questionsInCategory(category) 
    {
      var questions=[];
      for (let [questionId, question] of Object.entries(this.questionBank))
      {
          if (this.isInCategory(question, category))
          {
            questions.push(question);
          }
      }
      return questions;
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
        templateBank.push(templates[i]);
      }      
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
    isInCategory(question, category)
    {
      return (question.categories.includes(category.name))
    }       
  }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>