export default function SenderInformationCard() {
    return (
        <div className="bg-gray-100 p-5 my-3 rounded-lg">
            <h3 className="font-bold text-xl mb-5">Información del solicitante</h3>
            <div className="flex gap-5">
                <div className="avatar">
                    <div className="w-20 h-20 rounded-full">
                        <img src="/images/gato-pic.png" alt="Sender Profile Pic"/>
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-5">
                    <div>
                        <div className="text-sm">Solicitante</div>
                        <div className="font-bold">Antonio Antoniez</div>
                    </div>
                    <div>
                        <div className="text-sm">Identificación</div>
                        <div className="font-bold">C.C. 1234567890</div>
                    </div>
                    <div>
                        <div className="text-sm">Dirección</div>
                        <div className="font-bold">Enrique Segoviano #8-71</div>
                    </div>
                    <div>
                        <div className="text-sm">Correo Electrónico</div>
                        <div className="font-bold">antonio.antoniez@gmail.com</div>
                    </div>
                    <div>
                        <div className="text-sm">Teléfono de Contacto</div>
                        <div className="font-bold">320 1234567</div>
                    </div>
                    <div>
                        <div className="text-sm">Dependencia Destinataria</div>
                        <div className="font-bold">Tesorería</div>
                    </div>
                </div>
            </div>
        </div>
    )
}