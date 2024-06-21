import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { authResponseDto } from './auth.dto';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login de usuario' })
  @Post('login')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'john.doe' },
        password: { type: 'string', example: 'password123' },
      },
      required: ['username', 'password'],
    },
    examples: {
      user1: {
        value: { username: 'john.doe', password: 'password123' },
        summary: 'Exemplo de login de usuário',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'O usuário fez login com sucesso.',
  })
  async signIn(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<authResponseDto> {
    return this.authService.signIn(username, password);
  }
}
