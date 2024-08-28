# PersonalCRM+ Newsletter App

PersonalCRM+ is an all-in-one solution for personal CRM and newsletter management. This application allows users to manage contacts, send personalized newsletters, and track interactions.

## Local Setup

1. Clone the repository:
   ```
   git clone https://github.com/your-username/personalcrm-plus.git
   cd personalcrm-plus
   ```
2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following variables:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   RESEND_API_KEY=your_resend_api_key
   ```

4. Set up Supabase:

   - Create a new Supabase project
   - Run the migration script:

   ```
   npx supabase db push
   ```

5. Start the development server:
   ```
   npm run dev
   ```

## Third-Party Services

1. Supabase: Set up a new project and obtain the URL and anon key.
2. Resend: Sign up for an account and get an API key with full access.

## Deployment to Vercel

1. Push your code to a GitHub repository.

2. Log in to Vercel and create a new project.

3. Connect your GitHub repository to the Vercel project.

4. Configure environment variables in Vercel:

   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `RESEND_API_KEY`

5. Deploy the project.

6. After deployment, update your Supabase project settings with the new Vercel URL for authentication callbacks.

## Features

- User authentication
- Contact management
- Newsletter creation and sending
- Analytics dashboard

## Technologies Used

- Next.js 14 (App Router)
- TypeScript
- Supabase
- Tailwind CSS
- Shadcn UI
- Resend for email sending

For more detailed information on components and functionality, refer to the source code and comments within the project files.
