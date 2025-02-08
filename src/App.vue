<script setup>
import { RouterLink, RouterView } from "vue-router";
import HelloWorld from "./components/HelloWorld.vue";

const worker = new Worker(new URL("worker.js", import.meta.url));

function test() {
  const data = [
    [".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", "1", ".", "5", ".", ".", "."],
    [".", "9", "8", ".", ".", ".", ".", "6", "."],
    [".", ".", ".", ".", "6", ".", ".", ".", "3"],
    ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
    ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
    [".", "6", ".", ".", ".", ".", "2", "8", "."],
    [".", ".", ".", "4", "1", "9", ".", ".", "5"],
    [".", ".", ".", ".", "8", ".", ".", "7", "9"],
  ];
  worker.postMessage(data);
  worker.onmessage = (e) => {
    console.log(e.data);
  };
}
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
