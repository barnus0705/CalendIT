import { createContext } from "react";

const UserContext = createContext({
    notLoggedIn: false,
    user: null,
    setUser: (user) => {}
});
export default UserContext;