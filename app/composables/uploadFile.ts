import { ref } from 'vue';

/**
 * ファイルアップロード機能を提供するComposable
 * @param uploadUrl - ファイルをアップロードするAPIのエンドポイントURL
 */

export function useFileUpload(uploadUrl: string) {
    const isUploading = ref(false);
    const uploadError = ref<string | null>(null);

    // ファイル洗濯時のinput要素を一度だけ作成する
    let fileInput: HTMLInputElement | null = null;
    if (process.client) {
        fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.md'; // Markdownファイルのみを受け付ける
        fileInput.style.display = 'none'; // UIに表示しない
        document.body.appendChild(fileInput);

        // ファイルが選択されたときの処理
        fileInput.addEventListener('change', async (event) => {
            const target = event.target as HTMLInputElement;
            if (target.files && target.files.length > 0) {
                UploadFile(target.files[0]!);
                console.log('Selected file:', target.files[0]?.name);
            }
        });
    }

    // ファイルアップロード処理
    async function UploadFile(file: File) {
            isUploading.value = true;
            uploadError.value = null;

            const formData = new FormData();
            formData.append('file', file);

            try {
                // useFetchを使ってファイルをPOST
                const {error: fetchError } = await useFetch(uploadUrl, {
                    method: 'POST',
                    body: formData,
                });
                if (fetchError.value) {
                    throw fetchError.value;
                }
                console.log('uploadUrl:', uploadUrl);
                console.log(`Fetched post api: ${file.name}`);
            } catch (error: any) {
                uploadError.value = `failed to upload file: ${error.message}`;
            } finally {
                isUploading.value = false;
                // 同じファイルを再度選択できるように値をリセット
                if (fileInput) {
                    fileInput.value = '';
                    console.log('File input reset');
                }
            }
        }
    // ボタンから呼び出すための関数
    function openFileDialog() {
        if (fileInput) {
            fileInput.click();
        }
    }
    // コンポーネント側で使えるように、関数と状態を返す
    return {
        isUploading,
        uploadError,
        openFileDialog
    };
}