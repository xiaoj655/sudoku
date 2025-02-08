<script setup>
import { ref } from "vue";
import { sudoku_data } from "@/sudoku_data";
import Board from "@/components/board.vue";

let data = ref(),
  layout = ref(),
  solvingMode = ref(0),
  con = ref(),
  result = ref([]),
  solvingResult = ref("");

function init() {
  solvingMode.value = 0;
  const idx = Math.floor(Math.random() * sudoku_data.length);
  const d = sudoku_data[idx];
  data.value = d.value;
  layout.value = d.layout;
}

init();

const colors = [
  "#14b8a6",
  "#87CEEB", // 天蓝色 (Sky Blue)
  "#FF7F50", // 珊瑚色 (Coral)
  "#98FF98", // 薄荷绿 (Mint Green)
  "#E6E6FA", // 淡紫色 (Lavender)
  "#84cc16",
  "#FFDAB9", // 桃粉色 (Peach Pink)
  "#a78bfa",
  "#0ea5e9",
];

function test() {
  const worker = new Worker("worker.js");
  let c = Array.from(con.value.children).map((e) =>
    e.value === "" ? "." : e.value,
  );
  c = Array.from({ length: 9 }, (_, i) => c.slice(i * 9, i * 9 + 9));
  data.value = c;
  result.value.length = 0;
  worker.postMessage(c);
  solvingResult.value = "开始递归计算";

  worker.onmessage = (e) => {
    if (e.data === -1) {
      solvingResult.value = "迭代完成, 可行解数量: " + result.value.length;
    }

    result.value.push(e.data);
    if (result.value.length >= 10) {
      worker.terminate();
      solvingResult.value = "迭代完成, 可行解数量>= " + result.value.length;
    }
  };
}

function next(e) {
  if (!e.data) return;

  let n = e.target.nextElementSibling;
  while (n) {
    if (n.disabled) n = n.nextElementSibling;
    else break;
  }
  n.focus();
}

function toSolvingMode() {
  solvingMode.value = 1;
  data.value = Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => "."),
  );
}
</script>

<template>
  <main style="max-width: 1024px; margin: 0 auto; padding: 32px">
    <div style="text-align: center; margin-bottom: 24px">
      <button class="btn" @click="init">新题目</button>
      <button class="btn" @click="toSolvingMode">求解数独</button>
    </div>

    <div class="grid" ref="con">
      <input
        v-for="i in Array.from({ length: 81 }, (_, i) => i)"
        :value="
          data[Math.floor(i / 9)][i % 9] === '.'
            ? ''
            : data[Math.floor(i / 9)][i % 9]
        "
        :key="i"
        @input="next"
        maxlength="1"
        :disabled="!solvingMode && data[Math.floor(i / 9)][i % 9] !== '.'"
        :style="{
          fontWeight:
            data[Math.floor(i / 9)][i % 9] !== '.' ? 'bold' : 'normal',
          fontSize: data[Math.floor(i / 9)][i % 9] === '.' ? '18px' : '24px',
          color: data[Math.floor(i / 9)][i % 9] === '.' ? 'black' : '#475569',
          backgroundColor: colors[layout[Math.floor(i / 9)][i % 9]],
        }"
        style="
          width: 100%;
          height: 100%;
          text-align: center;
          border-style: none;
          border-radius: 4px;
        "
      />
    </div>
    <div style="text-align: center; padding: 18px 0">
      <button
        @click="test"
        v-if="solvingMode"
        class="btn"
        style="background-color: greenyellow"
      >
        测试有效性
      </button>
    </div>
    <div style="font-size: 22px; border-top: 2px solid #ccc; padding: 24px 0">
      {{ solvingResult }}
    </div>
    <div
      style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 32px"
    >
      <Board :colors="colors" v-for="d in result" :data="d" :layout="layout" />
    </div>
  </main>
</template>

<style scoped>
.grid {
  display: grid;
  max-width: 100%;
  aspect-ratio: 1/1;
  /* height: 600px; */

  grid-template-columns: repeat(9, 1fr);
  grid-template-rows: repeat(9, 1fr);
  gap: 1px;
  border: 1px solid #ccc;
}

input:focus {
  outline-color: #06b6d4;
  outline-offset: 0px;
  outline-width: 4px;
}

.btn {
  padding: 16px 16px;
  margin-left: 24px;
  border-radius: 8px;
  font-size: 16px;
  background-color: transparent;
  border: none;
  background: #cbd5e1;
}

.btn:hover {
  cursor: pointer;
}
</style>
