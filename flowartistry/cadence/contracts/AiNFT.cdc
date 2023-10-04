import NonFungibleToken from 0xf8d6e0586b0a20c7
// testnet: 0x631e88ae7f1d7c20
pub contract AiNFT: NonFungibleToken {
    pub event ContractInitialized()
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)
    pub event Minted(id: UInt64, name: String,ipfsLink: String)

    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath
  

    pub var totalSupply: UInt64

    pub resource interface Public {
        pub let id: UInt64
        pub let metadata: Metadata
    }

    pub struct Metadata {
        pub let name: String
        pub let ipfsLink: String

        init(name: String,ipfsLink: String) {
            self.name=name
            //Stored in the ipfs
            self.ipfsLink=ipfsLink
        }
    }

   pub resource NFT: NonFungibleToken.INFT, Public {
        pub let id: UInt64
        pub let metadata: Metadata
        init(initID: UInt64,metadata: Metadata) {
            self.id = initID
            self.metadata=metadata
        }
    }

    pub resource interface AiNFTCollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun borrowArt(id: UInt64): &AiNFT.NFT? {
            post {
                (result == nil) || (result?.id == id):
                    "Cannot borrow AiNFT reference: The ID of the returned reference is incorrect"
            }
        }
    }

    pub resource Collection: AiNFTCollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic {
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("missing NFT")

            emit Withdraw(id: token.id, from: self.owner?.address)

            return <-token
        }

        pub fun deposit(token: @NonFungibleToken.NFT) {
            let token <- token as! @AiNFT.NFT

            let id: UInt64 = token.id

            let oldToken <- self.ownedNFTs[id] <- token

            emit Deposit(id: id, to: self.owner?.address)

            destroy oldToken
        }

        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

       pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
    return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
}

        pub fun borrowArt(id: UInt64): &AiNFT.NFT? {
            if self.ownedNFTs[id] != nil {
                let ref =  &self.ownedNFTs[id] as &NonFungibleToken.NFT?
                return ref as! &AiNFT.NFT
            } else {
                return nil
            }
        }

        destroy() {
            destroy self.ownedNFTs
        }

        init () {
            self.ownedNFTs <- {}
        }
    }

    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <- create Collection()
    }

    pub struct NftData {
        pub let metadata: AiNFT.Metadata
        pub let id: UInt64
        init(metadata: AiNFT.Metadata, id: UInt64) {
            self.metadata= metadata
            self.id=id
        }
    }

    pub fun getNft(address:Address) : [NftData] {
        var artData: [NftData] = []
        let account=getAccount(address)

        if let artCollection= account.getCapability(self.CollectionPublicPath).borrow<&{AiNFT.AiNFTCollectionPublic}>()  {
            for id in artCollection.getIDs() {
                var art=artCollection.borrowArt(id: id)
                artData.append(NftData(metadata: art!.metadata,id: id))
            }
        }
        return artData
    }


    pub fun mintNFT(
        recipientAddress: Address,
        name: String,
        ipfsLink: String
    ) {
        // Make sure the recipient has set up their collection
        let recipient = getAccount(recipientAddress)
            .getCapability(AiNFT.CollectionPublicPath)
            .borrow<&{NonFungibleToken.CollectionPublic}>() 
            ?? panic("Recipient has not set up their AiNFT Collection")

        emit Minted(id: AiNFT.totalSupply, name: name, ipfsLink: ipfsLink)

        recipient.deposit(token: <-create AiNFT.NFT(
            initID: AiNFT.totalSupply,
            metadata: Metadata(
                name: name,
                ipfsLink: ipfsLink
            )
        ))

        AiNFT.totalSupply = AiNFT.totalSupply + 1 
    }



    init() {
        self.CollectionStoragePath = /storage/AiNFTCollection
        self.CollectionPublicPath = /public/AiNFTCollection
       

        self.totalSupply = 0

        
        let collection <- AiNFT.createEmptyCollection()
        self.account.save(<-collection, to: AiNFT.CollectionStoragePath)
        self.account.link<&AiNFT.Collection{NonFungibleToken.CollectionPublic, AiNFT.AiNFTCollectionPublic}>(AiNFT.CollectionPublicPath, target: AiNFT.CollectionStoragePath)

        emit ContractInitialized()
    }
}