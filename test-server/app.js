var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var pgp = require('pg-promise')({});
var cors = require('cors');
var https = require('https');
var fs = require('fs');
var crypto = require('crypto');

pgp.pg.types.setTypeParser(1114, function (stringValue) {
  return stringValue;
});

function now() {
  let curdate = new Date();
  return curdate.getTime() + curdate.getTimezoneOffset() * 60000;
}

var app = express();

var db = pgp({ host: '*', port: 5432, database: '*', user: '*', password: '*' });

var corsOptions = {
  origin: (origin, callback) => {
    callback(null, true);
  }
}

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'web-build')));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug')
app.set('views', './views')
app.post('/test_info', (req, res) => {
  let { passcode } = req.body;
  if (passcode)
    db.tx(async (con) => {
      var result = {};
      result.runtest_can = await con.oneOrNone("SELECT * FROM runtest_can WHERE pswd=${passcode};", { passcode });
      if (result.runtest_can) {
        result.user_details = await con.one("SELECT * FROM user_details WHERE id=${can_id};", result.runtest_can);
        result.test_pub = await con.one("SELECT * FROM test_pub WHERE id=${test_pub_id};", result.runtest_can);
        result.test = await con.one("SELECT * FROM test WHERE id=${test_id};", result.test_pub);
        result.program = await con.oneOrNone("SELECT * FROM program WHERE id=${cat_id};", result.test);
        result.course = await con.oneOrNone("SELECT * FROM pro_course WHERE id=${scat_id};", result.test);
        result.sections = await con.many("SELECT * FROM section WHERE test_id=${id};", result.test);
        for (section in result.sections) {
          result.sections[section] = {
            ...result.sections[section], ...await con.one("SELECT COUNT(id) FROM section_question_map WHERE section_id=${id};", result.sections[section])
          }
        }
      }
      return result;
    })
      .then((result) => res.status(200).send(result))
      .catch((err) => {
        res.status(500).send(err);
        console.log(err);
      });
  else res.status(400).send({ message: "Required field: passcode" });
});

function now() {
  let curdate = new Date();
  return curdate.getTime() + curdate.getTimezoneOffset() * 60000;
}

app.post('/start_test', (req, res) => {
  let { passcode } = req.body;
  if (passcode)
    db.tx(async (con) => {
      var result = {};
      result.runtest_can = await con.oneOrNone("SELECT * FROM runtest_can WHERE pswd=${passcode} AND NOT test_start_flag;", { passcode });
      if (result.runtest_can) {
        result.test_pub = await con.one("SELECT * FROM test_pub WHERE id=${test_pub_id};", result.runtest_can);
        result.test = await con.one("SELECT * FROM test WHERE id=${test_id};", result.test_pub);
        if (result.test_pub.publish_type == 1 || (new Date(result.test_pub.test_start_dttm).getTime() < now() && (new Date(result.test_pub.test_end_dttm).getTime() > now()))) {
          if (result.test_pub.publish_type == 2) {
            let run_test_can_update = result.runtest_can;
            run_test_can_update.test_start_dttm = result.test_pub.start_datetm;
            run_test_can_update.test_end_dttm = result.test_pub.end_datetm;
            await con.none("UPDATE runtest_can SET test_start_flag=TRUE,test_start_dttm=${test_start_dttm},test_end_dttm=${test_end_dttm},present_ques_id=0 WHERE id=${id};", run_test_can_update);
          }
          else {
            await con.none("UPDATE runtest_can SET test_start_flag=TRUE,test_start_dttm=now(),test_end_dttm=now()+interval ${duration},present_ques_id=0 WHERE id=${id};", { id: result.runtest_can.id, duration: result.test.duration + " minutes" });
          }
          result.sections = await con.many("SELECT * FROM section WHERE test_id=${id};", result.test);
          for (section_index in result.sections) {
            let questions = await con.many("SELECT * FROM section_question_map JOIN questions ON section_question_map.ques_id=questions.id WHERE section_question_map.section_id=${id} " + (result.runtest_can.random_flag ? "ORDER BY random();" : ";"), result.sections[section_index]);
            let questions_updates = "";
            for (question_index in questions) {
              questions_updates += pgp.as.format("INSERT INTO run_test (test_pub_id,start_dttm,end_dttm,sec_id,ques_id,runtest_can_id,type_id,time_taken,marks,ans_body,remarks,status,ans_status) VALUES (${test_pub_id},null,null,${section_id},${ques_id},${runtest_can_id},${type_id},null,${marks},null,null,0,0) RETURNING ques_id,id;\n", { test_pub_id: result.test_pub.id, section_id: result.sections[section_index].id, ques_id: questions[question_index].id, marks: questions[question_index].marks, runtest_can_id: result.runtest_can.id, type_id: questions[question_index].type_id })
            }
            let run_tests = await con.multi(questions_updates);
            let options_updates = "";
            for (run_test_index in run_tests) {
              let options = await con.manyOrNone("SELECT * FROM options WHERE ques_id=${ques_id};", run_tests[run_test_index][0]);
              for (option_index in options) {
                options_updates += pgp.as.format("INSERT INTO run_test_option (run_test_id,option_id,status,ans_status,marks,answer_body) VALUES (${run_test_id},${option_id},false,false,0,null);\n", { run_test_id: run_tests[run_test_index][0].id, option_id: options[option_index].id });
              }
            }
            await con.multi(options_updates);
          }
          return { success: true };

        }
        else return { message: "Test time over!" };
      }
      else return { message: "Test doesn't exist or already started!" };
    })
      .then((result) => res.status(200).send(result))
      .catch((err) => {
        res.status(500).send(err);
        console.log(err);
      });
  else res.status(400).send({ message: "Required field: passcode" });
});

app.post('/run_test', (req, res) => {
  let { passcode } = req.body;
  if (passcode)
    db.tx(async (con) => {
      var result = {};
      result.runtest_can = await con.oneOrNone("UPDATE runtest_can SET entry_date_time=now() WHERE pswd=${passcode} AND test_start_flag RETURNING *;", { passcode });
      if (result.runtest_can) {
        result.test_pub = await con.one("SELECT * FROM test_pub WHERE id=${test_pub_id};", result.runtest_can);
        result.test = await con.one("SELECT * FROM test WHERE id=${test_id};", result.test_pub);
        if ((new Date(result.runtest_can.test_start_dttm).getTime() < now() && (new Date(result.runtest_can.test_end_dttm).getTime() > now()))) {
          result.questions = await con.many("SELECT run_test.*,questions.qbody,questions.hints,questions.multi_select,questions.tolerance,questions.qdecimal,questions.difficulty_level FROM run_test JOIN questions ON run_test.ques_id=questions.id WHERE runtest_can_id=${id};", result.runtest_can);
          for (question_index in result.questions) {
            result.questions[question_index].options = await con.manyOrNone("SELECT run_test_option.*,options.body,options.op_order,options.pos FROM run_test_option JOIN options ON run_test_option.option_id=options.id WHERE run_test_id=${id};", result.questions[question_index]);
            if (result.questions[question_index].options && result.questions[question_index].type_id == 2) {
              result.questions[question_index].selected_option = 0;
              result.questions[question_index].options.forEach(option => {
                if (option.status) {
                  result.questions[question_index].selected_option = option.id
                }
              })
            }
            else if (result.questions[question_index].options && result.questions[question_index].type_id == 3) {
              result.questions[question_index].selected_options = [];
              result.questions[question_index].options.forEach(option => {
                if (option.status) {
                  result.questions[question_index].selected_options.push(option.id)
                }
              })
            }
          }
          return { success: true, ...result };

        }
        else return { message: "Test time over!" };
      }
      else return { message: "Test doesn't exist or not started!" };
    })
      .then((result) => res.status(200).send(result))
      .catch((err) => {
        res.status(500).send(err);
        console.log(err);
      });
  else res.status(400).send({ message: "Required field: passcode" });
});

app.post('/save_answer', (req, res) => {
  let { passcode, run_test_id, run_test_option_id, answer_body, run_test_option_ids, present_ques_id } = req.body;
  if (passcode && run_test_id && present_ques_id !== null)
    db.tx(async (con) => {
      var result = {};
      result.runtest_can = await con.oneOrNone("UPDATE runtest_can SET present_ques_id=${present_ques_id} WHERE pswd=${passcode} AND test_start_flag RETURNING *;", { passcode, present_ques_id });
      if (result.runtest_can) {
        if ((new Date(result.runtest_can.test_start_dttm).getTime() < now() && (new Date(result.runtest_can.test_end_dttm).getTime() + 30000 > now()))) {
          result.run_test = await con.oneOrNone("SELECT * FROM run_test WHERE runtest_can_id=${runtest_can_id} AND id=${run_test_id};", { runtest_can_id: result.runtest_can.id, run_test_id });
          if (result.run_test) {
            if (result.run_test.type_id == 2) {
              await con.multi("UPDATE run_test SET status=${status} WHERE id=${run_test_id};\n"
                + "UPDATE run_test_option SET status=FALSE WHERE run_test_id=${run_test_id};\n"
                + (run_test_option_id ? "UPDATE run_test_option SET status=TRUE WHERE id=${run_test_option_id};" : ""), { run_test_id, run_test_option_id, status: run_test_option_id ? 1 : 0 });
              return { success: true };
            }
            if (result.run_test.type_id == 3) {
              await con.multi("UPDATE run_test SET status=${status} WHERE id=${run_test_id};\n"
                + "UPDATE run_test_option SET status=FALSE WHERE run_test_id=${run_test_id};\n"
                + (run_test_option_ids ? run_test_option_ids.map(option_id => pgp.as.format("UPDATE run_test_option SET status=TRUE WHERE id=${option_id};", { option_id })).join("\n") : ""), { run_test_id, status: run_test_option_ids.length > 0 ? 1 : 0 });
              return { success: true };
            }
            else {
              await con.none("UPDATE run_test SET ans_body=${answer_body}, status=${status} WHERE id=${run_test_id};", { run_test_id, answer_body, status: answer_body ? 1 : 0 });
              return { success: true };
            }
          }
          else return { message: "No such question found!" };
        }
        else return { message: "Test time over!" };
      }
      else return { message: "Test doesn't exist or not started!" };
    })
      .then((result) => res.status(200).send(result))
      .catch((err) => {
        res.status(500).send(err);
        console.log(err);
      });
  else res.status(400).send({ message: "Required field: passcode, run_test_id, present_ques_id; Optional field: run_test_option_id,answer_body,run_test_option_ids" });
});

app.post('/finish_test', (req, res) => {
  let { passcode } = req.body;
  if (passcode)
    db.tx(async (con) => {
      var result = {};
      result.runtest_can = await con.oneOrNone("UPDATE runtest_can SET present_ques_id=0 WHERE pswd=${passcode} AND test_start_flag RETURNING *;", { passcode });
      if (result.runtest_can) {
        if ((new Date(result.runtest_can.test_start_dttm).getTime() < now() && (new Date(result.runtest_can.test_end_dttm).getTime() + 35000 > now()))) {
          await con.query("UPDATE runtest_can SET test_end_flag=TRUE WHERE id=${id};", result.runtest_can);
          return { message: "Test ended.", success: true };
        }
        else return { message: "Test time over!" };
      }
      else return { message: "Test doesn't exist or not started!" };
    })
      .then((result) => res.status(200).send(result))
      .catch((err) => {
        res.status(500).send(err);
        console.log(err);
      });
  else res.status(400).send({ message: "Required field: passcode" });
});

app.post('/add_can', (req, res) => {
  let { can_fname, can_lname, can_phone, can_email, program_code, test_id, user_email } = req.body;
  if (can_fname && can_lname && can_phone && can_email && program_code && test_id && user_email)
    db.tx(async (con) => {
      var result = {};
      result.user = await con.oneOrNone("SELECT id from user_details WHERE email=${user_email};", { user_email });
      if (result.user) {
        result.program = await con.oneOrNone("SELECT id,title FROM program WHERE code=${program_code} and user_id=${user_id};", { program_code, user_id: result.user.id });
        if (result.program) {
          result.test_pub = await con.manyOrNone("SELECT id FROM test_pub WHERE test_id=${test_id} AND user_id=${user_id};", { test_id, user_id: result.user.id });
          if (result.test_pub) {
            result.can = await con.oneOrNone("SELECT id from user_details WHERE email=${can_email};", { can_email });
            if (!result.can) {
              result.can = await con.one("INSERT INTO user_details (first_name,last_name,email,phone) VALUES (${can_fname},${can_lname},${can_email},${can_phone}) RETURNING id;", { can_fname, can_lname, can_email, can_phone })
              await con.one("INSERT INTO user_details (first_name,last_name,email,phone,password,type,user_id) VALUES (${can_fname},${can_lname},${can_email},${can_phone},${password},${type},${user_id}) RETURNING id;", { can_fname, can_lname, can_email, can_phone, type: "student", password: crypto.createHash('md5').update(can_phone).digest('hex'), user_id: result.can.id })
            }
            result.pro_users_role = await con.manyOrNone("SELECT id FROM pro_users_role WHERE user_id=${user_id} AND program_id=${program_id};", { user_id: result.can.id, program_id: result.program.id });
            if (!result.pro_users_role) {
              await con.one("INSERT INTO pro_users_role (user_id, program_id,role) VALUES(${user_id},${program_id},'Student');", { user_id: result.can.id, program_id: result.program.id });
            }
            result.adm_can_apply = await con.manyOrNone("SELECT sl FROM adm_can_apply WHERE cand_id=${user_id} AND prog_id=${program_id};", { user_id: result.can.id, program_id: result.program.id });
            if (!result.adm_can_apply) {
              await con.one("INSERT INTO adm_can_apply (cand_id, prog_id) VALUES(${user_id},${program_id})", { user_id: result.can.id, program_id: result.program.id });
            }
            result.runtest_can = await con.one("INSERT INTO runtest_can (can_id,test_pub_id,pswd) VALUES(${can_id},${test_pub_id},${pswd}) RETURNING pswd,id;", { can_id: result.can.id, test_pub_id: result.test_pub[0].id, pswd: Math.ceil(Math.random() * 899999 + 100000) });
            return { success: true, ...result.runtest_can };
          }
          else return { success: false, message: "The test is either not available or missing.", devHint: "Check if the test_id is valid and, whether the test is published and owned by the user bearing user_email." };
        }
        else return { success: false, message: "Program code is invalid.", devHint: "Re-check if the program_code is correct and is owned by the user bearing user_email." };
      }
      else return { success: false, message: "No such user found.", devHint: "Re-check if the user_email is correct." };
    })
      .then((result) => res.status(200).send(result))
      .catch((err) => {
        res.status(500).send({ success: false, message: "Internal error occurred.", devHint: "Contact administrator." });
        console.log(err);
      });
  else res.status(400).send({ success: false, message: "Required fields: can_fname, can_lname, can_phone, can_email, program_code, test_id, user_email" });
});


app.get('/report/:passcode', (req, res) => {
  let { passcode } = req.params;
  if (passcode)
    db.tx(async (con) => {
      var result = {};
      result.runtest_can = await con.oneOrNone("SELECT * FROM runtest_can WHERE pswd=${passcode} AND test_start_flag;", { passcode });
      if (result.runtest_can && (new Date(result.runtest_can.test_end_dttm).getTime() + 35000 < now())) {
        result.user_details = await con.one("SELECT * FROM user_details WHERE id=${can_id};", result.runtest_can);
        result.test_pub = await con.one("SELECT * FROM test_pub WHERE id=${test_pub_id};", result.runtest_can);
        result.test = await con.one("SELECT * FROM test WHERE id=${test_id};", result.test_pub);
        result.program = await con.oneOrNone("SELECT * FROM program WHERE id=${cat_id};", result.test);
        result.course = await con.oneOrNone("SELECT * FROM pro_course WHERE id=${scat_id};", result.test);
        result.sections = await con.many("SELECT * FROM section WHERE test_id=${id};", result.test);
        result.total_questions = 0;
        result.total_questions_attempted = 0;
        result.total_marks = 0;
        result.total_marks_obtained = 0;
        result.section_performances = [["Section name", "Total Marks Obtained"]]
        for (section_index in result.sections) {
          result.sections[section_index].questions = await con.many("SELECT run_test.*,questions.* FROM run_test JOIN questions ON run_test.ques_id=questions.id WHERE sec_id=${section_id} AND runtest_can_id=${runtest_can_id};", { runtest_can_id: result.runtest_can.id, section_id: result.sections[section_index].id });
          result.sections[section_index].total_questions = result.sections[section_index].questions.length;
          result.sections[section_index].total_questions_attempted = 0;
          result.sections[section_index].total_marks = 0;
          result.sections[section_index].total_marks_obtained = 0;
          for (question_index in result.sections[section_index].questions) {
            result.sections[section_index].total_marks += parseInt(result.sections[section_index].questions[question_index].marks);
            result.sections[section_index].questions[question_index].options = await con.manyOrNone("SELECT run_test_option.*,options.* FROM run_test_option JOIN options ON run_test_option.option_id=options.id WHERE ques_id=${id};", result.sections[section_index].questions[question_index]);
            if (result.sections[section_index].questions[question_index].options) {
              result.sections[section_index].questions[question_index].attempted = false;
              result.sections[section_index].questions[question_index].obtained_marks = 0;
              result.sections[section_index].questions[question_index].options.forEach((option, option_index) => {
                if (option.status) {
                  result.sections[section_index].questions[question_index].attempted = true;
                  if (result.sections[section_index].questions[question_index].type_id == 2 && option.correct_flag) result.sections[section_index].questions[question_index].obtained_marks += parseInt(result.sections[section_index].questions[question_index].marks);
                  else result.sections[section_index].questions[question_index].obtained_marks += parseFloat(result.sections[section_index].questions[question_index].marks) * parseFloat(option.weightage) / 100;
                }
              })
              result.sections[section_index].total_marks_obtained += result.sections[section_index].questions[question_index].obtained_marks;
              if (result.sections[section_index].questions[question_index].attempted) result.sections[section_index].total_questions_attempted++;
            }
          }
          result.total_questions += result.sections[section_index].total_questions;
          result.total_questions_attempted += result.sections[section_index].total_questions_attempted;
          result.total_marks += result.sections[section_index].total_marks;
          result.total_marks_obtained += result.sections[section_index].total_marks_obtained;
          result.sections[section_index].percentage = 100.0 * result.sections[section_index].total_marks_obtained / result.sections[section_index].total_marks;
          result.section_performances.push([result.sections[section_index].section_name, result.sections[section_index].total_marks_obtained])

        }
        result.percentage = 100.0 * result.total_marks_obtained / result.total_marks;
        return result;
      }
      else return { message: "Test doesn't exist, not attempted or hasn't ended yet!" };
    })
      .then((result) => result.message ? res.status(400).send(result.message) : res.render("report", result))
      .catch((err) => {
        res.status(500).send(err);
        console.log(err);
      });
  else res.status(400).send({ message: "Please use the path to be /report/<passcode>/" });
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.sendStatus(err.status || 500);
});

app.listen(8080);

// app.listen(3000);

module.exports = app;
