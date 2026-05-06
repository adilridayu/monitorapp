/**
 * Items Controller
 * HTTP endpoints for item operations
 */

import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ItemService } from './items.service';
import { Item } from './entities/item.entity';

@Controller('items')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createItemDto: Partial<Item>): Promise<Item> {
    return this.itemService.create(createItemDto);
  }

  @Get()
  async findAll(): Promise<Item[]> {
    return this.itemService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Item> {
    return this.itemService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateItemDto: Partial<Item>): Promise<Item> {
    return this.itemService.update(id, updateItemDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.itemService.remove(id);
  }
}