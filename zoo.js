/*
Omar Ali Ahmed Castañeda Parra
*/

const express = require('express');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));



var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "zoo",
    port: "3306"
});
    

app.get('/', function(req, res) {
    res.send(JSON.stringify("Wellcome to the zoo"));
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////FIREWALL//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.use(function(req, res, next) {
    if ("key" in req.query) 
    {
        var key = req.query["key"];
        var query = "SELECT * FROM users WHERE apikey='" + key + "'";
        db.query(query, function(err, result, fields) {
            if (err) throw err;
            if (result.length > 0) 
            {
                next();
            }
            else 
            {
                res.status(403).send("Access denied");
            }
        });
    } 
    else 
    {
        res.status(403).send("Access denied");
    }
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
//////////////////////////////////////////////////////////////POST//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*app.post('/animals', function(req, res) {
    var idAnimal = req.body.idAnimal;
    var name =   req.body.name;
    var breed =  req.body.breed;
    var dailyFood =  req.body.dailyFood;
    var birthday =  req.body.birthday;
    var dateEntryZoo =  req.body.dateEntryZoo;
    var cageId =  req.body.cageId;

    var query = "INSERT INTO animals ("
    for(var prop in req.body) {
        query+=prop;
        query += ",";
    }
    var query = query.substring(0, query.length-1);
    query += ") VALUES (" + idAnimal + ", '" + name + "','" + breed + "','" + dailyFood + "','" + birthday + "','" + dateEntryZoo + "'," + cageId + ")";

    db.query(query, function(err, result, fields) {
    if (err) throw err;
    res.send(JSON.stringify("Success animal creation"));
    }); 
});
app.post('/cages', function(req, res) {
    var idCage = req.body.idCage;
    var name =   req.body.name;
    var description =  req.body.description;
    var area =  req.body.area;
    var query = "INSERT INTO Cage (cageId, name, description, area) VALUES (" + idCage + ", '" + name + "','" + description + "'," + area + ")";
    db.query(query, function(err, result, fields) {
    if (err) throw err;
    res.send(JSON.stringify("Success animal creation"));
    }); 

});

app.post('/food', function(req, res) {
    var foodId = req.body.idCage;
    var name =   req.body.name;
    var animalId =  req.body.description;
    var quantity =  req.body.area;
    var query = "INSERT INTO Food (foodId, name, animalId, quantity) VALUES (" + foodId + ", '" + name + "'," + animalId + "," + quantity + ")";
    db.query(query, function(err, result, fields) {
    if (err) throw err;
    res.send(JSON.stringify("Success food creation"));
    }); 

});

app.post('/staff', function(req, res) {
    var staffId = req.body.idCage;
    var firstname =   req.body.name;
    var lastname =  req.body.description;
    var wage =  req.body.area;
    var query = "INSERT INTO Cage (staffId, firstname, lastname, wage) VALUES (" + staffId + ", '" + firstname + "','" + lastname + "'," + wage + ")";
    db.query(query, function(err, result, fields) {
    if (err) throw err;
    res.send(JSON.stringify("Success staff creation"));
    }); 

});

*/
app.post('/animals', function(req,res) {
    var query = "INSERT INTO animals ("
    for(var field in req.body) {
        query+=field;
        query += ",";
    }
    var query = query.substring(0, query.length-1);
    query += ") VALUES (";
    for(var field in req.body) {
        query+="'" + req.body[field] + "', ";
    }
    var query = query.substring(0, query.length-2);
    query +=")";
    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send(JSON.stringify("Success animal creation"));
    });
});
app.post('/cages', function(req,res) {
    var query = "INSERT INTO cages ("
    for(var field in req.body) {
        query+=field;
        query += ",";
    }
    var query = query.substring(0, query.length-1);
    query += ") VALUES (";
    for(var field in req.body) {
        query+="'" + req.body[field] + "', ";
    }
    var query = query.substring(0, query.length-2);
    query +=")";
    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send(JSON.stringify("Success cage creation"));
    });
});
app.post('/food', function(req,res) {
    var query = "INSERT INTO food ("
    for(var field in req.body) {
        query+=field;
        query += ",";
    }
    var query = query.substring(0, query.length-1);
    query += ") VALUES (";
    for(var field in req.body) {
        query+="'" + req.body[field] + "', ";
    }
    var query = query.substring(0, query.length-2);
    query +=")";
    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send(JSON.stringify("Success food creation"));
    });
});
app.post('/staff', function(req,res) {
    var query = "INSERT INTO staff ("
    for(var field in req.body) {
        query+=field;
        query += ",";
    }
    var query = query.substring(0, query.length-1);
    query += ") VALUES (";
    for(var field in req.body) {
        query+="'" + req.body[field] + "', ";
    }
    var query = query.substring(0, query.length-2);
    query +=")";
    db.query(query,function(err,result,fields){
        if(err) throw err;
        res.send(JSON.stringify("Success staff creation"));
    });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////GETS////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/animals', function(req, res) {
    var query = "SELECT * FROM animals"
    var conditions = ["name", "breed","food_per_day","birthday","entry_date","id_cage"];
    for (var index in conditions) 
    {
        if (conditions[index] in req.query) 
        {
            if (query.indexOf("WHERE") < 0) 
            {
                query += " WHERE";
            } 
            else 
            {
                query += " AND";
            }
            query += " " + conditions[index] + "='" +
            req.query[conditions[index]] + "'";
        }
    }

    if ("sort" in req.query) 
    {
        var sort = req.query["sort"].split(",");
        query += " ORDER BY";
        for (var index in sort) 
        {
            var direction = sort[index].substr(0, 1);
            var field = sort[index].substr(1);
            query += " " + field;
            if (direction == "-")
            query += " DESC,";
            else
            query += " ASC,";
        }
        query = query.slice(0, -1);
    }
    
    if ("fields" in req.query) 
    {
        query = query.replace("*", req.query["fields"]);
    }
    
    if ("limit" in req.query) 
    {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) 
        {
            query += " OFFSET " + req.query["offset"];
        }
    }
        
    db.query(query, function(err, result, fields) {
    if (err) throw err;
    res.send(JSON.stringify(result));
    });
});
app.get('/animals/:id', function(req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM animals WHERE id=" + id;
    var conditions = ["name", "breed","food_per_day","birthday","entry_date","id_cage"];
    for (var index in conditions) 
    {
        if (conditions[index] in req.query) 
        {
            if (query.indexOf("WHERE") < 0) 
            {
                query += " WHERE";
            } 
            else 
            {
                query += " AND";
            }
            query += " " + conditions[index] + "='" +
            req.query[conditions[index]] + "'";
        }
    }

    if ("sort" in req.query) 
    {
        var sort = req.query["sort"].split(",");
        query += " ORDER BY";
        for (var index in sort) 
        {
            var direction = sort[index].substr(0, 1);
            var field = sort[index].substr(1);
            query += " " + field;
            if (direction == "-")
            query += " DESC,";
            else
            query += " ASC,";
        }
        query = query.slice(0, -1);
    }
    
    if ("fields" in req.query) 
    {
        query = query.replace("*", req.query["fields"]);
    }
    
    if ("limit" in req.query) 
    {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) 
        {
            query += " OFFSET " + req.query["offset"];
        }
    }
    db.query(query, function(err, result, fields) {
    if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.get('/cages', function(req, res) {
    var query = "SELECT * FROM cages"
    var conditions = ["name", "description","area"];
    for (var index in conditions) 
    {
        if (conditions[index] in req.query) 
        {
            if (query.indexOf("WHERE") < 0) 
            {
                query += " WHERE";
            } 
            else 
            {
                query += " AND";
            }
            query += " " + conditions[index] + "='" +
            req.query[conditions[index]] + "'";
        }
    }
    if ("sort" in req.query) 
    {
        var sort = req.query["sort"].split(",");
        query += " ORDER BY";
        for (var index in sort) 
        {
            var direction = sort[index].substr(0, 1);
            var field = sort[index].substr(1);
            query += " " + field;
            if (direction == "-")
            query += " DESC,";
            else
            query += " ASC,";
        }
        query = query.slice(0, -1);
    }
    
    if ("fields" in req.query) 
    {
        query = query.replace("*", req.query["fields"]);
    }
    
    if ("limit" in req.query) 
    {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) 
        {
            query += " OFFSET " + req.query["offset"];
        }
    }
    db.query(query, function(err, result, fields) {
    if (err) throw err;
    res.send(JSON.stringify(result));
    });
});
app.get('/cages/:id', function(req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM cages WHERE id=" + id;
    var conditions = ["name", "description","area"];
    for (var index in conditions) 
    {
        if (conditions[index] in req.query) 
        {
            if (query.indexOf("WHERE") < 0) 
            {
                query += " WHERE";
            } 
            else 
            {
                query += " AND";
            }
            query += " " + conditions[index] + "='" +
            req.query[conditions[index]] + "'";
        }
    }

    if ("sort" in req.query) 
    {
        var sort = req.query["sort"].split(",");
        query += " ORDER BY";
        for (var index in sort) 
        {
            var direction = sort[index].substr(0, 1);
            var field = sort[index].substr(1);
            query += " " + field;
            if (direction == "-")
            query += " DESC,";
            else
            query += " ASC,";
        }
        query = query.slice(0, -1);
    }
    
    if ("fields" in req.query) 
    {
        query = query.replace("*", req.query["fields"]);
    }
    
    if ("limit" in req.query) 
    {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) 
        {
            query += " OFFSET " + req.query["offset"];
        }
    }
    db.query(query, function(err, result, fields) {
    if (err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.get('/food', function(req, res) {
    var query = "SELECT * FROM food"
    var conditions = ["name", "quantity","id_animal"];
    for (var index in conditions) 
    {
        if (conditions[index] in req.query) 
        {
            if (query.indexOf("WHERE") < 0) 
            {
                query += " WHERE";
            } 
            else 
            {
                query += " AND";
            }
            query += " " + conditions[index] + "='" +
            req.query[conditions[index]] + "'";
        }
    }
    if ("sort" in req.query) 
    {
        var sort = req.query["sort"].split(",");
        query += " ORDER BY";
        for (var index in sort) 
        {
            var direction = sort[index].substr(0, 1);
            var field = sort[index].substr(1);
            query += " " + field;
            if (direction == "-")
            query += " DESC,";
            else
            query += " ASC,";
        }
        query = query.slice(0, -1);
    }
    
    if ("fields" in req.query) 
    {
        query = query.replace("*", req.query["fields"]);
    }
    
    if ("limit" in req.query) 
    {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) 
        {
            query += " OFFSET " + req.query["offset"];
        }
    }
    db.query(query, function(err, result, fields) {
    if (err) throw err;
    res.send(JSON.stringify(result));
    });
});
app.get('/food/:id', function(req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM food WHERE id=" + id;
    var conditions = ["name", "breed","food_per_day","birthday","entry_date","id_cage"];
    for (var index in conditions) 
    {
        if (conditions[index] in req.query) 
        {
            if (query.indexOf("WHERE") < 0) 
            {
                query += " WHERE";
            } 
            else 
            {
                query += " AND";
            }
            query += " " + conditions[index] + "='" +
            req.query[conditions[index]] + "'";
        }
    }

    if ("sort" in req.query) 
    {
        var sort = req.query["sort"].split(",");
        query += " ORDER BY";
        for (var index in sort) 
        {
            var direction = sort[index].substr(0, 1);
            var field = sort[index].substr(1);
            query += " " + field;
            if (direction == "-")
            query += " DESC,";
            else
            query += " ASC,";
        }
        query = query.slice(0, -1);
    }
    
    if ("fields" in req.query) 
    {
        query = query.replace("*", req.query["fields"]);
    }
    
    if ("limit" in req.query) 
    {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) 
        {
            query += " OFFSET " + req.query["offset"];
        }
    }
    db.query(query, function(err, result, fields) {
    if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/staff', function(req, res) {
    var query = "SELECT * FROM staff"
    var conditions = ["firstname", "lastname","wage"];
    for (var index in conditions) 
    {
        if (conditions[index] in req.query) 
        {
            if (query.indexOf("WHERE") < 0) 
            {
                query += " WHERE";
            } 
            else 
            {
                query += " AND";
            }
            query += " " + conditions[index] + "='" +
            req.query[conditions[index]] + "'";
        }
    }
    if ("sort" in req.query) 
    {
        var sort = req.query["sort"].split(",");
        query += " ORDER BY";
        for (var index in sort) 
        {
            var direction = sort[index].substr(0, 1);
            var field = sort[index].substr(1);
            query += " " + field;
            if (direction == "-")
            query += " DESC,";
            else
            query += " ASC,";
        }
        query = query.slice(0, -1);
    }
    
    if ("fields" in req.query) 
    {
        query = query.replace("*", req.query["fields"]);
    }
    
    if ("limit" in req.query) 
    {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) 
        {
            query += " OFFSET " + req.query["offset"];
        }
    }
    db.query(query, function(err, result, fields) {
    if (err) throw err;
    res.send(JSON.stringify(result));
    });
});
app.get('/staff/:id', function(req, res) {
    var id = req.params.id;
    var query = "SELECT * FROM staff WHERE id=" + id;
    var conditions = ["firstname", "lastname","wage"];
    for (var index in conditions) 
    {
        if (conditions[index] in req.query) 
        {
            if (query.indexOf("WHERE") < 0) 
            {
                query += " WHERE";
            } 
            else 
            {
                query += " AND";
            }
            query += " " + conditions[index] + "='" +
            req.query[conditions[index]] + "'";
        }
    }

    if ("sort" in req.query) 
    {
        var sort = req.query["sort"].split(",");
        query += " ORDER BY";
        for (var index in sort) 
        {
            var direction = sort[index].substr(0, 1);
            var field = sort[index].substr(1);
            query += " " + field;
            if (direction == "-")
            query += " DESC,";
            else
            query += " ASC,";
        }
        query = query.slice(0, -1);
    }
    
    if ("fields" in req.query) 
    {
        query = query.replace("*", req.query["fields"]);
    }
    
    if ("limit" in req.query) 
    {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) 
        {
            query += " OFFSET " + req.query["offset"];
        }
    }
    db.query(query, function(err, result, fields) {
    if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////PUT//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*app.put('/animals/:id', function(req, res) {
    var idAnimal = req.params.id;
    var name =   req.body.name;
    var breed =  req.body.breed;
    var dailyFood =  req.body.dailyFood;
    var birthday =  req.body.birthday;
    var dateEntryZoo =  req.body.dateEntryZoo;
    var cageId =  req.body.cageId;
    var query = "UPDATE animals SET (name = '" + name + "', breed = '" + breed + "', dailyFood = '" + dailyFood + "', birthday = '" + birthday + "', dateEntryZoo = '" + dateEntryZoo + "',cageId = '" + cageId + "') WHERE animalId="+ idAnimal;
db.query(query, function(err, result, fields) {
    if (err) throw err;
    res.send(JSON.stringify("Success"));
    });
});


app.put('/cages/:id', function(req, res) {
    var idCage = req.body.idCage;
    var name =   req.body.name;
    var description =  req.body.description;
    var area =  req.body.area;
    var query = "UPDATE Animal SET (name = '" + name + "', description = '" + description + "', area = " + area + ") WHERE cageId="+ idCage;
db.query(query, function(err, result, fields) {
    if (err) throw err;
    res.send(JSON.stringify("Success"));
    });
});


app.put('/food/:id', function(req, res) {
    var foodId = req.body.idCage;
    var name =   req.body.name;
    var animalId =  req.body.description;
    var quantity =  req.body.area;
    var query = "UPDATE Animal SET (name = '" + name + "', description = '" + description + "', area = " + area + ") WHERE cageId="+ idCage;
db.query(query, function(err, result, fields) {
    if (err) throw err;
    res.send(JSON.stringify("Success"));
    });
});
*/

app.put('/animals/:id',function(req,res) {
    console.log(req.params);
    var id = req.params.id;
    var query = "UPDATE animals SET ";
    for (var field in req.body) {
        query+=field;
        query += " = '" + req.body[field] + "', ";
    }
    var query = query.substring(0, query.length-2);
    query += " WHERE id = " +id;
    db.query(query, function(err,result,fields) {
        if(err) throw err;
        res.send( JSON.stringify( "Success" ));
    });
});
app.put('/cages/:id',function(req,res) {
    console.log(req.params);
    var id = req.params.id;
    var query = "UPDATE cages SET ";
    for (var field in req.body) {
        query+=field;
        query += " = '" + req.body[field] + "', ";
    }
    var query = query.substring(0, query.length-2);
    query += " WHERE id = " +id;
    db.query(query, function(err,result,fields) {
        if(err) throw err;
        res.send( JSON.stringify( "Success" ));
    });
});
app.put('/food/:id',function(req,res) {
    console.log(req.params);
    var id = req.params.id;
    var query = "UPDATE food SET ";
    for (var field in req.body) {
        query+=field;
        query += " = '" + req.body[field] + "', ";
    }
    var query = query.substring(0, query.length-2);
    query += " WHERE id = " +id;
    db.query(query, function(err,result,fields) {
        if(err) throw err;
        res.send( JSON.stringify( "Success" ));
    });
});
app.put('/staff/:id',function(req,res) {
    console.log(req.params);
    var id = req.params.id;
    var query = "UPDATE staff SET ";
    for (var field in req.body) 
    {
        query+=field;
        query += " = '" + req.body[field] + "', ";
    }
    var query = query.substring(0, query.length-2);
    query += " WHERE id = " +id;
    db.query(query, function(err,result,fields) {
        if(err) throw err;
        res.send( JSON.stringify( "Success" ));
    });
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////DELETE///////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.delete('/animals', function(req, res) {
    var query = "DELETE FROM animals";
    db.query(query, function(err, result, fields) {
    if (err) throw err;
    res.send(JSON.stringify("Success"));
    });
});
app.delete('/animals/:id', function(req, res) {
    var id = req.params.id;
    var query = "DELETE FROM animals WHERE id=" + id;
    db.query(query, function(err, result, fields) {
    if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});
app.delete('/cages', function(req, res) {
    var query = "DELETE FROM cages";
    db.query(query, function(err, result, fields) {
    if (err) throw err;
    res.send(JSON.stringify("Success"));
    });
});
app.delete('/cages/:id', function(req, res) {
    var id = req.params.id;
    var query = "DELETE FROM cages WHERE id=" + id;
    db.query(query, function(err, result, fields) {
    if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});
app.delete('/food', function(req, res) {
    var query = "DELETE FROM food";
    db.query(query, function(err, result, fields) {
    if (err) throw err;
    res.send(JSON.stringify("Success"));
    });
});
app.delete('/Food/:id', function(req, res) {
    var id = req.params.id;
    var query = "DELETE FROM food WHERE id=" + id;
    db.query(query, function(err, result, fields) {
    if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});
app.delete('/staff', function(req, res) {
    var query = "DELETE FROM staff";
    db.query(query, function(err, result, fields) {
    if (err) throw err;
    res.send(JSON.stringify("Success"));
    });
});
app.delete('/staff/:id', function(req, res) {
    var id = req.params.id;
    var query = "DELETE FROM staff WHERE id=" + id;
    db.query(query, function(err, result, fields) {
    if (err) throw err;
        res.send(JSON.stringify("Success"));
    });
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////RELATIONS//////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/animals/:id/cages', function(req, res) {
    var id = req.params.id;
    var query = "SELECT cages.* FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id;
    var conditions = ["name","description", "area"];
    for (var index in conditions) 
    {
        if (conditions[index] in req.query) 
        {
            if (query.indexOf("WHERE") < 0) 
            {
                query += " WHERE";
            } 
            else 
            {
                query += " AND";
            }
            query += " " + conditions[index] + "='" +
            req.query[conditions[index]] + "'";
        }
    }

    if ("sort" in req.query) 
    {
        var sort = req.query["sort"].split(",");
        query += " ORDER BY";
        for (var index in sort) 
        {
            var direction = sort[index].substr(0, 1);
            var field = sort[index].substr(1);
            query += " " + field;
            if (direction == "-")
            query += " DESC,";
            else
            query += " ASC,";
        }
        query = query.slice(0, -1);
    }
    
    if ("fields" in req.query) 
    {
        query = query.replace("cages.*", req.query["fields"]);
    }
    
    if ("limit" in req.query) 
    {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) 
        {
            query += " OFFSET " + req.query["offset"];
        }
    }
    console.log(req.url);
    console.log(query);
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/animals/:id_animals/cages/:id_cages', function(req, res) {
    var id_animals = req.params.id_animals;
    var id_cages = req.params.id_cages;
    var query = "SELECT cages.* FROM animals INNER JOIN cages ON animals.id_cage = cages.id WHERE animals.id=" + id_animals + " AND cages.id=" + id_cages;
    var conditions = ["name","description", "area"];
    for (var index in conditions) 
    {
        if (conditions[index] in req.query) 
        {
            if (query.indexOf("WHERE") < 0) 
            {
                query += " WHERE";
            } 
            else 
            {
                query += " AND";
            }
            query += " " + conditions[index] + "='" +
            req.query[conditions[index]] + "'";
        }
    }

    if ("sort" in req.query) 
    {
        var sort = req.query["sort"].split(",");
        query += " ORDER BY";
        for (var index in sort) 
        {
            var direction = sort[index].substr(0, 1);
            var field = sort[index].substr(1);
            query += " " + field;
            if (direction == "-")
            query += " DESC,";
            else
            query += " ASC,";
        }
        query = query.slice(0, -1);
    }
    
    if ("fields" in req.query) 
    {
        query = query.replace("cages.*", req.query["fields"]);
    }
    
    if ("limit" in req.query) 
    {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) 
        {
            query += " OFFSET " + req.query["offset"];
        }
    }
    console.log(req.url);
    console.log(query);
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get('/cages/:id/animals', function(req, res) {
    var id = req.params.id;
    var query = "SELECT animals.* FROM cages INNER JOIN animals ON cages.id = animals.id_cage WHERE cages.id=" + id;
    var conditions = ["name", "breed","food_per_day","birthday","entry_date","id_cage"];
    for (var index in conditions) 
    {
        if (conditions[index] in req.query) 
        {
            if (query.indexOf("WHERE") < 0) 
            {
                query += " WHERE";
            } 
            else 
            {
                query += " AND";
            }
            query += " " + conditions[index] + "='" + 
            req.query[conditions[index]] + "'";
        }
    }

    if ("sort" in req.query) 
    {
        var sort = req.query["sort"].split(",");
        query += " ORDER BY";
        for (var index in sort) 
        {
            var direction = sort[index].substr(0, 1);
            var field = sort[index].substr(1);
            query += " " + field;
            if (direction == "-")
            query += " DESC,";
            else
            query += " ASC,";
        }
        query = query.slice(0, -1);
    }
    
    if ("fields" in req.query) 
    {
        query = query.replace("animals.*", req.query["fields"]);
    }
    
    if ("limit" in req.query) 
    {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) 
        {
            query += " OFFSET " + req.query["offset"];
        }
    }
    console.log(req.url);
    console.log(query);
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});



app.get('/cages/:id_cages/animals/:id_animals', function(req, res) {
    var id_animals = req.params.id_animals;
    var id_cages = req.params.id_cages;
    var query = "SELECT animals.* FROM cages INNER JOIN animals ON animals.id_cage = cages.id  WHERE animals.id = " + id_animals + " AND cages.id = " + id_cages;
    var conditions = ["name", "breed","food_per_day","birthday","entry_date","id_cage"];
    for (var index in conditions) 
    {
        if (conditions[index] in req.query) 
        {
            if (query.indexOf("WHERE") < 0) 
            {
                query += " WHERE";
            } 
            else 
            {
                query += " AND";
            }
            query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
        }
    }

    if ("sort" in req.query) 
    {
        var sort = req.query["sort"].split(",");
        query += " ORDER BY";
        for (var index in sort) 
        {
            var direction = sort[index].substr(0, 1);
            var field = sort[index].substr(1);
            query += " " + field;
            if (direction == "-")
            query += " DESC,";
            else
            query += " ASC,";
        }
        query = query.slice(0, -1);
    }
    
    if ("fields" in req.query) 
    {
        query = query.replace("animals.*", req.query["fields"]);
    }
    
    if ("limit" in req.query) 
    {
        query += " LIMIT " + req.query["limit"];
        if ("offset" in req.query) 
        {
            query += " OFFSET " + req.query["offset"];
        }
    }
    console.log(req.url);
    console.log(query);
    db.query(query, function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});


app.get('/animals/:id/food', function(req, res){
	var id = req.params.id;
	var query = "SELECT food.* FROM animals INNER JOIN food ON food.id_animal = animals.id   WHERE animals.id = " + id;
	var conditions = ["name","quantity", "id_animal"];
    for(var index in conditions)
    {
        if(conditions[index] in req.query)
        {
            if(query.indexOf("WHERE") < 0)
            {
                query += " WHERE";
            } 
            else 
            {
                query += " AND";
            }

                query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
		}
	}

    if ("sort" in req.query) 
    {
        var sort = req.query["sort"].split(",");
        query += " ORDER BY";
        for (var index in sort) 
        {
            var direction = sort[index].substr(0, 1);
            var field = sort[index].substr(1);
            query += " " + field;
            if (direction == "-")
            query += " DESC,";
            else
            query += " ASC,";
        }
        query = query.slice(0, -1);
    }

    if("fields" in req.query)
    {
		query = query.replace("food.*", req.query["fields"]);
	}

    if("limit" in req.query)
    {
		query += " LIMIT " + req.query["limit"];

        if("offset" in req.query)
        {
			query += " OFFSET " + req.query["offset"];
		}
	}
    console.log(req.url);
    console.log(query);
	db.query(query, function(err, result, fields){
		if(err) throw err;

		res.send(JSON.stringify(result));
	});
});

app.get('/animals/:id_animal/food/:id_food', function(req, res){
	var id_animal = req.params.id_animal;
	var id_food = req.params.id_food;

	var query = "SELECT food.* FROM animals INNER JOIN food ON food.id_animal = animals.id WHERE animals.id = " + id_animal + " AND food.id = " + id_food;
	
	var conditions = ["name","quantity", "id_animal"];

	
    for(var index in conditions)
    {
        if(conditions[index] in req.query)
        {
            if(query.indexOf("WHERE") < 0)
            {
                query += " WHERE";
            } 
            else 
            {
                query += " AND";
            }

            query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
		}
    }
    if ("sort" in req.query) 
    {
        var sort = req.query["sort"].split(",");
        query += " ORDER BY";
        for (var index in sort) 
        {
            var direction = sort[index].substr(0, 1);
            var field = sort[index].substr(1);
            query += " " + field;
            if (direction == "-")
            query += " DESC,";
            else
            query += " ASC,";
        }
        query = query.slice(0, -1);
    }

    if("fields" in req.query)
    {
		query = query.replace("food.*", req.query["fields"]);
	}

    if("limit" in req.query)
    {
		query += " LIMIT " + req.query["limit"];

        if("offset" in req.query)
        {
			query += " OFFSET " + req.query["offset"];
		}
	}
    console.log(req.url);
    console.log(query);
	db.query(query, function(err, result, fields){
		if(err) throw err;

		res.send(JSON.stringify(result));
	});
}); 

app.get('/food/:id/animals', function(req, res){
	var id = req.params.id;
	var query = "SELECT animals.* FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE food.id = " + id;
	
	var conditions = ["name","breed", "food_per_day", "birthday", "entry_date","id_cage"];

    for(var index in conditions)
    {
        if(conditions[index] in req.query)
        {
            if(query.indexOf("WHERE") < 0)
            {
                query += " WHERE";
            } 
            else 
            {
                query += " AND";
            }

            query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
		}
	}

    if("sort" in req.query)
    {
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";

        for(var index in sort)
        {
			var direction = sort[index].substr(0,1);
			var field = sort[index].substr(1);

			query += " " + field;

			if(direction == "-")
				query += " DESC,";
			else
				query += " ASC,";
		}	

		query = query.slice(0, -1);
	}

    if("fields" in req.query)
    {
		query = query.replace("animals.*", req.query["fields"]);
	}

    if("limit" in req.query)
    {
		query += " LIMIT " + req.query["limit"];

        if("offset" in req.query)
        {
			query += " OFFSET " + req.query["offset"];
		}
	}
    console.log(req.url);
    console.log(query);
	db.query(query, function(err, result, fields){
		if(err) throw err;

		res.send(JSON.stringify(result));
	});
});

app.get('/query', function(req, res){
	res.send(JSON.stringify(req.query));
});


app.get('/food/:id_food/animals/:id_animal', function(req, res){
	var id_animal = req.params.id_animal;
	var id_food = req.params.id_food;

	var query = "SELECT animals.* FROM animals INNER JOIN food ON animals.id = food.id_animal WHERE animals.id =" + id_animal + " AND food.id=" + id_food;
	
	var conditions = ["name","breed", "food_per_day", "birthday", "entry_date","id_cage"];

    for(var index in conditions)
    {
        if(conditions[index] in req.query)
        {
            if(query.indexOf("WHERE") < 0)
            {
                query += " WHERE";
            } 
            else 
            {
                query += " AND";
            }

            query += " " + conditions[index] + "='" + req.query[conditions[index]] + "'";
		}
	}

    if("sort" in req.query)
    {
		var sort = req.query["sort"].split(",");
		query += " ORDER BY";

        for(var index in sort)
        {
			var direction = sort[index].substr(0,1);
			var field = sort[index].substr(1);

			query += " " + field;

			if(direction == "-")
				query += " DESC,";
			else
				query += " ASC,";
		}	

		query = query.slice(0, -1);
	}


    if("fields" in req.query)
    {
		query = query.replace("animals.*", req.query["fields"]);
	}

    if("limit" in req.query)
    {
		query += " LIMIT " + req.query["limit"];

        if("offset" in req.query)
        {
			query += " OFFSET " + req.query["offset"];
		}
	}
    console.log(req.url);
    console.log(query);
	db.query(query, function(err, result, fields){
		if(err) throw err;

		res.send(JSON.stringify(result));
	});
});

app.get('/food-stats', function(req, res) 
{
    var query = "SELECT a.id, IF(food_per_day =0,0,quantity/food_per_day) as days_left FROM animals a JOIN food f WHERE a.id = f.id_animal;"
    db.query(query, function(err, result, fields) {
      if (err) throw err;
      res.send(JSON.stringify(result));
    });
  });

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.listen(3000, function() {
    db.connect(function(err) {
        if (err) throw err;
        console.log('Connection to database successful!');
    });
        
    console.log('Example app listening on port 3000!'); 
});