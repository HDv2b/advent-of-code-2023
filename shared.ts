import { readFile } from 'fs/promises';

export async function readData(path?: string): Promise<string[]> {
  const fileName = path || process.argv[2];
  const data = (await readFile(fileName)).toString().split('\n').map(x => x.replace('\r', ''));
  return data;
}
