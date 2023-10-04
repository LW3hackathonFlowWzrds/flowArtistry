import { config } from '@onflow/fcl';

config()
	.put('accessNode.api', 'https://rest-testnet.onflow.org') 
	.put('discovery.wallet', 'https://fcl-discovery.onflow.org/testnet/authn/')
	.put('app.detail.title', 'flowArtistry, AI generated NFTs')

