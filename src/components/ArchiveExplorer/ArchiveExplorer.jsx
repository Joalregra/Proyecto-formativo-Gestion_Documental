import {
    ArrowDownTrayIcon,
    Bars3BottomLeftIcon,
    EllipsisVerticalIcon,
    FolderIcon,

} from "@heroicons/react/24/solid";


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
                    <th className="flex items-center gap-5">
                        <button className=" items-center gap-1">
                            <Bars3BottomLeftIcon className="size-10 fill-white-700 cursor-pointer"></Bars3BottomLeftIcon>
                        </button>
                        Seccion
                    </th>
                    <th>Título</th>
                    <th className="flex items-center gap-5">
                        <button className=" items-center gap-1">
                            <Bars3BottomLeftIcon className="size-10 fill-white-700 cursor-pointer"></Bars3BottomLeftIcon>
                        </button>
                        Ultima Modificacion
                    </th>
                    <th>Tamaño del Archivo</th>
                    <th >Tipo</th>
                    <th className="rounded-r-lg"></th>
                </tr>
                </thead>
                <tbody className="overflow-y-auto">
                <tr className="odd:bg-gray-100 hover:bg-[#A7F1FB] even:bg-gray-200 text-black cursor-pointer">
                    <th className="rounded-l-lg">
                        <label>
                            <FolderIcon className="size-10  fill-gray-700 cursor-pointer"></FolderIcon>
                        </label>
                    </th>
                    <td>100</td>
                    <td>Gerencia General</td>
                    <td >08/09/2025</td>
                    <td>--</td>
                    <td>Carpeta</td>
                    <td  className="flex justify-center gap-15 rounded-r-lg">
                        <ArrowDownTrayIcon className="size-8  fill-gray-700 "></ArrowDownTrayIcon>
                        <EllipsisVerticalIcon className="size-8  fill-gray-700"></EllipsisVerticalIcon>
                    </td>

                </tr>
                <tr className="odd:bg-gray-100 hover:bg-[#A7F1FB] even:bg-gray-200 text-black cursor-pointer">
                    <th className="rounded-l-lg">
                        <label>
                            <FolderIcon className="size-10  fill-gray-700 cursor-pointer"></FolderIcon>
                        </label>
                    </th>
                    <td>101</td>
                    <td>Oficina de control interno</td>
                    <td>08/09/2025</td>
                    <td>--</td>
                    <td>Carpeta</td>
                    <td  className="flex justify-center gap-15 rounded-r-lg">
                        <ArrowDownTrayIcon className="size-8  fill-gray-700"></ArrowDownTrayIcon>
                        <EllipsisVerticalIcon className="size-8  fill-gray-700"></EllipsisVerticalIcon>
                    </td>

                </tr>
                <tr className="odd:bg-gray-100 hover:bg-[#A7F1FB] even:bg-gray-200 text-black cursor-pointer">
                    <th className="rounded-l-lg">
                        <label>
                            <FolderIcon className="size-10  fill-gray-700 cursor-pointer"></FolderIcon>
                        </label>
                    </th>
                    <td>102</td>
                    <td>Area Juridica</td>
                    <td>08/09/2025</td>
                    <td>--</td>
                    <td>Carpeta</td>
                    <td  className="flex justify-center gap-15 rounded-r-lg">
                        <ArrowDownTrayIcon className="size-8  fill-gray-700"></ArrowDownTrayIcon>
                        <EllipsisVerticalIcon className="size-8  fill-gray-700"></EllipsisVerticalIcon>
                    </td>

                </tr>
                </tbody>
            </table>
        </div>
    )
}