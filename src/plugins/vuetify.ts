import Vue from 'vue'

import Vuetify, {
  VApp,
  VNavigationDrawer,
  VList,
  VListItemAvatar,
  VListItemContent,
  VListItemTitle,
  VListItemSubtitle,
  VBtn,
  VIcon,
  VDivider,
  VSlider,
  VSnackbar,
  VTextField,
  VSubheader,
  VToolbar,
  VSelect,
  VProgressCircular,
  VDialog,
  VForm,
  VCheckbox,
  VTooltip,
} from 'vuetify/lib'

import { Ripple, Touch } from 'vuetify/lib/directives'

Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VIcon,
    VBtn,
    VList,
    VListItemAvatar,
    VListItemContent,
    VListItemTitle,
    VListItemSubtitle,
    VDivider,
    VSlider,
    VSnackbar,
    VTextField,
    VSubheader,
    VToolbar,
    VSelect,
    VProgressCircular,
    VDialog,
    VForm,
    VCheckbox,
    VTooltip,
  },
  directives: {
    Ripple,
    Touch,
  }
})

const opts = {
  theme: {
    themes: {
      light: {
        primary: '#51B2E0',
      },
    },
  },
}

export default new Vuetify(opts)
