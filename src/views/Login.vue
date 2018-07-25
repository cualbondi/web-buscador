<template>
    <div>
      <v-btn @click="fblogin">
        Login via facebook
      </v-btn>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({})
export default class NotFound extends Vue {

  public fblogin() {
    this.$store.dispatch('loginFB')
  }

  public created() {
    // TODO: move this to vue root later
    window.fbAsyncInit = function() {
      window.FB.init({
        appId      : '516530425068934',
        cookie     : true,
        // xfbml      : true,
        version    : 'v3.0',
      })
      window.FB.AppEvents.logPageView()
    };
    (function(d, s, id) {
      let js, fjs = d.getElementsByTagName(s)[0]
      if (d.getElementById(id)) {return}
      js = d.createElement(s); js.id = id;
      (js as any).src = 'https://connect.facebook.net/en_US/sdk.js'
      fjs.parentNode!.insertBefore(js, fjs)
    }(document, 'script', 'facebook-jssdk'))
  }

}
</script>
