//Express JS
const express = require('express');
const mongoose = require ("mongoose");

const app = express();

app.use(express.json())
//Router
// app.get('/',(req,res)=>{
//     res.send("Hello world");
// })


// Sample Mmeory Storage 
// let todos=[];
// Connecting MongoDB
mongoose.connect('mongodb://localhost:27017/mern-app')
.then(()=>{
    console.log("DB Connected !");
})
.catch((err)=>{
    console.log(err);
})
//craeting Schema
const todosSchema = new mongoose.Schema({
    title: {
        required:true,
        type: String
    },
    description: String
})

//todo Model 
const todoModel = mongoose.model('Todo', todosSchema);

//craete a todo
app.post('/todos',async(req, res)=>{
    const{title, description} = req.body;
   // const newTodo ={
    //     id:todos.length+1,
    //     title,
    //     description
    // }
    // todos.push(newTodo);
    // console.log(todos);
    // 

    try {
        const newTodo= new todoModel ({title, description});
    await newTodo.save(); 
    res.status(201).json(newTodo);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }    
})
// create API
app.get('/todos',async (req, res)=>{
    try {
        const todos = await todoModel.find();
        res.json(todos);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }
    
})

//update Todo list
app.put('/todos/:id',async(req, res)=>{

    try {
        const{title, description} = req.body;
        const id = req.params.id;
       const updatedTodo =  await todoModel.findByIdAndUpdate(
            id,
            {title, description },
            {new:true}
        )
        if(!updatedTodo){
            return res.status(404).json({message:"Todo Not Found "})
        }
        res.json(updatedTodo)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
        
    }
   
})

// Delete a todo Item
app.delete('/todos/:id', async(req, res)=>{

    try {
        const id =req.params.id;
    await todoModel.findByIdAndDelete(id);
    res.status(204).end();
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }
    
})

//port server
const port = 3000;
app.listen(port,()=>{
    console.log("Server Running "+port );
})