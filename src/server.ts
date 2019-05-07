import express from 'express';
import SerialPort from 'serialPort';
import path from 'path';

const serialPortPath = '/dev/cu.usbserial-AL02L3L9';
const serialPort = new SerialPort(serialPortPath, { baudRate: 57600 });

const app = express();

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
  console.log(`post body: '${req.body}'`);
  serialPort.write(' ');
  res.send('OK!');
});

app.listen(3000, () => console.log('Robot server app listening on http://localhost:3000'));
