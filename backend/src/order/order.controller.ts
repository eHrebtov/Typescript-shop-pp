import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsAdminGuard } from 'src/auth/isAdmin.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderToPayedDto } from './dto/update-order-to-payed.dto';
import { Order } from './order.model';
import { OrderService } from './order.service';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @ApiOperation({ summary: 'Create order' })
  @ApiResponse({ status: HttpStatus.CREATED, type: Order })
  @UseGuards(JwtAuthGuard)
  @Post()
  createOrder(
    @Body(new ValidationPipe()) orderDto: CreateOrderDto,
    @Req() req,
  ) {
    return this.orderService.createOrder(orderDto, req.user.id);
  }

  @ApiOperation({ summary: 'Get order by id' })
  @ApiResponse({ status: HttpStatus.CREATED, type: Order })
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  getOrderById(@Param('id') orderId: number, @Req() req) {
    return this.orderService.getOrderById(orderId, req.user.id);
  }

  @ApiOperation({ summary: 'Update order to payed' })
  @ApiResponse({ status: HttpStatus.OK, type: Order })
  @UseGuards(JwtAuthGuard)
  @Put('/pay/:orderId')
  updateOrderToPayed(
    @Body(new ValidationPipe()) paymentResult: UpdateOrderToPayedDto,
    @Param('orderId') orderId: number,
  ) {
    return this.orderService.updateOrderToPayed(paymentResult, orderId);
  }

  @ApiOperation({ summary: 'Update order to delivered. Admin only' })
  @ApiResponse({ status: HttpStatus.OK, type: Order })
  @UseGuards(IsAdminGuard)
  @Put('/delivered/:orderId')
  updateOrderToDelivered(@Param('orderId') orderId: number) {
    return this.orderService.updateOrderToDelivered(orderId);
  }
}
