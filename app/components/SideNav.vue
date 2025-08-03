<script setup lang="ts">
    import { ref, watch , defineProps, defineEmits } from 'vue'

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

    // ユーザー名を使って、そのユーザー用のアップロードURLを決定
    const uploadUrl = `/api/markdown/${prop_userName.userName}/upload/uploadFile`;
    const { openFileDialog, isUploading, error } = useFileUpload(uploadUrl);
</script>
<template>
  <div class="file-explorer">
    <div class="upload-button">
      <button @click="openFileDialog" :disabled="isUploading">
        ファイルアップロード
      </button>
      <span v-if="isUploading">アップロード中...</span>
      <span v-if="error" class="error">{{ error.message }}</span>
    </div>
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
.upload-button {
  margin-top: 20px;
  padding-top: 10px;
  border-top: 1px solid #333;
}
.upload-button button {
  width: 100%;
  padding: 8px;
  background-color: #3a3d41;
  color: #ccc;
  border: 1px solid #555;
  border-radius: 4px;
  cursor: pointer;
}
.upload-button button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.error {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}
.file-tree-item {
  padding: 5px 10px;
  cursor: pointer;
}
.file-tree-item:hover {
  background-color: #f0f0f0;
}
.file-tree-item.selected {
  background-color: #d0e0f0;
}
.file-tree-item .folder-icon {
  margin-right: 5px;
}
.file-tree-item .file-icon {
  margin-right: 5px;
}
.file-tree-item .folder-name {
  font-weight: bold;
}
.file-tree-item .file-name {
  color: #333;
}
.file-tree-item .file-name:hover {
  text-decoration: underline;
} 
</style>