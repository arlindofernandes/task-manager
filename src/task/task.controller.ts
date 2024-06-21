import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TaskDto, TaskRouterParameters, findAllParameters } from './task.dto';
import { TaskService } from './task.service';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@UseGuards(AuthGuard)
@Controller('task')
@ApiTags('Tasks')
@ApiBearerAuth()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
  @Get()
  @ApiOperation({
    summary:
      'Lista todas as tarefas e filtra a lista com base nos parâmetros de título e e status.',
  })
  @ApiQuery({
    name: 'status',
    type: String,
    required: false,
    description: 'Filtrar tarefas por Status.',
  })
  @ApiQuery({
    name: 'title',
    type: String,
    required: false,
    description: 'Filtrar tarefas por título.',
  })
  @ApiResponse({ status: 200, description: 'Sucesso', type: [TaskDto] })
  @ApiBadRequestResponse({ description: 'Parâmetros inválidos' })
  async findAll(@Query() params: findAllParameters): Promise<TaskDto[]> {
    return this.taskService.findAll(params);
  }
  @Get('/:id')
  @ApiOperation({ summary: 'Encontre tarefa por ID.' })
  @ApiParam({ name: 'id', type: String, description: 'ID da tarefa' })
  @ApiResponse({ status: 200, description: 'Sucesso', type: TaskDto })
  @ApiBadRequestResponse({ description: 'ID Inválido' })
  async findById(@Param('id') id: string): Promise<TaskDto> {
    return this.taskService.findById(id);
  }
  @Post()
  @ApiOperation({ summary: 'Crie uma nova tarefa.' })
  @ApiResponse({
    status: 201,
    description: 'Tarefa criada com sucesso',
    type: TaskDto,
  })
  @ApiBadRequestResponse({ description: 'Parâmetro de entrada inválido' })
  async create(@Body() task: TaskDto): Promise<TaskDto> {
    return await this.taskService.create(task);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Atualizar uma tarefa existente' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID da tarefa a ser atualizada',
  })
  @ApiResponse({ status: 200, description: 'Tarefa atualizada com sucesso' })
  @ApiBadRequestResponse({ description: 'Parâmetro de entrada inválido' })
  async update(@Param() params: TaskRouterParameters, @Body() task: TaskDto) {
    await this.taskService.update(params.id, task);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'ID da tarefa a ser excluída' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID da tarefa a ser excluída',
  })
  @ApiResponse({ status: 200, description: 'Tarefa excluída com sucesso' })
  @ApiBadRequestResponse({ description: 'Parâmetro de entrada inválido' })
  @ApiOperation({ summary: 'Deleta uma tarefa pelo ID.' })
  async remove(@Param('id') id: string) {
    return await this.taskService.remove(id);
  }
}
