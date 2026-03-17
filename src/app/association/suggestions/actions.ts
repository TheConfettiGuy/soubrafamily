"use server";
import { ClientSecretCredential } from "@azure/identity";
import { Client } from "@microsoft/microsoft-graph-client";

type SuggestionsForm = {
  name: string;
  profession?: string;
  workAddress?: string;
  homeAddress?: string;
  phone?: string;
  suggestions: string;
};

function getEnvOrThrow(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function createGraphClient() {
  const tenantId = getEnvOrThrow("AZURE_TENANT_ID");
  const clientId = getEnvOrThrow("AZURE_CLIENT_ID");
  const clientSecret = getEnvOrThrow("AZURE_CLIENT_SECRET");

  const credential = new ClientSecretCredential(
    tenantId,
    clientId,
    clientSecret
  );

  // IMPORTANT: callback style authProvider – this matches your working forms
  const client = Client.init({
    authProvider: async (done) => {
      try {
        const token = await credential.getToken(
          "https://graph.microsoft.com/.default"
        );
        if (!token) {
          throw new Error("Failed to get access token");
        }
        done(null, token.token);
      } catch (err) {
        console.error("Error getting Graph token", err);
        done(err as any, null);
      }
    },
  });

  return client;
}

export async function sendSuggestionsEmail(formData: FormData) {
  const data: SuggestionsForm = {
    name: (formData.get("name") || "").toString(),
    profession: (formData.get("profession") || "").toString(),
    workAddress: (formData.get("workAddress") || "").toString(),
    homeAddress: (formData.get("homeAddress") || "").toString(),
    phone: (formData.get("phone") || "").toString(),
    suggestions: (formData.get("suggestions") || "").toString(),
  };

  const toAddress = getEnvOrThrow("JOIN_FORM_TO");

  const subject = ` اقتراح جديد من موقع جمعية آل سوبره - ${data.name}`;

  const htmlBody = `
    <div style="direction: rtl; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
      <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 16px;">
        صندوق الاقتراحات – جمعية آل سوبره
      </h1>
      <p style="margin-bottom: 24px;">
        تم استلام اقتراح جديد من الموقع الخاص بالجمعية.
      </p>

      <table style="border-collapse: collapse; width: 100%; max-width: 700px;">
        <tbody>
          <tr>
            <td style="border:1px solid #ddd; padding:8px; font-weight:600;">الاسم</td>
            <td style="border:1px solid #ddd; padding:8px;">${data.name}</td>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding:8px; font-weight:600;">المهنة</td>
            <td style="border:1px solid #ddd; padding:8px;">${data.profession || "-"}</td>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding:8px; font-weight:600;">عنوان العمل</td>
            <td style="border:1px solid #ddd; padding:8px;">${data.workAddress || "-"}</td>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding:8px; font-weight:600;">عنوان السكن</td>
            <td style="border:1px solid #ddd; padding:8px;">${data.homeAddress || "-"}</td>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding:8px; font-weight:600;">هاتف</td>
            <td style="border:1px solid #ddd; padding:8px;">${data.phone || "-"}</td>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding:8px; font-weight:600;">الاقتراحات</td>
            <td style="border:1px solid #ddd; padding:8px; white-space:pre-wrap;">${data.suggestions}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  const plainTextBody = `
اقتراح جديد – جمعية آل سوبره

الاسم: ${data.name}
المهنة: ${data.profession || "-"}
عنوان العمل: ${data.workAddress || "-"}
عنوان السكن: ${data.homeAddress || "-"}
هاتف: ${data.phone || "-"}

الاقتراحات:
${data.suggestions}
  `.trim();

  const client = createGraphClient();

  await client.api(`/users/${encodeURIComponent(toAddress)}/sendMail`).post({
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
          },
        },
      ],
    },
    saveToSentItems: true,
  });

  return { ok: true };
}
