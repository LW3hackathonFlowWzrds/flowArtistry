// Script return a list of all the AiNFT NFTs that the provided address owns,
// along with their associated metadata
// testnet: 0xfb5d002cb67b4ee3

export const GetAccountInfo = `import AiNFT from 0xf8d6e0586b0a20c7


pub fun main(address: Address): [AiNFT.NftData] {
    return AiNFT.getNft(address: address)
}`
