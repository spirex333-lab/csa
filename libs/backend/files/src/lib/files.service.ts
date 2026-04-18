import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from '@workspace/be-commons';
import { File } from '@workspace/be-commons/entities/files.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FilesService extends CRUDService {
  constructor(
    @InjectRepository(File)
    private readonly filesRepository: Repository<File>
  ) {
    super(filesRepository);
  }
}
