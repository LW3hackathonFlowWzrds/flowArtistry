"use client"

import React, {useState, useEffect} from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Image, Button} from "@nextui-org/react";
import * as fcl from '@onflow/fcl';
import { useRouter } from "next/navigation";
import '/flow/config.js';

export default function NavBar() {
  const [user, setUser] = useState({ loggedIn: false });
  const router = useRouter();

  useEffect(() => {
		fcl.currentUser.subscribe(setUser);
	}, []);

	function handleAuthentication() {
		if (user.loggedIn) {
			fcl.unauthenticate();
      router.push("/");
		} else {
			fcl.authenticate();

		}
	}

  return (
    <Navbar position="static" isBordered>

      <NavbarBrand>
        <Image
              width={200}
              alt="app logo"
              src="/images/flowArtistry.svg"
            />
      </NavbarBrand>

      {/* <NavbarContent className="hidden sm:flex gap-4" justify="center"> */}

        {/* <NavbarItem>
          <Link color="foreground" href="/dashboard">
            Dashboard
          </Link>
        </NavbarItem> */}
        {/* <NavbarItem>
          <Link color="foreground" href="/dashboard/NFTs">
            NFTs
          </Link>
        </NavbarItem> */}

      {/* </NavbarContent> */}

      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Button onClick={handleAuthentication} color="primary" href="#" variant="flat">
            {user.loggedIn ? `Log Out` : `Login`}
          </Button>
        </NavbarItem>
        <NavbarItem>
        {user?.loggedIn && <p>Account: {user && user.addr ? user.addr : ""}</p>}
        </NavbarItem>
      </NavbarContent>

    </Navbar>
  );
}
