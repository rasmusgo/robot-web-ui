import bodyParser from 'body-parser';
import express from 'express';
import SerialPort from 'serialPort';
import path from 'path';
import { isString } from 'util';

const serialPortPath = '/dev/cu.usbserial-AL02L3L9';
const serialPort = new SerialPort(serialPortPath, { baudRate: 57600 });

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Template configuration
app.set('view engine', 'ejs');
app.set('views', 'public');

// Static files configuration
app.use('/assets', express.static(path.join(__dirname, 'frontend')));

// Controllers
app.get('/', (req, res) => {
  res.render('index');
});

app.post('/', (req, res) => {
  console.log(`post body: '${JSON.stringify(req.body)}'`);
  if (isString(req.body.command)) {
    serialPort.write(req.body.command);
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

app.listen(3000, () => console.log('Robot server app listening on http://localhost:3000'));
