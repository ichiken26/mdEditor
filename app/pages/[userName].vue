<script setup lang="ts">
import { useRoute } from '#imports';
import { ref, watch } from 'vue';
import SideNav from '~/components/SideNav.vue';
import TextField from '~/components/TextField.vue';

// ルートからuserNameを取得
const route = useRoute()
const userName = route.params.userName as string

// サイドナビで選択されたmdファイル名
const selectedFile = ref<string | null>(null)
// mdファイルの内容
const markdownText = ref<string>('# 左のエリアはMarkdownエディタです  \n\n右のエリアはプレビュー画面です')

// スクロール割合を取得
const editorScrollRatio = ref(0)

// サイドナビからファイル選択イベントを受け取る
function handleFileSelect(fileName: string) {
  selectedFile.value = fileName
}

// ファイルが選択されたらAPIから内容を取得
watch(selectedFile, async (fileName) => {
  if (fileName) {
    const { data } = await useFetch<string>(`/api/markdown/${userName}/${fileName}`)
    markdownText.value = data.value || ''
  }
})

// textareaのスクロールイベントハンドラ
function handleEditorScroll(ratio: number) {
  editorScrollRatio.value = ratio
}
</script>

<template>
  <main class="editor-layout">
    <div class="side-nav">
      <SideNav 
        :userName="userName" 
        @select="handleFileSelect" 
      />
    </div>
    <div class="text-field">
      <TextField 
        v-model="markdownText" 
        @scroll-ratio="handleEditorScroll"
      />
    </div>
    <div class="preview-field">
      <PreviewField 
        :source="markdownText" 
        :scrollRatio="editorScrollRatio"
      />
    </div>
  </main>
</template>

<style>
.editor-layout {
  display: flex;
  height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}
.side-nav {
  flex: 0 0 250px;
  padding: 1rem;
  background-color: #181818;
  border-right: 1px solid #1F1F1F;
  box-sizing: border-box;
}
.text-field {
  flex: 1;
  padding: 1rem;
  background-color: #1F1F1F;
  border-right: 3px solid #181818;
  box-sizing: border-box;
  display: flex;
}
.preview-field {
  flex: 1;
  padding: 1rem;
  background-color: #2F2F2F;
  box-sizing: border-box;
  overflow-y: auto;
}
</style>