import SenderInformationCard from "@/components/SenderInformationCard/SenderInformationCard";

export default function MailReader() {
    return (
        <div className="h-full w-2/3 shadow-xl rounded-lg p-8 overflow-y-auto">
            <div id="tag-container" className="flex gap-3">
                <div className="px-4 py-0.5 bg-senaGreen rounded-md font-bold text-white">Queja</div>
                <div className="px-4 py-0.5 bg-senaGray rounded-md font-bold">Primer Contacto</div>
            </div>
            <div id="serial-data" className="flex gap-3 my-2">
                <div className="font-bold text-lg">ID: 10010025</div>
                <div className="font-bold text-lg">08/09/2025</div>
            </div>
            <div>
                <h2 className="font-bold text-xl">Queja Generalizada</h2>
                <h3>Instructor de la ficha 9121043 lleva 4 semanas sin asistir a clases</h3>
            </div>
            <SenderInformationCard></SenderInformationCard>
            <div id="email-description">
                <div className="font-bold text-lg mb-2">Descripcion</div>
                <div>Por medio de la presente, los aprendices de la ficha 9121043 queremos expresar nuestra
                    inconformidad respecto al instructor asignado, quien lleva ausentándose de las clases durante las
                    últimas cuatro semanas sin brindar justificación ni reprogramar las sesiones perdidas. Esta
                    situación ha generado un retraso significativo en el avance del programa, afectando nuestro
                    aprendizaje y preparación. Solicitamos a la coordinación del SENA tomar medidas para garantizar la
                    continuidad de la formación y evitar mayores perjuicios.
                </div>
            </div>
            <div className="my-3">
                <div className="font-bold text-lg mb-2">Soportes Adjuntos</div>
                <img className="w-40" src="/images/attached-pdf.png" alt=""/>
            </div>
            <div className="w-full flex flex-col items-right">
                <textarea className="textarea w-full rounded-lg focus:border-none focus:outline-gray-200 my-2" placeholder="Bio" />
                <button className="btn bg-senaGreen p-2 hover:bg-senaWashedGreen text-white rounded-lg self-end">Enviar respuesta</button>
            </div>
        </div>
    )
}