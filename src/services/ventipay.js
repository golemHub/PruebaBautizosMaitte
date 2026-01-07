// Variables de entorno - usar PUBLIC_ para variables públicas en Astro
const VENTIPAY_API_KEY = import.meta.env.PUBLIC_VENTIPAY_API_KEY || import.meta.env.VENTIPAY_API_KEY;
const VENTIPAY_API_SECRET = import.meta.env.PUBLIC_VENTIPAY_API_SECRET || import.meta.env.VENTIPAY_API_SECRET;
const VENTIPAY_API_URL = import.meta.env.PUBLIC_VENTIPAY_API_URL || "https://api.ventipay.com/v1";

// Función para crear una transacción
export async function createTransaction(orderData) {
  try {
    // Validar que las credenciales estén disponibles
    if (!VENTIPAY_API_KEY || !VENTIPAY_API_SECRET) {
      throw new Error("Las credenciales de VentiPay no están configuradas. Por favor, contacta al administrador.");
    }

    // Validar datos de la orden
    if (!orderData || !orderData.amount || orderData.amount <= 0) {
      throw new Error("El monto de la transacción es inválido");
    }

    const credentials = btoa(`${VENTIPAY_API_KEY}:${VENTIPAY_API_SECRET}`);

    const response = await fetch(`${VENTIPAY_API_URL}/transactions`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: orderData.amount,
        currency: orderData.currency || "CLP",
        description: orderData.description || "Compra en línea",
        customer_email: orderData.customerEmail || "",
        callback_url: orderData.callbackUrl,
        return_url: orderData.returnUrl,
        cancel_url: orderData.cancelUrl,
      }),
    });

    if (!response.ok) {
      let errorMessage = "Error al crear la transacción";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        // Si no se puede parsear el error, usar el mensaje por defecto
        errorMessage = `Error ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    // Validar que la respuesta tenga los datos necesarios
    if (!data.payment_url) {
      throw new Error("No se recibió la URL de pago de VentiPay");
    }

    return {
      transactionId: data.id || data.transaction_id,
      paymentUrl: data.payment_url || data.paymentUrl,
      status: data.status || "pending",
    };
  } catch (error) {
    console.error("Error en la API de VentiPay:", error);
    // Re-lanzar el error con un mensaje más amigable si es necesario
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("Error de conexión. Por favor, verifica tu conexión a internet e intenta de nuevo.");
    }
    throw error;
  }
}

// Función para verificar el estado de una transacción
export async function checkTransactionStatus(transactionId) {
  try {
    const credentials = btoa(`${VENTIPAY_API_KEY}:${VENTIPAY_API_SECRET}`);

    const response = await fetch(
      `${VENTIPAY_API_URL}/transactions/${transactionId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al verificar la transacción");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al verificar el estado de la transacción:", error);
    throw error;
  }
}
