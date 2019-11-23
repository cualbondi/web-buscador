<template>
  <v-dialog v-model="shareModalOpen" width="500" content-class="share-modal">
    <div class="share-title">Compartir con</div>
    <div class="share-icon-grid">
      <!-- telegram -->
      <a :href="telegramUrl" class="share-button telegram">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="100%" height="100%"><linearGradient id="a" gradientUnits="userSpaceOnUse" x1="24" y1="658" x2="24" y2="618.146" gradientTransform="matrix(1 0 0 -1 0 662)"><stop offset="0" stop-color="#42bce8"/><stop offset="1" stop-color="#23a7dc"/></linearGradient><circle cx="24" cy="24" r="20" fill="url(#a)"/><path d="M34.176 14.811l-3.817 19.492s-.534 1.352-2.002.703l-8.809-6.84-3.203-1.568-5.392-1.838s-.828-.297-.908-.946c-.08-.649.934-1 .934-1l21.436-8.516c-.001-.001 1.761-.785 1.761.513z" fill="#fff"/><path d="M18.87 34.083s-.257-.024-.578-1.052c-.32-1.027-1.949-6.434-1.949-6.434L29.29 18.27s.747-.46.721 0c0 0 .133.081-.267.46s-10.171 9.273-10.171 9.273" fill="#d2e5f1"/><path d="M22.925 30.788l-3.484 3.217s-.272.209-.57.078l.667-5.976" fill="#b5cfe4"/></svg>
      </a>
      <!-- whatsapp -->
      <a :href="whatsappUrl" class="share-button whatsapp">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="100%" height="100%"><path d="M4.867 43.305l2.696-9.836a18.934 18.934 0 0 1-2.536-9.489C5.031 13.516 13.547 5 24.016 5a18.882 18.882 0 0 1 13.43 5.566A18.86 18.86 0 0 1 43 23.992c-.004 10.469-8.523 18.98-18.984 18.98-.004 0 0 0 0 0h-.008c-3.18 0-6.301-.796-9.074-2.308z" fill="#fff"/><path d="M4.867 43.805a.513.513 0 0 1-.355-.149.504.504 0 0 1-.125-.484l2.636-9.637a19.537 19.537 0 0 1-2.496-9.555C4.531 13.238 13.273 4.5 24.016 4.5a19.37 19.37 0 0 1 13.78 5.715A19.34 19.34 0 0 1 43.5 23.992c-.004 10.742-8.746 19.48-19.484 19.48-3.192 0-6.344-.785-9.145-2.277l-9.875 2.59a.491.491 0 0 1-.129.02z" fill="#fff"/><path d="M24.016 5a18.882 18.882 0 0 1 13.43 5.566A18.86 18.86 0 0 1 43 23.992c-.004 10.469-8.523 18.98-18.984 18.98h-.008c-3.18 0-6.301-.796-9.074-2.308l-10.067 2.64 2.696-9.835a18.934 18.934 0 0 1-2.536-9.489C5.031 13.516 13.547 5 24.016 5m0-1C12.996 4 4.03 12.96 4.027 23.98c0 3.368.848 6.684 2.461 9.622l-2.586 9.437c-.093.348.004.715.254.969.192.191.45.297.711.297a.927.927 0 0 0 .254-.035l9.688-2.54c2.828 1.47 6 2.243 9.199 2.247 11.023 0 19.988-8.965 19.992-19.98a19.851 19.851 0 0 0-5.848-14.138C34.38 6.082 29.355 4.004 24.016 4z" fill="#cfd8dc"/><path d="M35.176 12.832A15.676 15.676 0 0 0 24.02 8.207c-8.704 0-15.786 7.074-15.79 15.773 0 2.98.836 5.883 2.415 8.395l.375.598-1.594 5.82 5.972-1.566.579.343c2.421 1.438 5.199 2.2 8.03 2.2h.009c8.695 0 15.773-7.079 15.777-15.778a15.66 15.66 0 0 0-4.617-11.16z" fill="#40c351"/><path d="M19.27 16.047c-.356-.793-.73-.809-1.07-.82-.278-.012-.595-.012-.91-.012-.313 0-.83.117-1.263.594-.437.472-1.664 1.62-1.664 3.957 0 2.332 1.703 4.59 1.938 4.906.238.312 3.285 5.258 8.105 7.16 4.008 1.578 4.824 1.266 5.692 1.188.87-.083 2.808-1.149 3.203-2.258.394-1.106.394-2.055.277-2.254-.117-.2-.433-.317-.91-.555-.473-.238-2.805-1.383-3.242-1.543-.434-.156-.75-.234-1.067.238-.316.473-1.226 1.543-1.504 1.86-.277.316-.55.355-1.027.12-.473-.237-2-.737-3.812-2.355-1.41-1.257-2.364-2.808-2.641-3.285-.277-.472-.031-.73.207-.968.215-.211.477-.555.715-.832.234-.278.312-.473.473-.79.156-.316.078-.593-.04-.832-.117-.238-1.039-2.582-1.46-3.52z" fill-rule="evenodd" fill="#fff"/></svg>
      </a>
      <!--  facebook -->
      <a :href="facebookUrl" class="share-button facebook">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="100%" height="100%"><path d="M42 37a5 5 0 0 1-5 5H11a5 5 0 0 1-5-5V11a5 5 0 0 1 5-5h26a5 5 0 0 1 5 5z" fill="#3f51b5"/><path d="M34.367 25H31v13h-5V25h-3v-4h3v-2.41c.004-3.508 1.46-5.59 5.594-5.59H35v4h-2.285c-1.61 0-1.715.602-1.715 1.723V21h4z" fill="#fff"/></svg>
      </a>
      <!-- facebook messenger -->
      <a :href="facebookMessengerUrl" class="share-button facebook-messenger">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="100%" height="100%"><path d="M24 4C13.5 4 5 12.102 5 22c0 5.2 2.3 9.8 6 13.102V44l7.8-4.7c1.598.4 3.4.7 5.2.7 10.5 0 19-8.102 19-18S34.5 4 24 4z" fill="#448aff"/><path d="M12 28l10-11 5 5 9-5-10 11-5-5z" fill="#fff"/></svg>
      </a>
    </div>
    <div class="divider"></div>
    <div class="cancel-container">
      <v-btn color="primary" text @click="shareModalOpen = false">Cancelar</v-btn>
    </div>
  </v-dialog>
</template>


<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'

@Component({})
export default class ShareModal extends Vue {
  get shareModalOpen() {
    return this.$store.getters.shareModalOpen
  }
  set shareModalOpen(value) {
    this.$store.dispatch('setShareModal', value)
  }
  get facebookUrl(){
    return `https://www.facebook.com/sharer/sharer.php?u=${this.getUrl()}`
  }
  get whatsappUrl(){
    return this.isMobile()
      ? `whatsapp://send?text=${this.getUrl()}`
      : `https://web.whatsapp.com/send?text=${this.getUrl()}`
  }
  get facebookMessengerUrl(){
    return this.isMobile()
      ? `fb-messenger://share/?link=${this.getUrl()}&app_id=516530425068934`
      : `http://www.facebook.com/dialog/send?app_id=516530425068934&redirect_uri=${this.getUrl()}&link=${this.getUrl()}`
  }
  get telegramUrl(){
    return `https://telegram.me/share/url?url=${this.getUrl()}`
  }

  getUrl(){
    return encodeURIComponent(window.location.href)
  }

  isMobile() {
    if (
      navigator.userAgent.match(/Android/i)
      || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPad/i)
      || navigator.userAgent.match(/iPod/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i)
    ){
      return true;
    }
    else {
      return false;
    }
  }
}
</script>

<style lang="scss" scoped>
  .share-title {
    background-color: #e0e0e0;
    font-size: 24px;
    line-height: 32px;
    padding: 24px 16px 16px 16px;
  }
  .share-icon-grid {
      padding: 16px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
  }
  .share-button {
      text-decoration: none;
      width: 100px;
      height: 100px;
  }
  .cancel-container {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
  .divider{
    height: 0px;
    width: 100%;
    border: solid;
    border-width: thin 0 0 0;
    border-color: rgba(0,0,0,0.12);
  }
</style>

<style lang="scss">
.share-modal {
    padding: 0 !important;
  }
</style>
