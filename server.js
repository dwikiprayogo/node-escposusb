/*package libs yang kita pakai */
const escpos = require('escpos');
const express = require('express');
const http = require('http');
escpos.USB = require('escpos-usb');
const { body, validationResult } = require('express-validator');
const device = new escpos.USB();
const options = { encoding: "GB18030" }
const printer = new escpos.Printer(device, options);
/*pengaturan untuk port app*/
const port = process.env.PORT || 4000;
const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

/*Untuk independent connection*/
// var bodyParser = require('body-parser')
// var app = require('express')()
// var http = require('http').Server(app)
// var cors = require('cors')
// app.use(cors())
// app.use(bodyParser.json())
// const port = 4000;

/* endpoint untuk print */
app.post('/print', (req, res) => {
  res.json({ status: 'success' })
  console.log(req.body.text);
  // print(req.body.text)
});

/* endpoint untuk test print */
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
  console.log(status);
});

/*Listening untuk port independen*/
// http.listen(port, () => {
//   console.log(`Printer: http://localhost:${port}`);
// });

/*Pengaturan untuk font print*/
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
