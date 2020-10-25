const e = require('express');
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


/* GET HOME page. */
router.get('/', function(req, res) {
  var empdata = [];
  var result_msg = "";
  
  jsonReader('./data.json', (err, employees) => {
    if (err) {
        return
    }
    // empdata = emp;
    for (var i in employees.employee) {
      var emp = employees.employee[i];
      delete emp.emp_id_new;
      empdata.push(emp);
    }
    
    res.render('emp_att', {
      title: 'Employee Form',
      title2: 'Attendance Format',
      data: empdata,
      result: result_msg
      });
      
  });

});

/* POST HOME page. */
router.post('/', function(req, res) {
  var empdata = [];
  var result_msg = "";
  var postdata = JSON.parse(JSON.stringify(req.body));
  var status = 0;
  var message = "";
  if(postdata.emp_id !== ''){
    status = 1
    message = "Attendance format has successfuly generated."
    var att_msg = [];
    var date_obj = new Date();
    var month = date_obj.getMonth()+ 1;
    var day = date_obj.getUTCDate();
    var year = date_obj.getUTCFullYear();
    var months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
  
    att_msg.push(months[month-1] + " " + day + ", " + year);
    att_msg.push('EMP ID: ' + postdata.emp_id);
    att_msg.push('Name: ' + postdata.emp_name);
    att_msg.push('Time: ' + postdata.emp_shift);
    att_msg.push('Remote location: ' + postdata.emp_loc);
    result_msg = att_msg.join('<br/>');
  } else {
    status = 0;
    message = "Please choose employee first."
  }
  jsonReader('./data.json', (err, employees) => {
    if (err) {
        return
    }
    // empdata = emp;
    for (var i in employees.employee) {
      var emp = employees.employee[i];
      delete emp.emp_id_new;
      empdata.push(emp);
    }
    
    res.render('emp_att', {
      title: 'Employee Form',
      title2: 'Attendance Format',
      data: empdata,
      result: result_msg,
      status : status,
      message: message,
      });
      
  });
      
});

router.post('/save_emp', function(req, res) {

  var filePath = "./data.json";
  var empdata = [];
  var postdata = JSON.parse(JSON.stringify(req.body));

  if(postdata.emp_id_new == '' && postdata.emp_id == ""){
    res.send({result: false});
  } else {
    if(postdata.emp_id_new.length > 0){
      postdata.emp_id = postdata.emp_id_new;
      delete postdata.emp_id_new;
    }
  
    jsonReader(filePath, (err, employees) => {
      if (err) {
          return
      }
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
  }
});

/* GET ATT page. */
router.get('/:ID', function(req, res) {
    var empdata = [];
    var empselected = [];
    var result_msg = "";
    var postdata = JSON.parse(JSON.stringify(req.params));
    var status = 0;
    var message = "";

    jsonReader('./data.json', (err, employees) => {
      if (err) {
          return
      }
      // empdata = emp;
      for (var i in employees.employee) {
        var emp = employees.employee[i];
        if (postdata['ID'] == employees.employee[i].emp_id) {
          empselected.push(emp);
        }
        delete emp.emp_id_new;
        empdata.push(emp);
      }

      if (empselected.length > 0) {
        status = 1
        message = "Attendance format has successfuly generated."
        var att_msg = [];
        var date_obj = new Date();
        var month = date_obj.getMonth()+ 1;
        var day = date_obj.getUTCDate();
        var year = date_obj.getUTCFullYear();
        var months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

        att_msg.push(months[month-1] + " " + day + ", " + year);
        att_msg.push('EMP ID: ' + empselected[0].emp_id);
        att_msg.push('Name: ' + empselected[0].emp_name);
        att_msg.push('Time: ' + empselected[0].emp_shift);
        att_msg.push('Remote location: ' + empselected[0].emp_loc);
        result_msg = att_msg.join('<br/>');
      }
      
      res.render('emp_att', {
        title: 'Employee Form',
        title2: 'Attendance Format',
        data: empdata,
        result: result_msg,
        status : status,
        message: message,
      });
        
    });
        
  });


function digit2_format(number) {
  return number < 10 ? ("0" + number) : number;
}


module.exports = router;
