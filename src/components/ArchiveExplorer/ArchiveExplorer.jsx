import {
    ArrowDownTrayIcon,
    Bars3BottomLeftIcon,
    EllipsisVerticalIcon,
    FolderIcon,
    InformationCircleIcon,

} from "@heroicons/react/24/solid";




export default function ArchiveExplorer() {
    return (
        <div className="overflow-x-auto w-full">
            <table className="table border-separate border-spacing-y-2 w-full pb-15">
                <thead className="sticky top-0">
                <tr className="bg-gray-500 rounded-x text-white text-lg z-99">
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
                <tbody className="overflow-y-70">
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
                        <div tabIndex={0} role="button" className="border-none bg-transparent rounded-[50%] hover:bg-[#75D0D1]">
                                <ArrowDownTrayIcon className="size-7 m-1 fill-gray-700"></ArrowDownTrayIcon>
                        </div>  
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="border-none bg-transparent rounded-[50%] hover:bg-[#75D0D1]">
                                <EllipsisVerticalIcon className="size-8  fill-gray-700"></EllipsisVerticalIcon>
                            </div>
                            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box w-40 p-2 shadow-sm">
                                <li><a> <InformationCircleIcon className="size-4  fill-gray-700"></InformationCircleIcon> Detalles</a></li>
                                <li><a> <ArrowDownTrayIcon className="size-4  fill-gray-700"></ArrowDownTrayIcon> Descargar </a></li>
                            </ul>
                        </div>
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
                        <div tabIndex={0} role="button" className="border-none bg-transparent rounded-[50%] hover:bg-[#75D0D1]">
                                <ArrowDownTrayIcon className="size-7 m-1 fill-gray-700"></ArrowDownTrayIcon>
                        </div>
                        
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="border-none bg-transparent rounded-[50%] hover:bg-[#75D0D1]">
                                <EllipsisVerticalIcon className="size-8  fill-gray-700"></EllipsisVerticalIcon>
                            </div>
                            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box w-40 z-56 p-2 shadow-sm">
                                <li><a> <InformationCircleIcon className="size-4  fill-gray-700"></InformationCircleIcon> Detalles</a></li>
                                <li><a> <ArrowDownTrayIcon className="size-4  fill-gray-700"></ArrowDownTrayIcon> Descargar </a></li>
                            </ul>
                        </div>
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
                        <div tabIndex={0} role="button" className="border-none bg-transparent rounded-[50%] hover:bg-[#75D0D1]">
                                <ArrowDownTrayIcon className="size-7 m-1 fill-gray-700"></ArrowDownTrayIcon>
                        </div>
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="border-none bg-transparent rounded-[50%] hover:bg-[#75D0D1]">
                                <EllipsisVerticalIcon className="size-8  fill-gray-700"></EllipsisVerticalIcon>
                            </div>
                            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box w-40 p-2 shadow-sm">
                                <li><a> <InformationCircleIcon className="size-4  fill-gray-700"></InformationCircleIcon> Detalles</a></li>
                                <li><a> <ArrowDownTrayIcon className="size-4  fill-gray-700"></ArrowDownTrayIcon> Descargar </a></li>
                            </ul>
                        </div>
                    </td>

                </tr>
                </tbody>
            </table>
        </div>
    )
}