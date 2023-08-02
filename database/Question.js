const Sequelize = require('sequelize'); 
const connection = require('./database'); 
const question = connection.define('question', {
  title: {
    type: Sequelize.STRING,
    //the title cant be null
    allowNull: false
  }, 
  description: {
    type: Sequelize.TEXT, 
    allowNull: false
  }
});

//if a table named question does not exist, it will create, and the force will guarantee that if the table already exist, it will not be create again
question.sync({force:false}).then(() => {}); 

module.exports = question; 