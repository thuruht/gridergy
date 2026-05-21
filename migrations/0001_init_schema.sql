-- Migration number: 0001 	 2026-05-18T00:00:00.000Z

-- Users / Balances Table
CREATE TABLE IF NOT EXISTS user_balances (
    pubkey TEXT PRIMARY KEY, -- Lightning/Nostr Pubkey
    total_kwh REAL NOT NULL DEFAULT 0.0, -- Floating point for energy credits
    total_sats INTEGER NOT NULL DEFAULT 0, -- Integer for satoshi balances
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trades / Ledger Table
-- Serves as the immutable ledger of executed trades
CREATE TABLE IF NOT EXISTS trades (
    trade_id TEXT PRIMARY KEY, -- UUID
    pubkey TEXT NOT NULL,
    zone TEXT NOT NULL, -- Coast, North, South, SouthCentral, SouthWest, FarWest, Panhandle
    trade_type TEXT NOT NULL, -- BUY or SELL
    kwh_amount REAL NOT NULL,
    price_sats_per_kwh REAL NOT NULL,
    total_sats_settled INTEGER NOT NULL,
    settlement_interval TEXT NOT NULL, -- e.g., '2026-05-18T14:30:00Z'
    rtc_settlement_lmp REAL NOT NULL, -- The specific LMP at execution
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pubkey) REFERENCES user_balances(pubkey)
);

-- Indexes for performance
CREATE INDEX idx_trades_pubkey ON trades(pubkey);
CREATE INDEX idx_trades_interval ON trades(settlement_interval);
CREATE INDEX idx_trades_zone ON trades(zone);
