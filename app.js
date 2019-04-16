const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const btoa = require('btoa');
const app = express();
const fs = require("fs");
const port = 6969;

// Application USE INJECTED
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true, limit:'50mb' }));
app.use(express.static('public'));
// Serving Static Server
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/fonts', express.static(__dirname + '/public/fonts'));
app.use('/images', express.static(__dirname + '/public/images'));


// Internal Function
const bufferToBase64 = (buf) => {
  var binstr = Array.prototype.map.call(buf, function (ch) {
    return String.fromCharCode(ch);
  }).join('');
  return btoa(binstr);
};

const servingFiles = (content, filesFormat) => {
  try {
    fs.writeFileSync(`public/temp/${filesFormat}`, content, { mode: 0o755 });
  } catch (err) {
    // An error occurred
    console.error(err);
  }
};

const pdfGenerator = async (config) => {

  const { content, codeAgent, policyNumber} = config;

  const filesFormat = `${policyNumber}_${codeAgent}_temp.html`;
  
  await servingFiles(content, filesFormat);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // console.log('HTML TEMPLATE: ', `data:text/html,${btoa(content)}`);
  // await page.goto(`data:text/html,${btoa(content)}`, { waitUntil: 'networkidle0' });
  // console.log('RELA HTML: ', content);
  // await page.setContent(content, { waitUntil: 'networkidle0' });
  await page.goto(`http://127.0.01:6969/temp/${filesFormat}`, { waitUntil: 'networkidle2' });
  const pdf = await page.pdf(
    {
      path: 'out.pdf',
      format: 'A4',
      printBackground: true,
      landscape: false,
      margin: {
        top: '75px',
        bottom: '55px',
        left: '45px',
        right: '45px',
      }
    }
  );
  await browser.close();
  return bufferToBase64(pdf);
};

// Expose Endpoint
app.get('/pdf', (req, res) => res.send('Hello PDF'));

app.post('/generate', async (req, res) => {

  const generatorConfig = {
    content: req.body.content,
    codeAgent: req.body.codeagent,
    policyNumber: req.body.nopolicy,
  };
  const getPDF = await pdfGenerator(generatorConfig);
  res.setHeader('Content-Type', 'application/json');
  res.send({
    status: 200,
    data: getPDF,
  });
});

app.listen(port, () => console.log(`Serving Server ${port}!`));