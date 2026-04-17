type InvitationEmailParams = {
  url: string;
  expiresAt: string;
};

export const invitationEmail = {
  subject: '📅 Invitation to Join a Booking',

  text: ({ url, expiresAt }: InvitationEmailParams) =>
    `
You have been invited to join a booking.

Confirm your attendance:
${url}

This invitation expires on ${expiresAt}.
`.trim(),

  html: ({ url, expiresAt }: InvitationEmailParams) =>
    `
<!DOCTYPE html>
<html lang="en">
  <body style="margin:0; padding:0; background-color:#f5f7fb;">
    
    <!-- Preheader -->
    <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
      Confirm your booking invitation before it expires.
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f7fb;">
      <tr>
        <td align="center" style="padding:24px 12px;">
          
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px; background:#ffffff; border-radius:8px; font-family:Arial, sans-serif;">
            
            <!-- Header -->
            <tr>
              <td style="padding:28px 24px 20px; text-align:center; border-bottom:1px solid #eeeeee;">
                <h1 style="margin:0; font-size:20px; line-height:1.3; color:#111111; font-weight:600;">
                  📅 You're Invited
                </h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:24px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  
                  <tr>
                    <td style="font-size:14px; line-height:1.6; color:#333333; padding-bottom:20px;">
                      You have been invited to join a booking.
                    </td>
                  </tr>

                  <!-- Button -->
                  <tr>
                    <td align="center" style="padding-bottom:24px;">
                      <table role="presentation" cellpadding="0" cellspacing="0">
                        <tr>
                          <td bgcolor="#2563eb" style="border-radius:6px;">
                            <a href="${url}"
                               style="display:inline-block; padding:12px 20px; font-size:14px; font-weight:bold; color:#ffffff; text-decoration:none; border-radius:6px;">
                              Confirm Attendance
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td style="font-size:13px; color:#555555; padding-bottom:20px;">
                      This invitation expires on <strong>${expiresAt}</strong>.
                    </td>
                  </tr>

                  <tr>
                    <td style="border-top:1px solid #eeeeee; font-size:0; line-height:0;" height="1"></td>
                  </tr>

                  <tr>
                    <td style="font-size:12px; color:#777777; padding-top:16px;">
                      If the button does not work, use this link:
                    </td>
                  </tr>

                  <tr>
                    <td style="padding-top:8px; word-break:break-all;">
                      <a href="${url}" style="font-size:12px; color:#2563eb; text-decoration:none;">
                        ${url}
                      </a>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:16px; text-align:center; font-size:11px; color:#999999; border-top:1px solid #eeeeee;">
                This is an automated message. Do not reply.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
</html>
`.trim(),
};
