// const express = require('express');
const routes = require('./routes/routes.js');

// const app = express();

// // const urlencodedParser = express.urlencoded({
// //     extended: false
// // })

// app.get('/', routes.root);

// app.listen(3000);

const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const path = require('path');
app.use(cors());

app.use(express.static('public'));




app.get('/', routes.root);






app.listen(port, () => {
   console.log(`Server is up at port ${port}`);
});