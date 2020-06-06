import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

// Request at PUT '/api/tickets/:id'

// Ticket builder
const createTicket = () => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({ title: 'random title', price: 55 })
    .expect(201);
};

// TESTS
it('returns 404 if ticket does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  const response = await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signup())
    .send({ title: 'random title', price: 55 })
    .expect(404);
});

it('returns 401 if NOT_SIGNED_IN', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  const response = await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: 'random title', price: 55 })
    .expect(401);
});

it('returns 401 if NOT_OWNER of the updated ticket', async () => {
  const response = await createTicket();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signup())
    .send({ title: 'modified title', price: 44 })
    .expect(401);
});

it('returns 400 if invalid PRICE or TITLE', async () => {
  const cookie = global.signup();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'random title', price: 55 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: '', price: -55 })
    .expect(400);
});

it('successfully updates a ticket if SIGNED_IN and valid PRICE and TITLE', async () => {
  const cookie = global.signup();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'random title', price: 55 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'modified title', price: 44 })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual('modified title');
  expect(ticketResponse.body.price).toEqual(44);
});
