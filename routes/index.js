var express = require('express');
var router = express.Router();
var Razorpay = require('razorpay')
var instance = new Razorpay({
  key_id: 'rzp_test_OhjTpKv2ZXKFDd',
  key_secret: 'bez3LTX0gZTv8OVfDqOECMao',
});

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";



/* GET home page. */
router.get('/', function (req, res) {
  res.render('form');
});
router.post('/payment/:amount', function (req, res) {
  console.log(req.body);
  console.log(req.params.amount);
  MongoClient.connect(url, (err, client) => {
    if (err) {
      console.log(err);
      console.log("DB connection error");
    } else
      console.log("Database connected!");
    client.db('donation').collection('user').insertOne(req.body)
  })
  res.render('index');
});

router.post('/create-order', function (req, res) {
  console.log('Ajax order creation call');

  var options = {
    amount: 2000 * 100,  // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_rcptid_11"
  };
  instance.orders.create(options, function (err, order) {
    if (err) {
      console.log(err);
    } else {
      console.log(order);
      console.log('order created');
      res.json(order)
    }

  });
});

router.post('/verify-payment', (req, res) => {
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', 'bez3LTX0gZTv8OVfDqOECMao');
  hmac.update(req.body['paymentSuccessData[razorpay_order_id]'] + "|" + req.body['paymentSuccessData[razorpay_payment_id]']);
  let generatedSignature = hmac.digest('hex');
  let isSignatureValid = generatedSignature == req.body['paymentSuccessData[razorpay_signature]'];
  console.log(isSignatureValid);
  res.json(isSignatureValid)
})

router.get('/success-page', (req, res) => {
  res.render('success')
})



module.exports = router;
