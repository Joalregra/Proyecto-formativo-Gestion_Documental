"use client";

import { useEffect, useState } from "react";
import {
    ArrowDownTrayIcon,
    EllipsisVerticalIcon,
    FolderIcon,
    InformationCircleIcon,
    ChevronRightIcon,
    DocumentIcon,
} from "@heroicons/react/24/solid";

function formatSize(bytes) {
    if (!Number.isFinite(bytes) || bytes < 0) return "-";
    const units = ["B", "KB", "MB", "GB", "TB"];
    let i = 0;
    let v = bytes;
    while (v >= 1024 && i < units.length - 1) {
        v /= 1024;
        i++;
    }
    return `${v % 1 === 0 ? v : v.toFixed(1)}${units[i]}`;
}

export default function ArchiveExplorer() {
    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);
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

        const urlFiles = parentId === null ? "/api/files" : `/api/files?folder_id=${parentId}`;
        fetch(urlFiles)
            .then(async (res) => {
                if (!res.ok) {
                    console.error("Failed to fetch", urlFiles, res.status, res.statusText);
                    return [];
                }
                try {
                    const data = await res.json();
                    return Array.isArray(data) ? data : [];
                } catch (e) {
                    console.error("Invalid JSON from", urlFiles, e);
                    return [];
                }
            })
            .then((data) => setFiles(Array.isArray(data) ? data : []))
            .catch((err) => {
                console.error("fetch files error:", err);
                setFiles([]);
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
    const [detailsItem, setDetailsItem] = useState(null);

    // Helper to open the details drawer reliably and set the selected item
    const openDetails = (type, data) => {
        try {
            setDetailsItem({ type, data });
            if (typeof document !== 'undefined') {
                const checkbox = document.getElementById('my-drawer-4');
                if (checkbox) checkbox.checked = true;
            }
        } catch (e) {
            console.error('openDetails error', e);
        }
    };

    // Cascading selects state for modal
    const [options1, setOptions1] = useState([]); // root level
    const [options2, setOptions2] = useState([]); // children of level 1
    const [options3, setOptions3] = useState([]); // children of level 2
    const [options4, setOptions4] = useState([]); // children of level 3

    const [sel1, setSel1] = useState("");
    const [sel2, setSel2] = useState("");
    const [sel3, setSel3] = useState("");
    const [sel4, setSel4] = useState("");

    // Form fields
    const [fileName, setFileName] = useState("");
    const [fileInput, setFileInput] = useState(null); // File object
    const [submitting, setSubmitting] = useState(false);
    const [submitMsg, setSubmitMsg] = useState("");

    const deepestFolderId = () => {
        return sel4 || sel3 || sel2 || sel1 || "";
    };

    const fileToBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitMsg("");
        if (!fileName.trim()) {
            setSubmitMsg("Por favor, ingresa el nombre del archivo.");
            return;
        }
        if (!deepestFolderId()) {
            setSubmitMsg("Selecciona al menos una carpeta destino.");
            return;
        }
        if (!fileInput) {
            setSubmitMsg("Selecciona un archivo para subir.");
            return;
        }
        try {
            setSubmitting(true);
            const base64 = await fileToBase64(fileInput);
            const payload = {
                name: fileName.trim(),
                folder_id: Number(deepestFolderId()),
                file: {
                    base64,
                    filename: fileInput.name,
                    mimeType: fileInput.type,
                    size: fileInput.size,
                },
            };
            const res = await fetch("/api/files", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || `Fallo al guardar (${res.status})`);
            }
            setSubmitMsg("Archivo guardado correctamente.");
            // Reset form
            setFileName("");
            setSel1("");
            setSel2("");
            setSel3("");
            setSel4("");
            setOptions2([]);
            setOptions3([]);
            setOptions4([]);
            setFileInput(null);
            // Close modal after short delay
            setTimeout(() => setIsOpen(false), 700);
        } catch (err) {
            console.error("Submit error:", err);
            setSubmitMsg(err.message || "Error inesperado guardando el archivo.");
        } finally {
            setSubmitting(false);
        }
    };

    // Helper to fetch children by parent id (null for root)
    const fetchChildren = async (pid) => {
        const url = pid === null ? "/api/folders" : `/api/folders?parent_id=${pid}`;
        try {
            const res = await fetch(url);
            if (!res.ok) return [];
            const data = await res.json();
            const arr = Array.isArray(data) ? data : [];
            return arr.filter((it) => (it?.type ?? "").toLowerCase() === "carpeta");
        } catch (e) {
            console.error("fetchChildren error", e);
            return [];
        }
    };

    // When modal opens, load root options
    useEffect(() => {
        if (!isOpen) return;
        (async () => {
            const root = await fetchChildren(null);
            setOptions1(root);
            // reset selections and deeper options each time modal opens
            setSel1("");
            setSel2("");
            setSel3("");
            setSel4("");
            setOptions2([]);
            setOptions3([]);
            setOptions4([]);
        })();
    }, [isOpen]);

    const onChange1 = async (e) => {
        const id = e.target.value ? Number(e.target.value) : "";
        setSel1(id);
        setSel2("");
        setSel3("");
        setSel4("");
        setOptions3([]);
        setOptions4([]);
        if (id === "") {
            setOptions2([]);
            return;
        }
        const children = await fetchChildren(id);
        setOptions2(children);
    };

    const onChange2 = async (e) => {
        const id = e.target.value ? Number(e.target.value) : "";
        setSel2(id);
        setSel3("");
        setSel4("");
        setOptions4([]);
        if (id === "") {
            setOptions3([]);
            return;
        }
        const children = await fetchChildren(id);
        setOptions3(children);
    };

    const onChange3 = async (e) => {
        const id = e.target.value ? Number(e.target.value) : "";
        setSel3(id);
        setSel4("");
        if (id === "") {
            setOptions4([]);
            return;
        }
        const children = await fetchChildren(id);
        setOptions4(children);
    };

    const onChange4 = (e) => {
        const id = e.target.value ? Number(e.target.value) : "";
        setSel4(id);
    };

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

                            <form className="w-full flex flex-col gap-6" onSubmit={handleSubmit}>
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
                                        value={fileName}
                                        onChange={(e) => setFileName(e.target.value)}
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
                                            value={sel1}
                                            onChange={onChange1}
                                            className="select w-full px-4 py-2 mt-1"
                                        >
                                            <option value="" disabled>
                                                Seleccione...
                                            </option>
                                            {options1.map((opt) => (
                                                <option key={opt.id} value={opt.id}>
                                                    {opt.name}
                                                </option>
                                            ))}
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
                                            value={sel2}
                                            onChange={onChange2}
                                            className="select w-full px-4 py-2 mt-1"
                                            disabled={!sel1 || options2.length === 0}
                                        >
                                            <option value="" disabled>
                                                Seleccione...
                                            </option>
                                            {options2.map((opt) => (
                                                <option key={opt.id} value={opt.id}>
                                                    {opt.name}
                                                </option>
                                            ))}
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
                                            value={sel3}
                                            onChange={onChange3}
                                            className="select w-full px-4 py-2 mt-1"
                                            disabled={!sel2 || options3.length === 0}
                                        >
                                            <option value="" disabled>
                                                Seleccione...
                                            </option>
                                            {options3.map((opt) => (
                                                <option key={opt.id} value={opt.id}>
                                                    {opt.name}
                                                </option>
                                            ))}
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
                                            value={sel4}
                                            onChange={onChange4}
                                            className="select w-full px-4 py-2 mt-1"
                                            disabled={!sel3 || options4.length === 0}
                                        >
                                            <option value="" disabled>
                                                Seleccione...
                                            </option>
                                            {options4.map((opt) => (
                                                <option key={opt.id} value={opt.id}>
                                                    {opt.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/*

                                File upload */}
                                <div className="w-full">
                                    <label className="text-md font-light text-gray-600" htmlFor="file">
                                        Archivo
                                    </label>
                                    <input
                                        id="file"
                                        type="file"
                                        className="input w-full py-2 mt-1"
                                        onChange={(e) => setFileInput(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                                        accept="*/*"
                                    />
                                </div>

                                <div className="flex flex-col items-center mt-6 gap-2">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className={`bg-senaGreen ${submitting ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:bg-green-700'} text-white font-bold py-2 px-16 rounded-lg transition`}
                                    >
                                        {submitting ? 'Guardando…' : 'Guardar'}
                                    </button>
                                    {submitMsg && (
                                        <p className="text-sm text-gray-700">{submitMsg}</p>
                                    )}
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
                            onDoubleClick={() => handleBreadcrumbClick(idx)}
                        >
                            {name}
                        </button>
                    </span>
                ))}

                <div className="ml-auto flex gap-2">
                    {stack.length > 0 && (
                        <button
                            onDoubleClick={goBack}
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
                        onDoubleClick={() => enterFolder(folder)}
                    >
                        <td className="rounded-l-lg p-2">
                            <input
                                type="checkbox"
                                className="checkbox"
                                onDoubleClick={(e) => e.stopPropagation()}
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
                                    onMouseDown={() => setDetailsItem({ type: 'folder', data: folder })}
                                >
                                    <EllipsisVerticalIcon className="size-8 fill-gray-700" />
                                </div>
                                <ul className="dropdown-content menu bg-base-100 rounded-box w-40 p-2 shadow-sm">
                                    <li>
                                        <button type="button" className="flex items-center gap-2 cursor-pointer" onClick={() => openDetails('folder', folder)}>
                                            <InformationCircleIcon className="size-4 fill-gray-700" />
                                            Detalles
                                        </button>
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
                {/* Files list */}
                <tbody className="overflow-y-70">
                {(Array.isArray(files) ? files : []).map((file) => (
                    <tr key={file.id} className="odd:bg-gray-100 hover:bg-[#A7F1FB] even:bg-gray-200 text-black cursor-pointer">
                        <td className="rounded-l-lg p-2">
                            <input type="checkbox" className="checkbox" />
                        </td>
                        <td>
                            <DocumentIcon className="size-10 fill-gray-700 cursor-pointer" />
                        </td>
                        <td>--</td>
                        <td>{file.name}</td>
                        <td>{file.created_at ? new Date(file.created_at).toLocaleDateString() : "--"}</td>
                        <td>{formatSize(file.size)}</td>
                        <td>{file.tipo || "Archivo"}</td>
                        <td className="flex justify-center gap-15 rounded-r-lg">
                            <a href={file.file_path || '#'} download tabIndex={0} role="button" className="border-none bg-transparent rounded-[50%] hover:bg-[#75D0D1]">
                                <ArrowDownTrayIcon className="size-7 m-1 fill-gray-700"></ArrowDownTrayIcon>
                            </a>
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="border-none bg-transparent rounded-[50%] hover:bg-[#75D0D1]">
                                    <EllipsisVerticalIcon className="size-8  fill-gray-700"></EllipsisVerticalIcon>
                                </div>
                                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box w-40 p-2 shadow-sm">
                                    <li> <label htmlFor="my-drawer-4" className="flex items-center gap-2 cursor-pointer" onMouseDown={() => setDetailsItem({ type: 'file', data: file })}>
                                        <InformationCircleIcon className="size-4  fill-gray-700"></InformationCircleIcon> Detalles </label></li>
                                    <li><a href={file.file_path || '#'} download> <ArrowDownTrayIcon className="size-4  fill-gray-700"></ArrowDownTrayIcon> Descargar </a></li>
                                </ul>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="drawer drawer-end">
                <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
                
                <div className="drawer-content">
                    {/* Ejemplo: un botón que abre el drawer */}
                </div>

                <div className="drawer-side">
                    <label
                    htmlFor="my-drawer-4"
                    aria-label="close sidebar"
                    className="drawer-overlay"
                    ></label>

                    <label htmlFor="my-drawer-4" aria-label="close sidebar" className="w-full h-full flex items-center justify-center p-4 cursor-pointer">
                        <div className="max-w-xs w-full bg-white border rounded-lg shadow-sm p-4 text-center transform origin-center" style={{ transform: 'scale(1.44)' }} onClick={(e) => e.stopPropagation()}>
                        {/* Icon */}
                        <div className="w-full flex justify-center mb-2">
                            <div className="border rounded-md p-6">
                                {detailsItem?.type === 'folder' ? (
                                    <FolderIcon className="w-12 h-12 text-gray-600" />
                                ) : (
                                    <DocumentIcon className="w-12 h-12 text-gray-600" />
                                )}
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className="font-semibold text-gray-900 mb-3">{detailsItem?.data?.name || 'Detalles'}</h2>

                        {/* main info */}
                        <div className="text-sm text-gray-700 space-y-1">
                            <p><span className="font-medium">Tipo:</span> {detailsItem?.type === 'folder' ? 'Carpeta' : (detailsItem?.data?.tipo || 'Archivo')}</p>
                            <p><span className="font-medium">Última Modificación:</span> {(() => { const d = detailsItem?.data?.updated_at || detailsItem?.data?.created_at; return d ? new Date(d).toLocaleDateString() : '--'; })()}</p>
                            <p><span className="font-medium">Abierto 2025 por</span> {detailsItem?.data?.opened_by || 'js@gmail.com'}</p>
                            <p><span className="font-medium">Abierto</span> {detailsItem?.data?.opened_at ? new Date(detailsItem.data.opened_at).toLocaleDateString() : '26 Agosto 2025'}</p>
                        </div>

                        {/* separador */}
                        <hr className="my-3"/>

                        {/* Second Info */}
                        <div className="text-sm text-gray-700 space-y-1 text-left">
                            <p><span className="font-medium">Código sección:</span> {detailsItem?.data?.codigo_documental ?? '--'}</p>
                            <p><span className="font-medium">Series:</span> {detailsItem?.data?.series ?? '--'}</p>
                            <p><span className="font-medium">Subseries:</span> {detailsItem?.data?.subseries ?? '--'}</p>
                            <p><span className="font-medium">Tamaño:</span> {detailsItem?.type === 'folder' ? '--' : formatSize(detailsItem?.data?.size)}</p>
                        </div>
                        </div>
                    </label>
                </div>
            </div>
        </div>
    );
}
