// gives access to the logged in user's state

import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";

export default function useUser() {
  const [user, setUser] = useState({ loggedIn: false });

  useEffect(() => {
    return fcl.currentUser.subscribe(setUser); // Unsubscribe on cleanup
  }, []);

  return user;
}
