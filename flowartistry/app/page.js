"use client";

import React, { useEffect } from "react";
import { Button } from "@nextui-org/button";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Image } from "@nextui-org/react";
import * as fcl from "@onflow/fcl";
import "../flow/config.js";
import useUser from "./components/useUser.js";

export default function Home() {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user.loggedIn) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const logIn = () => {
    fcl.authenticate();
  };


  return (
    <main className="min-h-screen p-14 backdrop-blur-sm flex items-center justify-center">
      <Card className="min-w-[800px] min-h-[500px] bg-gold-400 bg-opacity-60">
        <CardHeader className="flex gap-3 justify-center">
          <div className="flex flex-col pt-14 drop-shadow-2xl">
            <Image width={300} alt="app logo" src="/images/flowArtistry.svg" />
          </div>
        </CardHeader>

        <CardBody className="text-center pt-0">
          <p className="text-2xl text-white font-mono">
          Create your own art & unique NFT using AI.
          </p>

          <div className="w-[500px] mx-auto pt-2 mt-4 border rounded border-black bg-gold-500 opacity-80">
              <h2 className="mb-2 text-xl font-semibold font-serif text-black">How to:</h2>
              <ul className="space-y-3 text-left pb-4 pl-3 pr-3 text-black font-mono font-semibold">
                  <li className="flex items-center space-x-3 ">
                      <span>1. Connect Flow wallet.</span>
                  </li>
                  <li className="flex items-center space-x-3">
                      <span>2. Enter a name for your NFT and a description for the AI image generator.</span>       
                  </li>
                  <li className="flex items-center space-x-3">
                      <span>3. Click ‘Mint’ to generate the image and mint the NFT to your wallet.</span>
                  </li>
              </ul>

          </div>

        </CardBody>

        <CardFooter className="flex gap-3 justify-center">
          <Button
            className="bg-black text-gold-500 w-52 h-14 text-xl"
            onClick={() => logIn()}
          >
            Connect Wallet
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
