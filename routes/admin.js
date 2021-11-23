var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";

/* GET admin listing. */
router.get('/', function (req, res, next) {

  MongoClient.connect(url, (err, client) => {
    if (err) {
      // console.log(err);
      console.log("DB connection error");
    } else

      getData(client).then((data) => {
        res.render('list', { data })
      })


    function getData(client) {
      return new Promise(async function (resolve, reject) {
        var data = await client.db('donation').collection('user').find({}).toArray(function (err, data) {
          resolve(data)
        })

      })
    }
  })

});




module.exports = router;
