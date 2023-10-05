"use client";

import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import { useState } from "react";
import { Input, Textarea, Button, Spinner } from "@nextui-org/react";
import axios from "axios";
import { NFTStorage, File } from "nft.storage";
import "../../flow/config";
import { MintAiNFT } from "../../flow/cadence/transactions/MintAiNFT.js";
import NFTCard from "../components/NFTCard";

export default function Page() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [url, setURL] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

 
  const handlePrompt = async () => {
    setIsLoading(true);
    try {
      setLoadingMessage("Generating Image...");
      const imgData = await createImage(description);
      setImage(imgData);

      setLoadingMessage("Uploading Image to IPFS...");
      const url = await uploadImage(imgData);
      setURL(url);

      setLoadingMessage("Minting NFT...");
      await mintNFT(url, name);

      setLoadingMessage("NFT Minted!");
    } catch (error) {
      console.error("Error:", error);
      setError(true);
      setLoadingMessage("Error while creating and minting NFT.");
    }

    setIsLoading(false);
    setError(false);
  };

  const createImage = async (description) => {
    const URL = `https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2`;
    const secretKey = process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY;
    const response = await axios({
      url: URL,
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        inputs: description,
        options: { wait_for_model: true },
      }),
      responseType: "arraybuffer",
    });

    const type = response.headers["content-type"];
    const data = response.data;

    const base64data = Buffer.from(data).toString("base64");
    const img = `data:${type};base64,` + base64data;
    return img;
  };

  const uploadImage = async (ipfsLink) => {
    const secretKey = process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY;
    const nftstorage = new NFTStorage({
      token: secretKey,
    });

    const { ipnft } = await nftstorage.store({
      image: new File([ipfsLink], "image.jpeg", { type: "image/jpeg" }),
      name: name,
      description: description,
    });

    const url = `https://ipfs.io/ipfs/${ipnft}/metadata.json`;
    return url;
  };

  const mintNFT = async (name, ipfsLink) => {
    try {
      const transactionId = await fcl
        .send([
          fcl.transaction(MintAiNFT),
          fcl.args([fcl.arg(ipfsLink, t.String), fcl.arg(name, t.String)]),
          fcl.proposer(fcl.authz),
          fcl.authorizations([fcl.authz]),
          fcl.limit(9999),
        ])
        .then(fcl.decode);

      console.log("NFT Mint Transaction ID:", transactionId);
    } catch (error) {
      console.error("Minting error:", error);
    }
  };

  return (
    <section className="backdrop-blur-md min-h-screen">
      <div className="flex flex-col gap-8 justify-center items-center p-14 border-4 w-3/5 mx-auto min-h-screen rounded-3xl border-gold-300 bg-gold-500 bg-opacity-30">
        <p className="text-white font-extrabold text-2xl font-mono">
          {(isLoading || image) ? " " :  "Generate your NFT to mint"}
          {image && "Your AI generated NFT!"}
        </p>

        { isLoading ?
          (<Spinner label={loadingMessage} size="lg" color={error ? "danger" : "success"} labelColor={error ? "danger" : "success"}/>) :
            image && url ?
              (<NFTCard imageSrc={image} title={name} linkToMetadata={url} id={url}/>) : (
                <>
                  <Input 
                      size='lg' 
                      type="text" 
                      label="NFT Name" 
                      labelPlacement="inside-left"
                      placeholder="Name of your NFT"
                      className="max-w-md text-lg"
                      onChange= {(e) => setName(e.target.value)}
                      isRequired
                      fullWidth
                      />
                    <Textarea
                      isRequired
                      label="AI prompt"
                      labelPlacement="inside-left"
                      placeholder="Enter your prompt"
                      className="max-w-md text-lg"
                      onChange= {(e) => setDescription(e.target.value)}
                    />
                    <Button 
                      color="warning"
                      variant="bordered" 
                      radius='full'
                      fullWidth
                      onClick={() => handlePrompt()}
                      isDisabled={!name || !description}
                      className="max-w-md text-lg bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg">
                      Mint
                    </Button>
                </>
              )
        }     
      </div>

    </section>
  );
}
