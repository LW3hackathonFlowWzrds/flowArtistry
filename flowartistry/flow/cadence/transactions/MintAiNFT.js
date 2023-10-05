export const MintAiNFT = `
import NonFungibleToken from 0x631e88ae7f1d7c20
import AiNFT from 0xfb5d002cb67b4ee3
transaction(name: String, ipfsLink: String) {
    let recipient: Address

    prepare(signer: AuthAccount) {
        // Assuming that the sender wants to mint the NFT for themselves
        self.recipient = signer.address

        // Set up a collection for the sender if they don't have one
        if !signer.getCapability<&{NonFungibleToken.CollectionPublic}>(AiNFT.CollectionPublicPath).check() {
            signer.save(<-AiNFT.createEmptyCollection(), to: AiNFT.CollectionStoragePath)
            signer.link<&{NonFungibleToken.CollectionPublic}>(AiNFT.CollectionPublicPath, target: AiNFT.CollectionStoragePath)
        }
    }

    execute {
        AiNFT.mintNFT(
            recipientAddress: self.recipient,
            name: name,
            ipfsLink: ipfsLink
        )
    }
}

`