// userNameとfilePathとmarkdownTextを引数に取り、markdownTextの内容をファイルに保存する
import { getRouterParam, setResponseStatus, setResponseHeaders } from 'h3';
import { writeFile, mkdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'

export default defineEventHandler(async (event) => {
    console.log('Save file API called');
    try {
        // URLの一部「{userName}」を取得する組み込み関数
        const userName = getRouterParam(event, 'userName');
        // userNameがundefinedだと!userNameはfalse
        if (!userName) {
            setResponseStatus(event, 400);
            return { error: 'UserName is not defined' };
        }

        // フォームのデータを読み取るNuxtの組み込み関数
        const formData = await readMultipartFormData(event);
        // fileという名前でデータを返す
        //formDataは値はnullまたはundefinedの可能性があるので?をつけておく(オプショナルチェニング)
        const fileData = formData?.find(part => part.name === 'file');
        console.log('fileData:', fileData);
        // FileNotFoundError
        // fileDataの中に値が入っていない(!)ときはfalse
        // fileData.data.lengthが0のとき(!)はfalse
        // この2つの条件のどちらか(|| (or演算子))でエラーをraiseしている
        if (!fileData || !fileData.data.length){
            // 400番エラーをset
            setResponseStatus(event, 400);
            return {error: 'ファイルが見つかりません'};
        }
        // 保存するパスを組み立てる
        const baseURL = process.cwd() + '/users/' + userName;
        const savePath = join(baseURL, fileData.filename? fileData.filename : 'uploaded_file.md');


        // const { userName, filePath, markdownText } = body;
        console.log(`Received data: userName=${userName}, filePath=${savePath}, fileData.data=${fileData.data}`);


        // ファイルを書き込む前にフォルダだけ作成
        const dirPath = dirname(savePath);
        await mkdir(dirPath, { recursive: true });

        // ファイルに書き込む
        try {
            await writeFile(savePath, fileData.data, 'utf-8');
            console.log(`File saved successfully: ${savePath}`);
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