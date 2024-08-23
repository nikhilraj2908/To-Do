var cors=require("cors");
var express=require("express");
const { MongoClient } = require("mongodb");
var mongoClient=require("mongodb").MongoClient;
var conString="mongodb://127.0.0.1:27017";
var app=express();
app.use(cors()); 
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.post('/register-user',(req,res)=>{
    var user={
        userID:req.body.userID, 
        userName:req.body.userName,
        password:req.body.password,
        emailID:req.body.emailID,
        mobile:req.body.mobile
    };
    mongoClient.connect(conString).then(clientObject=>{
       var database= clientObject.db("to-do")
       database.collection("users").insertOne(user).then(()=>{
        console.log("user added");
        res.end();
       });
    });
});
app.post('/add-task',(req,res)=>{
    var task={
        appointID:parseInt(req.body.appointID), 
        date:new Date(req.body.date),
        userID:req.body.userID,
        title:req.body.title,
        discription:req.body.discription
    }
    mongoClient.connect(conString).then(clientObject=>{
        var database=clientObject.db("to-do");
        database.collection("appointment").insertOne(task).then(()=>{
            console.log("task added");
            res.end();
        })
    })
})
app.put('/edit-task/:id',(req,res)=>{
    var id=parseInt(req.params.id);
    var task={
        appointID:parseInt(req.body.appointID), 
        date:new Date(req.body.date),
        title:req.body.title,
        userID:req.body.userID,
        discription:req.body.discription
    }
    MongoClient.connect(conString).then(clientObject=>{
        var database=clientObject.db("to-do");
        database.collection("appointment").updateOne({appointID:id},{$set:task}).then(()=>{
            console.log("updated");
            res.end();
        })
    })
})
app.delete('/delete-task/:id',(req,res)=>{
    var id=parseInt(req.params.id);
    mongoClient.connect(conString).then(clientObject=>{
        var database=clientObject.db("to-do");
        database.collection("appointment").deleteOne({appointID:id}).then(()=>{
            console.log("deleted succefully");
            res.end();
        })
    })
})

app.get('/get-users',(req,res)=>{
    mongoClient.connect(conString).then(clientObject=>{
       var database= clientObject.db("to-do")
       database.collection("users").find({}).toArray().then(document=>{
        res.send(document);
        console.log("login sucessfully");
        res.end();
       })
    })
})
app.get('/get-tasks/:userid',(req,res)=>{
    mongoClient.connect(conString).then(clientObject=>{
       var database= clientObject.db("to-do")
       database.collection("appointment").find({userID:req.params.userid}).toArray().then(document=>{
        res.send(document);
        res.end();
       })
    })
})
app.get('/get-appoint/:id',(req,res)=>{
    mongoClient.connect(conString).then(clientObject=>{
        var database=clientObject.db("to-do")
        database.collection("appointment").find({appointID:parseInt(req.params.id)}).toArray().then(document=>{
            res.send(document)
            res.end();
        })
    })
})
app.listen(2908);
console.log("server connected");