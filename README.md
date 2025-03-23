# CollabFlow

A streamlined internal collaboration suite for efficient team communication and file sharing built with Next.js, TypeScript, and Socket.IO.

## Overview

CollabFlow is a modern collaboration platform designed for small to medium-sized business teams. It provides secure, real-time communication channels with integrated file-sharing capabilities, built using cutting-edge web technologies.

## Features

### Phase 1: Foundation and User Management ✅
- Secure user authentication with NextAuth.js
- Profile management (name, avatar)
- Public and private channel creation
- Role-based access control

### Phase 2: Real-time Messaging ✅
- Real-time messaging using Socket.IO
- Message history with chronological display
- Basic text formatting (bold, italics)
- Server-side rendering for initial message load

### Phase 3: File Sharing 🚧
- File upload with size limits (10MB)
- Channel-specific file access
- Basic file previews (images, PDFs)
- Secure file storage

### Phase 4: Polish and Testing 📋
- UI/UX refinements
- Performance optimizations
- Beta testing and feedback collection

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Authentication**: NextAuth.js
- **Database**: Prisma with PostgreSQL
- **Real-time Communication**: Socket.IO
- **UI Components**: Shadcn UI
- **Styling**: Tailwind CSS
- **Form Validation**: Zod
- **Testing**: Jest and React Testing Library

## Getting Started

### Prerequisites

- Node.js 20.x or later
- npm or pnpm
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/farqani9/collabflow-app.git
   cd collabflow-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Fill in the required environment variables:
   - `DATABASE_URL`: PostgreSQL connection string
   - `NEXTAUTH_SECRET`: Random string for session encryption
   - `NEXTAUTH_URL`: Your application URL (e.g., http://localhost:3000)
   - `GITHUB_ID`: GitHub OAuth app ID
   - `GITHUB_SECRET`: GitHub OAuth app secret

4. Initialize the database:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

The application will be available at `http://localhost:3000` (or `3001` if port 3000 is in use).

## Project Structure

```
collabflow-app/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── api/            # API routes
│   │   ├── channels/       # Channel pages
│   │   └── components/     # React components
│   ├── lib/                # Utility functions
│   └── types/              # TypeScript types
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets
└── scripts/               # Utility scripts
```

## Environment Variables

Required environment variables:

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GITHUB_ID=
GITHUB_SECRET=
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Testing

Run the test suite:

```bash
npm run test
# or
pnpm test
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Socket.IO](https://socket.io/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)