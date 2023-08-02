const Sequelize = require('sequelize'); 

const connection = new Sequelize('guide_questions', 'root', 'psswrd', {
  host : 'localhost', 
  dialect: 'mysql'
}); 

module.exports = connection; 