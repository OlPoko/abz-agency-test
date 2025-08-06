import { useState } from "react";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import UserList from "./components/UserList/UserList";
import RegistrationForm from "./components/RegistrationForm/RegistrationForm";

function App() {
  const [refreshUsers, setRefreshUsers] = useState(false);

  const handleUserRegistered = () => {
    setRefreshUsers((prev) => !prev);
  };

  return (
    <>
      <Header />
      <Hero />
      <main>
        <UserList refresh={refreshUsers} />
        <RegistrationForm onUserRegistered={handleUserRegistered} />
      </main>
    </>
  );
}

export default App;
