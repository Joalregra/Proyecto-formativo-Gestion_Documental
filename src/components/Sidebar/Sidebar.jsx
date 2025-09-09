import {ArchiveBoxIcon, FolderIcon, InboxIcon, PlusCircleIcon} from "@heroicons/react/24/solid";

export default function Sidebar() {
    return (
        <div className="h-[calc(100dvh-80px)] w-20 bg-senaGreen flex flex-col justify-between items-center py-5 ">
            <div className="flex flex-col items-center gap-3">
                <a href="/" className="hover:cursor-pointer bg-white p-2 rounded-md">
                    <InboxIcon className="size-12 fill-senaGreen"></InboxIcon>
                </a>
                <a href="/archive" className="hover:cursor-pointer p-2 rounded-md">
                    <ArchiveBoxIcon className="size-12 fill-white"></ArchiveBoxIcon>
                </a>
                <a href="/explorer" className="hover:cursor-pointer p-2 rounded-md">
                    <FolderIcon className="size-12 fill-white"></FolderIcon>
                </a>
            </div>
            <div>
                <a href="/form" className="hover:cursor-pointer rounded-md">
                    <PlusCircleIcon className="size-14 fill-white"></PlusCircleIcon>
                </a>
            </div>
        </div>
    )
}