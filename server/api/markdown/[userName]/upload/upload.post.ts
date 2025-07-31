// asyncで非同期処理
export default defineEventHandler(async (event) =>{
    // フォームのデータを読み取るNuxtの組み込み関数
    const formData = await readMultipartFormData(event);
    // fileという名前でデータを返す
    //formDataは値はnullまたはundefinedの可能性があるので?をつけておく(オプショナルチェニング)
    const fileData = formData?.find(part => part.name === 'file');

    // FileNotFoundError
    // fileDataの中に値が入っていない(!)ときはfalse
    // fileData.data.lengthが0のとき(!)はfalse
    // この2つの条件のどちらか(|| (or演算子))でエラーをraiseしている
    if (!fileData || !fileData.data.length){
        // 400番エラーをset
        setResponseStatus(event, 400);
        return {error: 'ファイルが見つかりません'};
    }

    console.log('ファイル名:', fileData.filename);
    console.log('ファイル形式:', fileData.type);
    console.log('ファイルサイズ:', fileData.data.length, 'bytes');

    // ファイルをサーバに保存する処理
    // 仮テストコード
    const dummyFileId = `file-${Date.now()}`
    setResponseStatus(event, 201);
    return {
        id: dummyFileId,
        message: `File Uploaded: ${fileData.filename}`
    };
})