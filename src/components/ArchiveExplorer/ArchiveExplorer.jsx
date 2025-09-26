"use client"; // 👈 si usas App Router (Next.js 13+), debe ir en la PRIMERA línea del archivo

import { useEffect, useState } from "react";
import {
    ArrowDownTrayIcon,
    Bars3BottomLeftIcon,
    EllipsisVerticalIcon,
    FolderIcon,
    InformationCircleIcon,
} from "@heroicons/react/24/solid";

export default function ArchiveExplorer() {
    const [folders, setFolders] = useState([]);
    const [parentId, setParentId] = useState(null); // null = raíz
    const [stack, setStack] = useState([]); // historial para volver atrás

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
        if (folder?.type !== "carpeta") return; // solo navegar en carpetas
        setStack((prev) => [...prev, parentId]);
        setParentId(folder.id);
    };

    const goBack = () => {
        setStack((prev) => {
            const next = [...prev];
            const last = next.pop();
            setParentId(last ?? null);
            return next;
        });
    };

    return (
        <div className="overflow-x-auto w-full">
            {/* Barra de navegación simple */}
            <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-gray-600">
                    Ruta: {stack.length === 0 ? "Raíz" : `…/${stack.filter(x => x !== null).join("/")}/${parentId ?? ""}`}
                </div>
                <div className="flex gap-2">
                    {stack.length > 0 && (
                        <button onClick={goBack} className="btn btn-sm">
                            Atrás
                        </button>
                    )}
                </div>
            </div>

            <table className="table border-separate border-spacing-y-2 w-full pb-15">
                <thead className="sticky top-0">
                <tr className="bg-gray-500 text-white text-lg">
                    <th className="rounded-l-lg">
                        <input type="checkbox" className="checkbox border-white text-white" />
                    </th>
                    <th className="flex items-center gap-5">
                        <Bars3BottomLeftIcon className="size-10 cursor-pointer" />
                        Sección
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
                        <td className="rounded-l-lg">
                            <FolderIcon className="size-10 fill-gray-700 cursor-pointer" />
                        </td>
                        <td>{folder.id}</td>
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
