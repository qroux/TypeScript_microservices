import { Publisher, Subjects, TicketUpdatedEvent } from '@qroux-corp/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
