import { Observable, of } from 'rxjs';
import {
  readFile,
  copy,
  CopyOptions,
  ReadOptions,
  WriteOptions,
  MoveOptions,
  EnsureOptions,
  emptyDir,
  writeFile,
} from 'fs-extra';
import normalizePath from 'normalize-path';
import { map } from 'rxjs/operators';
import { flatMap$ } from './rx/flatMap$';
export function readFile$(fileName: string): Observable<Buffer> {
  return of(readFile(fileName)).pipe(flatMap$);
}

export function writeFile$(fileName: string, data: string | Buffer) {
  return of(writeFile(fileName, data)).pipe(flatMap$);
}

export const readFileMap = map((i: string) => readFile$(i));

export function emptyDir$(pathName: string) {
  return of(emptyDir(normalizePath(pathName))).pipe(flatMap$);
}

// export function copy$(src: string, dest: string, options?: CopyOptions): Observable<void>{return of(copy(src,dest,options)).pipe(flatMap$)}

// export function copyFile$(src: string, dest: string, flags?: number): Observable<void>{return of(copyFile()).pipe(flatMap$)}

// export function move$(src: string, dest: string, options?: MoveOptions): Observable<void>{return of(move()).pipe(flatMap$)}

// export function createFile$(file: string): Observable<void>{return of(createFile()).pipe(flatMap$)}

// export function ensureDir$(path: string, options?: EnsureOptions | number): Observable<void>{return of(ensureDir()).pipe(flatMap$)}

// export function mkdirs$(dir: string): Observable<void>{return of(mkdirs()).pipe(flatMap$)}

// export function mkdirp$(dir: string): Observable<void>{return of(mkdirp()).pipe(flatMap$)}

// export function outputFile$(file: string, data: any, options?: WriteFileOptions | string): Observable<void>{return of(outputFile()).pipe(flatMap$)}

// export function readJson$(file: string, options?: ReadOptions): Promise<any>;

// export function readJSON$(file: string, options?: ReadOptions): Promise<any>;

// export function readJsonSync$(file: string, options?: ReadOptions): any;
// export function readJSONSync$(file: string, options?: ReadOptions): any;
// export function remove$(dir: string): Observable<void>{return of(remove()).pipe(flatMap$)}

// export function outputJSON$(file: string, data: any, options?: WriteOptions): Observable<void>{return of(outputJSON()).pipe(flatMap$)}

// export function outputJson$(file: string, data: any, options?: WriteOptions): Observable<void>{return of(outputJson()).pipe(flatMap$)}

// export function writeJSON$(file: string, object: any, options?: WriteOptions): Observable<void>{return of(writeJSON()).pipe(flatMap$)}

// export function writeJson$(file: string, object: any, options?: WriteOptions): Observable<void>{return of(writeJson()).pipe(flatMap$)}

// export function ensureFile$(path: string): Observable<void>{return of(ensureFile()).pipe(flatMap$)}

// export function ensureLink$(src: string, dest: string): Observable<void>{return of(ensureLink()).pipe(flatMap$)}

// export function ensureSymlink$(src: string, dest: string, type?: SymlinkType): Observable<void>{return of(ensureSymlink()).pipe(flatMap$)}

// export function emptyDir$(path: string): Observable<void>{return of(emptyDir()).pipe(flatMap$)}

// export function pathExists$(path: string): Promise<boolean>;

// export function pathExistsSync$(path: string): boolean;

// export function access$(path: string | Buffer, mode?: number): Observable<void>{return of(access()).pipe(flatMap$)}

// export function appendFile$(file: string | Buffer | number, data: any, options?: { encoding?: string; mode?: number | string; flag?: string; }): Observable<void>{return of(appendFile()).pipe(flatMap$)}

// export function chmod$(path: string | Buffer, mode: string | number): Observable<void>{}
// export function cho of$(chmod())wn(path: string | Buffer, uid: number, gid: number): Observable<void>{return of(chown()).pipe(flatMap$)}

// export function close$(fd: number): Observable<void>{return of(close()).pipe(flatMap$)}

// export function fchmod$(fd: number, mode: string | number): Observable<void>{return of(fchmod()).pipe(flatMap$)}

// export function fchown$(fd: number, uid: number, gid: number): Observable<void>{return of(fchown()).pipe(flatMap$)}

// export function fdatasync$(fd: number): Observable<void>{return of(fdatasync()).pipe(flatMap$)}

// export function fstat$(fd: number): Promise<Stats>;

// export function fsync$(fd: number): Observable<void>{return of(fsync()).pipe(flatMap$)}

// export function ftruncate$(fd: number, len?: number): Observable<void>{return of(ftruncate()).pipe(flatMap$)}

// export function futimes$(fd: number, atime: number, mtime: number): Observable<void>{}
// export function futim of$(futimes())es(fd: number, atime: Date, mtime: Date): Observable<void>{return of(futimes()).pipe(flatMap$)}

// export function lchown$(path: string | Buffer, uid: number, gid: number): Observable<void>{return of(lchown()).pipe(flatMap$)}

// export function link$(srcpath: string | Buffer, dstpath: string | Buffer): Observable<void>{return of(link()).pipe(flatMap$)}

// export function lstat$(path: string | Buffer): Promise<Stats>;

// export function mkdir$(path: string | Buffer): Observable<void>{return of(mkdir()).pipe(flatMap$)}

// export function open$(path: string | Buffer, flags: string | number, mode?: number): Promise<number>;

// export function read$(fd: number, buffer: Buffer, offset: number, length: number, position: number | null): Promise<ReadResult>;

// export function readFile$(file: string | Buffer | number, options: { flag?: string; } | { encoding: string; flag?: string; }): Promise<string>;
// export function readFile$(file: string | Buffer | number, encoding: string): Promise<string>;
// export function readFile$(file: string | Buffer | number): Promise<Buffer>;

// export function readdir$(path: string | Buffer): Promise<string[]>;

// export function readlink$(path: string | Buffer): Promise<string>;

// export function realpath$(path: string | Buffer, cache?: { [path: string]: string }): Promise<string>;

// export function rename$(oldPath: string, newPath: string): Observable<void>{return of(rename()).pipe(flatMap$)}

// export function rmdir$(path: string | Buffer): Observable<void>{return of(rmdir()).pipe(flatMap$)}

// export function stat$(path: string | Buffer): Promise<Stats>;

// export function symlink$(srcpath: string | Buffer, dstpath: string | Buffer, type?: FsSymlinkType): Observable<void>{return of(symlink()).pipe(flatMap$)}

// export function truncate$(path: string | Buffer, len?: number): Observable<void>{return of(truncate()).pipe(flatMap$)}

// export function unlink$(path: string | Buffer): Observable<void>{return of(unlink()).pipe(flatMap$)}

// export function utimes$(path: string | Buffer, atime: number, mtime: number): Observable<void>{}
// export function utim of$(utimes())es(path: string | Buffer, atime: Date, mtime: Date): Observable<void>{return of(utimes()).pipe(flatMap$)}

// export function write$(fd: number, buffer: Buffer, offset: number, length: number, position?: number | null): Promise<WriteResult>;
// export function write$(fd: number, data: any, offset: number, encoding?: string): Promise<WriteResult>;

// export function writeFile$(file: string | Buffer | number, data: any, options?: WriteFileOptions | string): Observable<void>{return of(writeFile()).pipe(flatMap$)}

// export function mkdtemp$(prefix: string): Promise<string>;
