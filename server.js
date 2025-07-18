const express=require('express')
const app=express()
const path=require('path')
const db=require('./db/db')
const {logger}=require('./middleware/logEvents')
const PORT=3500

app.use(logger)
app.use(express.json())
app.use('/static',express.static(path.join(__dirname,'views')))
app.use('/',express.static(path.join(__dirname,'views')))
app.use(express.urlencoded({extended:false}))

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','home.html'))
})

app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','login.html'))
})

app.get('/signup',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','signup.html'))
})

app.post('/login',async(req,res)=>{
    const {uname,pass}=req.body
    try{
        const [result]=await db.execute('SELECT * FROM users WHERE uname=? and pass=?',[uname,pass])
        if(result.length>0){
            console.log('Login successfull!')
            if(result[0].uname.startsWith('admin')){
                console.log('admin login')
                res.sendFile(path.join(__dirname,'views','admin.html'))
            }
            else{
                console.log('student login')
                res.sendFile(path.join(__dirname,'views','stdnt.html'))
            }
        }
        else{
            console.log('no user found!')
            res.send('No user found!')
        }
    }
    catch(err){
        console.log(err)
        res.send(err)
    }
})

app.post('/signup',async(req,res)=>{
    const {uname,pass,pass2}=req.body
    console.log(pass)
    console.log(pass2)
    try{
        if(pass.length<8){
            console.log('password cannot be lesser than 8 characters!')
            return res.send('password cannot be lesser than 8 characters!')
        }
        if(pass!==pass2){
            console.log('Both Password must be same!')
            return res.send('Both Passwords must be same!');
        }
        const [result]=await db.execute('SELECT * FROM users WHERE uname=? and pass=?',[uname,pass])
        if(result.length>0){
            console.log('user already exists')
            res.send('user already exists!')
        }
        else{
            const [row]=await db.execute('INSERT INTO users VALUES (?,?)',[uname,pass])
            console.log('Account created successully!')
            res.send('Account created successully')
        }
        res.sendFile(path.join(__dirname,'views','login.html'))
    }
    catch(err){
        console.log(err)
        res.send(err)
    }
})

app.get('/add',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','add.html'))
})

app.post('/add',async(req,res)=>{
    const {roll,name,dept,city,pin}=req.body
    try{
        const [exists]=await db.execute('SELECT * from stdnts where roll=?',[roll])
        if(exists.length>0){
            console.log('student already exists!')
            return res.send('student already exists! try another student')
        }
        const [row]=await db.execute('INSERT INTO stdnts VALUES (?,?,?,?,?)',[roll,name,dept,city,pin])
        console.log('student added!')
        res.send('student added successfully!')
    }
    catch(err){
        console.log(err)
        res.send(err)
    }
})

app.get('/show',async(req,res)=>{
    try{
        const [rows]=await db.execute('SELECT * FROM stdnts')
        console.log(rows)
        res.json(rows)
    }
    catch(err){
        console.log(err)
        res.send(err)
    }
})

app.get('/update',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','update.html'))
})

app.post('/update',async(req,res)=>{
    const {roll,name,dept,city,pin}=req.body
    try{
        const [exists]=await db.execute('SELECT * FROM stdnts WHERE roll=?',[roll])
        if(exists.length<1){
            console.log('no student found')
            return res.send('student not found!')
        }
        const [rows]=await db.execute('UPDATE stdnts SET name=?,dept=?,city=?,pin=? where roll=?',[name,dept,city,pin,roll])
        console.log('student updated successfully!')
        res.send('student updated successfully!')
    }
    catch(err){
        console.log(err)
        res.send(err)
    }
})

app.get('/delete',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','delete.html'))
})

app.post('/delete',async (req,res)=>{
    const {roll}=req.body
    try{
        const [exists]=await db.execute('SELECT * FROM stdnts WHERE roll=?',[roll])
        if(exists.length<1){
            console.log(`Roll No ${roll} not exists!`)
            res.send(`Roll No ${roll} not exists!`)
        }   
        const [rows]=await db.execute('DELETE FROM stdnts WHERE roll=?',[roll])
        console.log(`rollno ${roll} deleted successfully!`)
        res.send(`rollno ${roll} deleted successfully!`)
    }
    catch(err){
        console.log(err)
        res.send(err)
    }
})

app.listen(PORT,()=>console.log(`server is running at port ${PORT}`))