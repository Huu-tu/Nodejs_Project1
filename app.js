var exprees = require("express");
var app = exprees();
const session = require('express-session');
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'tuhuu7165'
}));                         

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/Productss";

var publicDir = require('path').join(__dirname,'/public');
app.use(exprees.static(publicDir));

var hbs = require('hbs');
app.set('view engine','hbs');

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));

app.get('/',async(req,res)=>{
    let client = await MongoClient.connect(url);
    let dbo = client.db("Productss");
    let results = await dbo.collection("Productss").find({}).toArray();
    res.render('viewproducts',{model:results});                                                                                    
});

app.get('/Control_Center',async(req,res)=>{
    let client = await MongoClient.connect(url);
    let dbo = client.db('Productss');
    let results = await dbo.collection("Productss").find({}).toArray();
    res.render('home',{model:results});
});

app.get('/about',(req,res)=>{
    res.render('About');
});

app.get('/new',(req,res) => {
    res.render('newProduct');
});


app.get('/delete', async(req,res)=>{
    let id = req.query.id;
    var ObjectID = require("mongodb").ObjectID;
    let condition = {_id: ObjectID(id)};
    let client =  await MongoClient.connect(url);
    let dbo = client.db("Productss");
    await dbo.collection("Productss").deleteOne(condition);
    let results = await dbo.collection("Productss").find({}).toArray();
    res.redirect('/');
});

app.post('/insert', async(req, res)=>{
    let client = await MongoClient.connect(url , {useUnifiedTopology: true});
    let dbo = client.db('Productss');
    let Name = req.body.productName;
    let Price = req.body.price;
    let Date = req.body.ImportedDate;
    let Clothes = req.body.outfit;
    let Image = req.body.img;
    let newProduct = {
        productName: Name,
        price: Price,
        ImportedDate: Date, 
        outfit: Clothes,
        img: Image
    };
    await dbo.collection('Productss').insertOne(newProduct);

    res.redirect('/');
});

app.post('/search', async(req,res) =>{
    let searchText = req.body.textSearch;
    let searchPrice = req.body.numSearch;
    let client = await MongoClient.connect(url, {useUnifiedTopology: true});
    let dbo = client.db("Productss");
    let results = await dbo.collection("Productss").find({price:{$gte: "300",$lte:"500"}}).toArray();
    res.render('viewproducts',{model:results})
})

app.get('/edit', async(req,res)=>{
    let id = req.query.pid;
    var ObjectID = require("mongodb").ObjectID;
    let condition = {"_id": ObjectID(id)};
    let client = await MongoClient.connect(url, {useUnifiedTopology: true});
    let dbo = client.db("Productss");
    let prod = await dbo.collection("Productss").findOne(condition);
    res.render('edit',{model: prod});
})

app.post('/update',async(req,res)=>{
    let client = await MongoClient.connect(url, {useUnifiedTopology: true});
    let dbo = client.db("Productss");
    let Name = req.query.productName;
    let Price = re.query.pricel;
    let Date = req.body.ImportedDate;
    let Clothes = req.body.outfit;
    let ID  = req.body.pid;
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id": ObjectID(ID)};
    let updateProduct={$set : {productName : Name, price: Price, ImportedDate: Date, outfit: Clothes}};
    await dbo.collection("Productss").updateOne(condition,updateProduct);
    res.redirect('/');
})

const PORT  = process.env.PORT ||5000;
app.listen(PORT);
console.log("Server is running..." + PORT);