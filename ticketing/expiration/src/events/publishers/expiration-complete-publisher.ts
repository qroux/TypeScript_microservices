import {
  Publisher,
  ExpirationCompleteEvent,
  Subjects,
} from '@qroux-corp/common';

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  readonly subject = Subjects.ExpirationComplete;
}
