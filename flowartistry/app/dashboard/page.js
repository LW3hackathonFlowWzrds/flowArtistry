"use client";
// maybe rename this App.js?

import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import { useState } from "react";
import { Input } from "@nextui-org/react";
import axios from "axios";
import { NFTStorage, File } from "nft.storage";
import Spinner from "react-bootstrap/Spinner";
import "../../flow/config";
import { MintAiNFT } from "../../flow/cadence/transactions/MintAiNFT";
import useUser from "./components/useUser.js";

export default function Page() {
  const user = useUser();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [url, setURL] = useState(null);
  const [message, setMessage] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);

  const handlePrompt = async (e) => {
    e.preventDefault();

    if (name === "" || description === "") {
      window.alert("Please provide a name and description");
      return;
    }

    setIsWaiting(true);
    // Call AI API to generate an image based on description
    try {
      setMessage("Generating Image...");
      const imgData = await createImage(description);
      setImage(imgData);

      setMessage("Uploading Image to IPFS...");
      const url = await uploadImage(imgData);
      setURL(url);

      setMessage("Minting NFT...");
      await mintNFT(url, name);

      setMessage("NFT Minted!");
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error while creating and minting NFT.");
    }

    setIsWaiting(false);
  };

  const createImage = async (description) => {
    const URL = `https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2`;
    const response = await axios({
      url: URL,
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_HUGGING_FACE_API_KEY}`,
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
    const nftstorage = new NFTStorage({
      token: process.env.REACT_APP_NFT_STORAGE_API_KEY,
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
    <section class="backdrop-blur-md min-h-screen">
      {user && user.addr ? <h1>{user.addr}</h1> : null}

      {/* <div className='flex h-min-80 items-center justify-center'> */}

      {/* <div className="flex flex-col gap-4 max-w-lg bg-gold-200 p-2"> */}
      <div className="flex flex-col gap-8 justify-center items-center p-14 border-4 w-3/5 mx-auto min-h-screen rounded-3xl border-gold-300 bg-gold-500 bg-opacity-30">
        <p className="text-white font-extrabold text-2xl font-mono">
          Generate your NFT to mint
        </p>{" "}
      </div>
      <div>
        <form onSubmit={handlePrompt}>
          <Input
            size="lg"
            type="text"
            placeholder="Create a name..."
            labelPlacement="inside-left"
            className="max-w-md text-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            labelPlacement="inside-left"
            className="max-w-md text-lg"
            type="text"
            placeholder="Create a description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            color="warning"
            variant="bordered"
            radius="full"
            fullWidth
            className="max-w-md text-lg bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
            type="submit"
            value="Create & Mint"
          />
        </form>
      </div>
      {isWaiting ? (
        <div className="image__placeholder">
          <Spinner animation="border" />
          <p>{message}</p>
        </div>
      ) : image && url ? (
        <div>
          <img src={image} alt="AI generated image" />
          <p>
            View{" "}
            <a href={url} target="_blank" rel="noreferrer">
              Metadata
            </a>
          </p>
        </div>
      ) : null}
    </section>
  );
}
