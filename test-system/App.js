import * as React from 'react';
import { AppRegistry, Platform, StyleSheet, View, Image, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import HTMLView from 'react-native-htmlview';
import { Avatar, Button, DefaultTheme, Text, Modal, Portal, Provider as PaperProvider, Snackbar, TextInput, ActivityIndicator, Appbar, Surface, Title, Caption, Subheading, Paragraph, RadioButton, Checkbox } from 'react-native-paper';
import { name as appName } from './app.json';
import magnox_logo from './assets/logo.png';

const API_URI = "localhost:3000";

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    placeholder: "#42c5f5", primary: "#42c5f5",
    surface: "#42c5f5",
    accent: '#f1c40f',
  },
};

const styles = Platform.select({
  web: StyleSheet.create({
    login: {
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      flex: 1
    },
    loginPasscodeContainer: {
      paddingLeft: 50,
      paddingRight: 50,
      paddingTop: 250,
      flexDirection: "column",
      justifyContent: "center",
      flex: 1,
      width: 640
    },
    loginButton: {
      marginTop: 10
    },
    loginButtonContent: {
      height: 50
    },
    loginButtonText: {
      color: "#ffffff"
    },
    loginLogo: {
      width: 250,
      height: 250,
      resizeMode: "contain"
    },
    loginLogoContainer: {
      alignItems: "center"
    },
    error: {
      flexDirection: "row",
      backgroundColor: "#f00",
      width: 640,
      alignSelf: "center"
    },
    errorText: {
      color: "#fff",
      flex: 1
    },
    testLogo: {
      width: 240,
      height: 100,
      resizeMode: "cover"
    },
    test: {
      flexDirection: "column",
      flex: 1
    },
    testContainer: {
      flexDirection: "row"
    },
    testCanDetails: {
      margin: 10,
      flex: 1,
      padding: 10
    },
    testDetails: {
      margin: 10,
      flex: 2,
      padding: 10
    },
    top: {
      backgroundColor: "#efefef",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 5
    },
    topLogo: {
      alignItems: "center",
      flexDirection: "row",
      flex: 1,
    },
    testSections: {
      flexDirection: "row",
      alignSelf: "stretch",
      backgroundColor: "#ffffe0",
      margin: 10
    },
    testSection: {
      margin: 10
    },
    testInstructions: {
      alignSelf: "stretch",
      backgroundColor: "#e0ffef",
      alignContent: "stretch",
      margin: 10,
      padding: 5
    },
    testTitle: {
      textAlign: "center",
    },
    testInfo: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      margin: 10,
      backgroundColor: "#e0efff"
    },
    testEntry: {
      alignItems: "center",
      padding: 10,
      margin: 10
    },
    runTestContainer: {
      flex: 1,
      flexDirection: "row",
    },
    question: {
      alignSelf: "flex-start",
      padding: 50,
      flex: 3,
      margin: 10,
      fontSize: 25
    },
    questionT1: {
      padding: 20
    },
    questionT2: {
      padding: 20
    },
    questionT3: {
      padding: 20
    },
    runTestControls: {
      backgroundColor: "#efefef",
      flexDirection: "row",
      justifyContent: "space-evenly",
      padding: 10
    },
    runTestQIndicesContainer: {
      backgroundColor: "#e0efff",
      margin: 10,
      flex: 1
    },
    runTestQIndices: {
      padding: 10,
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between"
    }
  }),
  default: StyleSheet.create({
    login: {
      flexDirection: "column",
      alignItems: "stretch",
      justifyContent: "center",
      flex: 1
    },
    loginPasscodeContainer: {
      paddingLeft: 50,
      paddingRight: 50,
      paddingTop: 250,
      flexDirection: "column",
      justifyContent: "center",
      flex: 1
    },
    loginButton: {
      marginTop: 10,
      zIndex: 3,
      elevation: 3
    },
    loginButtonContent: {
      height: 50
    },
    loginButtonText: {
      color: "#ffffff"
    },
    loginLogo: {
      width: 250,
      height: 250,
      resizeMode: "contain"
    },
    loginLogoContainer: {
      alignItems: "center"
    },
    error: {
      flexDirection: "row",
      backgroundColor: "#f00",
    },
    errorText: {
      color: "#fff",
      flex: 1
    },
    testLogo: {
      width: 240,
      height: 100,
      resizeMode: "cover"
    },
    test: {
      flexDirection: "column",
      flex: 1
    },
    testCanDetails: {
      margin: 10
    },
    testDetails: {
      margin: 10,
      padding: 10
    },
    top: {
      backgroundColor: "#efefef",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 5
    },
    testSections: {
      flexDirection: "row",
      alignSelf: "stretch",
      backgroundColor: "#ffffe0",
      margin: 10
    },
    testSection: {
      margin: 10
    },
    testInstructions: {
      backgroundColor: "#e0ffef",
      margin: 10,
      padding: 5
    },
    testTitle: {
      textAlign: "center",
    },
    testInfo: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      margin: 10,
      backgroundColor: "#e0efff"
    },
    testEntry: {
      alignItems: "center",
      padding: 10,
      margin: 10
    },
    runTestContainer: {
      flex: 1,
    },
    question: {
      alignSelf: "flex-start",
      margin: 10,
      fontSize: 25
    },
    questionT1: {
      padding: 20
    },
    questionT2: {
      padding: 20
    },
    questionT3: {
      padding: 20
    },
    runTestControls: {
      backgroundColor: "#efefef",
      flexDirection: "row",
      justifyContent: "space-evenly",
      padding: 10
    },
    runTestQIndicesContainer: {
      backgroundColor: "#e0efff",
      margin: 10
    },
    runTestQIndices: {
      padding: 10,
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between"
    }
  })
});

export default class Main extends React.Component {
  constructor(props) {
    super(props);

    this._state = {
      login: {
        passcode: "",
      },
      test: { "runtest_can": { "id": 14, "test_pub_id": "8", "can_id": "60", "pswd": "279684", "test_start_flag": true, "test_end_flag": false, "present_ques_id": "119", "create_date_time": "2020-12-15T12:45:59.000Z", "entry_date_time": "2020-12-15T12:22:14.000Z", "sec_id": "6", "test_start_dttm": "2020-12-15T12:22:14.000Z", "test_end_dttm": "2020-12-15T13:22:14.000Z" }, "user_details": { "id": "60", "first_name": "Aniruddha", "last_name": "Sarkar", "photo_sm": null, "photo_lg": null, "dateofbirth": "1998-01-03T18:30:00.000Z", "gender": "M", "maritalstatus": null, "email": "sarkar4540@gmail.com", "alt_email": null, "phone": "7548950804", "alt_phone": null, "bloodgroup": null, "aadhar_no": null, "website": null, "address": null, "pin": null, "facebook_link": null, "linkedin_link": null, "google_link": null, "mothertongue_id": null, "about_me": null, "resume_heading": null, "expected_ctc": null, "caste": null, "physical_challenge": null, "percentage_ph": null, "passport_no": null, "organization": null, "designation": null, "mothers_name": null, "mothers_occupation": null, "created_date_time": "2020-11-28T06:16:45.000Z", "modified_date_time": null, "city_id": null }, "test_pub": { "id": 8, "test_id": "5", "org_id": null, "user_id": "58", "publish_type": "1", "start_datetm": null, "create_date_time": "2020-12-03T14:08:29.000Z", "modified_date_time": null, "end_datetm": null, "testc": null, "tp_archive": false }, "test": { "id": 5, "cat_id": "21", "user_id": "58", "title": "College Test", "details": "<p>Write the Test Carefully <br></p>", "admin_flag": true, "duration": 60, "archive_status": false, "hint_display_status": null, "create_date_time": "2020-12-02T11:24:25.000Z", "modified_date_time": null, "scat_id": "0", "marks": 40, "publish": true }, "program": { "id": 21, "code": "TEST001                                           ", "title": "Nayarozgar", "type": "2                                                                                                   ", "category": "Corporate Program                                                                                   ", "duration": "12                                                                                                  ", "start_date": "2020-11-26T18:30:00.000Z", "end_date": "2021-11-10T18:30:00.000Z", "user_id": "58", "status": "approved                                                                                            ", "total_fee": "                                                                                                    ", "total_credit": "                                                                                                                                                      ", "why_learn": null, "intro_video_link": null, "overview": "", "requirements": null, "curriculam": "", "selection_procedure": "", "program_brochure": null, "contact_info": null, "certificate_sample": null, "statusch_date": "2020-11-27T08:56:16.000Z", "date_added": "2020-11-27T08:13:57.000Z", "last_updated": null, "email": "himadri@cyanberg.com", "mobile": "9901072124", "facebook": null, "linkedin": null, "twitter": null, "student_enroll": 0, "teacher_enroll": 0, "fee_details": null, "banner": null, "lastdate_apply": null, "dtype": "month", "feetype": "Paid" }, "course": null },
      loading: false,
      error: false,
      testEntryTimeLeft: null,
      testEndTimeLeft: null,
      testEnded: false,
      run_test: null,
      runTestIndex: 0
    }
    this.state = this._state;
  }
  get(uri = "", body, cb) {
    this.setState({ loading: true })
    fetch(
      API_URI + "/" + uri,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : "{}" }
    ).then(res => {
      if (res.status == 200) {
        res.json()
          .then(json => {
            if (cb) cb(json);
          })
          .catch(err => {
            this.setState({ ...this.state, error: err.message })
            console.log(err);
          })
      }
      else {
        res.json()
          .then(json => {
            this.setState({ error: json.message });
          })
          .catch(err => {
            this.setState({ error: "Error networking!" })
            console.log(err);
          })
      }
    }).catch(err => {
      this.setState({ error: err.message })
      console.log(err);
    }).finally(() => {
      this.setState({ loading: false });
    });
  }
  getTest() {
    this.get("test_info", { passcode: this.state.login.passcode }, test => {
      if (test.runtest_can) {
        this.setState({ test, error: null, login: null });
        if (test.runtest_can.test_end_dttm) {
          let test_end_dttm = new Date(test.runtest_can.test_end_dttm.replace(" ", "T"));
          var timer = setInterval(() => {
            if (this.state.run_test) {
              clearInterval(timer);
            }
            else if (test_end_dttm.getTime() > this.now()) {
              this.setState({ testEnded: false, testEndTimeLeft: this.timeDiff(test_end_dttm) });
            }
            else {
              this.setState({ testEnded: true })
              clearInterval(timer);
            }
          }, 1000);
        }
      }
      else {
        this.setState({ error: "Invalid passcode" })
      }
    })
  }
  runTest() {
    this.get("run_test", { passcode: this.state.test.runtest_can.pswd }, (run_test) => {
      if (run_test.success) {
        let test_end_dttm = new Date(run_test.runtest_can.test_end_dttm.replace(" ", "T"));
        var timer = setInterval(() => {
          if (test_end_dttm.getTime() > this.now() && this.state.run_test && !this.state.testEnded) {
            this.setState({ testEnded: false, testEndTimeLeft: this.timeDiff(test_end_dttm) });
          }
          else {
            this.setState({ testEnded: true });
            if (this.state.run_test) this.saveAnswerAndFinish();
            clearInterval(timer);
          }
        }, 1000);
        this.setState({ run_test, error: null });
      }
      else this.setState({ error: run_test.message ? run_test.message : "Some error occurred!" });
    });
  }
  saveAnswerAndShow(question_index) {
    this.get("save_answer",
      this.state.run_test.questions[this.state.run_test.runtest_can.present_ques_id].type_id == 2
        ?
        { passcode: this.state.run_test.runtest_can.pswd, run_test_id: this.state.run_test.questions[this.state.run_test.runtest_can.present_ques_id].id, run_test_option_id: this.state.run_test.questions[this.state.run_test.runtest_can.present_ques_id].selected_option, present_ques_id: question_index }
        :
        this.state.run_test.questions[this.state.run_test.runtest_can.present_ques_id].type_id == 3
          ?
          { passcode: this.state.run_test.runtest_can.pswd, run_test_id: this.state.run_test.questions[this.state.run_test.runtest_can.present_ques_id].id, run_test_option_ids: this.state.run_test.questions[this.state.run_test.runtest_can.present_ques_id].selected_options, present_ques_id: question_index }
          :
          { passcode: this.state.run_test.runtest_can.pswd, run_test_id: this.state.run_test.questions[this.state.run_test.runtest_can.present_ques_id].id, answer_body: this.state.run_test.questions[this.state.run_test.runtest_can.present_ques_id].ans_body, present_ques_id: question_index },
      (response) => {
        if (response.success) {
          let run_test = this.state.run_test;
          run_test.runtest_can.present_ques_id = question_index;
          this.setState({ run_test });
        }
        else {
          this.setState({ error: response.message });
        }
      }
    )
  }
  saveAnswerAndFinish() {
    this.get("save_answer",
      this.state.run_test.questions[this.state.run_test.runtest_can.present_ques_id].type_id == 2
        ?
        { passcode: this.state.run_test.runtest_can.pswd, run_test_id: this.state.run_test.questions[this.state.run_test.runtest_can.present_ques_id].id, run_test_option_id: this.state.run_test.questions[this.state.run_test.runtest_can.present_ques_id].selected_option, present_ques_id: this.state.run_test.runtest_can.present_ques_id }
        :
        this.state.run_test.questions[this.state.run_test.runtest_can.present_ques_id].type_id == 3
          ?
          { passcode: this.state.run_test.runtest_can.pswd, run_test_id: this.state.run_test.questions[this.state.run_test.runtest_can.present_ques_id].id, run_test_option_ids: this.state.run_test.questions[this.state.run_test.runtest_can.present_ques_id].selected_options, present_ques_id: this.state.run_test.runtest_can.present_ques_id }
          :
          { passcode: this.state.run_test.runtest_can.pswd, run_test_id: this.state.run_test.questions[this.state.run_test.runtest_can.present_ques_id].id, answer_body: this.state.run_test.questions[this.state.run_test.runtest_can.present_ques_id].ans_body, present_ques_id: this.state.run_test.runtest_can.present_ques_id },
      (response) => {
        if (response.success) {
          this.get("finish_test", { passcode: this.state.run_test.runtest_can.pswd }, (response2) => {
            if (response2.success) {
              this.setState({ run_test: null, testEnded: true });
            }
            else this.setState({ error: response2.message });
          });
        }
        else {
          this.setState({ error: response.message });
        }
      }
    )
  }
  render() {
    return (
      <PaperProvider>
        <StatusBar />
        <Portal>
          <Modal
            dismissable={false}
            visible={this.state.loading}
            theme={theme}

          >
            <ActivityIndicator />
          </Modal>
        </Portal>
        {
          this.state.login ?
            <View style={styles.login} theme={theme}>
              <View style={styles.loginPasscodeContainer}>
                <TextInput
                  label="Passcode"
                  style={styles.loginPasscode}
                  value={this.state.login.passcode}
                  mode="outlined"
                  secureTextEntry
                  theme={theme}
                  onChangeText={text => {
                    this.setState({ login: { ...this.state.login, passcode: text } })
                  }}
                  onSubmitEditing={this.getTest.bind(this)}
                />
                <Button
                  style={styles.loginButton}
                  contentStyle={styles.loginButtonContent}
                  labelStyle={styles.loginButtonText}
                  mode="contained"
                  color="#42c5f5"
                  onPress={this.getTest.bind(this)}
                >Continue</Button>
              </View>
              <View style={styles.loginLogoContainer}>
                <Image style={styles.loginLogo} source={magnox_logo} />
              </View>
            </View>
            :
            this.state.test
              ?
              <View style={styles.test}>
                <Surface style={styles.top}>
                  <View style={styles.topLogo}>
                    <Image style={styles.testLogo} source={magnox_logo} />
                    {
                      this.state.run_test ?
                        <View>
                          <Caption>Time left to end</Caption>
                          <Title>{this.state.testEndTimeLeft}</Title>
                        </View>
                        :
                        null
                    }
                  </View>
                  {
                    this.state.run_test ?
                      <Button
                        style={styles.loginButton}
                        contentStyle={styles.loginButtonContent}
                        labelStyle={styles.loginButtonText}
                        mode="contained"
                        color="#42c5f5"
                        onPress={() => this.saveAnswerAndFinish()}
                      >Exit</Button>
                      :
                      <Button
                        style={styles.loginButton}
                        contentStyle={styles.loginButtonContent}
                        labelStyle={styles.loginButtonText}
                        mode="contained"
                        color="#42c5f5"
                        onPress={() => this.setState(this._state)}
                      >Exit</Button>
                  }
                </Surface>
                <ScrollView>
                  {
                    !this.state.run_test ?
                      <View style={styles.testContainer}>
                        <Surface style={styles.testCanDetails}>
                          <Caption>
                            Name
                    </Caption>
                          <Title>
                            {this.state.test.user_details.first_name}&nbsp;
                      {this.state.test.user_details.last_name}
                          </Title>
                          <Caption>
                            Email
                    </Caption>
                          <Subheading>
                            {this.state.test.user_details.email}
                          </Subheading>
                          <Caption>
                            Phone
                    </Caption>
                          <Subheading>
                            {this.state.test.user_details.phone}
                          </Subheading>
                          <Caption>
                            Program
                    </Caption>
                          <Subheading>
                            {this.state.test.program.title}
                          </Subheading>
                          {
                            this.state.test.course
                              ?
                              <View>
                                <Caption>
                                  Course
                          </Caption>
                                <Subheading>
                                  {this.state.test.course.title}&nbsp;
                          </Subheading>
                              </View>
                              :
                              null
                          }


                        </Surface>
                        <Surface style={styles.testDetails}>
                          <Title style={styles.testTitle}>
                            {this.state.test.test.title}
                          </Title>
                          <Surface style={styles.testInfo}>
                            {
                              this.state.test.test_pub.publish_type == 1
                                ?
                                <View>
                                  <Caption>
                                    Start Time
                          </Caption>
                                  <Subheading>
                                    Any
                          </Subheading>
                                </View>
                                :
                                this.state.test.test_pub.publish_type == 2
                                  ?
                                  <View>
                                    <Caption>
                                      Start Time
                          </Caption>
                                    <Subheading>
                                      {this.then(this.state.test.test_pub.start_datetm.replace(" ", "T"))}
                                    </Subheading>
                                  </View>
                                  :
                                  <View>
                                    <Caption>
                                      Start Time
                          </Caption>
                                    <Subheading>
                                      from {this.then(this.state.test.test_pub.start_datetm.replace(" ", "T"))} to {this.then(this.state.test.test_pub.end_datetm.replace(" ", "T"))}
                                    </Subheading>
                                  </View>
                            }
                            <View>
                              <Caption>
                                Duration
                           </Caption>
                              <Subheading>
                                {this.state.test.test.duration}&nbsp;Minutes
                            </Subheading>
                            </View>
                          </Surface>
                          <Surface style={styles.testSections}>
                            {
                              this.state.test.sections.map(section => <View style={styles.testSection}>
                                <Caption>
                                  {section.section_name}
                                </Caption>
                                <Subheading>
                                  {section.count}&nbsp; Questions
                              </Subheading>
                              </View>)
                            }
                          </Surface>

                          <Surface style={styles.testInstructions}>
                            <Subheading>Instructions</Subheading>
                            {
                              Platform.OS === 'web'
                                ?
                                <div dangerouslySetInnerHTML={{ __html: this.state.test.test.details }} />
                                :
                                <HTMLView value={this.state.test.test.details} />
                            }
                          </Surface>
                          {
                            this.state.test.runtest_can.test_start_flag
                              ?
                              <Surface style={styles.testEntry}>
                                <View>
                                  <Caption>Test attempted at</Caption>
                                  <Title>{this.then(this.state.test.runtest_can.test_start_dttm.replace(" ", "T"))}</Title>
                                </View>
                                {
                                  this.state.testEnded
                                    ?
                                    <View>
                                      <Caption>Test ended at</Caption>
                                      <Title>{this.then(this.state.test.runtest_can.test_end_dttm.replace(" ", "T"))}</Title>
                                    </View>
                                    :
                                    <View>
                                      <Caption>Time left to end</Caption>
                                      <Title>{this.state.testEndTimeLeft}</Title>
                                      <Button
                                        style={styles.loginButton}
                                        contentStyle={styles.loginButtonContent}
                                        labelStyle={styles.loginButtonText}
                                        mode="contained"
                                        color="#42c5f5"
                                        onPress={this.runTest.bind(this)}
                                      >Re-enter</Button>
                                    </View>

                                }
                              </Surface>
                              :

                              <Surface style={styles.testEntry}>
                                {
                                  this.state.testEntryTimeLeft
                                    ?
                                    <View>
                                      <Caption>Time left to start</Caption>
                                      <Title>{this.state.testEntryTimeLeft}</Title>
                                    </View>
                                    :
                                    this.state.test.test_pub.publish_type != 1 && new Date(this.state.test.test_pub.end_datetm.replace(" ", "T")).getTime() < this.now()
                                      ?
                                      <View>
                                        <Caption>Time to attempt test is over at</Caption>
                                        <Title>{this.then(this.state.test.test_pub.end_datetm.replace(" ", "T"))}</Title>
                                      </View>
                                      :
                                      <Button
                                        style={styles.loginButton}
                                        contentStyle={styles.loginButtonContent}
                                        labelStyle={styles.loginButtonText}
                                        mode="contained"
                                        color="#42c5f5"
                                        onPress={() => {
                                          let start_datetm = this.state.test.test_pub.publish_type == 1 ? new Date(this.now()) : new Date(this.state.test.test_pub.start_datetm.replace(" ", "T"));
                                          let timer = setInterval(() => {
                                            if (start_datetm.getTime() < this.now()) {
                                              clearInterval(timer);
                                              this.get("start_test", { passcode: this.state.test.runtest_can.pswd }, (response) => {
                                                if (response.success) {
                                                  this.runTest.bind(this)();
                                                  this.setState({ error: null, testEntryTimeLeft: null });
                                                }
                                                else this.setState({ error: response.message ? response.message : "Some error occurred!", testEntryTimeLeft: null });
                                              });
                                            }
                                            else {
                                              this.setState({
                                                testEntryTimeLeft: this.timeDiff(start_datetm)
                                              })
                                            }
                                          }, 1000);
                                        }}
                                      >Continue</Button>

                                }
                              </Surface>
                          }
                        </Surface>

                      </View>
                      :
                      <View style={styles.runTestContainer}>
                        {
                          this.state.run_test.questions[this.state.run_test.runtest_can.present_ques_id]
                            ?
                            <Surface style={styles.question}>
                              <Subheading>Question {this.state.run_test.runtest_can.present_ques_id + 1} of {this.state.run_test.questions.length}</Subheading>
                              {
                                Platform.OS === 'web'
                                  ?
                                  <div dangerouslySetInnerHTML={{ __html: this.state.run_test.questions[this.state.run_test.runtest_can.present_ques_id].qbody }} />
                                  :
                                  <HTMLView value={this.state.run_test.questions[this.state.run_test.runtest_can.present_ques_id].qbody} />
                              }
                              {
                                this.state.run_test.questions[this.state.run_test.runtest_can.present_ques_id].type_id == 2
                                  ?
                                  <RadioButton.Group value={this.state.run_test.questions[this.state.run_test.runtest_can.present_ques_id].selected_option} onValueChange={(val) => {
                                    let run_test = this.state.run_test;
                                    run_test.questions[this.state.run_test.runtest_can.present_ques_id].selected_option = val;
                                    run_test.questions[this.state.run_test.runtest_can.present_ques_id].status = 1;
                                    this.setState({ run_test });
                                  }} style={styles.questionT2}>
                                    {this.state.run_test.questions[this.state.run_test.runtest_can.present_ques_id].options.map(option => <RadioButton.Item label={
                                      Platform.OS === 'web'
                                        ?
                                        <div dangerouslySetInnerHTML={{ __html: option.body }} />
                                        :
                                        <HTMLView value={option.body} />
                                    } value={option.id} />)}
                                  </RadioButton.Group>
                                  :
                                  this.state.run_test.questions[this.state.run_test.runtest_can.present_ques_id].type_id == 3
                                    ?
                                    <View style={styles.questionT3}>
                                      {this.state.run_test.questions[this.state.run_test.runtest_can.present_ques_id].options.map(option, index => <Checkbox.Item label={
                                        Platform.OS === 'web'
                                          ?
                                          <div dangerouslySetInnerHTML={{ __html: option.body }} />
                                          :
                                          <HTMLView value={option.body} />
                                      }
                                        onPress={() => {
                                          let run_test = this.state.run_test;
                                          if (option.id in run_test.questions[run_test.runtest_can.present_ques_id].selected_options) {
                                            run_test.questions[run_test.runtest_can.present_ques_id].selected_options = run_test.questions[run_test.runtest_can.present_ques_id].selected_options.filter(e => e != option.id);
                                          }
                                          else {
                                            run_test.questions[run_test.runtest_can.present_ques_id].selected_options.push(option.id);
                                          }
                                          run_test.questions[run_test.runtest_can.present_ques_id].status = 1;
                                          this.setState({ run_test });
                                        }}
                                        status={option.id in this.state.run_test.questions[this.state.run_test.runtest_can.present_ques_id].selected_options ? 'checked' : 'unchecked'} />)}
                                    </View>
                                    :
                                    <TextInput
                                      multiline
                                      label="Answer"
                                      style={styles.questionT1}
                                      value={this.state.run_test.questions[this.state.run_test.runtest_can.present_ques_id].ans_body}
                                      onChangeText={text => {
                                        let run_test = this.state.run_test;
                                        run_test.questions[run_test.runtest_can.present_ques_id].ans_body = text;
                                        run_test.questions[run_test.runtest_can.present_ques_id].status = 1;
                                        this.setState({ run_test });
                                      }}
                                    />
                              }
                              <Surface style={styles.runTestControls}>
                                <Button
                                  style={styles.loginButton}
                                  contentStyle={styles.loginButtonContent}
                                  labelStyle={styles.loginButtonText}
                                  mode="contained"
                                  color="#42c5f5"
                                  onPress={() => this.saveAnswerAndShow((parseInt(this.state.run_test.runtest_can.present_ques_id) - 1) % this.state.run_test.questions.length)}
                                >Previous</Button>
                                <Button
                                  style={styles.loginButton}
                                  contentStyle={styles.loginButtonContent}
                                  labelStyle={styles.loginButtonText}
                                  mode="contained"
                                  color="#42c5f5"
                                  onPress={() => {
                                    let run_test = this.state.run_test;
                                    if (run_test.questions[run_test.runtest_can.present_ques_id].type_id == 2) {
                                      run_test.questions[run_test.runtest_can.present_ques_id].selected_option = 0;
                                    }
                                    else if (run_test.questions[run_test.runtest_can.present_ques_id].type_id == 3) {
                                      run_test.questions[run_test.runtest_can.present_ques_id].selected_options = [];
                                    }
                                    else {
                                      run_test.questions[run_test.runtest_can.present_ques_id].ans_body = null;
                                    }
                                    run_test.questions[run_test.runtest_can.present_ques_id].status = 0;
                                    this.setState({ run_test })
                                  }}
                                >Clear</Button>
                                <Button
                                  style={styles.loginButton}
                                  contentStyle={styles.loginButtonContent}
                                  labelStyle={styles.loginButtonText}
                                  mode="contained"
                                  color="#42c5f5"
                                  onPress={() => {
                                    if (this.state.run_test.runtest_can.present_ques_id == this.state.run_test.questions.length - 1) this.saveAnswerAndFinish();
                                    else this.saveAnswerAndShow((parseInt(this.state.run_test.runtest_can.present_ques_id) + 1) % this.state.run_test.questions.length)
                                  }
                                  }
                                >{this.state.run_test.runtest_can.present_ques_id == this.state.run_test.questions.length - 1 ? "Finish" : "Next"}</Button>
                              </Surface>
                            </Surface>
                            :
                            null
                        }
                        <Surface style={styles.runTestQIndicesContainer}>
                          <ScrollView>
                            <View style={styles.runTestQIndices}>
                              {this.state.run_test.questions.map((question, index) => {
                                return <TouchableOpacity style={{ margin: 5 }} onPress={() => this.saveAnswerAndShow(index)}>
                                  <Avatar.Text style={{ backgroundColor: this.state.run_test.runtest_can.present_ques_id == index ? "#42c5f5" : question.status == 0 ? "#ff5050" : "#50ff50" }} size={50} label={index + 1} />
                                </TouchableOpacity>
                              })}
                            </View>
                          </ScrollView>
                        </Surface>
                      </View>
                  }
                </ScrollView>
              </View>
              :
              null
        }
        <Snackbar
          visible={this.state.error}
          onDismiss={() => {
            this.setState({ error: false });
          }}
          style={styles.error}
          action={{
            label: 'Close',
            onPress: () => this.setState({ error: false })
          }}
          theme={theme}
        >
          <Text style={styles.errorText}>{this.state.error}</Text>
        </Snackbar>
      </PaperProvider >
    );
  }

  timeDiff(date) {
    let diff = new Date(date.getTime() - this.now());
    return (diff.getUTCMonth() ? diff.getUTCMonth() + " month(s) " : "") +
      ((diff.getUTCDate() - 1) > 0 ? (diff.getUTCDate() - 1) + " day(s) " : "") +
      (diff.getUTCHours() ? diff.getUTCHours() + " hour(s) " : "") +
      (diff.getUTCMinutes() ? diff.getUTCMinutes() + " minute(s) " : "") +
      (diff.getUTCSeconds() ? diff.getUTCSeconds() + " second(s) " : "");
  }

  now() {
    let curdate = new Date();
    return curdate.getTime() + (Platform.OS === 'web' ? curdate.getTimezoneOffset() * 60000 : 0);
  }

  then(date_str) {
    let curdate = new Date();
    let date = new Date(date_str);
    date = new Date(date.getTime() - (Platform.OS === 'web' ? curdate.getTimezoneOffset() * 60000 : 0));
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  }
}


AppRegistry.registerComponent(appName, () => Main);
