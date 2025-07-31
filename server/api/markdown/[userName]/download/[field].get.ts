export default defineEventHandler((event) =>{
    // URLの一部「{fileId}」を取得する組み込み関数
    const fileId = getRouterParam(event, 'fileId');
    // FileIDNotFoundError
    // fileIdがundefinedだと!fileIdはfalse
    if (!fileId){
        setResponseStatus(event, 400);
        return {error: 'FileID is not defined'}
    }

    console.log(`Got fileId: ${fileId}`)

    // fileIDを使ってDBやファイル置き場から保存されているmdファイルのテキストデータを取得
    // ダミーテキストを返す
    const markdownContent = `# ${fileId}の内容\n\nこれはNuxtサーバーからダウンロードされた**Markdown**ファイルです。\n\n- リスト項目1\n- リスト項目2`;
    const fileName = `${fileId}.md`;

    // レスポンスヘッダーを設定し、ブラウザにダウンロード指示を送る
    setResponseHeaders(event, {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': `attachment; filename="${fileName}"`
    });

    // mdファイルのテキストをそのまま返す
    return markdownContent;
})