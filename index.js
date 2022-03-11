const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function(req,res) {
    fs.readFile(__dirname+"/public/html/home.html", 'utf8', (err, html) => {
        if(err) {
            res.status(500).send('sorry, out of order \n'+err);
        }
        res.send(html);
  })
})

app.listen(process.env.PORT || 2999, () => console.log('server started 2999'));