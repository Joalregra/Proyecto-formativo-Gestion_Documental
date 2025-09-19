import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar/Sidebar";
import {FunnelIcon, MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import ArchiveTable from "@/components/ArchiveTable/ArchiveTable";

export default function Archive() {
    return (
        <div className="bg-senaGray">
            <Navbar></Navbar>
            <div className="flex">
                <Sidebar></Sidebar>
                <div className="flex flex-col h-[calc(100vh-80px-2.5rem)] w-[calc(110vw-80px)] bg-white m-5 rounded-lg p-5 gap-3">
                    <div id="inbox-search" className="flex gap-3 w-full">
                        <div className="flex items-center bg-gray-100 border-none px-1 rounded-md w-100">
                            <input placeholder="Buscar" type="text"
                                   className="input bg-gray-100 focus:outline-none focus:border-none border-none shadow-none w-full focus:shadow-none"/>
                            <MagnifyingGlassIcon className="size-5 mr-2"></MagnifyingGlassIcon>
                        </div>
                        <button className="p-4 bg-gray-100  rounded-md hover:cursor-pointer"><FunnelIcon
                            className="size-5"></FunnelIcon></button>
                    </div>
                    <ArchiveTable />
                </div>
            </div>

        </div>
    );
}