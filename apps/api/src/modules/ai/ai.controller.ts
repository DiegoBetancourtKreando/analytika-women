import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AIService } from './ai.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

class ChatDto {
  sessionId: string;
  message: string;
}

class TextDto {
  text: string;
}

@ApiTags('AI')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post('chat')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Enviar mensaje al asistente AI' })
  async chat(@Body() dto: ChatDto) {
    return this.aiService.chat(dto.sessionId, dto.message);
  }

  @Post('classify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Clasificar texto usando AI' })
  async classify(@Body() dto: TextDto) {
    return this.aiService.classify(dto.text);
  }

  @Post('summarize')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resumir texto usando AI' })
  async summarize(@Body() dto: TextDto) {
    return this.aiService.summarize(dto.text);
  }
}
