# DAMit!

DAMit! is a beautiful, interactive daily activity and habit tracker designed to help you monitor your well-being, habits, and daily progress.

![DAMit! Screenshot](public/og-image.png)

## 🚀 Features

- **Daily Check-ins**: Track your diet, energy levels, stress, sleep quality, and more with a simple, engaging interface.
- **Interactive UI**: Smooth animations and transitions powered by Framer Motion.
- **Progress Tracking**: Visual indicators for your daily completion status.
- **History Logs**: View and analyze your past entries.
- **Authentication**: Secure user accounts using Supabase.
- **PWA Support**: Installable on mobile and desktop devices.
- **Responsive Design**: optimized for both mobile and desktop experiences.
- **Dark/Light Mode**: Fully themable interface.

## 🛠️ Tech Stack

This project is built with a modern frontend stack:

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Backend/Auth**: [Supabase](https://supabase.com/)
- **Testing**: [Vitest](https://vitest.dev/) (Unit) & [Playwright](https://playwright.dev/) (E2E)

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, yarn, or pnpm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/YeswanthRajakumarr/damit.git
    cd damit
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  Set up environment variables:
    Create a `.env` file in the root directory and add your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  Start the development server:
    ```bash
    npm run dev
    ```

## 📜 Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the app for production.
- `npm run preview`: Preview the production build locally.
- `npm run lint`: Lint the codebase using ESLint.
- `npm run test`: Run unit tests with Vitest.
- `npm run test:e2e`: Run end-to-end tests with Playwright.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
