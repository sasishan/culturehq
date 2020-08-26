// var surveyResults= "https://vwtcceuev6.execute-api.us-west-2.amazonaws.com/default/myCultureSurvey";
var baseURL = "http://localhost:3030";
export const URLS = Object.freeze({
	surveyQuestions: baseURL+"/api/v1/engagement/dailyquestions",
	// https://vwtcceuev6.execute-api.us-west-2.amazonaws.com/default/myCultureSurvey
	surveyResponses: baseURL+"/api/v1/engagement/responses",
	//"https://b6i15gvzmj.execute-api.us-west-2.amazonaws.com/default/myCultureSurveyResponses",
	oneOnOneQuestionBank: baseURL+"/api/v1/oneonone/questionbank",
	questionCultures: baseURL+"/api/v1/oneonone/questionbank/categories",
	oneOnOneTemplates: baseURL + "/api/v1/oneonone/templates",
	// "https://h6oygjk5ci.execute-api.us-west-2.amazonaws.com/default/myCultureQuestions"
});
