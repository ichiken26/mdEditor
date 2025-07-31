// userNameからマークダウンファイルのpathのリストを取得するAPI
import { getRouterParam, setResponseStatus, setResponseHeaders } from 'h3';

export default defineEventHandler((event) => {
    // URLの一部「{userName}」を取得する組み込み関数
    const userName = getRouterParam(event, 'userName');
    
    // userNameがundefinedだと!userNameはfalse
    if (!userName) {
        setResponseStatus(event, 400);
        return { error: 'UserName is not defined' };
    }

    console.log(`got userName: ${userName}`);

    // ユーザー名を使ってDBやファイル置き場から保存されているmdファイルのパスリストを取得
    // ダミーパスリストを返す
    const markdownPaths = [
        `/users/${userName}/docs/file1.md`,
        `/users/${userName}/docs/file2.md`,
        `/users/${userName}/docs/file3.md`,
        `/users/${userName}/file_test.md`,
        `/users/${userName}/scrolltest/scrolltest.md`,
    ];

    // ユーザ名以前はいらないので削除したい
    const basePathToRemove = `/users/${userName}/`;
    // 'map'と'replace'を使ってパスからユーザ名以前の部分を削除
    const relativePaths = markdownPaths.map(fullPath =>
        fullPath.replace(basePathToRemove, '')
    )
    console.log(`relativePaths: ${relativePaths}`);

    // レスポンスヘッダーを設定
    setResponseHeaders(event, {
        'Content-Type': 'application/json; charset=utf-8'
    });

    // mdファイルのパスリストをそのまま返す
    return relativePaths;
});