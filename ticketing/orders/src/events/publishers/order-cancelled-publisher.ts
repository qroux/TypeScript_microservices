import { Publisher, OrderCancelledEvent, Subjects } from '@qroux-corp/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
