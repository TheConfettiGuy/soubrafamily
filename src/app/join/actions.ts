"use server";

import joinData from "@/data/join.json";
import { ClientSecretCredential } from "@azure/identity";
import { Client } from "@microsoft/microsoft-graph-client";

type JoinJson = typeof joinData;

// --- Env checks ---

const tenantId = process.env.AZURE_TENANT_ID;
const clientId = process.env.AZURE_CLIENT_ID;
const clientSecret = process.env.AZURE_CLIENT_SECRET;
const senderUser = process.env.JOIN_FORM_SENDER;
const toAddress = process.env.JOIN_FORM_TO;

if (!tenantId || !clientId || !clientSecret || !senderUser || !toAddress) {
  console.warn(
    "Join form: missing one of AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, JOIN_FORM_SENDER, JOIN_FORM_TO"
  );
}

const credential =
  tenantId && clientId && clientSecret
    ? new ClientSecretCredential(tenantId, clientId, clientSecret)
    : null;

async function getGraphClient() {
  if (!credential) {
    throw new Error("Graph credential not configured.");
  }

  const token = await credential.getToken(
    "https://graph.microsoft.com/.default"
  );
  if (!token) {
    throw new Error("Failed to get Graph access token.");
  }

  const client = Client.init({
    authProvider: (done) => {
      done(null, token.token);
    },
  });

  return client;
}

// --- Helper to build body from JSON metadata + FormData ---

export async function submitJoinForm(formData: FormData) {
  try {
    if (!senderUser || !toAddress) {
      throw new Error("JOIN_FORM_SENDER or JOIN_FORM_TO missing.");
    }

    // Extract values using the JSON definition
    const fields = (joinData as JoinJson).form.fields;
    const collected: { label: string; value: string }[] = [];

    for (const field of fields) {
      const raw = formData.get(field.id);
      const value = (raw ?? "").toString().trim();
      if (!value && !field.required) continue;

      collected.push({
        label: field.label,
        value: value || "-",
      });
    }

    // Full name (first field: "الاسم:")
    const fullName = collected[0]?.value || "عضو جديد";

    const subject = `طلب الانتساب - ${fullName}`;

    const htmlRows = collected
      .map(
        (f) => `
        <tr>
          <td style="padding:4px 8px;font-weight:bold;vertical-align:top;">${f.label}</td>
          <td style="padding:4px 8px;">${f.value}</td>
        </tr>`
      )
      .join("");

    const htmlBody = `
      <div dir="rtl" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
        <h1 style="font-size:24px;font-weight:bold;margin-bottom:16px;">
          طلب الانتساب
        </h1>
        <p style="margin-bottom:16px;">
          تم استلام طلب انتساب جديد بالمعلومات التالية:
        </p>
        <table style="border-collapse:collapse;border-spacing:0;">
          ${htmlRows}
        </table>
      </div>
    `;

    const plainTextBody =
      "طلب الانتساب\n\n" +
      collected.map((f) => `${f.label} ${f.value}`).join("\n");

    const client = await getGraphClient();

    // /users/{id | userPrincipalName}/sendMail
    await client.api(`/users/${encodeURIComponent(senderUser)}/sendMail`).post({
      message: {
        subject,
        body: {
          contentType: "HTML",
          content: htmlBody,
        },
        toRecipients: [
          {
            emailAddress: {
              address: toAddress,
              name: "جمعية آل سوبره",
            },
          },
        ],
      },
      saveToSentItems: true,
    });

    return { ok: true };
  } catch (err: any) {
    console.error("Error sending join form email:", err);
    return {
      ok: false,
      error: err?.message || "فشل إرسال البريد الإلكتروني.",
    };
  }
}
