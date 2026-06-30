onRecordAfterCreateRequest((e) => {
    try {
        const orderId = e.record.get("orderId")
        const amount = e.record.get("amount")
        const products = e.record.get("products")
        const customerSnapshot = e.record.get("customerSnapshot")
        
        const payload = {
            orderId: orderId,
            amount: amount,
            products: products,
            customerSnapshot: customerSnapshot
        }
        
        $http.send({
            url: "http://127.0.0.1:4000/api/generate-invoice",
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json"
            },
            timeout: 10 // seconds
        })
    } catch (err) {
        $app.logger().error("Failed to call mailer service: " + err)
    }
}, "orders")
