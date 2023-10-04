'use client'

import React, { useState } from 'react'
import {Input, Textarea, Button} from "@nextui-org/react";


export default function Page() {
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");


  const handlePrompt = (prompt) => {
    // call function to generate nft and pass title and prompt
  
  }

    return (
      <section class='backdrop-blur-md min-h-screen'>
      
        {/* <div className='flex h-min-80 items-center justify-center'> */}

        {/* <div className="flex flex-col gap-4 max-w-lg bg-gold-200 p-2"> */}
        <div className='flex flex-col gap-8 justify-center items-center p-14 border-4 w-3/5 mx-auto min-h-screen rounded-3xl border-gold-300 bg-gold-500 bg-opacity-30'>
          <p className='text-white font-extrabold text-2xl font-mono'>Generate your NFT to mint</p>
          <Input 
            size='lg' 
            type="text" 
            label="NFT Title" 
            labelPlacement="inside-left"
            className="max-w-md text-lg"
            onChange= {(e) => setTitle(e.target.value)}
            />
          <Textarea
            label="AI prompt"
            labelPlacement="inside-left"
            placeholder="Enter your prompt"
            className="max-w-md text-lg"
            onChange= {(e) => setPrompt(e.target.value)}
          />
          <Button 
            color="warning"
            variant="bordered" 
            radius='full'
            fullWidth
            onClick={() => generateNFT()}
            className="max-w-md text-lg bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg">
            Mint
          </Button>
        </div>

        {/* </div> */}
        
      </section>
      )
  }