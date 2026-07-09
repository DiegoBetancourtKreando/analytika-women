import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);
  private readonly apiKey: string | undefined;
  private readonly openai: any = null;

  constructor(private readonly prisma: PrismaService) {
    this.apiKey = process.env.OPENAI_API_KEY;
  }

  private async getOpenAI() {
    if (!this.apiKey) {
      return null;
    }

    try {
      const { default: OpenAI } = await import('openai');
      return new OpenAI({ apiKey: this.apiKey });
    } catch {
      this.logger.warn('OpenAI package not available, using fallback');
      return null;
    }
  }

  async chat(sessionId: string, message: string) {
    const openai = await this.getOpenAI();

    if (!openai) {
      const fallbackResponse = `Este es un modo de respuesta simulado. OpenAI no está configurado. Mensaje recibido: "${message}"`;

      await this.prisma.aIMessage.create({
        data: {
          sessionId,
          role: 'assistant',
          content: fallbackResponse,
          model: 'fallback',
        },
      });

      return {
        response: fallbackResponse,
        simulated: true,
      };
    }

    try {
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Eres un asistente especializado en violencia de género y apoyo a mujeres. Responde con empatía, profesionalismo y proporciona información útil y recursos.',
          },
          { role: 'user', content: message },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const response = completion.choices[0]?.message?.content || 'No se pudo generar una respuesta';
      const tokensUsed = completion.usage?.total_tokens;

      await this.prisma.aIMessage.create({
        data: {
          sessionId,
          role: 'assistant',
          content: response,
          tokensUsed,
          model: process.env.OPENAI_MODEL || 'gpt-4',
        },
      });

      await this.prisma.aIMessage.create({
        data: {
          sessionId,
          role: 'user',
          content: message,
        },
      });

      return { response };
    } catch (error: any) {
      this.logger.error('Error calling OpenAI:', error.message);
      return {
        response: 'Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo más tarde.',
        error: error.message,
      };
    }
  }

  async classify(text: string) {
    const openai = await this.getOpenAI();

    if (!openai) {
      return {
        classification: 'No clasificado',
        confidence: 0,
        simulated: true,
      };
    }

    try {
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Clasifica el siguiente texto en una de estas categorías:
            - VIOLENCIA_FISICA
            - VIOLENCIA_PSICOLOGICA
            - VIOLENCIA_SEXUAL
            - VIOLENCIA_ECONOMICA
            - VIOLENCIA_PATRIMONIAL
            - VIOLENCIA_DIGITAL
            - OTRO
            
            Responde solo con un JSON con los campos: classification, confidence (0-1), explanation`,
          },
          { role: 'user', content: text },
        ],
        temperature: 0.3,
      });

      const response = completion.choices[0]?.message?.content || '{}';

      try {
        return JSON.parse(response);
      } catch {
        return {
          classification: 'OTRO',
          confidence: 0.5,
          explanation: response,
        };
      }
    } catch (error: any) {
      this.logger.error('Error classifying text:', error.message);
      return {
        classification: 'Error',
        confidence: 0,
        error: error.message,
      };
    }
  }

  async summarize(text: string) {
    const openai = await this.getOpenAI();

    if (!openai) {
      return {
        summary: `Resumen simulado (OpenAI no configurado). Texto original: "${text.substring(0, 100)}..."`,
        simulated: true,
      };
    }

    try {
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Resume el siguiente texto de manera concisa, manteniendo los puntos clave importantes. Responde en español.',
          },
          { role: 'user', content: text },
        ],
        temperature: 0.5,
        max_tokens: 500,
      });

      const summary = completion.choices[0]?.message?.content || 'No se pudo generar un resumen';

      return { summary };
    } catch (error: any) {
      this.logger.error('Error summarizing text:', error.message);
      return {
        summary: 'Error al generar resumen',
        error: error.message,
      };
    }
  }
}
