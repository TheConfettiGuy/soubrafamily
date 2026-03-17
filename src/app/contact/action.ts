"use server";

import { Client } from "@microsoft/microsoft-graph-client";
export async function sendContactEmail(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  const tenantId = process.env.AZURE_TENANT_ID!;
  const clientId = process.env.AZURE_CLIENT_ID!;
  const clientSecret = process.env.AZURE_CLIENT_SECRET!;
  const sender = process.env.CONTACT_FORM_SENDER!; // new
  const receiver = process.env.CONTACT_FORM_TO!; // new

  // OAuth token
  const tokenRes = await fetch(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        scope: "https://graph.microsoft.com/.default",
        grant_type: "client_credentials",
      }),
    }
  );

  const tokenJson = await tokenRes.json();
  if (!tokenJson.access_token) {
    console.error("Cannot get Graph access token:", tokenJson);
    throw new Error("Authentication failed");
  }

  const graphClient = Client.init({
    authProvider: (done) => {
      done(null, tokenJson.access_token);
    },
  });

  const emailContent = `
اسم المُرسل: ${name}
البريد: ${email}
الهاتف: ${phone}
الموضوع: ${subject}

الرسالة:
${message}
`;

  const mail = {
    message: {
      subject: `رسالة جديدة من صفحة التواصل: ${subject}`,
      body: {
        contentType: "Text",
        content: emailContent,
      },
      toRecipients: [{ emailAddress: { address: receiver } }],
      from: { emailAddress: { address: sender } },
    },
    saveToSentItems: "false",
  };

  await graphClient.api(`/users/${sender}/sendMail`).post(mail);
}
