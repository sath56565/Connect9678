#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
npm install

# Install Prisma dependencies
echo "Installing Prisma dependencies..."
npm install @prisma/client
npm install prisma --save-dev

# Install UI dependencies
echo "Installing UI dependencies..."
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-slot @radix-ui/react-toast
npm install class-variance-authority clsx tailwind-merge
npm install lucide-react
npm install @hookform/resolvers zod react-hook-form
npm install axios

# Install development dependencies
echo "Installing development dependencies..."
npm install -D @types/node @types/react @types/react-dom
npm install -D autoprefixer postcss tailwindcss
npm install -D typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D eslint eslint-config-next

# Initialize Prisma
echo "Initializing Prisma..."
npx prisma generate

# Create necessary directories
echo "Creating necessary directories..."
mkdir -p app/api/channels
mkdir -p components/modals
mkdir -p components/server
mkdir -p lib

# Create environment file
echo "Creating environment file..."
cat > .env << EOL
DATABASE_URL="your_database_url_here"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
EOL

echo "Setup complete! Please update the .env file with your database URL."
echo "Run 'npm run dev' to start the development server." 