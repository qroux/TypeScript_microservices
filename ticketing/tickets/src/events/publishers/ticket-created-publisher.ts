import { Publisher, Subjects, TicketCreatedEvent } from '@qroux-corp/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
