import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TaskDto, TaskStatusEnum, findAllParameters } from './task.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from 'src/db/entities/task.entities';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}
  private tasks: TaskDto[] = [];

  async create(task: TaskDto) {
    const taskToSave: TaskEntity = {
      title: task.title,
      description: task.description,
      status: TaskStatusEnum.TO_DO,
    };
    const createdTask = await this.taskRepository.save(taskToSave);

    return this.entityToDto(createdTask);
  }
  async findById(id: string): Promise<TaskDto> {
    const foundTask = await this.taskRepository.findOne({ where: { id } });
    if (!foundTask) {
      throw new HttpException(
        `task with ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.entityToDto(foundTask);
  }
  async findAll(params: findAllParameters): Promise<TaskDto[]> {
    const searchParams: FindOptionsWhere<TaskEntity> = {};

    if (params.title) {
      searchParams.title = Like(`%${params.title}`);
    }
    if (params.status) {
      searchParams.status = Like(`%${params.status}`);
    }

    const tasksFound = await this.taskRepository.find({
      where: searchParams,
    });

    return tasksFound.map((taskEntity) => this.entityToDto(taskEntity));
  }

  async update(id: string, task: TaskDto) {
    const foundTask = await this.taskRepository.findOne({ where: { id } });
    if (!foundTask) {
      throw new HttpException(
        `task with ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.taskRepository.update(id, this.dtoToEntity(task));
  }

  async remove(id: string) {
    const result = await this.taskRepository.delete(id);
    if (!result.affected) {
      throw new HttpException(
        `task with id ${id} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  private entityToDto(taskEntity: TaskEntity): TaskDto {
    return {
      id: taskEntity.id,
      title: taskEntity.title,
      description: taskEntity.description,
      status: TaskStatusEnum[taskEntity.status],
    };
  }

  private dtoToEntity(taskDto: TaskDto): Partial<TaskEntity> {
    return {
      title: taskDto.title,
      description: taskDto.description,
      status: taskDto.status,
    };
  }
}
