<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# 💰 Savings - Group Expense Tracker

**Smart bill splitting and expense management for teams**

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/sankarshan22/savings/pulls)

[🚀 Live Demo](https://savings-bice.vercel.app/) • [📖 Documentation](#-deployment) • [🐛 Report Bug](https://github.com/sankarshan22/savings/issues) • [💡 Request Feature](https://github.com/sankarshan22/savings/issues/new)

</div>

---

## 📖 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Quick Start](#-quick-start)
- [Deployment](#-deployment)
- [Usage Guide](#-how-to-use)
- [Project Structure](#️-project-structure)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 👥 Member Management
- Add and remove team members
- Track individual costs and profits
- View detailed member statistics
- Smart debt calculation between members
- Avatar-based member identification

</td>
<td width="50%">

### 📊 Bill Tracking
- Record expenses with dates and descriptions
- Flexible cost sharing across multiple members
- Track who paid for each bill
- Mark bills as paid/unpaid
- Bulk delete by date
- Edit and update existing bills

</td>
</tr>
<tr>
<td width="50%">

### 💸 Debt Settlement
- Automatic debt calculation with net settlement
- Track payments between members
- Real-time balance updates
- Settlement history tracking
- Visual debt breakdown

</td>
<td width="50%">

### 📈 Financial Analytics
- **Costs Dashboard** - Individual spending patterns
- **Profits Dashboard** - Shared benefits distribution
- **Home Dashboard** - Total reimbursed vs pending
- Export unpaid bills to CSV
- Date-based filtering

</td>
</tr>
<tr>
<td width="50%">

### 🔐 Security & Persistence
- Environment-based authentication
- Data persisted to Supabase PostgreSQL
- Auto-save on every action
- Session persistence across refreshes
- Row Level Security enabled

</td>
<td width="50%">

### 🎨 User Experience
- Responsive design (mobile-friendly)
- Dark mode interface
- Real-time calculations
- Intuitive navigation
- Loading states and error handling

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

<table>
<tr>
<td align="center" width="20%">
<img src="https://skillicons.dev/icons?i=react" width="50" height="50" alt="React" />
<br>React 19.2
</td>
<td align="center" width="20%">
<img src="https://skillicons.dev/icons?i=typescript" width="50" height="50" alt="TypeScript" />
<br>TypeScript 5.8
</td>
<td align="center" width="20%">
<img src="https://skillicons.dev/icons?i=vite" width="50" height="50" alt="Vite" />
<br>Vite 6.2
</td>
<td align="center" width="20%">
<img src="https://skillicons.dev/icons?i=supabase" width="50" height="50" alt="Supabase" />
<br>Supabase
</td>
<td align="center" width="20%">
<img src="https://skillicons.dev/icons?i=tailwind" width="50" height="50" alt="Tailwind" />
<br>Tailwind CSS
</td>
</tr>
</table>

**Why These Technologies?**

- **React 19** - Latest features with improved performance and concurrent rendering
- **TypeScript** - Type safety prevents runtime errors and improves developer experience
- **Vite** - Lightning-fast HMR and optimized builds
- **Supabase** - Real-time PostgreSQL database with built-in authentication
- **Tailwind CSS** - Utility-first styling for rapid UI development

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ installed
- Supabase account ([Sign up free](https://supabase.com))
- Git installed

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/sankarshan22/savings.git
cd savings
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**
```bash
# Copy example file
cp .env.example .env.local

# Edit .env.local with your values
```

Your `.env.local` should look like:
```env
# Authentication
VITE_LOGIN_ID=admin
VITE_LOGIN_PASSWORD=your_secure_password

# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**🔒 Security Note:**
- Never commit `.env.local` to Git (already in `.gitignore`)
- Use strong, unique passwords for production
- Change default credentials before deploying

**5. Run the development server**
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) locally, or visit the [live demo](https://savings-bice.vercel.app/).

Login with your `.env.local` credentials.

---

## � Deployment

### Deploy to Vercel (Recommended)

**1. Push to GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

**2. Deploy on Vercel**
- Visit [vercel.com](https://vercel.com)
- Import your GitHub repository
- Add environment variables:
  - `VITE_LOGIN_ID`
  - `VITE_LOGIN_PASSWORD`
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Click Deploy

**3. Done!** Your app is live 🎉
---

## � Deployment

### Prerequisites
- Node.js v18+ installed
- Supabase account ([Sign up free](https://supabase.com))
- Git installed
- GitHub account (for Vercel deployment)

---

### Step 1: Supabase Database Setup

#### 1.1 Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in:
   - **Project Name**: `savings-app` (or any name you prefer)
   - **Database Password**: Choose a strong password (save it securely)
   - **Region**: Select closest to your users for best performance
4. Click **"Create New Project"** (takes ~2 minutes to provision)

#### 1.2 Get Your API Credentials
1. In your Supabase dashboard, navigate to **Settings** → **API**
2. Copy these two values:
   - **Project URL** - Format: `https://xxxxx.supabase.co`
   - **anon/public key** - Long JWT token under "Project API keys"

#### 1.3 Run Database Migration
1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Open `supabase-setup.sql` from this project
4. Copy the entire SQL content and paste into the editor
5. Click **"Run"** (or press Ctrl/Cmd + Enter)
6. You should see: **Success. No rows returned**
7. Verify tables: Go to **Table Editor** → You should see `members`, `bills`, `settlements`

---

### Step 2: Local Setup & Testing

#### 2.1 Configure Environment Variables
1. Open `.env.local` in your project
2. Update with your Supabase credentials:

```env
# Authentication Credentials
VITE_LOGIN_ID=admin
VITE_LOGIN_PASSWORD=YourSecurePassword123!

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**🔒 Security Note:**
- Never commit `.env.local` to Git (already in `.gitignore`)
- Use strong, unique passwords for production
- Change default credentials before deploying

#### 2.2 Test Locally
```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

**Verify everything works:**
1. Open `http://localhost:5173` (or visit [live app](https://savings-bice.vercel.app/))
2. Login with your `.env.local` credentials
3. Add a test member → Refresh page → Member should persist
4. Add a test bill → Refresh page → Bill should persist
5. Check Supabase Table Editor → Data should appear in tables

---

### Step 3: Deploy to Vercel

#### 3.1 Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### 3.2 Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"New Project"**
3. **Import** your GitHub repository
4. Vercel will auto-detect Vite configuration
5. **Before deploying**, add environment variables:
   - Click **Environment Variables**
   - Add these 4 variables:
     - `VITE_LOGIN_ID` → Your username
     - `VITE_LOGIN_PASSWORD` → Your password
     - `VITE_SUPABASE_URL` → Your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY` → Your Supabase anon key
6. Click **"Deploy"** (takes ~2 minutes)

#### 3.3 Access Your Live App
- Your app will be live at: `https://your-project.vercel.app`
- Login with your credentials
- All data persists across devices! 🎉

#### 3.4 Update Deployment (if needed)
```bash
# Make changes to your code
git add .
git commit -m "Your update message"
git push origin main
# Vercel auto-deploys on every push!
```

---

### Alternative Deployment Options

#### Option 2: Netlify
```bash
# Build the project
npm run build

# Deploy to Netlify
# 1. Go to netlify.com
# 2. Drag and drop the 'dist' folder
# 3. Add environment variables in Site Settings → Environment Variables
```

#### Option 3: GitHub Pages
⚠️ **Note:** Environment variables don't work on GitHub Pages. Use Vercel or Netlify instead.

---

### Step 4: Post-Deployment Verification

#### 4.1 Check Database Connection
1. Login to your deployed app
2. Add a member
3. Open Supabase Table Editor
4. Verify data appears in `members` table

#### 4.2 Enable Real-time (Optional)
Want real-time sync across devices?
1. In Supabase: **Database** → **Replication**
2. Enable replication for: `members`, `bills`, `settlements`
3. Now changes sync instantly! ⚡

---

### Production Checklist

Before going live, ensure:
- [ ] Changed default password in `.env.local`
- [ ] Tested adding/editing/deleting members
- [ ] Tested adding/editing/deleting bills
- [ ] Tested page refresh (data persists)
- [ ] Environment variables added to Vercel/Netlify
- [ ] `.env.local` is in `.gitignore`
- [ ] Database tables created in Supabase
- [ ] App accessible via deployment URL
- [ ] Login works on deployed version
- [ ] Data syncs to Supabase correctly

---

## 🐛 Troubleshooting

### Common Issues & Solutions

**❌ "Missing Supabase environment variables"**
- **Fix:** Check `.env.local` has all 4 variables filled (no placeholders)
- Restart dev server: `npm run dev`

**❌ "Property 'env' does not exist on type 'ImportMeta'"**
- **Fix:** Ensure `vite-env.d.ts` exists in project root
- Run: `npm run dev` to regenerate types

**❌ Data not persisting**
- **Fix:** 
  1. Check Supabase SQL Editor - ensure tables exist
  2. Open browser console (F12) - look for errors
  3. Verify Supabase URL and anon key are correct
  4. Check network tab - ensure API calls succeed

**❌ Can't login after deployment**
- **Fix:** 
  1. Verify environment variables added in Vercel/Netlify
  2. Check variable names match exactly (case-sensitive)
  3. Redeploy after adding variables

**❌ TypeScript errors**
- **Fix:** 
  1. Run `npm install` to ensure dependencies installed
  2. Delete `node_modules` and run `npm install` again
  3. Check `tsconfig.json` exists

**❌ Build fails on Vercel**
- **Fix:**
  1. Check build logs for specific errors
  2. Ensure `package.json` has correct build script
  3. Test build locally: `npm run build`

### Getting Help
- 📖 [Supabase Documentation](https://supabase.com/docs)
- 📖 [Vercel Documentation](https://vercel.com/docs)
- 📖 [Vite Documentation](https://vitejs.dev/guide/)
- 🐛 [Open an Issue](https://github.com/sankarshan22/savings/issues)

---

## �📱 How to Use

### Getting Started
1. **Login** - Use credentials from `.env.local`
2. **Add Team Members** - Navigate to "Team Members" → Click "Add Member"
3. **Record Bills** - Go to "Bills" → Click "Add Bill"
   - Enter date, amount, profit (if any)
   - Select who paid and who shares the cost
4. **View Analytics** - Check Costs/Profits dashboards
5. **Settle Debts** - Click on a member to see debts and record settlements
6. **Export Data** - Export unpaid bills to CSV for easy sharing

### Key Workflows

**Splitting a Restaurant Bill:**
1. Add bill with total amount
2. Select all members who attended
3. Mark who paid
4. App automatically calculates individual shares

**Tracking Payments:**
1. Click on member who owes money
2. View detailed debt breakdown
3. Click "Settle Debt"
4. Enter payment amount
5. Debts automatically update

---

## 🏗️ Project Structure

```
savings/
│
├── 📁 components/           # React Components
│   ├── Dashboard.tsx        # Member management view
│   ├── Bills.tsx            # Bill tracking interface
│   ├── Login.tsx            # Authentication screen
│   ├── MemberDetails.tsx    # Individual member stats
│   ├── ProfitsDashboard.tsx # Profit analytics
│   ├── CostsDashboard.tsx   # Cost analytics
│   └── ...                  # Other UI components
│
├── 📁 utils/                # Utility Functions
│   ├── csv.ts               # CSV export logic
│   ├── currency.ts          # INR formatting
│   └── color.ts             # Avatar colors
│
├── 📄 App.tsx               # Main app component & logic
├── 📄 types.ts              # TypeScript interfaces
├── 📄 supabaseClient.ts     # Supabase configuration
├── 📄 constants.ts          # App constants
├── 📄 supabase-setup.sql    # Database schema
│
└── 📖 README.md             # This file
```

---

## 🔒 Security Best Practices

- **Never commit** `.env.local` to version control
- **Change default credentials** before deployment
- **Use strong passwords** for production
- **Enable Supabase RLS** (Row Level Security)
- **Rotate keys** periodically
- ⚠️ Current setup allows anonymous access - consider adding proper auth for multi-user scenarios

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow existing code style
- Add TypeScript types for new features
- Test locally before submitting PR
- Update documentation if needed

---

## 🐛 Troubleshooting

### Common Issues

**"Missing Supabase environment variables"**
- Check `.env.local` has all 4 variables filled
- Restart dev server: `npm run dev`

**Data not saving**
- Verify Supabase tables exist (check Table Editor)
- Check browser console (F12) for errors
- Confirm Supabase URL and key are correct

**Can't login after deployment**
- Add environment variables in Vercel/Netlify settings
- Redeploy after adding variables

**TypeScript errors**
- Run `npm install` to ensure all dependencies installed
- Check `vite-env.d.ts` exists

📖 **More help:** Check [DEPLOYMENT.md](./DEPLOYMENT.md) troubleshooting section

---

## 📊 Key Technologies Explained

### Why Supabase?
- **Real-time database** with PostgreSQL
- **Free tier** generous for small teams
- **Built-in auth** (can be enabled later)
- **Auto-generated API** from database schema

### Why Vite?
- ⚡ **Lightning fast** Hot Module Replacement (HMR)
- 📦 **Optimized builds** with automatic code splitting
- 🔧 **TypeScript support** out of the box

### Why React 19?
- 🎣 **Powerful hooks** for state management
- ⚛️ **Component-based** architecture
- 🔄 **Virtual DOM** for efficient updates

---

## 🎯 Future Improvements

Planned features for upcoming releases:
- [ ] **Multi-user Authentication** - Supabase Auth integration
- [ ] **Real-time Sync** - Live updates across all devices
- [ ] **Email Notifications** - Payment reminders and alerts
- [ ] **Mobile App** - React Native version
- [ ] **Advanced Analytics** - Charts and spending insights
- [ ] **Receipt Upload** - OCR for automatic bill entry
- [ ] **Multi-currency** - Support for different currencies
- [ ] **Recurring Bills** - Automated monthly expenses
- [ ] **Split Strategies** - Custom split rules (percentage, fixed amounts)
- [ ] **Export Options** - PDF, Excel formats

---

## 📄 License

MIT License - See [LICENSE](./LICENSE) for details.

Feel free to use this project for:
- Personal projects
- Commercial applications
- Educational purposes
- Modifications and derivatives

---

## 🙏 Acknowledgments

Built with ❤️ using:
- [React](https://react.dev/) - UI Framework
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [Supabase](https://supabase.com/) - Backend & Database
- [Vite](https://vitejs.dev/) - Build Tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling

---

## 🔗 Links

- 🐛 [Report Issues](https://github.com/sankarshan22/savings/issues)
- 💡 [Request Features](https://github.com/sankarshan22/savings/issues/new)
- 📖 [Supabase Docs](https://supabase.com/docs)
- 📖 [Vercel Docs](https://vercel.com/docs)

---

<div align="center">

**Made with ❤️ by [Sankarshan](https://github.com/sankarshan22)**

⭐ Star this repo if you find it helpful!

</div>

