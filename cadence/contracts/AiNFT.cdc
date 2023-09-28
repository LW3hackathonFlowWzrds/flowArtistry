import NonFungibleToken from 0xf8d6e0586b0a20c7
//replace with testnet address 0x631e88ae7f1d7c20

pub contract AiNFT: NonFungibleToken {

    pub var totalSupply: UInt64
    pub event ContractInitialized()
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)

    pub resource NFT: NonFungibleToken.INFT {
        pub let id: UInt64 
        pub var image: String
        pub var name: String

        init(_image: String, _name: String) {
            self.id = AiNFT.totalSupply
            AiNFT.totalSupply = AiNFT.totalSupply + 1

            self.image = _image
            self.name = _name
        }
    }

    pub resource interface CollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun borrowEntireNFT(id: UInt64): &NFT
    }

pub resource Collection: NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic {
   

    pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

    pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
        let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("This NFT does not exist")
    
        emit Withdraw(id: token.id, from: self.owner?.address)

        return <-token
    }

    pub fun deposit(token: @NonFungibleToken.NFT) {
        let token <- token as! @AiNFT.NFT

        emit Deposit(id: token.id, to: self.owner?.address)

        self.ownedNFTs[token.id] <-! token
    }

    pub fun getIDs(): [UInt64] {
        return self.ownedNFTs.keys
    }

 pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
        }

pub fun borrowEntireNFT(id: UInt64): &AiNFT.NFT? {
     if self.ownedNFTs[id] != nil {
                // Create an authorized reference to allow downcasting
                let ref = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
                return ref as! &AiNFT.NFT
            }

            return nil
        }

    init() {
        self.ownedNFTs <- {}
    }

    destroy() {
        destroy self.ownedNFTs
    }
}


    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <- create Collection()
    }

    pub fun mintNFT(image: String, name: String): @NFT {
        return <- create NFT(_image: image, _name: name)
    }

    init() {
        self.totalSupply = 0
    }

}