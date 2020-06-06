import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';

it('should return 404 if ticket not found at GET /api/tickets/:id ', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it('should return 200 if ticket is found at GET /api/tickets/:id ', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({ title: 'random title', price: 55 })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual('random title');
  expect(ticketResponse.body.price).toEqual(55);
});
