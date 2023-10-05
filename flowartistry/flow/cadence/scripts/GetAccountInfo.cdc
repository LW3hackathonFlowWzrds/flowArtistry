import AiNFT from 0xfb5d002cb67b4ee3


pub fun main(address: Address): [AiNFT.NftData] {
    return AiNFT.getNft(address: address)
}