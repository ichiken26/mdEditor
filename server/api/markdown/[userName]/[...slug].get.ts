import { readFile } from 'fs/promises'
import { join } from 'node:path'

export default defineEventHandler(async (event) => {
  // URLの一部「{userName}」を取得する組み込み関数
  const userName = getRouterParam(event, 'userName');
  // fileNameはURLの残りの部分を取得
  const fileName = getRouterParam(event, 'slug')?.replace(/^\//, '') || '';

  if (!userName || !fileName) {
    setResponseStatus(event, 400);
    return { error: 'パラメータが不足しています' };
  }

  const baseURL = `${process.cwd()}/users/`;
  // ファイルパスを組み立て
  const filePath = join(baseURL, userName, fileName)
  console.log(`Reading file: ${filePath}`)

  try {
    const content = await readFile(filePath, 'utf-8')
    return content
  } catch (e) {
    // ファイルが存在しない場合やエラー時は404
    setResponseStatus(event, 404)
    return { error: `File 「${filePath}」 not found` }
  }
})