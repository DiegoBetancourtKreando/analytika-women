import { Module } from '@nestjs/common';
import { DynamicFormsController } from './dynamic-forms.controller';
import { DynamicFormsService } from './dynamic-forms.service';

@Module({
  controllers: [DynamicFormsController],
  providers: [DynamicFormsService],
  exports: [DynamicFormsService],
})
export class DynamicFormsModule {}
