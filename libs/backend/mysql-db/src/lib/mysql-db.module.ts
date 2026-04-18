import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { resolve } from 'path';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        console.log('env', JSON.stringify(process.env, null, 2));
        return {
          type: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
          host: process?.env?.['POSTGRES_DB_HOST'] ?? 'localhost',
          port: parseInt(process?.env?.['POSTGRES_DB_PORT'] ?? '5432'),
          username: process?.env?.['POSTGRES_DB_USERNAME'] ?? 'postgres',
          password: String(process?.env?.['POSTGRES_DB_PASSWORD']),
          database: process?.env?.['POSTGRES_DB_NAME'],
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        };
      },
    }),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class MysqlDbModule {}
