import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';

@Injectable()
export class KeepAliveService {
  private readonly logger = new Logger(KeepAliveService.name);

  // La expresión '* * * * *' indica que se ejecuta cada minuto
  @Cron('* * * * *')
  async sendPing() {
    try {
      await axios.get('https://wedding-back-bkutww.fly.dev'); // Cambia la URL si es necesario
      this.logger.log('Solicitud enviada correctamente para mantener vivo el servicio');
    } catch (error) {
      this.logger.error('Error al enviar la solicitud', error.stack);
    }
  }
}
