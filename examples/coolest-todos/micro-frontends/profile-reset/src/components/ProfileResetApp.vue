<template>
  <div id="app">
    <hr />
    <p>Current username: {{ username.current }}</p>
    <p>
      Previous username: {{ username.previous }}
      <br />
      <button v-on:click="reset">Reset</button>
    </p>
  </div>
</template>

<script lang="ts">
import { useSharedState } from "@my-org/runtime-vue";
import { fetchUsername } from "@my-org/user";

export default {
  name: "ProfileResetApp",
  methods: {
    reset() {
      // This code mutates username (it doesn't change this.username reference)
      const temp = this.username.current;
      this.username.current = this.username.previous;
      this.username.previous = temp;
      // This approach doesn't require to pass deep:true to useSharedState
      // this.username = {
      //   current: this.username.previous,
      //   previous: this.username.current,
      // };
    },
  },
  setup() {
    return useSharedState({
      prop: "username",
      loader: fetchUsername,
      deep: true, // true because the reset function is mutating the username
    });
  },
};
</script>
