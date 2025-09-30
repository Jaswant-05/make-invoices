"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(to: string, name: string, url: string) {
  const result = await resend.emails.send({
    from: "Make Invoices <notifications@email.makeinvoices.ca>",
    to,
    subject: "Verify your email",
    html: `<p>Hi ${name},</p>
           <p>Please verify your email by clicking the link below:</p>
           <p><a href="${url}">${url}</a></p>`,
  });

  if(result.error){
    return {
        error : "Error Sending email"
    }
  }

  return {
    success : true
  }
}

export async function sendPasswordResetEmail(to: string, name: string, url: string) {
  const result = await resend.emails.send({
    from: "Make Invoices <notifications@email.makeinvoices.ca>",
    to,
    subject: "Reset your password",
    html: `<p>Hi ${name},</p>
           <p>Click below to reset your password:</p>
           <p><a href="${url}">${url}</a></p>`,
  });

  if(result.error){
    return {
        errror : "Error Sending email"
    }
  }

  return {
    success : true
  }
}
