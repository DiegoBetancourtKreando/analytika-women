import { Module } from '@nestjs/common';
import { ViolenceReportsController } from './violence-reports.controller';
import { ViolenceReportsService } from './violence-reports.service';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ViolenceReportsController],
  providers: [ViolenceReportsService],
  exports: [ViolenceReportsService],
})
export class ViolenceReportsModule {}
