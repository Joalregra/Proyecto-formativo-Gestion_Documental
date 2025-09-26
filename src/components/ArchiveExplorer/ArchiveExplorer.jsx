"use client";

import { useEffect, useState } from "react";
import {
    ArrowDownTrayIcon,
    Bars3BottomLeftIcon,
    EllipsisVerticalIcon,
    FolderIcon,
    InformationCircleIcon,
    ChevronRightIcon,
} from "@heroicons/react/24/solid";

export default function ArchiveExplorer() {
    const [folders, setFolders] = useState([]);
    const [parentId, setParentId] = useState(null); // null = raíz
    const [stack, setStack] = useState([]); // history to go back
    const [stackNames, setStackNames] = useState([]); // names of the folder to user the breadcrumb

    useEffect(() => {
        const url = parentId === null ? "/api/folders" : `/api/folders?parent_id=${parentId}`;
        fetch(url)
            .then(async (res) => {
                if (!res.ok) {
                    console.error("Failed to fetch", url, res.status, res.statusText);
                    return [];
                }
                try {
                    const data = await res.json();
                    return Array.isArray(data) ? data : [];
                } catch (e) {
                    console.error("Invalid JSON from", url, e);
                    return [];
                }
            })
            .then((data) => setFolders(Array.isArray(data) ? data : []))
            .catch((err) => {
                console.error("fetch error:", err);
                setFolders([]);
            });
    }, [parentId]);

    const enterFolder = (folder) => {
        if (folder?.type !== "carpeta") return; // to navigate only to folders
        setStack((prev) => [...prev, parentId]);
        setStackNames((prev) => [...prev, folder?.name ?? String(folder?.id ?? "")]);
        setParentId(folder.id);
    };

    const goBack = () => {
        setStack((prev) => {
            const next = [...prev];
            const last = next.pop();
            setParentId(last ?? null);
            return next;
        });
        setStackNames((prev) => {.
            const next = [...prev];
            next.pop();
            return next;
        });
    };

    const handleBreadcrumbClick = (idx) => {
        // Build array of folder IDs corresponding to breadcrumb items
        const idsPath = [...stack.slice(1), parentId];
        const targetId = idsPath[idx];
        if (targetId === undefined || targetId === parentId) return; // no-op if current
        setParentId(targetId ?? null);
        setStack((prev) => prev.slice(0, idx + 1));
        setStackNames((prev) => prev.slice(0, idx + 1));
    };

    return (
        <div className="overflow-x-auto w-full">
            <div className="flex mt-7 mb-2 ml-3 gap-1 items-center">
                <button
                    className="text-xl text-gray-500 font-bold cursor-pointer px-3 py-2 rounded-md hover:text-gray-400"
                    onClick={() => {
                        setParentId(null);
                        setStack([]);
                        setStackNames([]);
                    }}
                >
                    Archivos
                </button>
                {stackNames.map((name, idx) => (
                    <span key={`${name}-${idx}`} className="flex items-center">
                        <ChevronRightIcon className="size-5 cursor-pointer text-gray-500" />
                        <button
                            className="text-xl text-gray-500 font-bold cursor-pointer px-3 py-2 rounded-md hover:text-gray-400"
                            onClick={() => handleBreadcrumbClick(idx)}
                        >
                            {name}
                        </button>
                    </span>
                ))}

                <div className="ml-auto flex gap-2">
                    {stack.length > 0 && (
                        <button
                            onClick={goBack}
                            className="text-sm text-gray-600 px-3 py-2 rounded-md hover:text-gray-400"
                        >
                            Atrás
                        </button>
                    )}
                </div>
            </div>

            <table className="table border-separate border-spacing-y-2 w-full pb-15">
                <thead className="sticky top-0">
                <tr className="bg-gray-500 text-white text-lg">
                    <th className="rounded-l-lg p-2">
                        <input type="checkbox" className="checkbox border-white text-white" />
                    </th>
                    <th>
                        <FolderIcon className="size-10 opacity-0" />
                    </th>
                    <th>Nombre</th>
                    <th>Última Modificación</th>
                    <th>Tamaño</th>
                    <th>Tipo</th>
                    <th className="rounded-r-lg"></th>
                </tr>
                </thead>
                <tbody>
                {(Array.isArray(folders) ? folders : []).map((folder) => (
                    <tr
                        key={folder.id}
                        className="odd:bg-gray-100 hover:bg-[#A7F1FB] even:bg-gray-200 text-black cursor-pointer"
                        onClick={() => enterFolder(folder)}
                    >
                        <td className="rounded-l-lg p-2">
                            <input
                                type="checkbox"
                                className="checkbox"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </td>
                        <td>
                            <FolderIcon className="size-10 fill-gray-700 cursor-pointer" />
                        </td>
                        <td>{folder.name}</td>
                        <td>{new Date(folder.updated_at).toLocaleDateString()}</td>
                        <td>--</td>
                        <td>{folder.type}</td>
                        <td className="flex justify-center gap-3 rounded-r-lg">
                            <div className="border-none bg-transparent rounded-[50%] hover:bg-[#75D0D1]">
                                <ArrowDownTrayIcon className="size-7 m-1 fill-gray-700" />
                            </div>
                            <div className="dropdown dropdown-end">
                                <div
                                    tabIndex={0}
                                    role="button"
                                    className="border-none bg-transparent rounded-[50%] hover:bg-[#75D0D1]"
                                >
                                    <EllipsisVerticalIcon className="size-8 fill-gray-700" />
                                </div>
                                <ul className="dropdown-content menu bg-base-100 rounded-box w-40 p-2 shadow-sm">
                                    <li>
                                        <a>
                                            <InformationCircleIcon className="size-4 fill-gray-700" />
                                            Detalles
                                        </a>
                                    </li>
                                    <li>
                                        <a>
                                            <ArrowDownTrayIcon className="size-4 fill-gray-700" />
                                            Descargar
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
