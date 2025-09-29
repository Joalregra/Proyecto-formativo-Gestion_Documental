"use client";

import { useEffect, useState } from "react";
import {
    ArrowDownTrayIcon,
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
        setStackNames((prev) => {
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

    const [isOpen, setIsOpen] = useState(false);
    return (



        <div className="overflow-x-auto w-full">
                {/* Botón para abrir el modal */}
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-senaGreen cursor-pointer hover:bg-green-700 text-white font-bold py-2 px-10 rounded-lg shadow-md"
                >
                    Abrir Formulario
                </button>

                {/* Modal */}
                {isOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                        <div className="relative flex flex-col items-center bg-white rounded-lg p-10 w-full max-w-2xl shadow-md">

                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl cursor-pointer"
                            >
                                ✖
                            </button>

                            <h1 className="font-bold text-2xl text-senaDarkGreen text-center mb-4">
                                Guardar Archivo
                            </h1>

                            <form className="w-full flex flex-col gap-6">
                                <div className="w-full">
                                    <label
                                        className="text-md font-light text-gray-600"
                                        htmlFor="full-name"
                                    >
                                        Nombre del Archivo
                                    </label>
                                    <input
                                        id="full-name"
                                        type="text"
                                        className="input w-full py-2 mt-1"
                                        placeholder="Escribe el nombre del archivo"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label
                                            className="text-md font-light text-gray-600"
                                            htmlFor="seccion"
                                        >
                                            Sección
                                        </label>
                                        <select
                                            id="seccion"
                                            defaultValue=""
                                            className="select w-full px-4 py-2 mt-1"
                                        >
                                            <option value="" disabled>
                                                Seleccione...
                                            </option>
                                            <option>Crimson</option>
                                            <option>Amber</option>
                                            <option>Velvet</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label
                                            className="text-md font-light text-gray-600"
                                            htmlFor="subseccion"
                                        >
                                            Sub Sección
                                        </label>
                                        <select
                                            id="subseccion"
                                            defaultValue=""
                                            className="select w-full px-4 py-2 mt-1"
                                        >
                                            <option value="" disabled>
                                                Seleccione...
                                            </option>
                                            <option>Crimson</option>
                                            <option>Amber</option>
                                            <option>Velvet</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label
                                            className="text-md font-light text-gray-600"
                                            htmlFor="serie"
                                        >
                                            Serie
                                        </label>
                                        <select
                                            id="serie"
                                            defaultValue=""
                                            className="select w-full px-4 py-2 mt-1"
                                        >
                                            <option value="" disabled>
                                                Seleccione...
                                            </option>
                                            <option>Crimson</option>
                                            <option>Amber</option>
                                            <option>Velvet</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label
                                            className="text-md font-light text-gray-600"
                                            htmlFor="subserie"
                                        >
                                            Sub Serie
                                        </label>
                                        <select
                                            id="subserie"
                                            defaultValue=""
                                            className="select w-full px-4 py-2 mt-1"
                                        >
                                            <option value="" disabled>
                                                Seleccione...
                                            </option>
                                            <option>Crimson</option>
                                            <option>Amber</option>
                                            <option>Velvet</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex justify-center mt-6">
                                    <button
                                        type="submit"
                                        className="bg-senaGreen cursor-pointer hover:bg-green-700 text-white font-bold py-2 px-16 rounded-lg transition"
                                    >
                                        Guardar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            <div className="flex mt-7 mb-2 ml-3 gap-1 items-center">
                <button
                    className="text-xl text-gray-500 font-bold cursor-pointer px-3 py-2 rounded-md hover:text-gray-400"
                    onClick={() => {
                        setParentId(null);
                        setStack([]);
                        setStackNames([]);
                    }}
                >
                    Home
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
                    <th>Sección</th>
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
                        <td>{folder.codigo_documental ?? "--"}</td>
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
