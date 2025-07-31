<script setup lang="ts">
import IconFolder from './IconFolder.vue';
import IconFile from './IconFile.vue';

// ----- 型定義 -----
interface TreeItem {
  name: string;
  path: string;
  type: 'folder' | 'file';
  children?: TreeItem[];
}

// ----- Props & Emits -----
const props = defineProps<{
  item: TreeItem;
  depth: number;
  openFolders: Record<string, boolean>;
}>();

const emit = defineEmits(['toggleFolder', 'selectFile']);

const isFolderOpen = computed(() => props.openFolders[props.item.path]);

function handleItemClick() {
  if (props.item.type === 'folder') {
    emit('toggleFolder', props.item.path);
  } else {
    emit('selectFile', props.item.path);
  }
}
</script>

<template>
  <div>
    <div class="tree-item" @click="handleItemClick" :style="{ paddingLeft: depth * 12 + 8 + 'px' }">
      <IconFolder v-if="item.type === 'folder'" :is-open="isFolderOpen" class="icon" />
      <IconFile v-else class="icon" />
      
      <span>{{ item.name }}</span>
    </div>

    <div v-if="item.type === 'folder' && isFolderOpen && item.children">
      <FileTreeItem
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :depth="depth + 1"
        :open-folders="openFolders"
        @toggle-folder="(path) => emit('toggleFolder', path)"
        @select-file="(path) => emit('selectFile', path)"
      />
    </div>
  </div>
</template>

<style scoped>
.tree-item {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  cursor: pointer;
  white-space: nowrap;
  color: #ccc;
}
.tree-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
.icon {
  width: 16px;
  height: 16px;
  margin-right: 6px;
  flex-shrink: 0;
}
</style>