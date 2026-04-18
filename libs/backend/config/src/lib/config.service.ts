import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Config } from '@workspace/be-commons/entities/config.entity';
import { ConfigSetDTO } from '@workspace/commons/dtos/config/config-set.dto';

@Injectable()
export class ConfigService {

  constructor(
    @InjectRepository(Config)
    private readonly configRepository: Repository<Config>
  ) {}

  /**
   * set key value config
   * @param param0
   * @returns
   */
  async set(dto: ConfigSetDTO): Promise<Config> {
    const exists = await this.configRepository.findOneBy({ name: dto.name });
    return await this.configRepository.save({ ...(exists ?? {}), ...dto });
  }

  /**
   * get key value config
   * @param param0
   * @returns
   */
  async get(name: string): Promise<Config | null> {
    return await this.configRepository.findOne({ where: { name } });
  }
}
