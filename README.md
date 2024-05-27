# [The Next Shop](https://the-next-shop-dashboard.vercel.app/)

This is an e-commerce admin dashboard and headlessCMS build with Next.js 14. It is bootstrapped with `create next-app`.

Checkout the storefront repository: https://github.com/devSaifur/the-next-store

[![The Next Shop | Dashboard](./public/images/screenshot.png)](the-next-shop-dashboard.vercel.app/)

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **Basic Authentication:** [Lucia](https://lucia-auth.com/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com)
- **Image Uploads:** [Cloudinary](https://cloudinary.com/)
- **Payments infrastructure:** [Stripe](https://stripe.com)

## Running Locally

1. Clone the repository

   ```bash
   git clone https://github.com/devSaifur/the-next-dashboard.git
   ```

2. Install dependencies using pnpm

   ```bash
   pnpm install
   ```

3. Copy the `.env.example` to `.env` and update the variables.

   ```bash
   cp .env.example .env
   ```

4. Start the development server

   ```bash
   pnpm run dev
   ```

5. Push the database schema

   ```bash
   pnpm run db:push
   ```

6. Start the Stripe webhook listener

   ```bash
   pnpm run stripe:listen
   ```
