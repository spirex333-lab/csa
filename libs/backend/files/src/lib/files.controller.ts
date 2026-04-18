import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  AuthenticatedRequest,
  CRUDController,
  ENV_API_PREFIX,
} from '@workspace/be-commons';
import { Public } from '@workspace/be-commons/decorators/is-public.decorator';
import { CreateFileDTO } from '@workspace/commons/dtos/files/create-file.dto';
import { FileDTO } from '@workspace/commons/dtos/files/file.dto';
import { Request, Response } from 'express';
import { createReadStream, existsSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, resolve } from 'path';
import { v4 } from 'uuid';
import { ENV_FILES_UPLOAD_PATH } from './files.constants';
import { FilesService } from './files.service';

export const UPLOADS_DIR = process.env?.[ENV_FILES_UPLOAD_PATH] ?? 'uploads';

@Controller('files')
export class FilesController extends CRUDController<FileDTO> {
  constructor(
    @Inject(FilesService)
    private readonly filesService: FilesService
  ) {
    super(filesService, FileDTO as any, FileDTO as any);
  }

  @Public()
  @Get(`${UPLOADS_DIR}/:path`)
  public async uploads(
    @Param('path') path: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const fullPath = resolve(UPLOADS_DIR, path); // Adjust base path as needed
    try {
      const fileExists = existsSync(fullPath);
      if (!fileExists) {
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);
      }

      // const fileStat = statSync(fullPath);
      const fileStream = createReadStream(fullPath);
      // res.setHeader('Content-Length', fileStat.size + '');
      // res.setHeader('Content-Type', this.getContentType(fullPath));
      // // res.setHeader(
      // //   'Content-Disposition',
      // //   'attachment; filename=' + basename(fullPath)
      // // );

      fileStream.pipe(res);
    } catch (error) {
      throw new HttpException(
        'Error reading file' + (error as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('/')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: `./${UPLOADS_DIR}`,
        filename: (req, file, callback) => {
          const uniqueName = `${v4()}${extname(file.originalname)}`;
          callback(null, uniqueName);
        },
      }),
    })
  )
  override async create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateFileDTO,
    @UploadedFile() file: Express.Multer.File
  ) {
    const host = req.protocol + '://' + req.get('host');
    const fileData: CreateFileDTO = {
      originalName: file.originalname,
      path: host + `/${process?.env?.[ENV_API_PREFIX]}/files/` + file.path,
      size: file.size,
      mimeType: file.mimetype,
      tenant: (req as any).tenant ?? req.user,
    };
    return await this.filesService.create({ req, dto: fileData });
  }
}
