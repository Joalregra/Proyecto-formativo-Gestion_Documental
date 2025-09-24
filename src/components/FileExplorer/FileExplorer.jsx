import {
    ArrowDownTrayIcon,
    Bars3BottomLeftIcon,
    EllipsisVerticalIcon,
    InformationCircleIcon,

} from "@heroicons/react/24/solid";




export default function FileExplorer() {
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
                        Id
                    </th>
                    <th>Nombre</th>
                    <th className="flex items-center gap-5">
                        <button className=" items-center gap-1">
                            <Bars3BottomLeftIcon className="size-10 fill-white-700 cursor-pointer"></Bars3BottomLeftIcon>
                        </button>
                        Fecha de Carga
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
                            <input type="checkbox" className="checkbox"/>
                        </label>
                    </th>
                    <td>100156</td>
                    <td>Acta 55/68 32:56.pdf</td>
                    <td>08/09/2025</td>
                    <td>36KB</td>
                    <td>Archivo</td>
                    <td  className="flex justify-center gap-15 rounded-r-lg">
                        <div tabIndex={0} role="button" className="border-none bg-transparent rounded-[50%] hover:bg-[#75D0D1]">
                            <ArrowDownTrayIcon className="size-7 m-1 fill-gray-700"></ArrowDownTrayIcon>
                        </div>
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="border-none bg-transparent rounded-[50%] hover:bg-[#75D0D1]">
                                <EllipsisVerticalIcon className="size-8  fill-gray-700"></EllipsisVerticalIcon>
                            </div>
                            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box w-40 p-2 shadow-sm">
                                <li> <label htmlFor="my-drawer-4" className="flex items-center gap-2 cursor-pointer">
                                    <InformationCircleIcon className="size-4  fill-gray-700"></InformationCircleIcon> Detalles </label></li>
                                <li><a> <ArrowDownTrayIcon className="size-4  fill-gray-700"></ArrowDownTrayIcon> Descargar </a></li>
                            </ul>
                        </div>
                    </td>

                </tr>
                </tbody>
            </table>
            <div className="drawer drawer-end">
                <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    {/* Page content here */}
                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu bg-base-200 text-base-content absolute top-25 h-200 w-110 p-4 rounded-md overflow-y-scroll">
                        {/* Sidebar content here */}
                        <div className="">

                        </div>
                    </ul>
                </div>
            </div>
        </div>
    )
}