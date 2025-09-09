import {DocumentTextIcon, UserCircleIcon} from "@heroicons/react/24/solid";

export default function InboxMailCard() {
    return (
        <div className="w-full p-4 border border-senaWashedBlue bg-white rounded-lg flex items-center gap-3 mb-3">
            <div id="selector" className="h-20 w-1 rounded-xl bg-senaWashedBlue"></div>
            <div>
                <div id="mail-card-tags" className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div id="mail-card-type" className="bg-gray-200 py-1 px-2 rounded-md">Queja</div>
                        <div id="mail-card-serial">10010025</div>
                        <div id="mail-card-date">08/09/2025</div>
                    </div>
                    <div className="text-center">
                        <div>Límite</div>
                        <div>08/22/2025</div>
                    </div>
                </div>
                <div id="mail-card-content" className="w-4/5 mb-3">
                    <h3 id="mail-card-subject">Queja generalizada</h3>
                    <p id="mail-card-description">Instructor de la ficha 9121043 lleva 4 semanas sin asistir a
                        clases</p>
                </div>
                <div id="mail-card-footer" className="flex justify-between items center">
                    <div id="mail-card-sender" className="flex">
                        <UserCircleIcon className="w-5"></UserCircleIcon>
                        <div>Antonio Antoniez</div>
                    </div>
                    <DocumentTextIcon className="w-5"></DocumentTextIcon>
                </div>
            </div>
        </div>
    )
}