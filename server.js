const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const HTTP_PORT = 8000;
const db = require("./database.js");
const md5 = require("md5");
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors())

// Root endpoint
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

// GetUsers
app.get("/api/users", (req, res, next) => {
    let sql = "select * from user";
    let params = [];
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows,
            "users":rows.length
        })
      });
});

//GetUser
app.get("/api/user/:id", (req, res, next) => {
    let sql = "select * from user where id = ?"
    let params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
});

//CreateUser
app.post("/api/user/", (req, res, next) => {
    
    let errors=[];

    if (!req.body.name){
        errors.push("No name specified");
    }
    if (!req.body.surname){
        errors.push("No surname specified");
    }
    if (!req.body.email){
        errors.push("No email specified");
    }
    if (!req.body.phone){
        errors.push("No phone specified");
    }
    if (!req.body.password){
        errors.push("No password specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }

    let data = {
        name: req.body.name,
        surname:req.body.surname,
        email: req.body.email,
        phone: req.body.phone,
        password : md5(req.body.password)
    }
    let sql ='INSERT INTO user (name, surname, email, phone, password) VALUES (?,?,?,?,?)';
    let params =[data.name, data.surname, data.email, data.phone, data.password];
    
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

app.patch("/api/user/:id", (req,res)=>{
    let data = {
        name: req.body.name,
        surname:req.body.surname,
        email: req.body.email,
        phone: req.body.phone,
        password : req.body.password
    }
    db.run(
        `UPDATE user set 
        name = COALESCE(?,name), 
        surname = COALESCE(?,surname),
        email = COALESCE(?,email), 
        phone = COALESCE(?,phone),
        password = COALESCE(?,password),
        WHERE id = ?`,
        [data.name, data.surname, data.email, data.phone, data.password, req.params.id],
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
    });
})

//DeleteUser
app.delete("/api/user/:id", (req, res, next) => {
    db.run(
        'DELETE FROM user WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
    });
})

// DefaultResponse
app.use(function(req, res){
    res.status(404);
});

// StartServer
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});
