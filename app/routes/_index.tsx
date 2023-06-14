import { json, type LinksFunction, type LoaderArgs, type LoaderFunction, type V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import CardSection from "~/components/home/cards";
import Challenges from "~/components/home/challenges";
import ContactUs from "~/components/home/contactus";
import Footer from "~/components/home/footer";
import Home from "~/components/home/home";
import Managment from "~/components/home/managment";
import Navbar from "~/components/home/navbar";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Smart Ethics" }];
};

export default function Index() {
  return (
    <div>
      <Navbar></Navbar>
      <Home></Home>
      <CardSection></CardSection>
      <Challenges></Challenges>
      <Managment></Managment>
      <ContactUs></ContactUs>
      <Footer></Footer>
    </div>
  );
}
