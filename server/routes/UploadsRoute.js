const express = require('express');
const fileUpload = require('express-fileupload');
const Employee = require('../models/EmployeeModel');
const path = require('path');
const fs = require('fs');
const app = express();

// default options
app.use(fileUpload());

app.put('/upload/images/:id', function(req, res) {
  // variables
  let id = req.params.id;


  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
   // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
 let sampleFile  = req.files.photo;
 let ArchiveExtensions = sampleFile.name.split('.');
 let extensions = ArchiveExtensions[ArchiveExtensions.length -1];


 // valid extensions
 let ValidExtensions = ['jpg', 'png', 'gif', 'jpeg'];

  if(ValidExtensions.indexOf(extensions) < 0){
      return res.status(400).json({
        ok: false,
        message: 'error valids extesions: ' + ValidExtensions.join(', '),
        ext: extensions
      });
  }

  let ArchiveName = `${id}.${new Date().getMilliseconds()}.${extensions}`;


  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(`public/uploads/${ArchiveName}`, function(err) {
    if (err){
      deleteArchive(ArchiveName);
      return res.status(500).json(err);
    }

    // upload image
    Employee.findById(id, (err, ImageDB) => {
      if(err){
        return res.status(500).json({
        ok: false,
        err
      });  
      }

      if(!ImageDB){
      deleteArchive(ArchiveName);
      return res.status(400).json({
        ok: false,
        message: 'Image no exist'
      })
      }

      // save image
      ImageDB.image  = ArchiveName;
      ImageDB.save((err, Image) => {
      res.json({
        ok: true, 
        image: Image,
        url:  ImageDB.image
      });
      })
    });
  });
});



function deleteArchive(nameArchive){
  let ImagePath = path.resolve(__dirname, `../public/uploads/${nameArchive}`);
  console.log(ImagePath);
  if(fs.existsSync(ImagePath)){
   fs.unlinkSync(ImagePath); 
  }
}




module.exports = app;