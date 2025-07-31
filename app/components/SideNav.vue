<script setup lang="ts">
    import { ref, watch , defineProps, defineEmits } from 'vue'
    import FileTreeItem from './FileTreeItem.vue';
    import { makeFileTree, type TreeItem } from '~/composables/makeFileTree';

    // /[userName].vueからuserNameをpropsとして受け取る
    const prop_userName = defineProps<{
        userName: string
    }>()
    const emit_selectedFile = defineEmits<{
        (e: 'select', fileName: string): void
    }>()
    console.log('prop_userName:', prop_userName.userName)

    
    const { data: md_path, pending } = await useFetch(`/api/markdown/${prop_userName.userName}`);

    const { fileTree } = makeFileTree(md_path);

    const openFolders = ref<Record<string, boolean>>({});
    function toggleFolder(path: string) {
        openFolders.value[path] = !openFolders.value[path];
    }

    watch(md_path, (val) => {
        console.log('md_path updated:', val);
    }, {immediate: true})

    // ファイル選択時に親コンポーネントにイベントをemit
    function selectFile(fileName: string) {
        emit_selectedFile('select', fileName);
    }
</script>
<template>
  <div class="file-explorer">
    <div class="header">ファイル一覧</div>
    <div v-if="pending">読み込み中...</div>
    <div v-else>
      <FileTreeItem
        v-for="item in fileTree"
        :key="item.path"
        :item="item"
        :depth="0"
        :open-folders="openFolders"
        @toggle-folder="toggleFolder"
        @select-file="selectFile"
      />
    </div>
  </div>
</template>

<style scoped>
/* style部分も変更なし！ */
.file-explorer {
  color: #ccc;
  font-family: sans-serif;
  font-size: 14px;
}
.header {
  padding: 10px;
  font-weight: bold;
  color: #888;
  text-transform: uppercase;
  font-size: 11px;
}
</style>