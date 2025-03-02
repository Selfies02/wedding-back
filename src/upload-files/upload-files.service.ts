import { Injectable } from '@nestjs/common';
import { join, extname } from 'path';
import { writeFile, existsSync, mkdirSync } from 'fs';
import { readdir, rename } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadFilesService {
  private baseUploadPath = join(__dirname, '..', '..', 'uploads');
  private photosPath = join(this.baseUploadPath, 'photos');
  private videosPath = join(this.baseUploadPath, 'videos');
  private removePath = join(this.baseUploadPath, 'remove');

  constructor() {
    // Crear las carpetas necesarias si no existen
    [this.baseUploadPath, this.photosPath, this.videosPath, this.removePath].forEach((path) => {
      if (!existsSync(path)) {
        mkdirSync(path, { recursive: true });
      }
    });
  }

  async saveFiles(files: Express.Multer.File[], uploadedBy: string, title?: string): Promise<string[]> {
    const savedFiles: string[] = [];

    // Sanitizar el título y el autor para usarlos en nombres de archivo
    const safeTitle = title ? title.replace(/\s+/g, '-') : 'sin-titulo';
    const safeAuthor = uploadedBy.replace(/\s+/g, '-');

    for (const file of files) {
        const fileExtension = extname(file.originalname);

        let targetFolder: string;
        if (['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'].includes(fileExtension)) {
            targetFolder = this.photosPath;
        } else if (['.mp4', '.mov', '.avi', '.mkv', '.wmv', '.flv'].includes(fileExtension)) {
            targetFolder = this.videosPath;
        } else {
            throw new Error(`Formato de archivo no permitido: ${file.originalname}`);
        }

        // Generar un nombre único con el título y autor
        const uniqueId = uuidv4().substring(0, 8); // Usar solo parte del UUID para mantener nombres más cortos
        const finalFileName = `${safeTitle}_${safeAuthor}_${uniqueId}${fileExtension}`;
        const filePath = join(targetFolder, finalFileName);

        await new Promise<void>((resolve, reject) => {
            writeFile(filePath, file.buffer, (err) => {
                if (err) reject(err);
                resolve();
            });
        });

        savedFiles.push(finalFileName);
    }

    return savedFiles;
  }

  async getPhotos(): Promise<string[]> {
    try {
      const files = await readdir(this.photosPath);
      return files;
    } catch (err) {
      throw new Error('Error al leer la carpeta de fotos');
    }
  }

  async getVideos(): Promise<string[]> {
    try {
      const files = await readdir(this.videosPath);
      return files;
    } catch (err) {
      throw new Error('Error al leer la carpeta de videos');
    }
  }

  async removePhoto(fileName: string): Promise<string> {
    const sourcePath = join(this.photosPath, fileName);
    const targetPath = join(this.removePath, fileName);
    await rename(sourcePath, targetPath);
    return fileName;
  }
  
  async removeVideo(fileName: string): Promise<string> {
    const sourcePath = join(this.videosPath, fileName);
    const targetPath = join(this.removePath, fileName);
    await rename(sourcePath, targetPath);
    return fileName;
  }
}