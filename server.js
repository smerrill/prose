var express = require('express');
var app = express();

app.use(express.static(__dirname));

app.listen(process.env.OPENSHIFT_NODEJS_PORT || 3000, process.env.OPENSHIFT_NODEJS_IP || "localhost");
