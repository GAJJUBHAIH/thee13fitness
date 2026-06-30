import PocketBase from 'pocketbase';
const pb = new PocketBase('http://127.0.0.1:8090');

async function run() {
  try {
    const payload = {
        orderId: 'ORD-' + Date.now(),
        customerSnapshot: { name: 'Test', email: 'test@test.com' },
        addressSnapshot: { city: 'Test' },
        phone: '1234567890',
        email: 'test@test.com',
        products: [{ id: '1', name: 'prod1', price: 100, quantity: 1, subtotal: 100 }],
        amount: 100,
        tax: 0,
        discount: 0,
        shipping: 0,
        paymentStatus: 'pending',
        deliveryStatus: 'processing',
      };
      
    const result = await pb.collection('orders').create(payload);
    console.log("Success:", result.id);
  } catch (err) {
    console.log("Error status:", err.status);
    console.log("Error details:", JSON.stringify(err.response?.data, null, 2));
    console.log("Error message:", err.message);
  }
}

run();
