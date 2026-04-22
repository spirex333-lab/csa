import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Orders } from '@workspace/be-commons/entities/orders.entity';
import { OrderEvent } from '@workspace/be-commons/entities/order-event.entity';
import { ChangeNow } from '@workspace/be-commons/entities/change-now.entity';
import { SwapRouterService } from '@workspace/change-now';
import { CreateOrdersDto } from '@workspace/commons/dtos/orders/create-orders.dto';
import { OrdersDto, InternalOrderStatus } from '@workspace/commons/dtos/orders/orders.dto';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectRepository(Orders)
    private readonly ordersRepo: Repository<Orders>,
    @InjectRepository(OrderEvent)
    private readonly eventRepo: Repository<OrderEvent>,
    @InjectRepository(ChangeNow)
    private readonly changeNowRepo: Repository<ChangeNow>,
    private readonly swapRouter: SwapRouterService,
  ) {}

  async createOrder(dto: CreateOrdersDto): Promise<OrdersDto> {
    const providerOrder = await this.swapRouter.createOrder(dto);

    // Both ChangeNowService and FfioService persist to change_now_orders before
    // returning, so this lookup is guaranteed to find a record.
    const changeNowRecord = await this.changeNowRepo.findOneOrFail({
      where: { externalId: providerOrder.id },
    });

    const order = this.ordersRepo.create({
      fromCanonical: dto.fromCanonical,
      toCanonical: dto.toCanonical,
      fromAmount: dto.fromAmount,
      expectedToAmount: providerOrder.expectedToAmount,
      depositAddress: providerOrder.depositAddress,
      toAddress: dto.toAddress,
      status: InternalOrderStatus.AWAITING_DEPOSIT,
      rateType: dto.rateType,
      provider: changeNowRecord.provider,
      externalId: providerOrder.id,
    });

    await this.ordersRepo.save(order);

    await this.eventRepo.save(
      this.eventRepo.create({
        order: changeNowRecord,
        internalOrder: order,
        eventType: 'order_created',
        payload: { orderId: order.id, provider: order.provider },
      }),
    );

    this.logger.log(`Order created: ${order.id} via ${order.provider}`);
    return this.toDto(order);
  }

  async getOrder(id: string): Promise<OrdersDto> {
    const order = await this.ordersRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    return this.toDto(order);
  }

  private toDto(order: Orders): OrdersDto {
    return {
      id: order.id,
      fromCanonical: order.fromCanonical,
      toCanonical: order.toCanonical,
      // MySQL decimal columns are returned as strings by the driver — cast explicitly
      fromAmount: Number(order.fromAmount),
      expectedToAmount: order.expectedToAmount != null ? Number(order.expectedToAmount) : undefined,
      depositAddress: order.depositAddress,
      toAddress: order.toAddress,
      status: order.status,
      rateType: order.rateType,
      provider: order.provider,
      externalId: order.externalId,
      createdAt: order.createdAt,
    };
  }
}
