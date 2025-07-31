// userNameとfilePathとmarkdownTextを引数に取り、markdownTextの内容をファイルに保存する
import { writeFile, mkdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'

export default defineEventHandler(async (event) => {
    try {
        // フロントエンドから送られてきたJSONボディを読み取る
        const body = await readBody(event);
        const { userName, filePath, markdownText } = body;

        // 必要なデータが存在するか確認
        if (!userName || !filePath || typeof markdownText !== 'string') {
            return { error: 'less of needed parameters' };
        }

        // 保存するファイルのパスを組み立て
        const savePath = join(process.cwd(), 'users', userName, filePath);
        console.log(`Saving file to: ${savePath}`);

        // ディレクトリが存在しない場合は作成
        const dir = dirname(savePath);
        try {
            await mkdir(dir, { recursive: true });
        } catch (error) {
            console.error(`Failed to create directory: ${dir}`, error);
            return { error: `Failed to create directory: ${dir}` };
        }

        // ファイルに書き込む
        try {
            await writeFile(savePath, markdownText, 'utf-8');
            return { success: true };
        } catch (error) {
            console.error(`Failed to write file: ${savePath}`, error);
            return { error: `Failed to write file: ${savePath}` };
        }

    } catch (error: any) {
        console.error('Error in saveFile.post:', error);
        setResponseStatus(event, 500, 'Internal Server Error');
        return { error: 'Internal server error' , details: error.message };
    }
});