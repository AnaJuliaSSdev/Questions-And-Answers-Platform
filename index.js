const express = require("express"); //importing the express
const app = express(); //bringing him to a variable, to create routes etc
const bodyParser = require("body-parser"); //translate the data send by the form into a html structure that will be used in the backend 
const connection = require('./database/database'); 
const Question = require('./database/Question');
const Answer = require('./database/Answer'); 

connection
.authenticate()
.then(() => {
  console.log("Connection success")
})
.catch((errorMsg) => {
  console.log(errorMsg); 
}) 

//-------------BODY PARSER-----------//
//translate the data from the form into a JS structure 
app.use(bodyParser.urlencoded({extended: false})); 

//optional, will translate the information from jason to JS, used in API
app.use(bodyParser.json());


//--------------ROUTES---------------//
//saying to express to use the EJS as a view engine
// the view engine allow us to render web pages using template files
//These templates are filled with actual data and served to the client
app.set('view engine', 'ejs'); 
//static documents: css, javascripts, images etc
app.use(express.static('public'));

app.get("/", (req, res) => {
  //equal to select *
  //raw true tell that we only want the data present on the database sql, the columns 
  //order tell which field we want order for and which sense, ascending or descending
  //in this case, we are order by id from largest to smallest
  //ASC OR DESC
  Question.findAll({raw : true, order:[['id', 'DESC']]}).then(questions => {
    res.render("index", {
      questions: questions
    }); 
  }); 
});

app.get("/ask", (req, res) => {
  res.render("ask"); 
});

app.post("/saveQuestion", (req, res) => {
  var title = req.body.title; 
  var description = req.body.description;  

  //equal to insert into
  Question.create({
    title: title, 
    description: description
  }).then(() => {
    res.redirect("/");
  });
});

app.get("/question/:id", (req, res) => {
  var id = req.params.id;
  Question.findOne({
    where: {id: id}
  }).then(question => {
    if(question != undefined){ //question found
      Answer.findAll({
        where: {questionID: question.id}, 
        order:[['id', 'DESC']]
      }).then(answers => {
        res.render("question", {
          question: question,
          answers: answers
        });
      });
    } else { //question not found
      res.redirect("/");
    }
  });
}); 

app.post("/answer", (req, res) => {
  var body = req.body.body; 
  var questionID = req.body.question; 
  Answer.create({
    body : body,
    questionID: questionID
  }).then(() => {
    res.redirect("/question/" + questionID); 
  })
});

app.listen(8080, ()=>{
  console.log("App is working!"); 
});
