// updated transaction with borrow function

import NonFungibleToken from 0x631e88ae7f1d7c20
import AiNFT from 0xfb5d002cb67b4ee3
transaction(name: String, ipfsLink: String) {
    let recipient: Address
    let recipientCollectionRef: &{NonFungibleToken.CollectionPublic}

    prepare(signer: AuthAccount) {
        self.recipient = signer.address

        // Check if the signer has a collection, if not, set one up
        if !signer.getCapability<&{NonFungibleToken.CollectionPublic}>(AiNFT.CollectionPublicPath).check() {
            signer.save(<-AiNFT.createEmptyCollection(), to: AiNFT.CollectionStoragePath)
            signer.link<&{NonFungibleToken.CollectionPublic}>(AiNFT.CollectionPublicPath, target: AiNFT.CollectionStoragePath)
        }

        // Borrow the recipient's public NFT collection reference
        self.recipientCollectionRef = getAccount(self.recipient)
            .getCapability(AiNFT.CollectionPublicPath)
            .borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not get receiver reference to the NFT Collection")
    }

    execute {
        // Use the mintNFT function to mint the NFT and deposit it into the recipient's collection
        AiNFT.mintNFT(
            recipientAddress: self.recipient,
            name: name,
            ipfsLink: ipfsLink
        )
    }
}
