document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('payment-form');
    const messageDiv = document.getElementById('payment-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            email: form.email.value,
            cardholderName: form['cardholder-name'].value,
            cardNumber: form['card-number'].value,
            expirationMonth: form['expiration-month'].value,
            expirationYear: form['expiration-year'].value,
            cvv: form.cvv.value,
            amount: form.amount.value,
            currency: form.currency.value,
            service: form.service.value
        };

        try {
            const response = await fetch('/payment/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            messageDiv.innerText = result.message;
            form.reset();
            console.log(result.apiResponse);
        } catch (err) {
            messageDiv.innerText = 'Error al procesar el pago';
        }
    });
});