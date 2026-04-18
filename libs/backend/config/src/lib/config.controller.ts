import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '@workspace/auth/lib/auth.guard';
import { ConfigSetDTO } from '@workspace/commons/dtos/config/config-set.dto';
import { ConfigService } from './config.service';

@Controller('config')
export class ConfigController {
  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService
  ) {}

  @Get('/:name')
  @UseGuards(AuthGuard)
  public getConfig(@Param('name') name: string) {
    return this.configService.get(name);
  }

  @UseGuards(AuthGuard)
  @Post('/')
  public setConfig(@Body() dto: ConfigSetDTO) {
    return this.configService.set(dto);
  }

  @Get('hb')
  public heartBeat() {
    return { status: 'OK' };
  }
}
