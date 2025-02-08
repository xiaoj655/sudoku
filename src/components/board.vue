<script setup>
const { data, colors, layout } = defineProps(["data", "colors", "layout"]);
</script>

<template>
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
      :disabled="data[Math.floor(i / 9)][i % 9] !== '.'"
      :style="{
        fontWeight: data[Math.floor(i / 9)][i % 9] !== '.' ? 'bold' : 'normal',
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
</template>
