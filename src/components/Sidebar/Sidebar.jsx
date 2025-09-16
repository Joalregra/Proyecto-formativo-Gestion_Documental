"use client";

import { ArchiveBoxIcon, FolderIcon, InboxIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();

    const links = [
        { id: "inbox", href: "/", icon: InboxIcon },
        { id: "archive", href: "/archive", icon: ArchiveBoxIcon },
        { id: "explorer", href: "/explorer", icon: FolderIcon },
    ];

    return (
        <>

            <div className="hidden md:flex h-[calc(100dvh-80px)] w-20 bg-senaGreen flex-col justify-between items-center py-5">
                <div className="flex flex-col items-center gap-3">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;

                        return (
                            <Link
                                key={link.id}
                                href={link.href}
                                className={`hover:cursor-pointer p-2 rounded-md transition ${
                                    isActive ? "bg-white" : "bg-transparent"
                                }`}
                            >
                                <Icon
                                    className={`size-12 transition ${
                                        isActive ? "fill-senaGreen" : "fill-white"
                                    }`}
                                />
                            </Link>
                        );
                    })}
                </div>

                <div>
                    <Link href="/form" className="hover:cursor-pointer rounded-md">
                        <PlusCircleIcon className="size-14 fill-white" />
                    </Link>
                </div>
            </div>


            <div className="md:hidden fixed bottom-0 left-0 w-full bg-senaGreen flex justify-around items-center py-2 z-50">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    return (
                        <Link
                            key={link.id}
                            href={link.href}
                            className={`p-2 rounded-md transition ${
                                isActive ? "bg-white" : "bg-transparent"
                            }`}
                        >
                            <Icon
                                className={`size-10 transition ${
                                    isActive ? "fill-senaGreen" : "fill-white"
                                }`}
                            />
                        </Link>
                    );
                })}

                <Link href="/form" className="hover:cursor-pointer rounded-md">
                    <PlusCircleIcon className="size-12 fill-white" />
                </Link>
            </div>
        </>
    );
}
