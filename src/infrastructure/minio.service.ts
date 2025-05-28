import { createWriteStream } from "fs";
import { readFile } from "fs/promises";
import { Client } from "minio";
import { join, relative } from "path";
import { Readable } from "stream";
import { singleton } from "tsyringe";
import config from "../config/config";

@singleton()
export default class MinioService {
  private _minioClient!: Client;

  constructor() {
    this._minioClient = new Client({
      endPoint: config.fileStorage.host,
      port: config.fileStorage.port || 80,
      useSSL: config.fileStorage.useSSL,
      accessKey: config.fileStorage.accessKey,
      secretKey: config.fileStorage.secretKey,
    });
  }

  async uploadBuffer(filename: string, data: Buffer, bucketName?: string) {
    console.log(`upload ${filename} file to ${bucketName}`);
    const size = Buffer.byteLength(data);
    await this._minioClient.putObject(
      this.getDefaultBucket(bucketName),
      filename,
      data,
      size,
    );
    return filename;
  }

  readFile(filename: string, bucketName?: string): Promise<string> {
    return this.getFile(filename, bucketName).then(
      (rs) =>
        new Promise((resolve, reject) => {
          let data = "";
          rs.on("data", (chunk) => {
            data += chunk.toString();
          });

          rs.on("end", () => {
            resolve(data);
          });

          rs.on("error", (err) => {
            reject(err);
          });
        }),
    );
  }

  getFile(filename: string, bucketName?: string): Promise<Readable> {
    return this._minioClient.getObject(
      this.getDefaultBucket(bucketName),
      filename,
    );
  }

  downloadFileToTemp(filename: string, bucketName?: string): Promise<string> {
    const targetPath = this.getTempPath(filename);
    return new Promise((resolve, reject) => {
      try {
        const ws = createWriteStream(targetPath);
        this.getFile(filename, this.getDefaultBucket(bucketName))
          .then((rs) => {
            rs.pipe(ws);
            ws.on("finish", () => resolve(targetPath));
            ws.on("error", (err) =>
              reject(new Error(`Error writing file: ${err.message}`)),
            );
            rs.on("error", (err) =>
              reject(new Error(`Stream error: ${err.message}`)),
            );
          })
          .catch((err: Error) => reject(err));
      } catch (err: unknown) {
        reject(err as Error);
      }
    });
  }

  async withFiles(
    files: (string | undefined)[],
    fn: (
      cwd: string,
      files: Promise<string | undefined>[],
    ) => Promise<string[]>,
    bucketName?: string,
  ) {
    const targetFiles = files.map((fn) =>
      fn
        ? this.downloadFileToTemp(fn, this.getDefaultBucket(bucketName)).catch(
            (err) => {
              console.info(err);
              return undefined;
            },
          )
        : Promise.resolve(undefined),
    );
    const filesToUpload = await fn(this.getTempPath(), targetFiles);
    return Promise.all(
      filesToUpload.map((f) =>
        f
          ? this.uploadFile(
              f,
              this.getFilenameRelativeToTempPath(f),
              this.getDefaultBucket(bucketName),
            )
          : undefined,
      ),
    );
  }

  uploadFile(
    sourceFilename: string,
    targetFilename: string,
    bucketName?: string,
  ): Promise<void> {
    return readFile(sourceFilename).then((b) =>
      this.uploadBuffer(targetFilename, b, this.getDefaultBucket(bucketName)),
    );
    // .then(() => rm(sourceFilename));
  }

  deleteFile(filename: string, bucketName?: string) {
    console.log(
      `delete ${filename} file from ${this.getDefaultBucket(bucketName)}`,
    );
    return this._minioClient.removeObject(
      this.getDefaultBucket(bucketName),
      filename,
    );
  }

  public getTempPath(filename?: string) {
    return join("/tmp/md2pdf", filename ?? "");
  }

  public getFilenameRelativeToTempPath(filename: string): string {
    return relative(this.getTempPath(), filename);
  }

  public static getPublicLink(filename: string): string {
    return new URL(
      `${this.getDefaultBucket()}/${filename}`,
      config.fileStorage.public_url,
    ).toString();
  }

  public getDefaultBucket(v?: string): string {
    return MinioService.getDefaultBucket(v);
  }

  public static getDefaultBucket(v?: string): string {
    return v ?? config.fileStorage.bucket_name;
  }
}
