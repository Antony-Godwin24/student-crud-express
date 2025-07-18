const express=require('express')
const path=require('path')
const app=express()
const {format}=require('date-fns')
const {v4:uuid}=require('uuid')
const fs=require('fs')
const fsPromises=require('fs').promises

const logEvents=async(message,file)=>{
    const DateTime=`${format(new Date(), 'yyyyMMss\tHH:mm:ss')}`
    const logItem=`${DateTime}\t${uuid()}\t${message}\n`
    try{
        if(!fs.existsSync(path.join(__dirname,'..','logs'))){
            fsPromises.mkdir(path.join(__dirname,'..','logs'))
        }

        await fsPromises.appendFile(path.join(__dirname,'..','logs',file),logItem)
    }
    catch(err){
        console.log(err)
    }
}

const logger=(req,res,next)=>{
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`,'reqLog.txt')
    console.log(`${req.method} ${req.url}`)
    next();
}

module.exports={logger,logEvents}