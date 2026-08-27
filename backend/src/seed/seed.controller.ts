import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  // Un unico endpoint, pensado solo para desarrollo: borra todo lo que
  // haya en las tablas y las vuelve a llenar con initialData (seed-data.ts).
  @Get()
  executeSeed() {
    return this.seedService.runSeed();
  }
}
