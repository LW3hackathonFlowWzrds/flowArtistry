"use client"

import NFTCard from '@/app/components/NFTCard';
import React, { useEffect, useState } from 'react'

export default function Page() {
  const [nfts, setNfts] = useState([]);

  useEffect(() => {

    // call the getNFTS function and set the state here
    setNfts()
  })

  //get nfts function
  const getNFTS = () => {

  }

    return (
      <div class='backdrop-blur-md min-h-screen'>
       <h1 class="text-center p-10 text-3xl">My NFTs!</h1>

        <div class="flex flex-row gap-3">
           {nfts?.length && nfts.maps((nft) => (
            <NFTCard 
              key={nft.id}
              imageSrc={nft.image}
              title={nft.title}
              linkToMetadata={nft.url} 
            />
            ))} 

        {/* delete this below components, it's only for viewing in dev mode */}
        <NFTCard 
          key={"nft.id"}
          imageSrc={"nft.imageSrc"}
          title={"nft.title"}
          linkToMetadata={"nft.description sdffs sdfsf"} 
        />
         <NFTCard 
          key={"nft.id2"}
          imageSrc={"nft.imageSr2c"}
          title={"nft.titl2e"}
          linkToMetadata={"nft.descript2ion ervcsdcs "} 
        />
          <NFTCard 
          key={"nft.id23"}
          imageSrc={"nft.imageSr23c"}
          title={"nft.titl32e"}
          linkToMetadata={"nft.descri3pt2ion ewewewew rvtdvdvs "} 
        />

        </div>
      </div>
      )
  }