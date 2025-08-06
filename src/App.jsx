import Header from "./components/Header/Header";
import UserList from "./components/UserList/UserList";
import RegistrationForm from "./components/RegistrationForm/RegistrationForm";

function App() {
  return (
    <>
      <Header />
      <main>
        <UserList />
        <RegistrationForm />
      </main>
    </>
  );
}

export default App;
