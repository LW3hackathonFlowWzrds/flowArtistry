import NonFungibleToken from 0x631e88ae7f1d7c20
import MetadataViews from 0x631e88ae7f1d7c20

pub contract AiNFT: NonFungibleToken {

    pub var totalSupply: UInt64

    pub event ContractInitialized()
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)

    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath
    pub let MinterStoragePath: StoragePath

    pub struct AiNFTMintData{
        pub let id: UInt64
        pub let type: String
        pub let url: String

        init(_id: UInt64, _type: String, _url: String){
            self.id = _id
            self.type = _type
            self.url = _url
        }
    }

    pub resource NFT: NonFungibleToken.INFT, MetadataViews.Resolver {
        pub let id: UInt64
        pub let type: String
        pub let url: String
    
        init(
            id: UInt64,
            type: String,
            url: String,
        ) {
            self.id = id
            self.type = type
            self.url = url
        }
    
        pub fun getViews(): [Type] {
            return [ Type<AiNFTMintData>() ]
        }

        pub fun resolveView(_ view: Type): AnyStruct? {
            switch view {
                case Type<AiNFTMintData>():
                return AiNFTMintData(
                    _id: self.id,
                    _type: self.type,
                    _url: self.url
                )
            }
            return nil
        }
    }

    pub resource interface AiNFTCollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun borrowAiNFT(id: UInt64): &AiNFT.NFT? {
            post {
                (result == nil) || (result?.id == id):
                    "Cannot borrow AiNFT reference: the ID of the returned reference is incorrect"
            }
        }
    }

    pub resource Collection: AiNFTCollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection {
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        init () {
            self.ownedNFTs <- {}
        }

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
 
        pub fun borrowAiNFT(id: UInt64): &AiNFT.NFT? {
            if self.ownedNFTs[id] != nil {
                let ref = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
                return ref as! &AiNFT.NFT
            }

            return nil
        }

        pub fun borrowViewResolver(id: UInt64): &AnyResource{MetadataViews.Resolver} {
            let nft = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
            let AiNFT = nft as! &AiNFT.NFT
            return AiNFT as &AnyResource{MetadataViews.Resolver}
        }

        destroy() {
            destroy self.ownedNFTs
        }
    }

    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <- create Collection()
    }

     pub fun mintNFT(
            recipient: &{NonFungibleToken.CollectionPublic},
            type: String,
            url: String,
        ) {

            var newNFT <- create NFT(
                id: AiNFT.totalSupply,
                type: type,
                url: url
            )

            recipient.deposit(token: <-newNFT)

            AiNFT.totalSupply = AiNFT.totalSupply + UInt64(1)
        }

    init() {
        self.totalSupply = 0

        self.CollectionStoragePath = /storage/AiNFTCollection
        self.CollectionPublicPath = /public/AiNFTCollection
        self.MinterStoragePath = /storage/AiNFTMinter

        let collection <- create Collection()
        self.account.save(<-collection, to: self.CollectionStoragePath)

        self.account.link<&AiNFT.Collection{NonFungibleToken.CollectionPublic, AiNFT.AiNFTCollectionPublic, MetadataViews.ResolverCollection}>(
            self.CollectionPublicPath,
            target: self.CollectionStoragePath
        )

        emit ContractInitialized()
    }
}