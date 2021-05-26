import JSZip from 'jszip';

export async function unzipFile(file: File | Buffer): Promise<string[]> {
  const zipFiles = await JSZip.loadAsync(file);

  const files = Object.keys(zipFiles.files).map(async (zipFile) => {
    try {
      
      return await zipFiles.file(zipFile)?.async('text');
    } catch (error) {
      return undefined;
    }
  });
  return (await Promise.all(files)).filter((file) => {
    return file !== undefined;
  }) as string[];
}
