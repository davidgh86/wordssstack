import { createStore } from 'vuex'

export const store = createStore({
  state: {
    count: 5
  },
  getters: {
    getterExample(state) {
      return state.count
    },
    getterExample2(state, getters){
      return getters.getterExample * 2
    }
  },
  // sincorno
  mutations: {
    increment (state, payload){
      return state.count = state.count + payload.amount;
    },
    decrement (state, payload){
      return state.count = state.count - payload.amount;
    }
  },
  // asincrono
  actions: {
    increment (context, payload) {
      context.commit('increment', payload)
    },
    decrement (context, payload) {
      context.commit('decrement', payload)
    }
  }
})


