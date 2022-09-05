const express=require('express');
const app = express();
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const Blog=require('./models/newBlogModel')
const methodOverride = require('method-override')

const port=3000;

//middleware
app.set('view engine', 'views');
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json());
app.use(methodOverride('_method'))


//connection to database
let url="mongodb://localhost:27017/blog"
mongoose.connect(url,(err)=>{
    if(err) throw err;
    console.log("Database connected successfully")
})


//end point
//index route
app.get('/', (req, res) => {
   Blog.find({})
   .then((raw)=>{
    if(!raw){
        console.log('No data found')
        res.status(404).send("data not found")
    }else{
        res.render('index.ejs',{blog: raw})
    }
   }).catch((err)=>{if(err) throw err})
})
//New Post Route
app.get('/newBlog',(req,res)=>{
    res.render('newBlog.ejs')
})
/
app.post('/newBlog',(req,res)=>{
    console.log(req.body)
    Blog.create({
        image:req.body.imagelink,
        title:req.body.title,
        description:req.body.description

    }).then((saved)=>{
        if(saved){
            console.log(`data saved ${saved}`);
            res.redirect('/')
        }else{
            console.log('data not saved')
        }
    }).catch((err)=>{if(err) throw err})
})
app.delete('/:id',(req,res)=>{
    console.log(req.params.id)
    Blog.deleteOne({_id:req.params.id})
    .then((deldata)=>{
        if(!deldata){
            console.log('data not deleted')
            res.send("data not deleted")
        }else{
           res.redirect('/')
            console.log("data deleted",deldata)
        }
    }).catch((err)=>{if(err) throw err})
})
app.get('/:id',(req,res)=>{
    Blog.findOne({_id:req.params.id})
    .then((found)=>{
        if(!found){
            console.log(" not found")
        }else{
            console.log("Found one data",found)
            console.log(found.image)
            console.log(found.description)
            res.render('newBlog.ejs',{value:found})
         
        }
    }).catch((err)=>{if(err) throw err})
})
app.put('/newBlog/:id',(req,res)=>{
    Blog.findByIdAndUpdate({_id:req.params.id},{$set:req.body},{new:true})
    .then((updated)=>{
        if(!updated){
            console.log("not update")
            res.send("Something error in this query")
        }else{
            console.log("update")
          res.redirect('/')
        }
    }).catch((err)=>{if(err) throw err})
})

app.listen(port,(err, data) => {
    if(err)throw err
    console.log(`Server is listening on ${port}`)
})