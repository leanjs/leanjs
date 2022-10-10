<template>
  <div id="app">
    <h2>{{ username?.current }}'s ToDo</h2>
    <form v-on:submit.prevent="onSubmit">
      <input type="text" v-model="text" placeholder="I have to do..." />
      <button>Add</button>
    </form>
    <p v-for="todo in todos" :key="todo.id">
      {{ todo.text }}
      <br />
      ❌ | ✅
    </p>
  </div>
</template>

<script>
import { useSharedState } from "@my-org/runtime-vue";
import { fetchUsername } from "@my-org/user";

export default {
  name: "TodoApp",
  data(props) {
    return {
      todos: [],
      text: "",
      id: 1,
    };
  },
  setup() {
    return useSharedState({
      prop: "username",
      loader: fetchUsername,
    });
  },
  methods: {
    onSubmit() {
      if (this.text.length > 0) {
        const newTodo = {
          id: this.id,
          author: this.name,
          text: this.text,
          createdAt: new Date(),
        };
        this.todos.push(newTodo);
        this.text = "";
        this.id = this.id + 1;
      }
    },
  },
};
</script>
