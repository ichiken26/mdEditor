<script setup lang="ts">
import { text } from 'node:stream/consumers';


    const modelValue = defineModel<string>();
    const emit = defineEmits<{
        (e: 'update:modelValue', value: string): void
        (e: 'scroll-ratio', ratio: number): void
    }>()

    function onScroll(e: Event) {
        const target = e.target as HTMLTextAreaElement;
        const scrollHeight = target.scrollHeight - target.clientHeight;
        const scrollTop = target.scrollTop;
        const scrollRatio = scrollHeight ? scrollTop / scrollHeight : 0;
        emit('scroll-ratio', scrollRatio);
    }

    // 開業時に末尾なら自動でスクロール
    function onInput(e: Event) {
        emit('update:modelValue', (e.target as HTMLTextAreaElement).value);
        nextTick(() =>{
            const el = textareaRef.value;
            if (!el) return;
            const scrollHeight = el.scrollHeight - el.clientHeight;
            if (scrollHeight - el.scrollTop < 10) {
                el.scrollTop = el.scrollHeight; // 最後までスクロール
            }
        });
    }
</script>

<template>
    <main class="main-text-field">
        <textarea
            v-model="modelValue"
            @input="emit('update:modelValue', $event.target?.value ?? '')"
            @scroll="onScroll"
            class="vs-ish-text-area"
            spellcheck="false"
            placeholder="ここにMarkdownを入力..."
        ></textarea>
    </main>
</template>
<style scoped>
    .main-text-field{
        width: 100%;
        height: 100%;
        background-color: #1e1e1e;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }

    .vs-ish-text-area {
        width: 100%;
        height: 100%;
        background-color: #1e1e1e;
        color: #d4d4d4;
        font-family: 'Fira Mono', 'Consolas', 'Menlo', 'Monaco', monospace;
        font-size: 1.1rem;
        border: none;
        outline: none;
        resize: none;
        padding: 1rem;
        line-height: 1.6;
        box-sizing: border-box;
        caret-color: #00bfff;
    }
</style>