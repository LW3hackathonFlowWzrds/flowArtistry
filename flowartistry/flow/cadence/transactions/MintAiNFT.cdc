// The transactions file contains the instructions for what the deployed contract should do


import NonFungibleToken from 0xf8d6e0586b0a20c7
import AiNFT from 0xf8d6e0586b0a20c7


transaction(image: String, name: String) {
    prepare(signer: AuthAccount) {
        let recipientCollection = signer.borrow<&AiNFT.Collection>(from: /storage/AiNFTCollection)
            ?? panic("Could not borrow recipient's collection reference")

        let nft <- AiNFT.mintNFT(image: image, name: name)
        recipientCollection.deposit(token: <-nft)
    }
}

