import {computed, type Ref } from 'vue';

// ファイルツリーの描くアイテムの型定義
// composablesとcomponentsの両方で使用されるため、共通の型として定義
export interface TreeItem {
    name: string;
    path: string;
    type: 'folder' | 'file';
    children?: TreeItem[];
}

export function makeFileTree(paths: Ref<string[] | null>) {
    const fileTree = computed((): TreeItem[] => {
        if (!paths.value) {
            return [];
        }

        const root: {children: TreeItem[] } = { children: [] };

        paths.value.forEach( path => {
            const parts = path.split('/');
            let currentLevel = root.children;

            parts.forEach((part, index) => {
                const isLastPart = index === parts.length - 1;
                let existingItem = currentLevel.find(node => node.name === part);
                if (existingItem) {
                    currentLevel = existingItem.children || [];
                } else {
                    const newNode: TreeItem = {
                        name: part,
                        path: parts.slice(0, index + 1).join('/'),
                        type: isLastPart ? 'file' : 'folder',
                        children: isLastPart ? undefined : [],
                    };
                    currentLevel.push(newNode);
                    currentLevel = newNode.children || [];
                }
            });
        });

        return root.children;
    });

    return { fileTree };
}