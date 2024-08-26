import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Home from "./pages/Home/Home";
import Cours from "./pages/Cours/Cours";
import Contact from "./pages/Contact/Contact";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import Profile from "./pages/Profile/Profile";
import Panier from "./pages/Panier/Panier";
import Footer from "./components/Footer/Footer";
import PostPage from "./pages/CoursPostPage/PostPage";
import ScrollUp from "./components/ScrollUp/ScrollUp";
import ProfileCours from "./components/ProfileCours/ProfileCours";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cours" element={<Cours />} />
        <Route path="/post/:postSlug" element={<PostPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/logout" element={<SignIn />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile-cours" element={<ProfileCours />} />
        <Route path="/panier" element={<Panier />} />
      </Routes>
      <Footer />
      <ScrollUp />
    </BrowserRouter>
  );
}
