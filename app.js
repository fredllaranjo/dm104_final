var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var mysql = require('pg');

/*
Host
ec2-23-21-220-152.compute-1.amazonaws.com
Database
da7t36mmrt0tca
User
xruzngbbplcpsg
Port
5432
Password
19801988d182bc07c404a4fdcea69e501d32509a24b708e10fdf0044281ede1f
 */
//dev-management-dm104.000webhostapp.com
/*var con = mysql.createConnection({
  host: "localhost",
  user: "id2076563_dev_dm104",
  password: "dev_dm104",
  database: "id2076563_dev_management"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
*/
var app = express();
app.use(bodyParser.json());
var baseURL = "/dev";
var sequence = 0;
var devs = [
    {
        id: ++sequence,
        name: 'Fred Laranjo',
        birthday: '24/03/1992',
        /*formation: [{type:'graduation', location:'FAI'},{type:'postgraduation', location:'INATEL'}],
        workHistory: [{enterprise:'Genno', role: 'Eletronic Technical Assistant', months:'12', current: false},
                    {enterprise:'Compels Informática', role: 'System Analyst', months:'60', current: false},
                    {enterprise:'Inatel Competence Center', role: 'System Especialist', months:'24', current: true}],*/
        competences: ['Team Leadership', 'Development', 'Architecture', 'DevOps'],
        technologies: ['Java', 'C#', 'JavaScript', 'C', 'C++', 'HTML5', 'CSS3'],
        availableHoursMonth: 30
    }
];

app.listen(8089, function () {
    console.log('EXPRESS!');
});

function notFound(res) {
    res.status(404).send('Não encontrado!');
}

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get(baseURL + '/', function (req, res) {
    console.log('RECEIVED');
    res.json(devs);
});

app.get(baseURL + '/:id', function (req, res) {
    console.log("GET dev id: " + req.params.id);
    var dev = null;
    for (var index = 0; index < devs.length; index++) {
        if (devs[index] != null && devs[index].id == req.params.id) {
            dev = devs[index];
            break;
        }
    }
    if (dev) {
        res.json(dev);
    } else {
        notFound(res);
    }
});

app.post(baseURL + '/', function (req, res) {
    console.log("POST dev name: " + req.body.name);
    if (req.body.name) {
        var newDev = {
            id: ++sequence,
            name: req.body.name,//Fred Laranjo
            birthday: req.body.birthday,//24/03/1992
            /*formation: req.body.formation,//[{type:'graduation', location:'FAI'},{type:'postgraduation', location:'INATEL'}]
            workHistory: req.body.workHistory,//[{enterprise:'Genno', role: 'Eletronic Technical Assistant', months:'12', current: false},
                                              // {enterprise:'Compels Informática', role: 'System Analyst', months:'60', current: false},
                                              // {enterprise:'Inatel Competence Center', role: 'System Especialist', months:'24', current: true}]*/
            competences: req.body.competences,//['Team Leadership','Development','Architecture','DevOps']
            technologies: req.body.technologies,//['Java','C#','JavaScript',C','C++','HTML5','CSS3']
            availableHoursMonth: req.body.availableHoursMonth//30
        }
        /*var sql = "INSERT INTO devs (name, birthday, availableHoursMonth) VALUES ('"+newDev.name+"', '"+newDev.birthday+"', '"+newDev.availableHoursMonth+"')";
        con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        });*/
        devs.push(newDev);
        res.status(200).json(newDev);
    } else {
        res.status(400).send('Enviados valores inválidos');
    }
});

app.put(baseURL + '/', function (req, res) {
    console.log("PUT dev id: " + req.body.id);
    var dev = null;
    for (var index = 0; index < devs.length; index++) {
        if (devs[index] != null && devs[index].id == req.body.id) {
            dev = devs[index];
            break;
        }
    }
    if (dev) {
        dev.name = req.body.name;
        dev.birthday = req.body.birthday;
        /*dev.formation = req.body.formation;
        dev.workHistory = req.body.workHistory;*/
        dev.competences = req.body.competences;
        dev.technologies = req.body.technologies;
        dev.availableHoursMonth = req.body.availableHoursMonth;
        res.status(200).json(dev);
    } else {
        notFound(res);
    }
});

app.delete(baseURL + '/:id', function (req, res) {
    console.log("DELETE dev id: |" + req.params.id + "|");
    var indexFound = null;
    for (var index = 0; index < devs.length; index++) {
        console.log("DELETE: |" + index + "| |" + devs[index].id + "|");
        if (devs[index] != null && parseInt(devs[index].id, 10) == parseInt(req.params.id, 10)) {
            console.log("found");
            indexFound = index;
            break;
        }
    }
    if (indexFound != null) {
        //delete devs[indexFound];
        devs.splice(indexFound, 1);
        res.status(200).send('Apagou');
    } else {
        notFound(res);
    }
});