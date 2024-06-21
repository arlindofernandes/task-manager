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

@UseGuards(AuthGuard)
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
  @Get()
  async findAll(@Query() params: findAllParameters): Promise<TaskDto[]> {
    return this.taskService.findAll(params);
  }
  @Get('/:id')
  async findById(@Param('id') id: string): Promise<TaskDto> {
    return this.taskService.findById(id);
  }
  @Post()
  async create(@Body() task: TaskDto): Promise<TaskDto> {
    return await this.taskService.create(task);
  }

  @Put('/:id')
  async update(@Param() params: TaskRouterParameters, @Body() task: TaskDto) {
    await this.taskService.update(params.id, task);
  }

  @Delete('/:id')
  async remove(@Param('id') id: string) {
    return await this.taskService.remove(id);
  }
}
