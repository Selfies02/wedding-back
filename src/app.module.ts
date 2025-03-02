import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadFilesModule } from './upload-files/upload-files.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UploadFilesModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
