const express = require('express');
const app = new express();

/*This tells the server to use the client 
folder for all static resources*/
app.use(express.static('client'));

/*This tells the server to allow cross origin references*/
const cors_app = require('cors');
app.use(cors_app());

/*Uncomment the following lines to loan the environment 
variables that you set up in the .env file*/

const dotenv = require('dotenv');
dotenv.config();

const api_key = process.env.API_KEY;
const api_url = process.env.API_URL;

function getNLUInstance() {
    // let api_key = process.env.API_KEY; 
    // let api_url = process.env.API_URL;
    
    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');
    
    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2021-08-01',
        authenticator: new IamAuthenticator ({
            apikey: api_key
        }),
        serviceUrl: api_url
    });
    // console.log(naturalLanguageUnderstanding);
    return naturalLanguageUnderstanding;
}


//The default endpoint for the webserver
app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {

     analyzeEmotionUrl(req.query.url,res);
   // return res.send({"happy":"90","sad":"10"});
});

app.get("/url/sentiment", (req,res) => {
  //  return res.send("url sentiment for "+req.query.url);
   //  analyzeEmotionUrl(req.query.url,res);
    analyzeSentimentUrl(req.query.url,res);
});

app.get("/text/emotion", (req,res) => {
   // return res.send({"happy":"10","sad":"90"});
  analyzeEmotionText(req.query.text,res);
});

app.get("/text/sentiment", (req,res) => {
 //   return res.send("text sentiment for "+req.query.text);
    analyzeSentimentText(req.query.text,res);
});

app.get("/text/sentiment", (req,res) => {
    let textToAnalyze = req.query.text
        const analyzeParams = 
        {
            "text": textToAnalyze,
            "features": {
                "keywords": {
                    "sentiment": true,
                    "limit": 1
                }
            }
        }
        
        const naturalLanguageUnderstanding = getNLUInstance();
        
        naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
            //Retrieve the sentiment and return it as a formatted string

            return res.send(analysisResults.result.keywords[0].sentiment,null,2);
        })
        .catch(err => {
            return res.send("Could not do desired operation "+err);
        });
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

// function getNLUInstance() {
    
    
//     }
    
function analyzeEmotionUrl(url,res){
    const naturalLanguageUnderstanding= getNLUInstance();
    const analyzeParams = {
  'url':url,
  'features': {
    'emotion': {
    }
  }
};
naturalLanguageUnderstanding.analyze(analyzeParams)
  .then(analysisResults => {
    // console.log(JSON.stringify(analysisResults, null, 2));
   // return analysisResults.result.emotion.document.emotion;
   res.send(analysisResults.result.emotion.document.emotion);
  })
  .catch(err => {
    console.log('error:', err);
  });

}


function analyzeEmotionText(sampleText,res){
    const naturalLanguageUnderstanding= getNLUInstance();
    const analyzeParams = {
  'html':sampleText,
  'features': {
    'emotion': {     
    }
  }
};
naturalLanguageUnderstanding.analyze(analyzeParams)
  .then(analysisResults => {
    // console.log(JSON.stringify(analysisResults, null, 2));
   // return analysisResults.result.emotion.document.emotion;
   res.send(analysisResults.result.emotion.document.emotion);
  })
  .catch(err => {
    console.log('error:', err);
  });

}


function analyzeSentimentText(sampleText,res){
    const naturalLanguageUnderstanding= getNLUInstance();
      
   const analyzeParams = {
      'html': sampleText,
       'features': {
        'sentiment': {
          
        }
       }
    };

    naturalLanguageUnderstanding.analyze(analyzeParams)
      .then(analysisResults => {
        // console.log(JSON.stringify(analysisResults, null, 2));
        //.result.entities[0].sentiment
         res.send(
            analysisResults.result.sentiment.document);
        
      })
      .catch(err => {
          
        console.log('error:', err);
         res.send("nutral");
      });

}
function analyzeSentimentUrl(url,res){
    const naturalLanguageUnderstanding= getNLUInstance();
      
   const analyzeParams = {
      'url': url,
       'features': {
        'sentiment': {
          
        }
       }
    };

    naturalLanguageUnderstanding.analyze(analyzeParams)
      .then(analysisResults => {
        // console.log(JSON.stringify(analysisResults, null, 2));
         res.send(analysisResults.result.sentiment.document);
      })
      .catch(err => {
        console.log('error:', err);
         res.send("nutral");
      });

}