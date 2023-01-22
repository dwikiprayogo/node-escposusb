// 'use strict';
// const path = require('path');
const escpos = require('escpos');
const express = require('express');
const http = require('http');
escpos.USB = require('escpos-usb');
const { body, validationResult } = require('express-validator');
const device = new escpos.USB();
const options = { encoding: "GB18030" }
const printer = new escpos.Printer(device, options);

const port = process.env.PORT || 4000;
const app = express();
const server = http.createServer(app);
// const io = socketIO(server);

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

// var bodyParser = require('body-parser')
// var app = require('express')()
// var http = require('http').Server(app)
// var cors = require('cors')
// app.use(cors())
// app.use(bodyParser.json())

// const port = 4000;

app.post('/print', (req, res) => {
  res.json({ status: 'success' })
  console.log(req.body.text);
  // print(req.body.text)
});

app.post('/print-text', [
  body('text').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req).formatWith(({
    msg
  }) => {
    return msg;
  });

  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: false,
      message: errors.mapped()
    });
  }

  const message = req.body.text;
  const status = print(message);
  if(status == true){
    res.status(200).json({
          status: true,
          response: "Sukses print"
        });
  }else{
    res.status(500).json({
          status: false,
          response: "Gagal print"
        });
  }
  // .then(response => {
  //   res.status(200).json({
  //     status: true,
  //     response: response
  //   });
  // }).catch(err => {
  //   res.status(500).json({
  //     status: false,
  //     response: err
  //   });
  // });

  console.log(status);

});

// http.listen(port, () => {
//   console.log(`Printer: http://localhost:${port}`);
// });

const print = (text) => {
  let response = false;
  if(device.open){
    device.open(function () {
      printer
        .font('a')
        .align('ct')
        .style('bu')
        .size(1, 1)
        .text(text)
        .cut()
        .close();
    });
    response = true;
  }else{
    response = false;
  }
  return response;
}

server.listen(port, function() {
  console.log('App running on *: ' + port);
});
