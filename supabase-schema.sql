-- Supabase Database Setup for Savings App
-- Run these SQL commands in your Supabase SQL Editor

-- Create members table
CREATE TABLE IF NOT EXISTS public.members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    reimbursement_amt NUMERIC(10, 2) DEFAULT 0,
    reimbursed_amt NUMERIC(10, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create bills table
CREATE TABLE IF NOT EXISTS public.bills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    reason TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    profit NUMERIC(10, 2) DEFAULT 0,
    amount_shared_by TEXT[] NOT NULL DEFAULT '{}',
    paid_by TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create settlements table
CREATE TABLE IF NOT EXISTS public.settlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date TEXT NOT NULL,
    from_member_id TEXT NOT NULL,
    to_member_id TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settlements ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access (change this for production!)
-- For development/demo: Allow all operations
CREATE POLICY "Allow all operations on members" ON public.members
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on bills" ON public.bills
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on settlements" ON public.settlements
    FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bills_date ON public.bills(date);
CREATE INDEX IF NOT EXISTS idx_bills_paid_by ON public.bills(paid_by);
CREATE INDEX IF NOT EXISTS idx_settlements_from_member ON public.settlements(from_member_id);
CREATE INDEX IF NOT EXISTS idx_settlements_to_member ON public.settlements(to_member_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to auto-update updated_at
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON public.members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bills_updated_at BEFORE UPDATE ON public.bills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settlements_updated_at BEFORE UPDATE ON public.settlements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create date_payment_status table
CREATE TABLE IF NOT EXISTS public.date_payment_status (
    date TEXT PRIMARY KEY,
    status TEXT NOT NULL CHECK (status IN ('paid', 'unpaid')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security for date_payment_status
ALTER TABLE public.date_payment_status ENABLE ROW LEVEL SECURITY;

-- Create policy for date_payment_status
CREATE POLICY "Allow all operations on date_payment_status" ON public.date_payment_status
    FOR ALL USING (true) WITH CHECK (true);

-- Create index for date_payment_status
CREATE INDEX IF NOT EXISTS idx_date_payment_status_date ON public.date_payment_status(date);

-- Create trigger for date_payment_status
CREATE TRIGGER update_date_payment_status_updated_at BEFORE UPDATE ON public.date_payment_status
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions (for authenticated and anon users)
GRANT ALL ON public.members TO anon, authenticated;
GRANT ALL ON public.bills TO anon, authenticated;
GRANT ALL ON public.settlements TO anon, authenticated;
GRANT ALL ON public.date_payment_status TO anon, authenticated;
