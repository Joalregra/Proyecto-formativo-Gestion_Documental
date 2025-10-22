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

export default function ArchiveExplorer({ searchTerm, setSearchTerm }) {
    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);
    const [parentId, setParentId] = useState(null);
    const [stack, setStack] = useState([]);
    const [stackNames, setStackNames] = useState([]);

    const isGlobalSearchActive = searchTerm && searchTerm.length > 0;

    useEffect(() => {
        let folderUrl = "/api/folders";
        let fileUrl = "/api/files";

        if (isGlobalSearchActive) {
            folderUrl += `?name=${encodeURIComponent(searchTerm)}`;
            fileUrl += `?name=${encodeURIComponent(searchTerm)}`;
        } else {
            const pidQuery = parentId === null ? "" : `?parent_id=${parentId}`;
            folderUrl += pidQuery;
            const fidQuery = parentId === null ? "" : `?folder_id=${parentId}`;
            fileUrl += fidQuery;
        }

        fetch(folderUrl)
            .then(async (res) => {
                if (!res.ok) {
                    console.error("Failed to fetch folders", folderUrl, res.status, res.statusText);
                    return [];
                }
                try {
                    const data = await res.json();
                    return Array.isArray(data) ? data : [];
                } catch (e) {
                    console.error("Invalid JSON from folders", folderUrl, e);
                    return [];
                }
            })
            .then((data) => setFolders(Array.isArray(data) ? data : []))
            .catch((err) => {
                console.error("fetch folders error:", err);
                setFolders([]);
            });

        fetch(fileUrl)
            .then(async (res) => {
                if (!res.ok) {
                    console.error("Failed to fetch files", fileUrl, res.status, res.statusText);
                    return [];
                }
                try {
                    const data = await res.json();
                    return Array.isArray(data) ? data : [];
                } catch (e) {
                    console.error("Invalid JSON from files", fileUrl, e);
                    return [];
                }
            })
            .then((data) => setFiles(Array.isArray(data) ? data : []))
            .catch((err) => {
                console.error("fetch files error:", err);
                setFiles([]);
            });

    }, [parentId, searchTerm]);

    const filteredFolders = folders;
    const filteredFiles = files;

    const enterFolder = (folder) => {
        if (!folder || folder?.type !== "carpeta") return;

        // If currently in search mode, we need to clear the search first
        if (isGlobalSearchActive) {
            if (setSearchTerm) setSearchTerm("");
            setStack([]);
            setStackNames([]);
        }

        // This is the common navigation step, regardless of previous state
        // Add current folder to stack before moving to the child
        setStack((prev) => [...prev, parentId]);
        setStackNames((prev) => [...prev, folder?.name ?? String(folder?.id ?? "")]);
        setParentId(folder.id);
    };

    const goBack = () => {
        if (isGlobalSearchActive) return;

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
        if (isGlobalSearchActive) return;

        const idsPath = [...stack.slice(1), parentId];
        const targetId = idsPath[idx];
        if (targetId === undefined || targetId === parentId) return;
        setParentId(targetId ?? null);
        setStack((prev) => prev.slice(0, idx + 1));
        setStackNames((prev) => prev.slice(0, idx + 1));
    };

    const [isOpen, setIsOpen] = useState(false);
    const [detailsItem, setDetailsItem] = useState(null);

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

    const [options1, setOptions1] = useState([]);
    const [options2, setOptions2] = useState([]);
    const [options3, setOptions3] = useState([]);
    const [options4, setOptions4] = useState([]);

    const [sel1, setSel1] = useState("");
    const [sel2, setSel2] = useState("");
    const [sel3, setSel3] = useState("");
    const [sel4, setSel4] = useState("");

    const [fileName, setFileName] = useState("");
    const [fileInput, setFileInput] = useState(null);
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
        const folderIdToUse = deepestFolderId();

        if (!fileName.trim()) {
            setSubmitMsg("Por favor, ingresa el nombre del archivo.");
            return;
        }
        if (!folderIdToUse) {
            setSubmitMsg("Selecciona al menos una carpeta destino.");
            return;
        }
        if (!fileInput) {
            setSubmitMsg("Selecciona un archivo para subir.");
            return;
        }

        // --- Validation for PDF type ---
        if (fileInput.type !== 'application/pdf') {
            setSubmitMsg("Solo se permiten archivos PDF.");
            return;
        }
        // --- End Validation ---

        try {
            setSubmitting(true);
            const base64 = await fileToBase64(fileInput);
            const payload = {
                name: fileName.trim(),
                folder_id: Number(folderIdToUse),
                // Pass a specific 'tipo' override to the backend to save "PDF" instead of the full MIME type.
                tipo: "PDF",
                file: {
                    base64,
                    filename: fileInput.name,
                    mimeType: fileInput.type, // Still pass the actual mime type for safety/backend check
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

            // --- Success Actions ---
            setSubmitMsg("Archivo guardado correctamente.");
            setFileName("");
            setSel1("");
            setSel2("");
            setSel3("");
            setSel4("");
            setOptions2([]);
            setOptions3([]);
            setOptions4([]);
            setFileInput(null);

            // Close modal after success
            setTimeout(() => {
                setIsOpen(false);
                setSubmitMsg(""); // Clear message after modal closes
            }, 700);

            // --- End Success Actions ---

        } catch (err) {
            console.error("Submit error:", err);
            setSubmitMsg(err.message || "Error inesperado guardando el archivo.");
        } finally {
            setSubmitting(false);
        }
    };

    const fetchChildren = async (pid) => {
        const url = pid === null ? "/api/folders" : `/api/folders?parent_id=${pid}`;
        try {
            const res = await fetch(url);
            if (!res.ok) return [];
            const data = await res.json();
            const arr = Array.isArray(data) ? data : [];
            return arr.filter((it) => (it?.type ?? it?.tipo ?? "").toLowerCase() === "carpeta");
        } catch (e) {
            console.error("fetchChildren error", e);
            return [];
        }
    };

    useEffect(() => {
        if (!isOpen) return;
        (async () => {
            const root = await fetchChildren(null);
            setOptions1(root);
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
            <button
                onClick={() => setIsOpen(true)}
                className="bg-senaGreen cursor-pointer hover:bg-green-700 text-white font-bold py-2 px-10 rounded-lg shadow-md"
            >
                Abrir Formulario
            </button>

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

                            <div className="w-full">
                                <label className="text-md font-light text-gray-600" htmlFor="file">
                                    Archivo (Solo PDF)
                                </label>
                                <input
                                    id="file"
                                    type="file"
                                    className="input w-full py-2 mt-1"
                                    onChange={(e) => setFileInput(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                                    // --- ONLY ACCEPT PDF FILES ---
                                    accept="application/pdf"
                                    // --- END PDF ACCEPTANCE ---
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
                        if (setSearchTerm) setSearchTerm("");
                    }}
                >
                    Home
                </button>
                {!isGlobalSearchActive && stackNames.map((name, idx) => (
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
                {isGlobalSearchActive && (
                    <span className="flex items-center">
                        <ChevronRightIcon className="size-5 text-gray-400" />
                        <span className="text-xl text-senaDarkGreen font-bold px-3 py-2 rounded-md">
                            Resultados de búsqueda: "{searchTerm}"
                        </span>
                    </span>
                )}


                <div className="ml-auto flex gap-2">
                    {stack.length > 0 && !isGlobalSearchActive && (
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
                {(Array.isArray(filteredFolders) ? filteredFolders : []).map((folder) => (
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
                <tbody className="overflow-y-70">
                {(Array.isArray(filteredFiles) ? filteredFiles : []).map((file) => (
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
                </div>

                <div className="drawer-side">
                    <label
                        htmlFor="my-drawer-4"
                        aria-label="close sidebar"
                        className="drawer-overlay"
                    ></label>

                    <label htmlFor="my-drawer-4" aria-label="close sidebar" className="w-full h-full flex items-center justify-center p-4 cursor-pointer">
                        <div className="max-w-xs w-full bg-white border rounded-lg shadow-sm p-4 text-center transform origin-center" style={{ transform: 'scale(1.44)' }} onClick={(e) => e.stopPropagation()}>
                            <div className="w-full flex justify-center mb-2">
                                <div className="border rounded-md p-6">
                                    {detailsItem?.type === 'folder' ? (
                                        <FolderIcon className="w-12 h-12 text-gray-600" />
                                    ) : (
                                        <DocumentIcon className="w-12 h-12 text-gray-600" />
                                    )}
                                </div>
                            </div>

                            <h2 className="font-semibold text-gray-900 mb-3">{detailsItem?.data?.name || 'Detalles'}</h2>

                            <div className="text-sm text-gray-700 space-y-1">
                                <p><span className="font-medium">Tipo:</span> {detailsItem?.type === 'folder' ? 'Carpeta' : (detailsItem?.data?.tipo || 'Archivo')}</p>
                                <p><span className="font-medium">Última Modificación:</span> {(() => { const d = detailsItem?.data?.updated_at || detailsItem?.data?.created_at; return d ? new Date(d).toLocaleDateString() : '--'; })()}</p>
                                <p><span className="font-medium">Abierto 2025 por</span> {detailsItem?.data?.opened_by || 'js@gmail.com'}</p>
                                <p><span className="font-medium">Abierto</span> {detailsItem?.data?.opened_at ? new Date(detailsItem.data.opened_at).toLocaleDateString() : '26 Agosto 2025'}</p>
                            </div>

                            <hr className="my-3"/>

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
