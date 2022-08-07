import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'

declare module '@vue/runtime-core' {
  interface State {
    title: string,
    htmlEditorContent: string,
    stack: Array<StackElement>
  }

  interface ComponentCustomProperties {
    $store: Store<State>
  }
}