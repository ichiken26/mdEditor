<script setup lang="ts">
    import { computed } from 'vue'
    import { marked } from 'marked'

    const props = defineProps<{
        source: string
        scrollRatio?: number
    }>()

    // MarkdownをHTMLに変換
    const renderedHtml = computed(() => {
        return marked(props.source, { breaks: true, gfm: true })
    })
    const previewRef = ref<HTMLElement | null>(null)

    // スクロール位置を同期するためのプロパティ
    watch(() => props.scrollRatio, (newRatio) => {
        if (previewRef.value) {
            const extraPadding = 40 // 余分なパディングを考慮
            // スクロール位置を計算して設定
            // scrollHeight - clientHeight はコンテンツの高さから表示領域の高さ
            const scrollHeight = previewRef.value.scrollHeight - previewRef.value.clientHeight + extraPadding;
            previewRef.value.scrollTop = scrollHeight * (newRatio ?? 0);
        }
    }, { immediate: true })

</script>
<template>
    <main class="prev-field" ref="previewRef">
        <div 
            class="markdown-preview"
            v-html="renderedHtml"
        ></div>
    </main>
</template>
<style scoped>
    .prev-field{
        width: 100%;
        height: 100%;
        background: #2f2f2f;
        color: #e0e0e0;
        overflow-y: auto;
        padding: 1rem;
        box-sizing: border-box;
    }

    .markdown-preview {
        font-family: 'Fira Mono', 'Consolas', 'Menlo', 'Monaco', 'monospace', 'sans-serif';
        font-size: 1.1rem;
        line-height: 1.7;
        word-break: break-word;
    }
    .markdown-preview h1, .markdown-preview h2, .markdown-preview h3, .markdown-preview h4, .markdown-preview h5, .markdown-preview h6, .markdown-preview h7 {
        color: #4fc3f7;
        margin-top: 1.5rem;
        margin-bottom: 0.5rem;
    }
    .markdown-preview code {
        background-color: #232323;
        color: #ffcb6b;
        padding: 0.2rem 0.4rem;
        border-radius: 4px;
        font-size: 0.95em;
    }
    .markdown-preview pre {
        background-color: #232323;
        color: #b2ccd6;
        padding: 1em;
        border-radius: 6px;
        overflow-x: auto;
    }
    .markdown-preview a {
        color: #82aaff;
        text-decoration: underline;
    }
    .markdown-preview a:hover {
        color: #4fc3f7;
        text-decoration: none;
    }
    .markdown-preview p {
        margin: 1em 0;
        line-height: 1.6;
    }
    .markdown-preview ul, .markdown-preview ol {
    margin-left: 1.5em;
    }
    .markdown-preview li {
        margin-bottom: 0.5em;
    }
    .markdown-preview blockquote {
        border-left: 4px solid #4fc3f7;
        padding-left: 1em;
        color: #b2ccd6;
        margin: 1em 0;
    }
    .markdown-preview img {
        max-width: 100%;
        height: auto;
        border-radius: 4px;
        margin: 1em 0;
    }
    .markdown-preview table {
        width: 100%;
        border-collapse: collapse;
        margin: 1em 0;
    }
    .markdown-preview th, .markdown-preview td {
        border: 1px solid #4fc3f7;
        padding: 0.5em;
        text-align: left;
    }
    .markdown-preview th {
        background-color: #4fc3f7;
        color: #fff;
    }
    .markdown-preview hr {
        border: none;
        border-top: 1px solid #4fc3f7;
        margin: 1.5em 0;
    }
    .markdown-preview strong {
        color: #ffcb6b;
        font-weight: bold;
    }
    .markdown-preview em {
        color: #ffcb6b;
        font-style: italic;
    }
    .markdown-preview del {
        color: #ff5370;
        text-decoration: line-through;
    }
    .markdown-preview sub {
        font-size: 0.8em;
        vertical-align: sub;
    }
    .markdown-preview sup { 
        font-size: 0.8em;
        vertical-align: super;
    }
</style>