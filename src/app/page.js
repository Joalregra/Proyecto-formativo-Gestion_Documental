'use client'
import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar/Sidebar";
import Inbox from "@/components/Inbox/Inbox";
import MailReader from "@/components/MailReader/MailReader";

export default function Home() {
    return (
        <div className="bg-senaGray">
            <Navbar></Navbar>
            <div className="flex">
                <Sidebar></Sidebar>
                <div className="flex h-[calc(100vh-80px-2.5rem)] w-[calc(107vw-80px)] bg-white m-5 rounded-lg">
                    <Inbox></Inbox>
                    <MailReader></MailReader>
                </div>
            </div>

        </div>
    );
}
