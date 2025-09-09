import {
    BarsArrowUpIcon,
    DocumentTextIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    UserCircleIcon
} from "@heroicons/react/24/solid";
import InboxMailCard from "@/components/InboxMailCard/InboxMailCard";

    export default function Inbox() {
        return (
            <div className="h-full w-1/3 bg-white flex flex-col items-center p-3 rounded-lg">
                <div className="w-full">
                    <h2 className="font-bold text-2xl mb-2 text-center">Bandeja de Entrada</h2>
                    <div id="inbox-search" className="flex gap-3 w-full">
                        <div className="flex items-center bg-gray-100 border-none px-1 rounded-md w-9/10">
                            <input placeholder="Buscar" type="text"
                                   className="input bg-gray-100 focus:outline-none focus:border-none border-none shadow-none w-full focus:shadow-none"/>
                            <MagnifyingGlassIcon className="size-5 mr-2"></MagnifyingGlassIcon>
                        </div>
                        <button className="p-4 bg-gray-100 rounded-md hover:cursor-pointer"><FunnelIcon
                            className="size-5"></FunnelIcon></button>
                    </div>
                    <div id="inbox-categories" className="flex my-2 w-full justify-between">
                        <form className="flex gap-3 w-8/10 overflow-scroll no-scrollbar">
                            <input className="btn rounded-xl checked:bg-senaGreen border-none py-7" type="checkbox"
                                   name="frameworks" aria-label="Preguntas"/>
                            <input className="btn rounded-xl checked:bg-senaGreen border-none py-7" type="checkbox"
                                   name="frameworks" aria-label="Quejas"/>
                            <input className="btn rounded-xl checked:bg-senaGreen border-none py-7" type="checkbox"
                                   name="frameworks" aria-label="Reclamos"/>
                            <input className="btn rounded-xl checked:bg-senaGreen border-none py-7" type="checkbox"
                                   name="frameworks" aria-label="Sugerencias"/>
                        </form>
                        <button className="p-4 bg-gray-100 rounded-md hover:cursor-pointer"><BarsArrowUpIcon
                            className="size-5"></BarsArrowUpIcon></button>
                    </div>
                    <h3 id="inbox-date" className="text-start w-full px-2 mt-4 font-bold m-3">Agosto, 2025</h3>
                </div>
                <div id="mail-card-scrollarea" className="p-2 bg-gray-100 flex-1 overflow-y-auto rounded-md">
                    <InboxMailCard></InboxMailCard>
                    <InboxMailCard></InboxMailCard>
                    <InboxMailCard></InboxMailCard>
                    <InboxMailCard></InboxMailCard>
                    <InboxMailCard></InboxMailCard>
                </div>
            </div>
        )
    }