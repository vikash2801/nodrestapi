let express = require('express')
let app = express();
let dotEnv = require('dotenv');
dotEnv.config();
let port = process.env.PORT || 3400;
let mongo = require('mongodb')
let mongoClient = mongo.MongoClient;
let mongoUrl = process.env.LiveMongo;
//let mongoUrl = process.env.MongoURL;
let db;

let bodyParser = require('body-parser');
//it's middleware b/w client and server
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

let cors = require('cors')
app.use(cors())

/* --------------------------------------------------------endpoints------------------------------------------------------------- */
//starting endpoint
app.get('/', (req,res)=>{
    res.send("Welcome on Express");
})

//list of courses
app.get('/courseDetail',(req,res)=>{
    let query = {};
    //output the result
    db.collection('course').find(query).toArray((err, result)=>{
        if (err) throw err;
        res.send(result);
    });
})

//course wrt courseTopic
app.get('/courseDetail/courseType/:course',(req,res)=>{
    let course = req.params.course;

    let query = {};

    if(course){
        query = {course_type: course}
    }
    //output the result
    db.collection('course').find(query).toArray((err, result)=>{
        if (err) throw err;
         res.send(result);        
    });
})

//course wrt rating
app.get('/courseDetail/rating/:rating',(req,res)=>{
    let rat = req.params.rating;

    let query = {};

    if(rat){
        query = {"course_details.rating":{$gt: rat}}
    }
    //output the result
    db.collection('course').find(query).toArray((err, result)=>{
        if (err) throw err;
         res.send(result);        
    });
})

//Filter options
app.get('/filter/:courseCategory',(req,res) => {
    let query = {};
    let sort = {"course_details.cost":1}
    let courseCategory = req.params.courseCategory;
    let courseType = req.query.courseType;
    let lang = req.query.lang;
    let lcost = Number(req.query.lcost);
    let hcost = Number(req.query.hcost);

    if(req.query.sort){
        sort={"course_details.cost":req.query.sort}
    }
    console.log("course_category:" + courseCategory);
    if(hcost && lcost && courseType){
        query={
            "course_category":courseCategory,
            "course_type":courseType,
            $and:[{"course_details.cost":{$gt:lcost,$lt:hcost}}]
        }
    } 
    else if(hcost && lcost){
        query={
            "course_category":courseCategory,
            $and:[{"course_details.cost":{$gt:lcost,$lt:hcost}}]
        }
    }
    else if(courseType){
        query={
            "course_category":courseCategory,
            "course_type":courseType
        }
    }else if(lang){
        query={
            "course_category":courseCategory,
            "course_details.language": lang
        }
    }else{
        query={
            "course_category":courseCategory
        }
    }

    db.collection('course').find(query).sort(sort).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})


//place Order
app.post('/placeOrder',(req,res) => {
    db.collection('orders').insertOne(req.body,(err,result) => {
        if(err) throw err;
        res.send('Order Placed');
    })
})

//list the orders
app.get('/orders',(req,res)=>{
    let email = req.query.email;
    let query = {};
    if(email){
        query={email:email};
    }
    db.collection('orders').find(query).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//after payment

//update the product status after payment
app.put('/updateOrder/:id',(req,res)=>{
    let OrderId = mongo.ObjectId(req.params.id);
    let query = {_id: OrderId}
    
    db.collection('orders').updateOne(
        query,
        {
            $set:{
                status: req.body.status,
                bank: req.body.bank,
                date: req.body.date
            }
        },(err,result)=>{
            if(err) throw err;
            res.send("Order updated with payment status")
    })
})

//Delete the order from cart
app.delete('/deleteOrder/:id',(req,res)=>{
    let OrderId = mongo.ObjectId(req.params.id);
    let query = {_id: OrderId}
    
    db.collection('orders').deleteOne(query,(err,result)=>{
            if(err) throw err;
            res.send("Order deleted")
    })
    
})



//connnection with db
mongoClient.connect(mongoUrl,(err,client)=>{
    if(err) console.log("Error while configuration");
    db = client.db('Udemy');
    
})

app.listen(port,()=>{
    console.log(`Express is using port: ${port}`)
});
