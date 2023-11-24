import { defineStore } from "pinia";

export const useMain = defineStore("main", {
  state: () => {
    return {
      counter: 0,
      name: "Jackie"
    };
  },
  getters: {
    doubleCount: (state) => {
      return state.counter * 2;
    }
  },
  actions: {
    increment() {
      this.counter++;
    }
  }
});
