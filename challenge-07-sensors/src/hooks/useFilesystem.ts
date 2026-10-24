import { useState } from 'react';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';

export default function useFilesystem() {
  const [files, setFiles] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const run = async (fn: () => Promise<void>) => {
    setError(null);
    try { await fn(); } catch (e: any) { setError(e.message); }
  };

  const listFiles = () =>
    run(async () => {
      const res = await Filesystem.readdir({ path: '', directory: Directory.Documents });
      setFiles(res.files.map((f) => f.name));
    });

  const writeFile = (name: string, data: string) =>
    run(async () => {
      await Filesystem.writeFile({ path: name, data, directory: Directory.Documents, encoding: Encoding.UTF8 });
      await listFiles();
    });

  const readFile = (name: string) =>
    run(async () => {
      const res = await Filesystem.readFile({ path: name, directory: Directory.Documents, encoding: Encoding.UTF8 });
      setContent(typeof res.data === 'string' ? res.data : await (res.data as Blob).text());
    });

  const deleteFile = (name: string) =>
    run(async () => {
      await Filesystem.deleteFile({ path: name, directory: Directory.Documents });
      setContent('');
      await listFiles();
    });

  return { files, content, error, listFiles, writeFile, readFile, deleteFile };
}
