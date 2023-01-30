// const express = require('express')
// const multer = require('multer')
//const fs = require('fs')
//import {uploadImage} from './s3.js'
import * as s3 from "./s3.js";
import crypto from 'crypto'

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

import express  from 'express'
import multer from 'multer'
 import fs from 'fs'

//  import path from 'path';
//  import { fileURLToPath } from 'url';
 
//  const __filename = fileURLToPath(import.meta.url);
 
//  const __dirname = path.dirname(__filename);
 import {addImage,getImages,getImage,deleteImage} from './database.js'
const app = express()
//multer
//const upload = multer({ dest: 'images/' })-->
//-->
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

//json
app.use(express.json())
app.use(express.urlencoded({extended :true}))
//urlencodede
app.use("/images",express.static("./images"))

//app.use('/api/images', express.static('images'))
app.use(express.static("dist"));

app.get("/api/images", async(req, res) => {
  const images = await getImages()
  //
  for (const image of images) {
    image.url = await s3.getSignedUrl(image.file_name)
  }

  res.send(images)
})

app.post('/api/images',upload.single('sara'), async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  try{   
    //GET DATA FROM THE POST REQUEST
     const description = req.body.description
      // const filePath =req.file.path-->
    //  const fileName = "a_file_name"-->
    const fileName = generateFileName()

       const fileBuffer = req.file.buffer
       const mimetype = req.file.mimetype
       //PROCESS IMAGE
       
    //  const images=fileName+  "_450"
    //  const imagem=fileName+  "_600"
    //  const imagel=fileName+  "_900"

       
       //save to s3
       const s3Result = await s3.uploadImage(fileBuffer, fileName, mimetype)
       console.log(s3Result);
       //save to db
     const result = await addImage(fileName,description)
     res.send(result)

     // res.redirect("/");
    }catch (error) {
        console.error(error)
        res.sendStatus(500)
      }
//    res.send("hellooo")
  })
 

// app.get("/api/images/:id/delete", async(req, res) => {
//   const id = +req.params.id
// console.log(id);
//   try{
// await deleteImage(id)
// res.redirect("/api/images")
// } catch (error) {
//   console.error(error)
//   res.sendStatus(500)
// }
// })
app.delete("/api/images/:id", async (req, res) => {
  const id = +req.params.id
  console.log(id);
  const image = await getImage(id) 
console.log(image);
 
await s3.deleteImageFile(image.file_name)
  try{
    const result = await deleteImage(id)
    res.send(result)
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
})
// After all other routes
app.get('*', (req, res) => {
  //res.sendFile('dist/index.html');
  res.sendFile('dist/index.html', { root: '.' });

});
const port = 8080
app.listen(port, () => console.log(`listening on port ${port}`))