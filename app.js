const path = require('path');
const { auth } = require('express-openid-connect');

var express = require('express');
const { env } = require('process');
var app = express()
app.use(express.static('public'))
app.set('view engine','hbs')
app.set('views','views')
require("dotenv").config();

const port =
  env === "development" ? process.env.DEV_PORT : process.env.PROD_PORT || process.env.PORT;

//app.listen(8080)

app.get('/', (req, res) => {
    res.render('map')
});


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(
  auth({
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    baseURL: process.env.BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    secret: process.env.SESSION_SECRET,
    authRequired: false,
    auth0Logout: true,
  }),
);


app.use((req, res, next) => {
  res.locals.isAuthenticated = req.oidc.isAuthenticated();
  next();
});

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
