This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy the example environment file:

```bash
copy .env.local.example .env.local
```

3. Open `.env.local` and fill in your real values:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `ZAPIER_WEBHOOK_URL`

4. Start the development server:

```bash
npm run dev
```

If PowerShell blocks `npm.ps1`, use this command instead:

```bash
cmd /c "npm run dev"
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run on another computer

If you move this project to another computer, the structure stays the same as long as you:

- copy or clone the project folder
- run `npm install`
- copy `.env.local.example` to `.env.local`
- fill in the real environment values
- run `npm run dev`

This keeps the same file layout and lets the app work exactly the same way on the other computer.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
