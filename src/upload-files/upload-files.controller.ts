import { Controller, Post, UploadedFiles, UseInterceptors, Body, Get } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadFilesService } from './upload-files.service';

@Controller('api/upload-files')
export class UploadFilesController {
  constructor(private readonly uploadFilesService: UploadFilesService) {}

  @Post('files')
  @UseInterceptors(FilesInterceptor('files', 15))
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: any
  ) {
    try {
      console.log('Datos recibidos en el backend:', body);
      const { uploadedBy, title } = body;

      if (!uploadedBy) {
        throw new Error('Faltan datos en la petición');
      }

      const savedFiles = await this.uploadFilesService.saveFiles(files, uploadedBy, title);

      return {
        message: 'Archivos subidos correctamente',
        files: savedFiles
      };
    } catch (error) {
      console.error('Error en la subida:', error);
      return { message: 'Error al subir los archivos', error: error.message };
    }
  }

  @Get('photos')
  async listPhotos() {
    try {
      const photos = await this.uploadFilesService.getPhotos();
      return { photos };
    } catch (error) {
      return { message: 'Error al obtener las fotos', error: error.message };
    }
  }

  @Get('videos')
  async listVideos() {
    try {
      const videos = await this.uploadFilesService.getVideos();
      return { videos };
    } catch (error) {
      return { message: 'Error al obtener los videos', error: error.message };
    }
  }

  @Post('remove/photo')
  async removePhoto(@Body('fileName') fileName: string) {
    try {
      const removedFile = await this.uploadFilesService.removePhoto(fileName);
      return { message: 'Foto eliminda correctamente', fileName: removedFile };
    } catch (error) {
      return { message: 'Error al eliminar la foto', error: error.message };
    }
  }

  @Post('remove/video')
  async removeVideo(@Body('fileName') fileName: string) {
    try {
      const removedFile = await this.uploadFilesService.removeVideo(fileName);
      return { message: 'Video eliminado correctamente', fileName: removedFile };
    } catch (error) {
      return { message: 'Error al eliminar el video', error: error.message };
    }
  }
}