<template>
  <v-row class="fill-height">
    <v-col><v-sheet height="64"><v-toolbar flat>
          <v-btn outlined class="mr-4" color="black" @click="setToday">Today</v-btn>
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
          color="purple darken-2 white--text"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
        ></v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card
            color="grey lighten-4"
            min-width="350px"
            flat
          >
            <v-toolbar
              :color="selectedEvent.color"
              dark
            >
              <v-btn icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <span v-html="selectedEvent.details"></span>
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                color="secondary"
                @click="selectedOpen = false"
              >
                Cancel
              </v-btn>
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
      events: [],

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
      signedIn: false,
      unsubscribeAuth: undefined,
      user: undefined,
      username: "",
    },
    }),
    computed(){
      this.isUserSignedIn();
    },
    mounted () {
      this.$refs.calendar.checkChange()
    },
    methods: {
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
        const events = []

        var occurences = 24;
        var duration = 5;
        var start_date = "9/13/2021 00:00";
        for(let i=0; i <= occurences; i++){
          var repeat_every = 28*i; //repeat every number of days/weeks/months
          var start = new Date(start_date);
          var end = new Date(start_date)
          start.setDate( start.getDate() + repeat_every );
          end.setDate( end.getDate() + repeat_every + (duration - 1 ));

          events.push({
            name: 'Child1',
            start: start,
            end: end,
            color: 'purple darken-4',
          })
        }
        this.events = events
      },
      rnd (a, b) {
        return Math.floor((b - a + 1) * Math.random()) + a
      },
    },
  }
</script>