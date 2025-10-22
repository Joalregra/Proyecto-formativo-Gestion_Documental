import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar/Sidebar";
import { ChevronRightIcon, FunnelIcon, MagnifyingGlassIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import ArchiveExplorer from "@/components/ArchiveExplorer/ArchiveExplorer";
import { useState } from "react"; // <-- Import useState

export default function Explorer() {
    // State to hold the value typed in the input field
    const [inputSearchTerm, setInputSearchTerm] = useState("");
    // State that triggers the actual search logic (passed to ArchiveExplorer)
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = () => {
        // Only update the actual search term when the icon is clicked or Enter is pressed
        setSearchTerm(inputSearchTerm.trim());
    };

    return (
        <div className="bg-senaGray">
            <Navbar></Navbar>
            <div className="flex">
                <Sidebar></Sidebar>
                <div className="flex flex-col h-[calc(100vh-80px-2.5rem)] w-[calc(100vw-80px)] bg-white m-5 rounded-lg p-5 gap-3">
                    <div id="inbox-search" className="flex gap-3 w-full">
                        {/* Use flex-grow and max-w-sm for better responsiveness */}
                        <div className="flex items-center bg-gray-100 border-none px-2 rounded-md flex-grow max-w-sm">
                            {/* Input bound to inputSearchTerm state */}
                            <input
                                placeholder="Buscar"
                                type="text"
                                className="input bg-gray-100 text-black focus:outline-none focus:border-none border-none shadow-none w-full focus:shadow-none"
                                value={inputSearchTerm}
                                onChange={(e) => setInputSearchTerm(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSearch();
                                }}
                            />
                            {/* Icon triggers the search */}
                            <MagnifyingGlassIcon
                                className="size-7 stroke-black hover:cursor-pointer"
                                onClick={handleSearch}
                            ></MagnifyingGlassIcon>
                        </div>
                        <button className="p-4 bg-gray-100 rounded-md hover:cursor-pointer hover:bg-[#A7F1FB]"><FunnelIcon
                            className="size-7 fill-white-200 stroke-black" ></FunnelIcon></button>
                        <button className="p-4 bg-gray-100 rounded-md hover:cursor-pointer hover:bg-[#A7F1FB]"><Squares2X2Icon
                            className="size-7 bg-none fill-white-200 stroke-black" ></Squares2X2Icon></button>
                    </div>
                    {/* Pass both the search term and the function to clear it */}
                    <ArchiveExplorer
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />
                </div>
            </div>
        </div>
    );
}
