<template>
  <v-row class="fill-height">
      <!-- 1st bar -->
    <v-container class="purple darken-4" fluid>
      <v-row no-gutters>
        <v-app-bar-nav-icon class="black mt-3 mr-4" @click.stop="drawer = !drawer" color=white></v-app-bar-nav-icon>
        <h1 class="white--text mt-2">Molly</h1>
        <v-spacer></v-spacer>
        <v-btn rounded class="mt-4 mr-3" @click="dialog = true">Enter Date</v-btn>
      </v-row>
    </v-container>
    <!-- Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list shaped>
        <v-list-item-group v-model="item">
          <v-list-item v-if="signedIn === true"><v-list-item-title class="font-weight-bold">Hi {{this.user.username}}!</v-list-item-title></v-list-item>
          <v-list-item v-if="signedIn === false" @click="dialogLogin=true"><v-list-item-icon><v-icon color=black>mdi-login</v-icon></v-list-item-icon><v-list-item-title>Login</v-list-item-title></v-list-item>
          <v-list-item><v-list-item-icon><v-icon color=black>mdi-account-details</v-icon></v-list-item-icon><v-list-item-title>What is Molly's app?</v-list-item-title></v-list-item>
          <v-list-item><v-list-item-icon><v-icon color=black>mdi-bug</v-icon></v-list-item-icon><v-list-item-title>Report a Bug</v-list-item-title></v-list-item>
          <v-list-item><v-list-item-icon><v-icon color=black>mdi-comment-quote</v-icon></v-list-item-icon><v-list-item-title>Feedback</v-list-item-title></v-list-item>
          <v-list-item><v-list-item-icon><v-icon color=black>mdi-head-lightbulb-outline</v-icon></v-list-item-icon><v-list-item-title>Got an app idea?</v-list-item-title></v-list-item>
          <v-list-item v-if="signedIn === true" @click="signOut"><v-list-item-icon><v-icon color=black>mdi-logout</v-icon></v-list-item-icon><v-list-item-title>Logout</v-list-item-title></v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <!-- Create Event dialog -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-container>
          <!-- <v-alert v-if="showError" dense type="error">Required info missed *</v-alert> -->
            <v-text-field class="mt-7" v-model="name" label="Name? (*required)" outlined></v-text-field>
            <v-text-field v-model="start" type="date" label="Start of last period (*=required)" outlined></v-text-field>
            <v-text-field v-model="duration" label="How long did it last? (*required)" outlined></v-text-field>
            <v-text-field v-model="cycle_length" label="How long is the menstrual cycle? (*required)" outlined></v-text-field>
            <v-row justify="center">
            <v-btn type="submit" color="purple darken-4 white--text" class="ma-4" @click.prevent="createEvent">Get Results</v-btn>
            </v-row>
        </v-container>
      </v-card>
    </v-dialog>

    <!-- Login Dialog Box  -->
      <v-dialog v-model="dialogLogin">
        <v-card>
          <v-container style="width=50%" class="indigo darken-4" fluid>
            <v-row justify="center" align="center" no-gutters>
              <v-col  cols=12 md=4>
                <h3 v-if="messageLogin" align=center class="font-weight-bold red--text">{{ messageLogin }}</h3>
                <v-text-field :rules="[rules.required, rules.email]" class="ma-3 mt-10 font-weight-bold" v-model="email" dark  label="Enter Email" outlined rounded></v-text-field>
              </v-col>
            </v-row>
            <v-row justify="center" no-gutters>
              <v-col  cols=12 md=4>
                <v-text-field :rules="[rules.required]" class="mx-3 mt-3" v-model="password" type="password" dark  label="Enter Password" outlined rounded></v-text-field>
                <h3 v-if="errorLogin" align=center class="font-weight-bold red--text">{{ errorLogin }}</h3>
              </v-col>  
            </v-row>
            <v-row justify="center" no-gutters>
                <v-btn class="ma-4" color="black" dark @click="signin" rounded>Login<v-icon color="white">mdi-login</v-icon></v-btn>
                <v-btn class="ma-4" color="black" dark @click="dialogRegister=true" rounded>Register<v-icon color="white" >mdi-account-plus</v-icon></v-btn>
                <v-btn class="ma-4" color="black" dark @click="dialogForgot=true" rounded>Forgot Password<v-icon color="white" >mdi-lock-reset</v-icon></v-btn>
            </v-row>
          </v-container>
          <v-progress-linear v-if="apiRequest" indeterminate class="indigo darken-4"></v-progress-linear>
        </v-card>
      </v-dialog>
    <!-- Register Dialog Box  -->
      <v-dialog v-model="dialogRegister">
        <v-card>
          <v-container style="width=50%" class="indigo darken-4" fluid>
            <v-row justify="center" no-gutters>
              <v-col  cols=12 md=4>
                <v-text-field :rules="[rules.required, rules.email]" class="ma-3 mt-10 font-weight-bold" v-model="email" type="email" dark  label="Enter Email" outlined rounded></v-text-field>
              </v-col>
            </v-row>
            <v-row justify="center" no-gutters>
              <v-col  cols=12 md=4>
                <v-text-field :rules="[rules.required]" class="mx-3 mt-3" v-model="password" type="password" dark  label="Enter Password" outlined rounded></v-text-field>
                <h3 v-if="errorRegister" align=center class="font-weight-bold red--text">{{ errorRegister }}</h3>
              </v-col>
            </v-row>
            <v-row justify="center" no-gutters>
                <v-btn class="ma-4" color="black" dark @click="register" rounded>Register<v-icon color="white">mdi-account-plus</v-icon></v-btn>
                <v-btn class="ma-4" color="black" dark @click="dialogForgot=true" rounded>Forgot Password<v-icon color="white">mdi-lock-reset</v-icon></v-btn>
            </v-row>
          </v-container>
          <v-progress-linear v-if="apiRequest" indeterminate class="indigo darken-4"></v-progress-linear>
        </v-card>


      </v-dialog>
    <!-- Signup Confirmation  -->
      <v-dialog v-model="dialogConfirm">
        <v-card><v-container style="width=50%" class="indigo darken-4" fluid>
            <v-row justify="center" no-gutters>
              <v-card-text align="center" class="mt-7 white--text">Please check your email for confirmation code</v-card-text>
              <v-col cols=12 md=4>
                <v-text-field class="ma-3 mt-1 font-weight-bold" v-model="confirmCode" dark  label="Confirmation Code" outlined rounded></v-text-field>
                <h3 v-if="errorConfirm" align=center class="font-weight-bold red--text">{{ errorConfirm }}</h3>
              </v-col>
            </v-row>
            <v-row justify="center" no-gutters>
                <v-btn class="ma-4" color="black" dark @click="confirmSignUp" rounded>Confirm<v-icon color="white">mdi-ticket-confirmation</v-icon></v-btn>
                <v-btn class="ma-4" color="black" dark @click="resendCode" rounded>Re-send Code<v-icon color="white">mdi-email-sync-outline</v-icon></v-btn>
            </v-row></v-container>
            <v-progress-linear v-if="apiRequest" indeterminate class="indigo darken-4"></v-progress-linear>
            </v-card>
      </v-dialog>
    <!-- Forgot Password  -->
      <v-dialog v-model="dialogForgot">
        <v-card><v-container style="width=50%" class="indigo darken-4" fluid>
            <v-row justify="center" no-gutters>
              <v-col  cols=12 md=4>
                <v-text-field class="ma-3 mt-10 font-weight-bold" v-model="email" :rules="[rules.required, rules.email]" type="email" dark  label="Enter Email" outlined rounded></v-text-field>
                <h3 v-if="errorForgot" align=center class="font-weight-bold red--text">{{ errorForgot }}</h3>
              </v-col>
            </v-row>
            <v-row justify="center" no-gutters>
                <v-btn class="ma-4" color="black" dark @click="forgot" rounded>Forgot Password<v-icon color="white">mdi-ticket-confirmation</v-icon></v-btn>
            </v-row></v-container></v-card>
      </v-dialog>
    <!-- Forgot Password Submit -->
      <v-dialog v-model="dialogForgotSubmit">
        <v-card><v-container style="width=50%" class="indigo darken-4" fluid>
            <v-row justify="center" no-gutters>
              <v-card-text align="center" class="mt-7 white--text">Please check your email for confirmation code</v-card-text>
              <v-col  cols=12 md=4>
                <v-text-field class="ma-3 font-weight-bold" v-model="newCode" dark  label="Confirmation Code" outlined rounded></v-text-field>
              </v-col>
            </v-row>
            <v-row justify="center" no-gutters>
              <v-col  cols=12 md=4>
                <v-text-field :rules="[rules.required]" class="ma-3 font-weight-bold" v-model="newPassword" type="password" dark  label="Enter New Password" outlined rounded></v-text-field>
                <h3 v-if="errorForgotSubmit" align=center class="font-weight-bold red--text">{{ errorForgotSubmit }}</h3>
              </v-col>
            </v-row>
            <v-row justify="center" no-gutters>
                <v-btn class="ma-4" color="black" dark @click="forgotSubmit" rounded>Submit<v-icon color="white">mdi-file-send-outline</v-icon></v-btn>
            </v-row></v-container>
            <v-progress-linear v-if="apiRequest" indeterminate class="indigo darken-4"></v-progress-linear>
          </v-card>
          
      </v-dialog>
    <!-- Missing Info Alert -->
        <v-dialog v-model="alertMissingInfo" persistent max-width="290">
          <v-card>
            <v-card-title class="red headline" style="font-weight:bold; color:white;">Alert</v-card-title>
            <v-card-text>Please enter the missing info!</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="alertMissingInfo = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

    <v-col><v-sheet height="64"><v-toolbar flat>
          <!-- <v-btn outlined class="mr-4" color="black" @click="setToday">Today</v-btn> -->
          <v-btn fab text small color="black" @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab text small color="black" @click="next">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="black white--text"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
        ></v-calendar>
        <v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x>
          <v-card color="grey lighten-4" min-width="350px" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-btn icon><v-icon>mdi-pencil</v-icon></v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon><v-icon>mdi-dots-vertical</v-icon></v-btn>
            </v-toolbar>
            <v-card-text><span v-html="selectedEvent.details"></span></v-card-text>
            <v-card-actions>
              <v-btn text color="secondary" @click="selectedOpen = false">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>
<script>
import { Auth } from 'aws-amplify';
  export default {
    data: () => ({
      focus: '',
      type: 'month',
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: undefined,

      dialog: false,
      item: "",

      name: null,
      lname: null,
      start: null,
      end: null,
      cycle_length: null,
      duration: null,

      apiRequest: false,
      authState: undefined,
      confirmCode: null,
      dialogConfirm: false,
      dialogForgotSubmit: false,
      dialogLogin: false,
      dialogRegister: false,
      dialogForgot: false,
      drawer: false,
      email: "",
      errorLogin: "",
      errorRegister: "",
      errorConfirm: "",
      errorForgot: "",
      errorForgotSubmit: "",
      errorResendCode: "",
      alertMissingInfo: false,
      messageLogin: null,
      newCode: "",
      newPassword: "",
      password: "",
      rules: {
        required: value => !!value || 'Required.',
        counter: value => value.length <= 20 || 'Max 20 characters',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
      },
    },
      signedIn: false,
      unsubscribeAuth: undefined,
      user: undefined,
      username: "",
    }),
    // computed(){
    //   this.isUserSignedIn();
    // },
    mounted () {
      this.$refs.calendar.checkChange()
      this.isUserSignedIn();
    },
    methods: {
    createEvent(){
        const events = []

        var occurences = 24;
        // var duration = 5;
        var start_date = this.start + " 00:00";
        for(let i=0; i <= occurences; i++){
          var repeat_every = this.cycle_length*i; //repeat every number of days/weeks/months
          var start = new Date(start_date);
          var end = new Date(start_date)
          start.setDate( start.getDate() + repeat_every );
          end.setDate( end.getDate() + repeat_every + (this.duration - 1 ));


          events.push({
            name: this.name,
            start: start,
            end: end,
            color: 'purple darken-4',
          })
        }
        this.events = events
        this.dialog = false
    },
    async createEvent1() {
      this.name =""
      const { name, details, start, end, time_of_day, color, category, owner2, service_category, apt_num, apt_status } = this;
      const calendar = { name, details, start, end, time_of_day, color, category, owner2, service_category, apt_num, apt_status };

      // Make field mandatory 
      // If user is admin and all info are available, then create record
      if (this.userProps === 'admin' && this.apt_num && this.start && this.time_of_day && this.apt_status && this.service_category && (new Date().setHours(0,0,0,0)) <= (new Date(this.start_date.replace(/-/g, '/')).setHours(0,0,0,0)) && this.owner2 && this.category) {
        await API.graphql({query: createCalEvent, variables: { input: calendar }});this.clearRecords()} 
      // Else if not admin and user with customer info, create record
      else if (this.userProps !== 'admin' && this.apt_num && this.start && this.time_of_day && this.apt_status && this.service_category && (new Date().setHours(0,0,0,0)) <= (new Date(this.start_date.replace(/-/g, '/')).setHours(0,0,0,0))){
          await API.graphql({query: createCalEvent, variables: { input: calendar }});this.clearRecords()}
      else { 
        this.showError = true
        this.dialog_color = 'red lighten-5'
      }
      // EH 1
      // this.getCalEvents()

    },
    async isUserSignedIn(){
      // need to fix in future as it is throwing out an error
      try {
        const userObj = await Auth.currentAuthenticatedUser()
          this.signedIn = true
          this.user = userObj
      } catch (err) {
          this.signedIn = false
      }
    },
    async signin(){
      try {
        this.apiRequest=true
        await Auth.signIn(this.email, this.password)
        this.isUserSignedIn()
        this.dialogLogin = false
        this.dialogRegister = false
        this.dialogForgot = false
        this.errorLogin = null
        this.messageLogin = null
      } catch(err) {
        this.errorLogin = err.message
      }
      this.apiRequest=false
    },
    async register(){
      this.apiRequest=true
      if (!this.password || !this.email) {
        return;
      }
      try {
        this.username = this.email
        console.log(this.username)
        const {username, password, email } = this
        await Auth.signUp({
            username,
            password,
            attributes: { email }
        });  
        this.dialogRegister = false
        this.dialogConfirm = true
        this.dialogLogin = false
      } catch (err) {this.errorRegister = err.message}
      this.apiRequest=false
    },
    async confirmSignUp(){
      this.apiRequest=true
      try {
        await Auth.confirmSignUp(this.email, this.confirmCode)
        this.signin()
        this.isUserSignedIn()
        this.dialogConfirm = false
      } catch (err) {
        this.errorConfirm = err.message
      }
      this.apiRequest=false
    },
    async resendCode(){
      try {
          await Auth.resendSignUp(this.email);
      } catch (err) {
          this.errorResendCode = err.message
      }
    },
    async forgot(){
      try {
        // const forgotOutput = await Auth.forgotPassword(this.email)
        // console.log(forgotOutput)
        await Auth.forgotPassword(this.email)
        this.dialogForgot = false
        this.dialogLogin = false
        this.dialogForgotSubmit = true
      } catch(err){
        this.errorForgot = err.message
      }
    },
    async forgotSubmit(){
      this.apiRequest=true
      this.errorLogin = null
      this.messageLogin = null
      try {
        await Auth.forgotPasswordSubmit(this.email, this.newCode, this.newPassword)
        this.dialogForgotSubmit=false
        this.messageLogin = 'Succesful password reset... login again.'
        this.dialogLogin=true
        this.apiRequest=false
      } catch(err){
        this.errorForgotSubmit = err.message
      }
      this.apiRequest=false
    },
    async signOut() {
      try {
          await Auth.signOut();
          this.drawer=false
          this.user=null
          this.signedIn=false
      } catch (err) {
          alert(err.message)
      }
    },
      viewDay ({ date }) {
        this.focus = date
        this.type = 'day'
      },
      getEventColor (event) {
        return event.color
      },
      setToday () {
        this.focus = ''
      },
      prev () {
        this.$refs.calendar.prev()
      },
      next () {
        this.$refs.calendar.next()
      },
      showEvent ({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          requestAnimationFrame(() => requestAnimationFrame(() => open()))
        } else {
          open()
        }

        nativeEvent.stopPropagation()
      },
      updateRange () {
        // const events = []

        // var occurences = 24;
        // var duration = 5;
        // var start_date = "9/13/2021 00:00";
        // for(let i=0; i <= occurences; i++){
        //   var repeat_every = 28*i; //repeat every number of days/weeks/months
        //   var start = new Date(start_date);
        //   var end = new Date(start_date)
        //   start.setDate( start.getDate() + repeat_every );
        //   end.setDate( end.getDate() + repeat_every + (duration - 1 ));

        //   events.push({
        //     name: 'Eric',
        //     start: start,
        //     end: end,
        //     color: 'purple darken-4',
        //   })
        // }
        // this.events = events
      },
      rnd (a, b) {
        return Math.floor((b - a + 1) * Math.random()) + a
      },
    },
  }
</script>