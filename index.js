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

/* =============================================course collection========================================================= */
//starting endpoint
app.get('/',(req,res)=>{
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

//course wrt courseSubCategory
/* app.get('/courseDetail/courseSubCat/:subcategory',(req,res)=>{
    let subCategory = req.params.subcategory;

    let query = {};

    if(subCategory){
        query = {"course_subcategory": subCategory}
    }
    //output the result
    db.collection('course').find(query).toArray((err, result)=>{
        if (err) throw err;
         res.send(result);        
    });
})
 */

//course wrt courseTopic
app.get('/courseDetail/courseType/:courseTopic',(req,res)=>{
    let CourseTopic = Number(req.params.courseTopic);

    let query = {};

    if(CourseTopic){
        query = {"typeId": CourseTopic}
    }
    //output the result
    db.collection('course').find(query).toArray((err, result)=>{
        if (err) throw err;
         res.send(result);        
    });
})

//course wrt uniqueId
app.get('/courseDetail/:courseId',(req,res)=>{
    let CourseId = Number(req.params.courseId);

    let query = {};

    if(CourseId){
        query = {"courseID": CourseId}
    }
    //output the result
    db.collection('course').find(query).toArray((err, result)=>{
        if (err) throw err;
         res.send(result);        
    });
})

//studentCourse wrt reviewCount
app.get('/courseDetail/studentCourse/:count',(req,res)=>{
    
    let query = {};

    let Cnt = Number(req.params.count);

    if(Cnt){
        query = {"course_details.reviewCount":{$gt:Cnt}};
    }
    //console.log(query)

    //output the result
    db.collection('course').find(query).toArray((err, result)=>{
        if (err) throw err;
         res.send(result);        
    });
})


//Filter options
app.get('/courseDetail/courseCat/:courseCategory',(req,res) => {
    let query = {};
    let sort = {"course_details.cost":1}
    let courseCategory = req.params.courseCategory;
    //let courseType = req.query.courseType;
    let rating = Number(req.query.rating);
    let lcost = Number(req.query.lcost);
    let hcost = Number(req.query.hcost);

    if(req.query.sort){
        sort={"course_details.cost":req.query.sort}
    }
    console.log("course_category:" + courseCategory);
    if(hcost && lcost && rating){
        query={
            "course_category": courseCategory,
            $and:[{"course_details.cost":{$gt:lcost,$lt:hcost}}],
            "course_details.rating":{$gt:rating}
        }
    } 
    else if(hcost && lcost){
        query={
            "course_category":courseCategory,
            $and:[{"course_details.cost":{$gt:lcost,$lt:hcost}}]
        }
    }
    else if(rating){
        query={
            "course_category":courseCategory,
            $and:[{"course_details.rating":{$gt:rating}}]
        }
    }/* else if(lang){
        query={
            "course_category":courseCategory,
            "course_details.language": lang
        }
    } */else{
        query={
            "course_category":courseCategory
        }
    }

    db.collection('course').find(query).sort(sort).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//get course details of given courseIDs 
app.post('/courseItem',(req,res) => {
    if(Array.isArray(req.body.id)){
        db.collection('course').find({"courseID":{$in:req.body.id}}).toArray((err,result) => {
            if(err) throw err;
            res.send(result)
        })
    }else{
        res.send({"errMsg": "Invalid Input"})
    }
    
})
/* =============================================category collection========================================================= */

//get category details
app.get('/categoryJson',(req,res)=>{
    let query = {};
    db.collection('category').find(query).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

/* =============================================orders collection========================================================= */
//place the Order for added course items in cart
app.post('/placeOrder',(req,res) => {
    db.collection('orders').insertOne(req.body,(err,result) => {
        if(err) throw err;
        res.send('Order Placed');
    })
})

//list the orders details
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
    let OrderId = Number(req.params.id);
    let query = {"id": OrderId}
    
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
    let OrderId = Number(req.params.id);
    let query = {"id": OrderId}
    
    db.collection('orders').deleteOne(query,(err,result)=>{
            if(err) throw err;
            res.send("Order deleted")
    })
    
})

/* =============================================MongoDB Database connection========================================================= */

//connnection with db
mongoClient.connect(mongoUrl,(err,client)=>{
    if(err) console.log("Error while configuration");
    db = client.db('Udemy');
    
})

app.listen(port,()=>{
    console.log(`Express is using port: ${port}`)
});