import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Search from "./pages/Search";
import ReportLost from "./pages/ReportLost";
import ReportFound from "./pages/ReportFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Footer from "./components/Footer";
import MyReports from "./pages/MyReports";
import EditReport from "./pages/EditReport";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import ItemDetails from "./pages/ItemDetails";

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/report-lost" element={<ReportLost />} />
        <Route path="/report-found" element={<ReportFound />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-reports" element={<MyReports />} />
        <Route path="/edit-report/:id" element={<EditReport />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chat/:itemId/:receiverId" element={<Chat />} />
        <Route path="/item/:id" element={<ItemDetails />} />
      </Routes>
      <Footer />
    </>
  );

}

export default App;
