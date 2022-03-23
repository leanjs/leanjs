<template>
  <div id="app">
    <h2>{{ username }}'s ToDos</h2>
    <form v-on:submit.prevent="onSubmit">
      <input type="text" v-model="text" placeholder="Type your TODO..." />
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
export default {
  name: "App",
  props: ["runtime"],
  data(props) {
    return {
      username: props.runtime.state.username,
      todos: [],
      text: "",
      id: 1,
    };
  },
  mounted() {
    this.runtime.subscribe("username", (username) => {
      this.username = username;
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
