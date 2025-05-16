# PetCare-js

## Descripción

Este proyecto es una aplicación web para la gestión de servicios de cuidado de mascotas, que incluye un formulario de contacto protegido con reCAPTCHA, envío de correos electrónicos usando Nodemailer y un formulario de pago que utiliza una API externa simulada (FakePayment).

---

## Implementación de reCAPTCHA

El formulario de contacto en la página principal (`index.ejs`) utiliza Google reCAPTCHA para evitar el spam y asegurar que solo humanos puedan enviar mensajes.  
**¿Cómo funciona?**
- El usuario debe completar el reCAPTCHA antes de enviar el formulario.
- Al enviar, el token generado por reCAPTCHA se envía al backend.
- El backend valida el token con la API de Google reCAPTCHA usando la clave secreta (`key_Capchat` en `.env`).
- Si la validación es exitosa, el mensaje se procesa y almacena.

**Fragmento relevante:**
```js
const recaptchaSecretKey = process.env.key_Capchat;
const recaptchaVerificationResponse = await axios.post(
  'https://www.google.com/recaptcha/api/siteverify',
  null,
  {
    params: {
      secret: recaptchaSecretKey,
      response: token,
      remoteip: ip,
    },
  }
);
```

---
## Implementación de Google Analytics

El proyecto integra Google Analytics para el seguimiento de visitas y análisis de tráfico del sitio web.

**¿Cómo se implementa?**

- En el archivo `index.ejs`, dentro de la etiqueta `<head>`, se incluye el script oficial de Google Analytics (gtag.js).
- El script se carga de forma asíncrona y se inicializa con el ID de medición proporcionado por Google Analytics.
- Esto permite que todas las visitas y eventos básicos del sitio sean registrados automáticamente en tu cuenta de Google Analytics.

**Fragmento relevante:**
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XSNTHXH5GJ"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-XSNTHXH5GJ');
</script>
```

**¿Qué ventajas ofrece?**
- Permite visualizar estadísticas de visitas, páginas vistas, duración de sesiones y más desde la consola de Google Analytics.
- No requiere configuración adicional para el seguimiento básico.
- Si se desea, se pueden agregar eventos personalizados usando la función `gtag('event', ...)`.

---

## Envío de correos con Nodemailer

Cuando un usuario envía el formulario de contacto, el backend utiliza Nodemailer para enviar un correo electrónico tanto al usuario como a los administradores.

**¿Cómo funciona?**
- Se configura un transporter con Gmail y las credenciales almacenadas en el archivo `.env`.
- Se envía un correo con los datos del formulario y la IP/pais de origen.
- El correo se envía a los destinatarios definidos en las variables de entorno (`email_g`, `email2_d`).

**Fragmento relevante:**
```js
this.transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.email_g,
    pass: process.env.pass_g
  }
});
```

---

## API de FakePayment

El formulario de pago (`form-payment-services.ejs`) permite simular un pago enviando los datos a una API externa ficticia.

**¿Cómo funciona?**
- El usuario llena el formulario de pago y los datos se envían por AJAX al backend.
- El backend toma los datos y los envía a la API externa (`https://fakepayment.onrender.com/payments`) usando Axios.
- Se incluye un JWT en el header `Authorization: Bearer ...` (clave en `.env` como `key_fakepayment`).
- Si la API responde correctamente, se muestra el mensaje "Pago realizado".

**Fragmento relevante:**
```js
const token = process.env.key_fakepayment;
const response = await axios.post('https://fakepayment.onrender.com/payments', {
    "full-name": cardholderName,
    "card-number": cardNumber,
    "expiration-month": expirationMonth,
    "expiration-year": expirationYear,
    "cvv": cvv,
    "amount": amount,
    "currency": currency,
    "description": service
}, {
    headers: {
        Authorization: `Bearer ${token}`
    }
});
```

---

## Variables de entorno

Configura el archivo `.env` con tus claves y credenciales:

```
Url_Ipapi=http://api.ipapi.com/api/
Access_key=TU_API_KEY_IPAPI
key_Capchat=TU_CLAVE_SECRETA_RECAPTCHA
email_g=TU_CORREO_GMAIL
pass_g=TU_CONTRASEÑA_GMAIL
email1_d=DESTINATARIO1
email2_d=DESTINATARIO2
key_fakepayment=TU_JWT_FAKEPAYMENT
```

---

## Notas de seguridad

- **Nunca almacenes datos sensibles de tarjetas en tu base de datos.**
- **No uses claves reales en producción sin protegerlas adecuadamente.**
- **Para producción, usa servicios de pago reales y cumple con PCI DSS.**

---