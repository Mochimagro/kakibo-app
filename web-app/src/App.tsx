import { Route, Routes } from "react-router";
import InputPage from "./pases/Input";
import DatePage from "./pases/Date";
import MonthData from "./pases/MonthPage";
import { Flex } from "@chakra-ui/react";

import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/input" element={<InputPage />} />
      <Route path="/date" element={<DatePage />} />
    </Routes>
  );
}

function HomePage() {
  return (
    <Flex minH="100vh" direction="column">
      <Header />
      <MonthData />
      <Footer />
    </Flex>
  );
}

export default App;
