const CORRECT_PIN = "INSERISCI_PIN_QUI";
const NUKI_TOKEN = "INSERISCI_TOKEN_QUI";
const SMARTLOCK_ID = "INSERISCI_SMARTLOCK_ID_QUI";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: CORS });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    if (body.pin !== CORRECT_PIN) {
      return new Response(JSON.stringify({ error: "PIN non corretto" }), {
        status: 401,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const nukiRes = await fetch(
      `https://api.nuki.io/smartlock/${SMARTLOCK_ID}/action/unlock`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NUKI_TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (nukiRes.ok) {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    } else {
      return new Response(
        JSON.stringify({ error: "Errore Nuki", status: nukiRes.status }),
        {
          status: 502,
          headers: { ...CORS, "Content-Type": "application/json" },
        },
      );
    }
  },
};
