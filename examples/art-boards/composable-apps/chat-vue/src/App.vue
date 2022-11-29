<template>
 <div className="chat">
      <h2>Chat</h2>
      <div className="content">
        <p v-for="message in messages">{{message.text}}</p>
      </div>
      <form v-on:submit="handleSubmit($event)">
        <div className="input">
          <input
            autoComplete="off"
            type="text"
            name="text"
            v-model="newMessage"
          />
          <button type="submit">Send</button>
        </div>
      </form>
    </div>

</template>

<script setup lang="ts">
import { inject, ref } from "vue";
import type { Runtime } from "@art-boards/runtime-shared";
import type { FormEventHandler } from "react";
import { createStar } from "@art-boards/ui-canvas";

export interface Props {}

const runtime = inject<Runtime>("runtime");

const newMessage = ref("");
const messages = ref([
{ text: "Hello 👋", sentAt: new Date() },
])
const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
  e.preventDefault();
  messages.value = [...messages.value, { text: newMessage.value, sentAt: new Date() }];
  if (newMessage.value.startsWith("star") && runtime) {
      runtime.api.canvas.stage.addChild(createStar());
    }

  newMessage.value = "";

}
</script>