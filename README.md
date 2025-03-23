# CollabFlow

A streamlined internal collaboration suite for efficient team communication and file sharing. Built with modern web technologies for optimal performance and user experience.

## Features

### Phase 1: Foundation and User Management ✅
- Secure user authentication with NextAuth.js
- Basic profile management (name, avatar)
- Channel creation (public/private) with permissions
- Role-based access control

### Phase 2: Real-time Messaging ✅
- Real-time chat using Socket.IO
- Message persistence
- Message history with timestamps
- Basic text formatting

### Phase 3: File Sharing (Coming Soon)
- File upload with size limits
- File storage and channel-specific access
- Basic previews for images and PDFs

### Phase 4: Polish and Testing (Coming Soon)
- UI/UX improvements
- Bug fixes and performance optimizations
- Beta testing and feedback integration

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Authentication**: NextAuth.js
- **Database**: Prisma with SQLite
- **Real-time**: Socket.IO
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with dark mode support

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm/pnpm/yarn

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
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Initialize the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

6. Create a test channel:
```bash
npm run create-channel
```

7. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
collabflow-app/
├── src/
│   ├── app/                 # Next.js app router pages
│   ├── components/         # React components
│   │   ├── chat/          # Chat-related components
│   │   └── channels/      # Channel-related components
│   ├── lib/               # Utility functions and configurations
│   └── hooks/             # Custom React hooks
├── prisma/                # Database schema and migrations
├── public/               # Static files
└── scripts/              # Utility scripts
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# Socket.IO
NEXT_PUBLIC_SOCKET_URL="http://localhost:3000"
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- Socket.IO team for real-time capabilities
- Tailwind CSS team for the utility-first CSS framework