
<template>
	<span class="dropdown">
		<button class="btn btn-outline-secondary dropdown-toggle btn-sm" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
		{{selectedSortField}}
		</button>
		<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
			<a class="dropdown-item" @click="emitSort(sortByDate)" >{{sortByDate}}</a>
			<a class="dropdown-item" @click="emitSort(sortByScore)" >{{sortByScore}}</a>
			<a class="dropdown-item" @click="emitSort(sortByCulture)">{{sortByCulture}}</a>
		</div>
		<button class="btn btn-sm btn-outline-secondary ml-1" @click="emitDirection()">
			<span  v-if="sortDirection<0">
				<i class="fa fa-arrow-up" aria-hidden="true" ></i>
			</span>
			<span  v-if="sortDirection>0">
				<i class="fa fa-arrow-down" aria-hidden="true"></i>
			</span>			
		</button>

		<button class="btn btn-sm btn-outline-secondary ml-4" @click="toggleShowData()">
			<span  v-if="showNoDataQuestions">
				Answered Questions
			</span>
			<span  v-if="!showNoDataQuestions">
				All Questions
			</span>			
		</button>		
	</span>
</template>

<script>
// import Comms from './Comms';

export default {
  name: 'Culture_Responses_Details',
  components: 
  {
  },
  props: 
  {
	selectedSortField:{},
	sortDirectionStart: {},
	showNoDataQuestions:{}
  },  
  computed: 
  {
  },
  data: () => (
  {  
	sortByScore: "Score",
	sortByCulture: "Culture",
	sortByDate: "Date",
	sortDirection: {}
	
  }),
  mounted()
  {
	this.sortDirection = this.sortDirectionStart;
  },
  created()
  {
    this.initialize();
  },
  methods:
  {
    initialize () {
    },
	emitSort(sortType)
	{
		this.$emit('sortBy', sortType);
	},
	emitDirection()
	{
		this.sortDirection=this.sortDirection*-1;
		this.$emit('sortDirectionChanged', this.sortDirection);	
	},
	toggleShowData()
	{
		this.showNoDataQuestions=!this.showNoDataQuestions;
		this.$emit('toggleShowNoDataQuestions', this.showNoDataQuestions);			
	}

  }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>