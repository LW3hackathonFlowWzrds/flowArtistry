export const MintAiNFT = 
`import AiNFT from 0x9c050c63af57457f
import NonFungibleToken from 0x631e88ae7f1d7c20
import MetadataViews from 0x631e88ae7f1d7c20

transaction(type: String, url: String){
    let recipientCollection: &AiNFT.Collection{NonFungibleToken.CollectionPublic}

    prepare(signer: AuthAccount){
        
    if signer.borrow<&AiNFT.Collection>(from: AiNFT.CollectionStoragePath) == nil {
    signer.save(<- AiNFT.createEmptyCollection(), to: AiNFT.CollectionStoragePath)
    signer.link<&AiNFT.Collection{NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection}>(AiNFT.CollectionPublicPath, target: AiNFT.CollectionStoragePath)
    }

    self.recipientCollection = signer.getCapability(AiNFT.CollectionPublicPath)
                                .borrow<&AiNFT.Collection{NonFungibleToken.CollectionPublic}>()!
    }
    execute{
        AiNFT.mintNFT(recipient: self.recipientCollection, type: type, url: url)
    }
}`