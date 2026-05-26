# Email Configuration for Hostinger SMTP

When you have access to your Hostinger account, add these environment variables to `.env.local`:

```env
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=biraccredited2025@licprintingshop.net
SMTP_PASS=Licprintshop@2025
SMTP_FROM=biraccredited2025@licprintingshop.net
```

Hostinger uses port `465` for SSL/TLS. The app already treats `465` as a secure SMTP connection.

## How to find your Hostinger SMTP details:

1. Log in to Hostinger control panel
2. Go to **Email** section
3. Click your email account
4. Look for **SMTP Settings** or **Mail Server Details**
5. Copy the SMTP host, port, username, and password
6. Paste them into `.env.local`

## Testing:

Once configured, orders will automatically send confirmation emails to customers.

If email sending fails, check the server console logs (Next.js dev server output) for error messages.
