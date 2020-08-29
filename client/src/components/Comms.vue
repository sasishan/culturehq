<script>
import { Auth } from 'aws-amplify';
const axios = require('axios');

function getTokens(session)
{
	if (session && session.accessToken)
	{
		var tokens = { accessToken: session.accessToken.jwtToken, idToken: session.idToken.jwtToken }
		return tokens;
	}
	else
	{
		return '';
	}
}

function getEmail(session)
{
	if (session && session.idToken.payload.email)
	{
		return session.idToken.payload.email
	}
	else
	{
		return '';
	}
}

async function getAnonymousHeader()
{
	var headers =
    {
        // 'Authorization': session.idToken.jwtToken, 
        'content-type': 'application/json',
	};
	return headers;
}

async function getHeader()
{
	// return getAnonymousHeader();
	const session = await Auth.currentSession();			
	var tokens = getTokens(session);
	var headers =
    {
        'AccessToken': tokens.accessToken,
        'Authorization': tokens.idToken,
        'content-type': 'application/json',
        'email': getEmail(session)
	};
	return headers;
}

// async function getFileHeader()
// {
// 	const session = await Auth.currentSession();			
// 	var headers =
//     {
//         // 'Authorization': session.idToken.jwtToken, 
//         'AccessToken': getToken(session),
//         'content-type': 'multipart/form-data',
//         'email': getEmail(session)
// 	};
// 	return headers;
// }
export default 
{
	name: 'Comms',
	// async anonymousPost(url, data, callback)
	// {
	// 	try 
	// 	{
	// 		var headers = getAnonymousHeader();
	// 		var response = await axios.post(url, data, {headers: headers});

	// 		var results = response.data;
	// 		return callback(null, results);
	// 	}
	// 	catch (err) 
	// 	{
	// 		console.log('An error occurred: ', err);
	// 		return callback(err, null);
	// 	}
	// },	
	async post(url, data, callback)
	{
		try 
		{
			var headers = await getHeader();
			var response = await axios.post(url, data, {headers: headers});

			var results = response.data;
			return callback(null, results);
		}
		catch (err) 
		{
			console.log('An error occurred: ', err);
			return callback(err, null);
		}

		// var headers = await getHeader();
		// return new Promise(function(resolve, reject) 
		// {
		// 	try 
		// 	{
		// 		var response = await axios.post(url, data, {headers: headers}).then(function(response)
		// 		{
		// 			var results = response.data;
		// 			resolve(results);
		// 		}, function(error)
		// 		{
		// 			console.log('An error occurred: ', error);
		// 			reject(error);
		// 		});
		// 	}
		// 	catch (err) 
		// 	{
		// 		console.log('An error occurred: ', err);
		// 		reject(err);
		// 	}		
		// });		
	},	
	// async getFile(url, callback)
	// {
	// 	try 
	// 	{
	// 		// var headers = await getHeader();
	// 		var response = await axios.get(url, {responseType: 'blob',timeout: 30000});
	// 		var results = response.data;
	// 		return callback(null, results);

	// 	}
	// 	catch (err) 
	// 	{
	// 		console.log('An error occurred: ', err);
	// 		return callback(err, null);
	// 	}
	// },
	// async postFile(url, data, callback)
	// {
	// 	try 
	// 	{
	// 		var headers = await getFileHeader();
	// 		var response = await axios.post(url, data, {headers: headers});

	// 		var results = response.data;
	// 		return callback(null, results);

	// 	}
	// 	catch (err) 
	// 	{
	// 		console.log('An error occurred: ', err);
	// 		return callback(err, null);
	// 	}
	// },		
	async get(url)
	{
		var headers = await getHeader();
		return new Promise(function(resolve, reject) 
		{
			try 
			{
				axios.get(url, {headers: headers}).then(function(response)
				{
					var results = response.data;
					resolve(results);
				}, function(error)
				{
					console.log('An error occurred: ', error);
					reject(error);
				});
			}
			catch (err) 
			{
				console.log('An error occurred: ', err);
				reject(err);
			}		
		});
	},
	// async delete(url, callback)
	// {
	// 	try 
	// 	{
	// 		var headers = await getHeader();
	// 		var response = await axios.delete(url, {headers: headers});

	// 		var results = response.data;
	// 		return callback(null, results);

	// 	}
	// 	catch (err) 
	// 	{
	// 		console.log('An error occurred: ', err);
	// 		return callback(err, null);
	// 	}
	// },	
	components: 
	{
	}, 	
	methods: 
	{

	},

}

</script>