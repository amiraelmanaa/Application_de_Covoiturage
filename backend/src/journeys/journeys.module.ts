import { Module } from '@nestjs/common';
import { JourneysService } from './journeys.service';
import { JourneysRepository } from './journeys.repository';

@Module({
  providers: [JourneysService, JourneysRepository],
  exports: [JourneysService],
})
export class JourneysModule {}