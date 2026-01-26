
-- ===================================================
CREATE TABLE IF NOT EXISTS boxes (
  
  network TEXT NOT NULL CHECK (network IN ('testnet', 'mainnet')),
  layer TEXT NOT NULL DEFAULT 'sapphire' CHECK (layer = 'sapphire'),
  
  -- Basic identifier
  id NUMERIC(78, 0) NOT NULL, -- boxId 
  
  PRIMARY KEY (network, layer, id), -- Composite primary key contains network field
  token_id NUMERIC(78, 0) NOT NULL, -- NFT tokenId, same as boxId
  token_uri TEXT, -- NFT tokenURI (currently not written to this field, reserved for extension)
  
  -- Chain event data fields
  box_info_cid TEXT, -- CID (for associating MetadataBox) in BoxCreated event
  private_key TEXT, 
  price NUMERIC(78, 0) NOT NULL DEFAULT 0, 
  deadline NUMERIC(78, 0) NOT NULL DEFAULT 0, 
  
  -- User relationships
  minter_id NUMERIC(78, 0) NOT NULL, -- UserId
  owner_address TEXT NOT NULL, -- NFT owner address (wallet address)
  publisher_id NUMERIC(78, 0), -- UserId
  seller_id NUMERIC(78, 0), -- UserId
  buyer_id NUMERIC(78, 0), -- UserId
  completer_id NUMERIC(78, 0), -- UserId 
  
  -- Status values: 0=Storing, 1=Selling, 2=Auctioning, 3=Paid, 4=Refunding, 5=Delaying, 6=Published, 7=Blacklisted
  status SMALLINT NOT NULL CHECK (status BETWEEN 0 AND 7),
  
  -- listed_mode values: NULL=Not Listed, 1=Selling, 2=Auctioning
  listed_mode SMALLINT CHECK (listed_mode BETWEEN 1 AND 2), 
  accepted_token TEXT, 
  refund_permit BOOLEAN, 
  
  -- Timestamp fields
  create_timestamp NUMERIC(78, 0) NOT NULL, 
  publish_timestamp NUMERIC(78, 0), 
  listed_timestamp NUMERIC(78, 0), 
  purchase_timestamp NUMERIC(78, 0), 
  complete_timestamp NUMERIC(78, 0), 
  request_refund_deadline NUMERIC(78, 0), 
  review_deadline NUMERIC(78, 0) 
);

ALTER TABLE boxes ENABLE ROW LEVEL SECURITY;


-- ===================================================
CREATE TABLE IF NOT EXISTS box_bidders (
  
  network TEXT NOT NULL CHECK (network IN ('testnet', 'mainnet')),
  layer TEXT NOT NULL DEFAULT 'sapphire' CHECK (layer = 'sapphire'),
  
  id TEXT NOT NULL, -- boxId-UserId 
  box_id NUMERIC(78, 0) NOT NULL, -- boxId
  bidder_id NUMERIC(78, 0) NOT NULL, -- UserId
  
  PRIMARY KEY (network, layer, id), -- Composite primary key contains network field
  FOREIGN KEY (network, layer, box_id) REFERENCES boxes(network, layer, id) ON DELETE CASCADE,
  FOREIGN KEY (network, layer, bidder_id) REFERENCES users(network, layer, id) ON DELETE CASCADE
);

ALTER TABLE box_bidders ENABLE ROW LEVEL SECURITY;


-- ===================================================
CREATE TABLE IF NOT EXISTS metadata_boxes (
  network TEXT NOT NULL CHECK (network IN ('testnet', 'mainnet')),
  layer TEXT NOT NULL DEFAULT 'sapphire' CHECK (layer = 'sapphire'),
  
  id NUMERIC(78, 0) NOT NULL, -- boxId
  
  PRIMARY KEY (network, layer, id), 
  FOREIGN KEY (network, layer, id) REFERENCES boxes(network, layer, id) ON DELETE CASCADE,
  
  -- BoxInfo fields
  type_of_crime TEXT, 
  label TEXT[], 
  title TEXT, 
  nft_image TEXT, 
  box_image TEXT, 
  country TEXT, 
  state TEXT, 
  description TEXT, 
  event_date DATE, 
  create_date TIMESTAMP WITH TIME ZONE, 
  timestamp BIGINT, 
  mint_method TEXT CHECK (mint_method IN ('create', 'createAndPublish')),
  
  file_list TEXT[], 
  password TEXT, 
  
  encryption_slices_metadata_cid JSONB, -- { slicesMetadataCID_encryption, slicesMetadataCID_iv }
  encryption_file_cid JSONB[], -- [{ fileCID_encryption, fileCID_iv }, ...]
  encryption_passwords JSONB, -- { password_encryption, password_iv }
  public_key TEXT
);

ALTER TABLE metadata_boxes ENABLE ROW LEVEL SECURITY;

-- ===================================================
CREATE TABLE IF NOT EXISTS box_rewards (
  
  network TEXT NOT NULL CHECK (network IN ('testnet', 'mainnet')),
  layer TEXT NOT NULL DEFAULT 'sapphire' CHECK (layer = 'sapphire'),
  id TEXT NOT NULL, -- box_id-reward_type-token composite key
  box_id NUMERIC(78, 0) NOT NULL,
  reward_type TEXT NOT NULL CHECK (reward_type IN ('Minter', 'Seller', 'Completer', 'Total')), 
  token TEXT NOT NULL, 
  PRIMARY KEY (network, layer, id),
  FOREIGN KEY (network, layer, box_id) REFERENCES boxes(network, layer, id) ON DELETE CASCADE,
  amount NUMERIC(78, 0) NOT NULL DEFAULT 0,
  UNIQUE(network, layer, box_id, reward_type, token)
);

ALTER TABLE box_rewards ENABLE ROW LEVEL SECURITY;

-- ===================================================
CREATE TABLE IF NOT EXISTS user_rewards (
  
  network TEXT NOT NULL CHECK (network IN ('testnet', 'mainnet')),
  layer TEXT NOT NULL DEFAULT 'sapphire' CHECK (layer = 'sapphire'),
  id TEXT NOT NULL, -- user_id-reward_type-token composite key
  user_id NUMERIC(78, 0) NOT NULL, 
  reward_type TEXT NOT NULL CHECK (reward_type IN ('Minter', 'Seller', 'Completer')), 
  token TEXT NOT NULL, 
  PRIMARY KEY (network, layer, id),
  FOREIGN KEY (network, layer, user_id) REFERENCES users(network, layer, id) ON DELETE CASCADE,
  amount NUMERIC(78, 0) NOT NULL DEFAULT 0,
  UNIQUE(network, layer, user_id, reward_type, token)
);

ALTER TABLE user_rewards ENABLE ROW LEVEL SECURITY;

-- ===================================================
CREATE TABLE IF NOT EXISTS user_withdraws (
  
  network TEXT NOT NULL CHECK (network IN ('testnet', 'mainnet')),
  layer TEXT NOT NULL DEFAULT 'sapphire' CHECK (layer = 'sapphire'),
  id TEXT NOT NULL, -- user_id-withdraw_type-token composite key
  user_id NUMERIC(78, 0) NOT NULL, 
  withdraw_type TEXT NOT NULL CHECK (withdraw_type IN ('Helper', 'Minter')), -- Withdraw type
  token TEXT NOT NULL, 
  PRIMARY KEY (network, layer, id),
  FOREIGN KEY (network, layer, user_id) REFERENCES users(network, layer, id) ON DELETE CASCADE,
  amount NUMERIC(78, 0) NOT NULL DEFAULT 0,
  UNIQUE(network, layer, user_id, withdraw_type, token)
);

ALTER TABLE user_withdraws ENABLE ROW LEVEL SECURITY;

-- ===================================================
CREATE TABLE IF NOT EXISTS box_user_order_amounts (
  
  network TEXT NOT NULL CHECK (network IN ('testnet', 'mainnet')),
  layer TEXT NOT NULL DEFAULT 'sapphire' CHECK (layer = 'sapphire'),
  
  id TEXT NOT NULL, -- user_id-box_id-token composite key
  user_id NUMERIC(78, 0) NOT NULL, -- UserId
  box_id NUMERIC(78, 0) NOT NULL, -- box_id
  token TEXT NOT NULL, 
  
  PRIMARY KEY (network, layer, id), -- Composite primary key contains network field
  FOREIGN KEY (network, layer, user_id) REFERENCES users(network, layer, id) ON DELETE CASCADE,
  FOREIGN KEY (network, layer, box_id) REFERENCES boxes(network, layer, id) ON DELETE CASCADE,
  
  amount NUMERIC(78, 0) NOT NULL DEFAULT 0,
  
  -- Unique constraint: Each user has only one record for each token in each box
  UNIQUE(network, layer, user_id, box_id, token)
);

ALTER TABLE box_user_order_amounts ENABLE ROW LEVEL SECURITY;

-- ===================================================
CREATE TABLE IF NOT EXISTS statistical_state (
  
  network TEXT NOT NULL CHECK (network IN ('testnet', 'mainnet')),
  layer TEXT NOT NULL DEFAULT 'sapphire' CHECK (layer = 'sapphire'),
  
  id TEXT NOT NULL DEFAULT 'statistical', -- Singleton ID
  
  PRIMARY KEY (network, layer, id), -- Composite primary key contains network field
  total_supply NUMERIC(78, 0) NOT NULL DEFAULT 0,
  status_0_supply NUMERIC(78, 0) NOT NULL DEFAULT 0, -- Storing
  status_1_supply NUMERIC(78, 0) NOT NULL DEFAULT 0, -- Selling
  status_2_supply NUMERIC(78, 0) NOT NULL DEFAULT 0, -- Auctioning
  status_3_supply NUMERIC(78, 0) NOT NULL DEFAULT 0, -- Paid
  status_4_supply NUMERIC(78, 0) NOT NULL DEFAULT 0, -- Refunding
  status_5_supply NUMERIC(78, 0) NOT NULL DEFAULT 0, -- Delaying
  status_6_supply NUMERIC(78, 0) NOT NULL DEFAULT 0, -- Published
  status_7_supply NUMERIC(78, 0) NOT NULL DEFAULT 0  -- Blacklisted
);

ALTER TABLE statistical_state ENABLE ROW LEVEL SECURITY;

-- Initialize statistical_state
INSERT INTO statistical_state (network, layer, id)
VALUES 
  ('testnet', 'sapphire', 'statistical'),
  ('mainnet', 'sapphire', 'statistical')
ON CONFLICT DO NOTHING;


-- ===================================================
CREATE TABLE IF NOT EXISTS token_total_amounts (
  
  network TEXT NOT NULL CHECK (network IN ('testnet', 'mainnet')),
  layer TEXT NOT NULL DEFAULT 'sapphire' CHECK (layer = 'sapphire'),
  
  id TEXT NOT NULL, -- tokenAddress-fundsType composite key
  token TEXT NOT NULL, 
  fund_manager_id TEXT NOT NULL DEFAULT 'fundManager',
  
  PRIMARY KEY (network, layer, id), -- Composite primary key contains network field
  FOREIGN KEY (network, layer, fund_manager_id) REFERENCES fund_manager_state(network, layer, id) ON DELETE CASCADE,
  funds_type TEXT NOT NULL CHECK (funds_type IN (
    'OrderPaid',    
    'OrderWithdraw',   
    'RefundWithdraw',  
    'RewardsAdded',    
    'HelperRewardsWithdraw',  
    'MinterRewardsWithdraw'  
  )),
  amount NUMERIC(78, 0) NOT NULL DEFAULT 0,
  
  -- Unique constraint (contains network field)
  UNIQUE(network, layer, token, funds_type)
);

ALTER TABLE token_total_amounts ENABLE ROW LEVEL SECURITY;


