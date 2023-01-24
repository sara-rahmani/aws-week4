// const express = require('express')
// const multer = require('multer')
//const fs = require('fs')

import express  from 'express'
import multer from 'multer'
 import fs from 'fs'
//  import path from 'path';
//  import { fileURLToPath } from 'url';
 
//  const __filename = fileURLToPath(import.meta.url);
 
//  const __dirname = path.dirname(__filename);
 import {addImage,getImages} from './database.js'
const app = express()
//multer
const upload = multer({ dest: 'images/' })

//json
app.use(express.json())
app.use(express.urlencoded({extended :true}))
//urlencodede
app.use("/images",express.static("./images"))

//app.use('/api/images', express.static('images'))
app.use(express.static("build"));

app.get("/api/images", async(req, res) => {
  const result = await getImages()
  res.send(result)
})

app.post('/api/images',upload.single('sara'), async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  try{    const description = req.body.description
       const filePath =req.file.path
     const result = await addImage(filePath,description)
     res.send(result)

     // res.redirect("/");
    }catch (error) {
        console.error(error)
        res.sendStatus(500)
      }
//    res.send("hellooo")
  })
app.get('images/:imageName',async (req,res)=>{

    //store data in database
    //deploy to a cloud service
    
    //diff btw deploying code and deploying persistance code
    const imageName = req.params.imageName
   // const description = req.body.description
    // const filePath =req.file.path
    // const result = await addImage(filePath,description)
    // res.send(result)
    const readStream = fs.createReadStream(`images/${imageName}`)
    readStream.pipe(res)
})
// After all other routes
app.get('*', (req, res) => {
//  res.sendFile('dist/index.html');
  res.sendFile('build/index.html', { root: '.' });

});
const port = process.env.PORT || 8080
app.listen(port, () => console.log(`listening on port ${port}`))