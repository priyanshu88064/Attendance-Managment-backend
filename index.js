const express = require('express');
const app = express();
const server = require('http').createServer(app);
const PORT  = process.env.PORT || 80;
const cors = require('cors');
const {createUser,login, getRecord, submitUser, mark} = require('./db');
const { stat } = require('fs');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.post('/create',(req,res)=>{
    
    createUser(req.body,function(data) {
        res.json({"message":data});
    });

});

app.post('/login',(req,res)=>{

    login(req.body,function(data){
        res.json({"message":data});
    });

});

app.get('/record/:rollno',(req,res)=>{

    getRecord(req.params.rollno,function(data) {
        res.json(data);
    })

});

app.post('/userSubmit',(req,res)=>{

    submitUser(req.body,function(status){
        res.json(status);
    })
});

app.get('/mark/:section/:sub',(req,res)=>{

    mark(req.params.section,req.params.sub,function(status){
        res.json(status);
    });

})

server.listen(PORT,()=>{
    console.log("Listening on Port:"+PORT);
});