import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

const createTicket = () => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({ title: 'random title', price: 55 })
    .expect(201);
};

it('should return an array of ticket with status 200', async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app).get('/api/tickets').send();

  expect(response.body.length).toEqual(3);
  expect(response.body[0].title).toEqual('random title');
  expect(response.body[0].price).toEqual(55);
});
