import express, { Request, Response } from 'express';
import { requireAuth, OrderStatus } from '@qroux-corp/common';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  }).populate('ticket');

  res.send(orders);
});

export { router as indexOrderRouter };
