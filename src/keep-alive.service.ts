import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';

@Injectable()
export class KeepAliveService {
  private readonly logger = new Logger(KeepAliveService.name);

  // La expresión '* * * * *' indica que se ejecuta cada minuto
  @Cron('* * * * *')
  async sendPing() {
    console.log('Iniciando la solicitud de ping...');
    this.logger.log('Iniciando la solicitud de ping...');
    
    try {
      await axios.get('http://18.188.173.108'); // Cambia la URL si es necesario
      console.log('Solicitud enviada correctamente para mantener vivo el servicio');
      this.logger.log('Solicitud enviada correctamente para mantener vivo el servicio');
    } catch (error) {
      this.logger.error('Error al enviar la solicitud', error.stack);
    }
  }
}
