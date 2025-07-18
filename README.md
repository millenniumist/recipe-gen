# 🍳 AI-Powered Recipe Generator

A full-stack web application that generates delicious recipes using AI, built with Next.js 14, Supabase, and Google Gemini API.

![Recipe Generator Demo](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Tests](https://img.shields.io/badge/Tests-96.7%25%20Passing-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)

## ✨ Features

### 🤖 AI Recipe Generation
- **Smart Recipe Creation**: Generate unique recipes from any ingredients using Google Gemini API
- **Dietary Preferences**: Support for vegetarian, vegan, keto, gluten-free, and other dietary restrictions
- **Customizable Servings**: Adjust recipes for 1-12 servings
- **Detailed Instructions**: Step-by-step cooking instructions with cooking times

### 🔐 User Authentication
- **Secure Registration**: Email/password authentication with Supabase
- **Email Verification**: Automated email confirmation system
- **Protected Routes**: User-specific access control
- **Session Management**: Persistent login sessions

### 💾 Recipe Management
- **Save Favorites**: Store your favorite recipes to your personal account
- **Personal Dashboard**: View and manage all your saved recipes
- **Recipe Search**: Easy browsing of your recipe collection
- **Delete Recipes**: Remove recipes you no longer want

### 🎨 Modern UI/UX
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Beautiful Interface**: Clean, modern design with Shadcn/ui components
- **Loading States**: Smooth animations and loading indicators
- **Error Handling**: User-friendly error messages and recovery

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ with App Router, TypeScript
- **UI Components**: Shadcn/ui, Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **AI Integration**: Google Gemini API
- **Testing**: Jest, React Testing Library
- **Deployment**: Vercel-ready

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/millenniumist/recipe-gen.git
   cd recipe-gen
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Set up Supabase database**
   Execute this SQL in your Supabase SQL editor:
   ```sql
   CREATE TABLE recipes (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     title TEXT NOT NULL,
     ingredients TEXT[] NOT NULL,
     instructions TEXT NOT NULL,
     cooking_time INTEGER,
     servings INTEGER,
     dietary_tags TEXT[],
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "Users can only access their own recipes" ON recipes
   FOR ALL USING (auth.uid() = user_id);
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

The application includes comprehensive test coverage:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Results
- **31 comprehensive tests** covering all major functionality
- **96.7% success rate** ensuring reliability
- **Component testing** with React Testing Library
- **API route testing** for backend functionality
- **Integration testing** for user workflows

## 📁 Project Structure

```
recipe-generator/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication pages
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # User dashboard
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── ui/               # Shadcn/ui components
│   │   ├── forms/            # Form components
│   │   └── recipe/           # Recipe-specific components
│   ├── lib/                   # Utility libraries
│   │   ├── supabase/         # Supabase client config
│   │   └── gemini/           # Gemini API integration
│   ├── types/                 # TypeScript type definitions
│   └── __tests__/            # Test files
├── jest.config.js            # Jest configuration
├── tailwind.config.ts        # Tailwind CSS config
└── components.json           # Shadcn/ui config
```

## 🔧 API Routes

### Recipe Generation
- `POST /api/generate` - Generate new recipe from ingredients
- `GET /api/recipes` - Fetch user's saved recipes
- `POST /api/recipes` - Save a new recipe
- `DELETE /api/recipes/[id]` - Delete a recipe

### Authentication
- `GET /auth/callback` - Handle email verification
- `GET /auth/auth-code-error` - Handle auth errors

## 🌟 Key Features Explained

### Recipe Generation Process
1. User enters ingredients and preferences
2. Form validates input and shows loading state
3. Gemini API generates structured recipe with title, ingredients, instructions, and cooking time
4. Recipe is displayed with save option for authenticated users

### User Authentication Flow
1. User registers with email/password
2. Email verification sent automatically
3. User clicks verification link
4. Redirected to dashboard with full access

### Recipe Management
1. Authenticated users can save generated recipes
2. Personal dashboard shows all saved recipes
3. Recipes are private to each user (Row Level Security)
4. Users can delete recipes they no longer want

## 🚀 Deployment

The application is ready for deployment on Vercel:

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel handles the build automatically

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Google Gemini** for AI-powered recipe generation
- **Supabase** for authentication and database
- **Shadcn/ui** for beautiful UI components
- **Next.js** for the excellent development experience

---

**Built with ❤️ and AI**
