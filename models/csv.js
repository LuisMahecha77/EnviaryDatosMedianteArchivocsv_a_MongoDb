var mongoose = require('mongoose');

var csvSchema = new mongoose.Schema({
    FirstName: {
        type:String
    },
    LastName: {
        type:String
    },
    Age: {
        type:Number
    },
    Gender: {
        type:String
    },
    GmailOne: {
        type: String
    },
    GmailTwo: {
        type: String
    },
    CityOfResidence: {
        type: String
    },
    Profession: {
        type: String
    },
    MonthlyIncome: {
        type: Number
    }
});

module.exports = mongoose.model('dataPerson', csvSchema);