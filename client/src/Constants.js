// var surveyResults= "https://vwtcceuev6.execute-api.us-west-2.amazonaws.com/default/myCultureSurvey";
// var baseURL = "http://localhost:3030";
var baseURL = "https://culturehq.honchohq.com/"
// "http://3.221.72.198/";
export const URLS = Object.freeze({
	surveyQuestions: baseURL+"/api/v1/engagement/dailyquestions",
	surveyQuestionsPublished: baseURL+"/api/v1/engagement/publishedquestions",
	// https://vwtcceuev6.execute-api.us-west-2.amazonaws.com/default/myCultureSurvey
	surveyResponses: baseURL+"/api/v1/engagement/responses",
	//"https://b6i15gvzmj.execute-api.us-west-2.amazonaws.com/default/myCultureSurveyResponses",
	oneOnOneQuestionBank: baseURL+"/api/v1/oneonone/questionbank",
	questionCultures: baseURL+"/api/v1/oneonone/questionbank/categories",
	oneOnOneTemplates: baseURL + "/api/v1/oneonone/templates",
	sendOneQuestion: baseURL + "/api/v1/engagement/sendonequestion",
	createNewQuestion: baseURL + "/api/v1/engagement/newquestion",
	publishQuestion: baseURL + "/api/v1/engagement/",
	getLogs: baseURL + "/api/v1/engagement/sendlogs",
	questionRecommendation: baseURL + "/api/v1/engagement/recommendations/question",
	allRecommendations: baseURL + "/api/v1/engagement/recommendations",
	updateDailyQuestion: baseURL + '/api/v1/engagement/dailyquestion/',
	getUsers: baseURL+'/api/v1/admin/users',
	getExtendedManagers: baseURL+'/api/v1/myprofile/allmanagers'
	// "https://h6oygjk5ci.execute-api.us-west-2.amazonaws.com/default/myCultureQuestions"
});

export const ChartColors = Object.freeze({
	questionBackgroundColors: [
                      'rgba(75, 192, 192, 0.2)',
                      'rgba(75, 192, 192, 0.2)',                            
                      'rgba(255, 206, 86, 0.2)',
                      'rgba(255, 206, 86, 0.2)',                      
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(153, 102, 255, 0.2)',
                      'rgba(255, 159, 64, 0.2)'],
	questionBorderColors :
      [ 'rgba(75, 192, 192, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(255, 206, 86, 1)',                      
        'rgba(255, 206, 86, 1)',                            
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)' ],

	cultureBackgroundColors: [
						'rgba(255, 206, 86, 0.2)',   
                      'rgba(255, 206, 86, 0.2)',                      
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(153, 102, 255, 0.2)',
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 235, 0.2)',                      
                      'rgba(255, 159, 64, 0.2)'],
	cultureBorderColors :
      [
        'rgba(255, 206, 86, 1)' ],        
    });