"use server";

import { ClientSecretCredential } from "@azure/identity";
import { Client } from "@microsoft/microsoft-graph-client";

type SocialActivitiesForm = {
  name: string;
  fatherName: string;
  motherName: string;
  registryNumber: string;
  birthDate: string;
  birthPlace: string;
  spouseName?: string;
  homeAddress: string;
  homePhone: string;
  maritalStatus: string;
  explanation: string;
};

function getCredential() {
  const tenantId = process.env.AZURE_TENANT_ID;
  const clientId = process.env.AZURE_CLIENT_ID;
  const clientSecret = process.env.AZURE_CLIENT_SECRET;

  if (!tenantId || !clientId || !clientSecret) {
    throw new Error("Azure env vars are missing");
  }

  return new ClientSecretCredential(tenantId, clientId, clientSecret);
}

async function getGraphClient() {
  const credential = getCredential();

  const token = await credential.getToken(
    "https://graph.microsoft.com/.default"
  );

  if (!token) {
    throw new Error("Failed to get access token from Azure AD");
  }

  return Client.init({
    authProvider: (done) => {
      done(null, token.token);
    },
  });
}

export async function sendSocialActivitiesEmail(formData: FormData) {
  const data: SocialActivitiesForm = {
    name: (formData.get("name") || "").toString(),
    fatherName: (formData.get("fatherName") || "").toString(),
    motherName: (formData.get("motherName") || "").toString(),
    registryNumber: (formData.get("registryNumber") || "").toString(),
    birthDate: (formData.get("birthDate") || "").toString(),
    birthPlace: (formData.get("birthPlace") || "").toString(),
    spouseName: (formData.get("spouseName") || "").toString(),
    homeAddress: (formData.get("homeAddress") || "").toString(),
    homePhone: (formData.get("homePhone") || "").toString(),
    maritalStatus: (formData.get("maritalStatus") || "").toString(),
    explanation: (formData.get("explanation") || "").toString(),
  };

  const toAddress = process.env.JOIN_FORM_TO;
  if (!toAddress) {
    throw new Error("AZURE_SENDER_EMAIL is not set");
  }

  const subject = `طلب إستشارة وتوجيه - ${data.name}`;

  const htmlBody = `
    <div style="direction: rtl; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
      <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 16px;">
        طلب إستشارة وتوجيه
      </h1>
      <p style="margin-bottom: 24px;">
        تم استلام طلب جديد من الموقع الخاص بجمعية آل سوبره (النشاطات الاجتماعية والمعنوية).
      </p>

      <table style="border-collapse: collapse; width: 100%; max-width: 700px;">
        <tbody>
          <tr>
            <td style="border:1px solid #ddd; padding:8px; font-weight:600;">الاسم</td>
            <td style="border:1px solid #ddd; padding:8px;">${data.name}</td>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding:8px; font-weight:600;">اسم الأب</td>
            <td style="border:1px solid #ddd; padding:8px;">${data.fatherName}</td>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding:8px; font-weight:600;">اسم الأم</td>
            <td style="border:1px solid #ddd; padding:8px;">${data.motherName}</td>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding:8px; font-weight:600;">رقم السجل</td>
            <td style="border:1px solid #ddd; padding:8px;">${data.registryNumber}</td>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding:8px; font-weight:600;">تاريخ الولادة</td>
            <td style="border:1px solid #ddd; padding:8px;">${data.birthDate}</td>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding:8px; font-weight:600;">مكان الولادة</td>
            <td style="border:1px solid #ddd; padding:8px;">${data.birthPlace}</td>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding:8px; font-weight:600;">اسم الزوج/الزوجة</td>
            <td style="border:1px solid #ddd; padding:8px;">${data.spouseName || "-"}</td>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding:8px; font-weight:600;">عنوان السكن</td>
            <td style="border:1px solid #ddd; padding:8px;">${data.homeAddress}</td>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding:8px; font-weight:600;">هاتف المنزل</td>
            <td style="border:1px solid #ddd; padding:8px;">${data.homePhone}</td>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding:8px; font-weight:600;">الوضع العائلي</td>
            <td style="border:1px solid #ddd; padding:8px;">${data.maritalStatus}</td>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding:8px; font-weight:600;">شرح الموضوع</td>
            <td style="border:1px solid #ddd; padding:8px; white-space:pre-wrap;">${data.explanation}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  const plainTextBody = `
طلب إستشارة وتوجيه - النشاطات الاجتماعية والمعنوية

الاسم: ${data.name}
اسم الأب: ${data.fatherName}
اسم الأم: ${data.motherName}
رقم السجل: ${data.registryNumber}
تاريخ الولادة: ${data.birthDate}
مكان الولادة: ${data.birthPlace}
اسم الزوج/الزوجة: ${data.spouseName || "-"}
عنوان السكن: ${data.homeAddress}
هاتف المنزل: ${data.homePhone}
الوضع العائلي: ${data.maritalStatus}

شرح الموضوع:
${data.explanation}
  `.trim();

  const client = await getGraphClient();

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
