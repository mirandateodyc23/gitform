var express = require('express');
var router = express.Router();
var fs = require('fs');


function jsonReader(filePath, cb) {
  fs.readFile(filePath, (err, fileData) => {
      if (err) {
          return cb && cb(err)
      }
      try {
          const object = JSON.parse(fileData)
          return cb && cb(null, object)
      } catch(err) {
          return cb && cb(err)
      }
  })
}


/* GET home page. */
router.get('/', function(req, res) {
  var empdata = [];
  jsonReader('./data.json', (err, emp) => {
    if (err) {
        console.log(err)
        return
    }
      empdata = emp;
      res.render('emp_att', {
        title: 'Employee Form',
        data: empdata
       });
      
  });

});

router.post('/save_emp', function(req, res) {

  var filePath = "./data.json";
  var empdata = [];
  var postdata = JSON.parse(JSON.stringify(req.body));

  if(postdata.emp_id_new.length > 0){
    postdata.emp_id = postdata.emp_id_new;
    delete postdata.emp_id_new;
  }

  jsonReader(filePath, (err, employees) => {
    if (err) {
        console.log(err)
        return
    }
    console.log(postdata);
    var exist = false;
    for (var i in employees.employee) {
      var emp = employees.employee[i];
      if(emp.emp_id == postdata.emp_id){
        exist = true;
        emp = postdata;
      }
      empdata.push(emp);

    }

    if(!exist){
      empdata.push(postdata);
    }

    fs.writeFile(filePath, JSON.stringify({employee : empdata}), (err) => {
      if (err) console.log('Error writing file:', err)
    })
    res.send({result: empdata});

  })
   

});

function digit2_format(number) {
  return number < 10 ? ("0" + number) : number;
}


module.exports = router;
