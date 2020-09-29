var express = require('express');
var router = express.Router();
var { check, validationResult } = require('express-validator');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Gitflow Form' });
});

/* POST data and process */
router.post('/process', 
[
  check('tic-no-0', 'tic-no-1', 'tic-no-2')
    .isLength({ min: 1 })
    .withMessage('Please enter a Ticket #'),
  check('tic-title-0','tic-title-1','tic-title-2')
    .isLength({ min: 1 })
    .withMessage('Please enter a title'),
  check('cp-no-0','cp-no-1','cp-no-2')
    .isLength({ min: 1 })
    .withMessage('Please enter a CP'),
  check('proj-type-0','proj-type-1','proj-type-2')
    .isLength({ min: 1 })
    .withMessage('Please enter a Project Type'),
  check('requestor-0','requestor-1','requestor-2')
    .isLength({ min: 1 })
    .withMessage('Please enter a Requestor'),
],
function(req, res, next) {
  var errors = validationResult(req);
  var postdata = JSON.parse(JSON.stringify(req.body));
  if (errors.isEmpty()) {

      var resultdata = {
        notification: [],
        gitformat: []
      }
      var date_obj = new Date();
      var month = digit2_format(date_obj.getMonth()+ 1);
      var day = digit2_format(date_obj.getUTCDate());
      var year = date_obj.getUTCFullYear();
      var gitarr = {
        fst: [],
        snd: [],
        trd: [],
        fth: [],
        ffh: [],
      };

      for (key in postdata) {
        var splarr = key.split('-');
        var field = key.replace("-" + splarr[splarr.length - 1], "");
        var data_arr = field;

        if(splarr[splarr.length - 1] == 0){
          gitarr.fst.push({label : field, value : postdata[key]});
        } else if(splarr[splarr.length - 1] == 1) {
          gitarr.snd.push({label : field, value : postdata[key]});
        } else if(splarr[splarr.length - 1] == 2) {
          gitarr.trd.push({label : field, value : postdata[key]});
        } else if(splarr[splarr.length - 1] == 3) {
          gitarr.fth.push({label : field, value : postdata[key]});
        } else if(splarr[key.length - 1] == 4) {
          gitarr.ffh.push({label : field, value : postdata[key]});
        }
        
      };
     
      var date_format = year + "" + month + "" + "" + day;
      
      var ticket, ticket1, ticket2, ticket3, ticket4, ticket5 = "";
      var title, title1, title2, title3, title4, title5 = "";
      var cp, cp1, cp2, cp3, cp4, cp5 = "";
      var project, project1, project2, project3, project4, project5 = "";
      var requestor, requestor1, requestor2, requestor3, requestor4, requestor5 = "";

      if (gitarr.fst.length > 0 && gitarr.snd.length == 0 && gitarr.trd.length == 0 && gitarr.fth.length == 0 && gitarr.ffh.length == 0) {
          gitarr.fst.forEach(element => {
            if (element.label == 'tic-no'){
              ticket = element.value;
            } else if(element.label == 'tic-title'){
              title =  element.value;
            } else if(element.label == 'cp-no'){
              cp =  element.value;
            } else if(element.label == 'proj-type'){
              project =  element.value;
            } else if(element.label == 'requestor'){
              requestor =  element.value;
            }
          });
          resultdata.notification['develop'] = "Hi All," + "<br/>" + "I will merge #" + ticket + "(" + cp + ") to origin/develop (" + project + ").<br/> Thank you";
          resultdata.notification['master'] = "Hi All," + "<br/>" + "I will merge #" + ticket + "(" + cp + ") to origin/master (" + project + ").<br/> Thank you";
          resultdata.notification['go-live'] = "(bell) " + project  + " (bell) Live Notification:  " + "<br/>" + "#" + ticket + "#" + cp + ": " + title + " // requested by " + requestor;
          
          resultdata.gitformat['develop-commit-msg'] = "#" + ticket + "(" + cp + ") " + title;
          resultdata.gitformat['master-commit-msg'] = ticket + " " + cp + " " + title;
          resultdata.gitformat['master-release-tag'] = "v" + date_format +"_#" + ticket + "#" + cp ;
      
      } else if(gitarr.fst.length > 0 && gitarr.snd.length > 0 && gitarr.trd.length == 0 && gitarr.fth.length == 0 && gitarr.ffh.length == 0) {

          gitarr.fst.forEach(element => {
            if (element.label == 'tic-no'){
              ticket = element.value;
            } else if(element.label == 'tic-title'){
              title =  element.value;
            } else if(element.label == 'cp-no'){
              cp =  element.value;
            } else if(element.label == 'proj-type'){
              project =  element.value;
            } else if(element.label == 'requestor'){
              requestor =  element.value;
            }
          });

          gitarr.snd.forEach(element => {
            if (element.label == 'tic-no'){
              ticket2 = element.value;
            } else if(element.label == 'tic-title'){
              title2 =  element.value;
            } else if(element.label == 'cp-no'){
              cp2 =  element.value;
            } else if(element.label == 'proj-type'){
              project2 =  element.value;
            } else if(element.label == 'requestor'){
              requestor2 =  element.value;
            }
          });

          resultdata.notification['develop'] = "Hi All," + "<br/>" + "I will merge #" + ticket + "(" + cp + ") to origin/develop (" + project + ").<br/> Thank you";
          
          resultdata.notification['develop-2'] = "Hi All," + "<br/>" + "I will merge #" + ticket2 + "(" + cp2 + ") to origin/develop (" + project2 + ").<br/> Thank you";

          if(project == project2){
            resultdata.notification['master'] = "Hi All," + "<br/>" + "I will merge #" + ticket + "#" + ticket2 + " to origin/master (" + project + ").<br/> Thank you";
            resultdata.notification['go-live'] = "(bell) " + project  + " (bell) Live Notification:  " + "<br/>" + "#" + ticket + "(#" + cp + ") " + title + " // requested by " + requestor +
                                                                                                         "<br/>" + "#" + ticket2 + "(#" + cp2 + ") " + title2 + " // requested by " + requestor2;
            resultdata.gitformat['develop-commit-msg'] = "#" + ticket + "(" + cp + ") " + title + 
                                                    "<br/>#" + ticket2 + "(" + cp2 + ") " + title2;
            resultdata.gitformat['master-commit-msg'] = ticket + "(" + cp + ") " + title + 
                                                    "<br/>" + ticket2 + "(" + cp2 + ") " + title2;
            resultdata.gitformat['master-release-tag'] = "v" + date_format +"_#" + ticket + "#" + ticket2 + "#" + cp + " " + title;
          } else {
            resultdata.notification['master'] = "Hi All," + "<br/>" + "I will merge #" + ticket + "(" + cp + ") to origin/master (" + project + ").<br/> Thank you";
            resultdata.notification['master-2'] = "Hi All," + "<br/>" + "I will merge #" + ticket2 + "(" + cp2 + ") to origin/master (" + project2 + ").<br/> Thank you";          
            resultdata.notification['go-live'] = "(bell) " + project  + " (bell) Live Notification:  " + "<br/>" + "#" + ticket + "(#" + cp + ") " + title + " // requested by " + requestor +
                                                 "<br/>(bell) " + project2  + " (bell) Live Notification:  " + "<br/>" + "#" + ticket2 + "(#" + cp2 + ") " + title2 + " // requested by " + requestor2;
            resultdata.gitformat['develop-commit-msg'] = "#" + ticket + "(" + cp + ") " + title;
            resultdata.gitformat['develop-commit-msg-2'] = "#" + ticket2 + "(" + cp2 + ") " + title2;

            resultdata.gitformat['master-commit-msg'] = ticket + " " + cp + " " + title;
            resultdata.gitformat['master-commit-msg-2'] = ticket2 + " " + cp2 + " " + title2;

            resultdata.gitformat['master-release-tag'] = "v" + date_format +"_#" + ticket +  "#" + cp ;
            resultdata.gitformat['master-release-tag-2'] = "v" + date_format +"_#" + ticket2 + "#" + cp2;
          }

      }
      console.log(resultdata);

      res.render('index', {
        title: 'Gitflow Form',
        errors: errors.array(),
        data: postdata,
        result: resultdata,
        status : 1,
        message: 'Gitflow format has successfuly generated.'
      });


  } else {    
    res.render('index', {
      title: 'Gitflow Form',
      errors: errors.array(),
      data: postdata,
      result: {},
      status : 0,
      message: 'Gitflow format has not successfuly generated. Please see error below.'
    });
    
  }
 
});

function digit2_format(number) {
  return number < 10 ? ("0" + number) : number;
}


module.exports = router;
