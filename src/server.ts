import express from 'express';
import SerialPort from 'serialport';

const path = '/dev/cu.usbserial-AL02L3L9';
const serialport = new SerialPort(path, { baudRate: 57600 });

const app = express();

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(3000, () => console.log('Example app listening on port 3000!'));
