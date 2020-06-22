import { Publisher, PaymentCreatedEvent, Subjects } from '@qroux-corp/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
