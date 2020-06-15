import { Publisher, OrderCreatedEvent, Subjects } from '@qroux-corp/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
