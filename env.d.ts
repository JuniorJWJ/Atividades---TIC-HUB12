/// <reference types="vite/client" />

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $confirm: import('primevue/confirmationservice').ConfirmationServiceMethods
  }
}
