import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar/Sidebar";
import {ChevronRightIcon,FunnelIcon, MagnifyingGlassIcon, Squares2X2Icon} from "@heroicons/react/24/outline";
import ArchiveExplorer from "@/components/ArchiveExplorer/ArchiveExplorer";

export default function Explorer() {
    return (
        <div className="bg-senaGray">
            <Navbar></Navbar>
            <div className="flex">
                <Sidebar></Sidebar>
                <div className="flex flex-col h-[calc(100vh-80px-2.5rem)] w-[calc(100vw-80px)] bg-white m-5 rounded-lg p-5 gap-3">
                    <div id="inbox-search" className="flex gap-3 w-full">
                        <div className="flex items-center bg-gray-100 border-none px-2 rounded-md w-100">
                            <input placeholder="Buscar" type="text"
                                   className="input bg-gray-100 text-black focus:outline-none focus:border-none border-none shadow-none w-full focus:shadow-none"/>
                            <MagnifyingGlassIcon className="size-7 stroke-black hover:cursor-pointer"></MagnifyingGlassIcon>
                        </div>
                        <button className="p-4 bg-gray-100 rounded-md hover:cursor-pointer hover:bg-[#A7F1FB]"><FunnelIcon
                            className="size-7 fill-white-200 stroke-black" ></FunnelIcon></button>
                        <button className="p-4 bg-gray-100 rounded-md hover:cursor-pointer hover:bg-[#A7F1FB]"><Squares2X2Icon
                            className="size-7 bg-none fill-white-200 stroke-black" ></Squares2X2Icon></button>
                    </div>
                    <div className="flex mt-7 mb-2 ml-3 gap-1 items-center">
                        <button className="text-xl text-gray-500 font-bold cursor-pointer
                                       px-3 py-2 rounded-md hover:text-gray-400">Archivos
                        </button>
                        <ChevronRightIcon className="size-5 cursor-pointer text-gray-500"></ChevronRightIcon>
                    </div>
                    <ArchiveExplorer />
                </div>
            </div>

        </div>
    );
}