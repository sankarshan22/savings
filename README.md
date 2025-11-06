<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# IYKYK - Expense & Reimbursement Tracker

A React + TypeScript application for tracking team expenses, bills, and reimbursements with profit sharing capabilities.

## 🚀 Features

- 👥 Team member management
- 💰 Bill tracking with cost and profit distribution
- 🔄 Debt and settlement management
- 📊 Financial dashboards (costs, profits, reimbursements)
- 📥 CSV export functionality
- 🔐 Secure authentication with environment variables
- 💾 Supabase integration ready

## 🛠️ Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## ⚙️ Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your credentials:
   ```env
   VITE_LOGIN_ID=your_login_id
   VITE_LOGIN_PASSWORD=your_password
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 🔐 Security Features

- ✅ Environment-based credentials (no hardcoded passwords)
- ✅ Input sanitization and validation
- ✅ Error boundaries for graceful error handling
- ✅ Safe localStorage operations
- ✅ TypeScript strict mode enabled
- ✅ Cryptographically secure ID generation

## 📚 Documentation

See [CRITICAL_FIXES_DOCUMENTATION.md](./CRITICAL_FIXES_DOCUMENTATION.md) for:
- Detailed explanation of security improvements
- Business logic explanations
- Race condition handling
- Financial calculation best practices
- Migration guides for Supabase

## 🏗️ Architecture

```
src/
├── components/        # React components
├── utils/            # Utility functions
│   ├── supabase.ts   # Supabase client
│   ├── helpers.ts    # Validation & helpers
│   ├── currency.ts   # Currency formatting
│   └── csv.ts        # CSV export
├── types.ts          # TypeScript definitions
└── App.tsx           # Main application

```

## 🔄 Data Flow

1. User actions trigger state updates
2. State changes are debounced (500ms)
3. Data saved to localStorage (with error handling)
4. Calculations run on state changes (memoized)
5. UI updates reflect new state

## 🚧 Known Limitations

- LocalStorage has 5MB limit
- Session storage authentication (no server-side validation)
- Single currency support
- No real-time sync (use Supabase for this)

## 📈 Future Improvements

- [ ] Migrate to Supabase for data persistence
- [ ] Implement proper JWT-based authentication
- [ ] Add unit tests
- [ ] Multi-currency support
- [ ] Real-time collaboration
- [ ] Mobile responsive improvements
- [ ] PWA support

## 🤝 Contributing

1. Follow TypeScript strict mode
2. Use provided utility functions for validation
3. Add error handling for all user inputs
4. Test localStorage operations
5. Document complex business logic

## 📝 License

MIT

## 🔗 Links

- AI Studio: https://ai.studio/apps/drive/17SVl6yYNRQRSX7PwaBqN4tpa8Fz4BOE6
