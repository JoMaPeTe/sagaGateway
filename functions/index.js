
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
//  exports.helloWorld = functions.https.onRequest((request, response) => {
//    functions.logger.info("Hello logs!", {structuredData: true});
//    response.send("Hello from Firebase!");
//  });

//const functions = require('firebase-functions');

//EXPRESS para json en lugar de las firebase functions
const express = require ('express');
const app = express();

const cors = require('cors')({origin:true});
const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');

admin.initializeApp({
  credential: admin.credential.applicationDefault(), // credential: admin.credential.applicationDefault(),  credential: admin.credential.cert(serviceAccount)
  databaseURL: "https://saga-1f81f-default-rtdb.europe-west1.firebasedatabase.app"
});
const { SessionsClient } = require('dialogflow');
const { Express } = require('actions-on-google/dist/framework/express');



app.get('/', function(req,res){
  res.send('Hello World!')
});
// Configurar cabeceras y cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});


app.post('/gateway', express.json(), function(request,response){

  cors(request, response, async() =>{
    
    // const agent = new WebhookClient({ request: req, response: res });
    // console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
    // console.log('Dialogflow Request body: ' + JSON.stringify(req.body));
    
    const {queryInput, sessionId} = request.body;

    const SessionClient = new SessionsClient ({credentials: serviceAccount});
    const session = SessionClient.sessionPath('saga-1f81f', sessionId);
    let result;
    try {
    const responses =  await SessionClient.detectIntent ({ session, queryInput}); 
    
     result = responses[0].queryResult;
   } catch (error) {
    result = error;
   }
  console.log(result);
    response.send(result);

      
    })
});

/**
La function para administrar custom claims no parece que sea posible usarla con Express
https://stackoverflow.com/questions/55031521/firebase-callable-express
https://firebase.google.com/docs/functions/callable-reference

app.post('/admin', express.json(), function(request,response){
  cors(request, response, async() =>{
  })
});
 */

app.listen(3001,() => {
  console.log('Estamos ejecutando el servidor GATEWAY en el puerto' + 3001);
})




