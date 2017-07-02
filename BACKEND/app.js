var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');

//https://node-postgres.com/guides/upgrading
//https://github.com/brianc/node-postgres/wiki/pg
var config = {
    host: "ec2-23-21-220-152.compute-1.amazonaws.com",
    user: "xruzngbbplcpsg",
    password: "19801988d182bc07c404a4fdcea69e501d32509a24b708e10fdf0044281ede1f",
    database: "da7t36mmrt0tca",
    port: 5432,
    ssl: true,
    max: 10, // max number of clients in pool
    idleTimeoutMillis: 5000, // close & remove clients which have been idle > 5 second
};

// create a pool
var pool = new pg.Pool(config);

var app = express();
app.use(bodyParser.json());
var baseURL = "/dev";
var sequence = 0;

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
    console.log("GET ALL DEVS");
    pool.connect(function (err, client, done) {
        if (err) throw err;
        var devs = [];
        // execute a query on our database
        client.query('SELECT * from devs d;', function (err, result) {
            if (err) throw err;
            result.rows.forEach(function (row) {
                console.log(row);
                var dev = {
                    id: row.id,
                    name: row.name,
                    birthday: row.birthday,
                    availableHoursMonth: row.available_hours_month
                };
                devs.push(dev);
            }, this);
            res.json(devs);
        });
        client.release();
    });
});

app.get(baseURL + '/:id', function (req, res) {
    console.log("GET dev id: " + req.params.id);
    pool.connect(function (err, client, done) {
        if (err) throw err;
        var dev = null;
        // execute a query on our database
        var query = '((SELECT d.*, dc.*,\'C\' as grouped  from devs d JOIN dev_competences dc ON dc.dev_id = d.id WHERE d.id = ' + req.params.id + ' ORDER BY dc.dev_id, dc.id)'
            + 'UNION'
            + '(SELECT d.*, dt.*,\'T\' as grouped from devs d JOIN dev_technologies dt ON dt.dev_id = d.id WHERE d.id = ' + req.params.id + ' ORDER BY dt.dev_id, dt.id)'
            + ') order by grouped;';
        client.query(query, function (err, result) {
            if (err) throw err;
            var firstResult = result.rows[0];
            dev = {
                id: firstResult.dev_id,
                name: firstResult.name,
                birthday: firstResult.birthday,
                availableHoursMonth: firstResult.available_hours_month,
                competences: [],
                technologies: []
            };
            result.rows.forEach(function (row) {
                console.log(row);
                if (row.grouped == 'C') {
                    dev.competences.push(row.competence);
                } else if (row.grouped == 'T') {
                    dev.technologies.push(row.competence);//row.technology changed by UNION
                }
            }, this);
            if (dev) {
                res.json(dev);
            } else {
                notFound(res);
            }
        });
        client.release();
    });
});

app.post(baseURL + '/', function (req, res) {
    console.log("POST dev name: " + req.body.name);
    if (req.body.name && req.body.birthday && req.body.availableHoursMonth && ((req.body.competences && req.body.competences != []) || (req.body.competences && req.body.competences != []))) {
        var newDev = {
            name: req.body.name,//Fred Laranjo
            birthday: req.body.birthday,//24/03/1992
            competences: req.body.competences,//['Team Leadership','Development','Architecture','DevOps']
            technologies: req.body.technologies,//['Java','C#','JavaScript',C','C++','HTML5','CSS3']
            availableHoursMonth: req.body.availableHoursMonth//30
        }
        pool.connect(function (err, client, done) {
            if (err) throw err;
            var query = 'INSERT INTO devs (name, birthday, available_hours_month) VALUES (\'' + newDev.name + '\', \'' + newDev.birthday + '\', ' + newDev.availableHoursMonth + ') RETURNING id;';

            client.query(query, function (err, result) {
                if (err) throw err;
                newDev.id = result.rows[0].id;
                if (newDev.competences && newDev.competences != []) {
                    var query = 'INSERT INTO dev_competences (dev_id, competence) VALUES ';
                    var comma = false;
                    newDev.competences.forEach(function (competence) {
                        if (comma)
                            query += ',';
                        query += '(' + newDev.id + ', \'' + competence + '\')';
                        comma = true;
                    }, this);
                    query += ';';
                    console.log(query);
                    client.query(query, function (err, result) {
                        if (err) throw err;
                    });
                }
                if (newDev.technologies && newDev.technologies != []) {
                    var query = 'INSERT INTO dev_technologies (dev_id, technology) VALUES ';
                    var comma = false;
                    newDev.technologies.forEach(function (technology) {
                        if (comma)
                            query += ',';
                        query += '(' + newDev.id + ', \'' + technology + '\')';
                        comma = true;
                    }, this);
                    query += ';';
                    console.log(query);
                    client.query(query, function (err, result) {
                        if (err) throw err;
                    });
                }
                res.status(200).json(newDev);
            });
            client.release();
        });
    } else {
        res.status(400).send('Enviados valores inválidos');
    }
});

app.put(baseURL + '/', function (req, res) {
    console.log("PUT dev id: " + req.body.id);
    if (req.body.id && req.body.name && req.body.birthday && req.body.availableHoursMonth && ((req.body.competences && req.body.competences != []) || (req.body.competences && req.body.competences != []))) {
        var newDev = {
            id: req.body.id,//Fred Laranjo
            name: req.body.name,//Fred Laranjo
            birthday: req.body.birthday,//24/03/1992
            competences: req.body.competences,//['Team Leadership','Development','Architecture','DevOps']
            technologies: req.body.technologies,//['Java','C#','JavaScript',C','C++','HTML5','CSS3']
            availableHoursMonth: req.body.availableHoursMonth//30
        }
        pool.connect(function (err, client, done) {
            if (err) throw err;
            var query = 'UPDATE devs SET name = \'' + newDev.name + '\', birthday = \'' + newDev.birthday + '\', available_hours_month = ' + newDev.availableHoursMonth + ' WHERE id = ' + newDev.id + ';';
            console.log(query);
            client.query(query, function (err, result) {
                if (err) throw err;
                var affectedRows = result.rowCount;
                if (affectedRows) {
                    if (newDev.competences && newDev.competences != []) {
                        var query = 'DELETE FROM dev_competences WHERE dev_id = ' + newDev.id + '; INSERT INTO dev_competences (dev_id, competence) VALUES ';
                        var comma = false;
                        newDev.competences.forEach(function (competence) {
                            if (comma)
                                query += ',';
                            query += '(' + newDev.id + ', \'' + competence + '\')';
                            comma = true;
                        }, this);
                        query += ';';
                        console.log(query);
                        client.query(query, function (err, result) {
                            if (err) throw err;
                        });
                    }
                    if (newDev.technologies && newDev.technologies != []) {
                        var query = 'DELETE FROM dev_technologies WHERE dev_id = ' + newDev.id + '; INSERT INTO dev_technologies (dev_id, technology) VALUES ';
                        var comma = false;
                        newDev.technologies.forEach(function (technology) {
                            if (comma)
                                query += ',';
                            query += '(' + newDev.id + ', \'' + technology + '\')';
                            comma = true;
                        }, this);
                        query += ';';
                        console.log(query);
                        client.query(query, function (err, result) {
                            if (err) throw err;
                        });
                    }
                    res.status(200).send('Atualizado com sucesso!');
                } else {
                    notFound(res);
                }
            });
            client.release();
        });
    } else {
        res.status(400).send('Enviados valores inválidos');
    }
});

app.delete(baseURL + '/:id', function (req, res) {
    console.log("DELETE dev id: " + req.params.id);
    pool.connect(function (err, client, done) {
        if (err) throw err;
        // execute a query on our database
        var query = 'DELETE from devs d WHERE d.id = ' + req.params.id + ';';
        client.query(query, function (err, result) {
            if (err) throw err;
            var affectedRows = result.rowCount;
            if (affectedRows) {
                res.status(200).send('Deletado com sucesso!');
            } else {
                notFound(res);
            }
        });
        client.release();
    });
});