import React from "react";
import {Card, CardHeader, CardFooter, Image, CardBody} from "@nextui-org/react";

export default function NFTCard({imageSrc, title, linkToMetadata, id }) {
  return (
    <div className="max-w-[900px] gap-2 grid grid-cols-12 grid-rows-2 px-8 border-black" key={id}>
    <Card isFooterBlurred className="w-[400px] h-[400px] col-span-12 sm:col-span-5 radius-md bg-gold-200">
      <CardHeader className="absolute z-10 top-1 flex-col items-center">
        <p className="text-lg text-black uppercase font-bold">{title}</p>
      </CardHeader>
      <CardBody className="p-3">
        <Image
        removeWrapper
        alt="NFT AI Image"
        className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
        src={imageSrc}
        />
      </CardBody>
      <CardFooter className="absolute pb-4 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-center bg-black">
        <div>
          <p className="text-white text-md">Metadata: {linkToMetadata}</p>
        </div>
      </CardFooter>
    </Card>
  </div>
  );
}
