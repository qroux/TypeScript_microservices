const OrderIndex = ({ currentUser, orders }) => {
  console.log(orders);
  const orderList = orders.map((order) => {
    return (
      <tr key={order.id}>
        <td>{order.id}</td>
        <td>{order.ticket.title}</td>
        <td>{order.ticket.price}</td>
        <td>{order.status}</td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Orders History</h1>
      <h5>(Account: {currentUser.email})</h5>
      <table className="table mt-5">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Ticket</th>
            <th>Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>{orderList}</tbody>
      </table>
    </div>
  );
};

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/orders');

  return { orders: data };
};

export default OrderIndex;
