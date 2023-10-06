import React from "react";
import {Card, CardHeader, CardFooter, Image, CardBody, Button} from "@nextui-org/react";

export default function NFTCard({imageSrc, title, linkToMetadata, id, isTxAvailable }) {
  return (
    <div className="max-w-[900px] max-h-[750px]	  border-black" key={id}>
    <Card isFooterBlurred className="w-[600px] col-span-12 sm:col-span-5 radius-sm bg-gold-200">
      <CardHeader className="absolute z-10 top-1 flex-col items-center">
        <p className="text-3xl text-black uppercase font-bold font-mono">{title}</p>
      </CardHeader>
      <CardBody>
        <Image
        removeWrapper
        alt={title}
        className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
        src={imageSrc}
        />
      </CardBody>
      <CardFooter className="absolute pb-4 bottom-0 border-zinc-100/50 z-10 justify-center bg-black">
        <div>
          {isTxAvailable && isTxAvailable && <Button 
            color="warning"
            radius='full'
            href={linkToMetadata}
            as="a"
            target="_blank"
            rel="noopener noreferrer"
            className="max-w-md text-lg text-black shadow-lg">
            View Metadata
          </Button>}
        </div>
      </CardFooter>
    </Card>
  </div>
  );
}
