"use client"

import React, { useEffect } from 'react';
import {Button} from '@nextui-org/button'; 
import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/react";
import { useRouter } from 'next/router'
import {Image} from "@nextui-org/react";
import * as fcl from '@onflow/fcl';
import '../flow/config.js';

export default function Home() {
  const [user, setUser] = useState({ loggedIn: false });
  const router = useRouter();

  useEffect(() => {
		fcl.currentUser.subscribe(setUser);
	}, []);

  const login = () => {
    fcl.authenticate();
    if (user.loggedIn) {
			router.push('/dashboard');
		} 
  }
  return (
    <main className="min-h-screen p-14 backdrop-blur-sm flex items-center justify-center">

      <Card className="min-w-[800px] min-h-[500px] bg-gold-400 bg-opacity-60">
        <CardHeader className="flex gap-3 justify-center">
          <div className="flex flex-col p-14 drop-shadow-2xl">
            <Image
              width={300}
              alt="app logo"
              src="/images/flowArtistry.svg"
            />
          </div>
        </CardHeader>

        <CardBody className="text-center">
          <p className='p-16 text-3xl text-white font-mono'>Generate and mint NFTs with AI</p>
        </CardBody>

        <CardFooter className="flex gap-3 justify-center">
          <Button 
            className='bg-black text-gold-500 w-52 h-14 text-xl'
            onClick={()=> login()}
            >
              Connect Wallet</Button> 
        </CardFooter>
        </Card>
          
    </main>
  )
}
