<template>
  <v-app>
    <v-app-bar app color="black" dark absolute>
      <span class="mx-auto white--text text-center">App Requested by Moms for Moms and their Daughters</span>
    </v-app-bar>


    <v-main>
      <!-- <v-card v-if="authState !== 'signedin'" class="black white--text mt-3 pt-2 text-center">
          Username: customer1
      </v-card>
      <v-card v-if="authState !== 'signedin'" class="black white--text pb-2 text-center">
          Password: welcome2
      </v-card> -->
      <Cycle />
      <!-- <Cycle v-if="authState === 'signedin' && user" :userProps="user.username" /> -->
    </v-main>
        <!-- <amplify-authenticator>
          <amplify-sign-in slot="sign-in" :hide-sign-up="true">
          </amplify-sign-in>
        </amplify-authenticator>
        <amplify-sign-out v-if="authState === 'signedin'" >
        </amplify-sign-out> -->


  </v-app>
</template>

<script>
import Cycle from './components/Cycle';
import { onAuthUIStateChange } from '@aws-amplify/ui-components'

export default {
  name: 'App',
  components: {
    Cycle,
  },
  created() {
    this.unsubscribeAuth = onAuthUIStateChange((authState, authData) => {
      this.authState = authState;
      this.user = authData;
    })
  },
  data() {
    return {
      user: undefined,
      authState: undefined,
      unsubscribeAuth: undefined,
      collapseOnScroll: true,
    }
  },
  beforeDestroy() {
    this.unsubscribeAuth();
  }
};
</script>
<style>
  :root {
    --amplify-primary-color: rgba(19, 89, 194, 0.776);
  }
</style>