import {ArrowDownIcon, FolderIcon} from "@heroicons/react/24/solid";

export default function ArchiveExplorer() {
    return (
        <div className="overflow-x-auto w-full">
            <table className="table border-separate border-spacing-y-2 w-full">
                <thead className="sticky top-0">
                <tr className="bg-gray-500 rounded-x text-white text-lg">
                    <th className="rounded-l-lg">
                        <label className="h-full">
                            <input type="checkbox" className="checkbox border-white text-white"/>
                        </label>
                    </th>
                    <th>Seccion</th>
                    <th>Título</th>
                    <th>Ultima Modificacion</th>
                    <th>Tamaño del Archivo</th>
                    <th >Tipo</th>
                    <th className="rounded-r-lg"></th>
                </tr>
                </thead>
                <tbody className="overflow-y-auto">
                <tr className="odd:bg-gray-100 hover:bg-[#A7F1FB] even:bg-gray-200 text-black">
                    <th className="rounded-l-lg">
                        <label>
                            <FolderIcon className="size-10  fill-gray-700"></FolderIcon>
                        </label>
                    </th>
                    <td>100</td>
                    <td>Gerencia General</td>
                    <td >08/09/2025</td>
                    <td>--</td>
                    <td>Carpeta</td>
                    <td  className="rounded-r-lg">
                        <ArrowDownIcon className="size-8  fill-gray-700"></ArrowDownIcon>
                    </td>

                </tr>
                <tr className="odd:bg-gray-100 hover:bg-[#A7F1FB] even:bg-gray-200 text-black">
                    <th className="rounded-l-lg">
                        <label>
                            <FolderIcon className="size-10  fill-gray-700"></FolderIcon>
                        </label>
                    </th>
                    <td>101</td>
                    <td>Oficina de control interno</td>
                    <td>08/09/2025</td>
                    <td>--</td>
                    <td>Carpeta</td>
                    <td  className="rounded-r-lg">
                        <ArrowDownIcon className="size-8  fill-gray-700"></ArrowDownIcon>
                    </td>

                </tr>
                <tr className="odd:bg-gray-100 hover:bg-[#A7F1FB] even:bg-gray-200 text-black">
                    <th className="rounded-l-lg">
                        <label>
                            <FolderIcon className="size-10  fill-gray-700"></FolderIcon>
                        </label>
                    </th>
                    <td>102</td>
                    <td>Area Juridica</td>
                    <td>08/09/2025</td>
                    <td>--</td>
                    <td>Carpeta</td>
                    <td  className="rounded-r-lg">
                        <ArrowDownIcon className="size-8  fill-gray-700"></ArrowDownIcon>
                    </td>

                </tr>
                </tbody>
            </table>
        </div>
    )
}