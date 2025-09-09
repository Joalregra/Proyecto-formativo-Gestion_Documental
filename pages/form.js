import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar/Sidebar";
import Inbox from "@/components/Inbox/Inbox";
import MailReader from "@/components/MailReader/MailReader";
import {PaperClipIcon} from "@heroicons/react/24/solid";

export default function Form() {
    return (
        <div className="bg-senaGray">
            <Navbar></Navbar>
            <div className="flex">
                <div className="flex flex-col items-center h-[calc(100vh-80px-2.5rem)] w-[calc(100vw)] bg-white m-5 rounded-lg p-5">
                    <h1 className="font-bold text-2xl text-senaDarkGreen text-center">Diligenciar PQRS</h1>
                    <form action="" className="w-full flex flex-col items-center">
                        <div className="grid grid-cols-2 w-3/5 items-center justify-center gap-5 my-3">
                            <div>
                                <label className="text-md font-light text-gray-600" htmlFor="document-type">Tipo de Documento</label>
                                <select id="document-type" defaultValue=" " className="select w-full">
                                    <option disabled={true}> </option>
                                    <option>Crimson</option>
                                    <option>Amber</option>
                                    <option>Velvet</option>
                                </select>
                            </div>
                            <div>
                                <label className={"text-md font-light text-gray-600"} htmlFor="document-number">Número de Documento</label>
                                <input id="document-number" type="text" className="input w-full" />
                            </div>
                            <div>
                                <label className={"text-md font-light text-gray-600"} htmlFor="full-name">Nombre Completo</label>
                                <input id="full-name" type="text" className="input w-full" />
                            </div>
                            <div>
                                <label className={"text-md font-light text-gray-600"} htmlFor="address">Dirección</label>
                                <input id="address" type="text" className="input w-full" />
                            </div>
                            <div>
                                <label className={"text-md font-light text-gray-600"} htmlFor="email-address">Correo Electrónico</label>
                                <input id="email-address" type="text" className="input w-full" />
                            </div>
                            <div>
                                <label className={"text-md font-light text-gray-600"} htmlFor="phone-number">Teléfono</label>
                                <input id="phone-number" type="text" className="input w-full" />
                            </div>
                            <div>
                                <label className="text-md font-light text-gray-600" htmlFor="document-type">Tipo de Documento</label>
                                <select id="document-type" defaultValue=" " className="select w-full">
                                    <option disabled={true}> </option>
                                    <option>Crimson</option>
                                    <option>Amber</option>
                                    <option>Velvet</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-md font-light text-gray-600" htmlFor="document-type">Tipo de Documento</label>
                                <select id="document-type" defaultValue=" " className="select w-full">
                                    <option disabled={true}> </option>
                                    <option>Crimson</option>
                                    <option>Amber</option>
                                    <option>Velvet</option>
                                </select>
                            </div>
                        </div>
                        <div className="w-3/5">
                            <label className={"text-md font-light text-gray-600"} htmlFor="subject">Asunto</label>
                            <input id="subject" type="text" className="input w-full" />
                        </div>
                        <div className="w-3/5 my-3">
                            <label className={"text-md font-light text-gray-600"} htmlFor="request-description">Descripción de la solicitud</label>
                            <textarea id="request-description" className="textarea w-full my-2" placeholder="Bio"></textarea>
                        </div>
                        <div className="flex w-3/5 items-center gap-2">
                            <button className="btn">Adjuntas Soportes</button>
                            <PaperClipIcon className="size-5"></PaperClipIcon>
                        </div>
                        <div className="flex w-3/5 my-3 gap-3">
                            <input type="checkbox" defaultChecked className="checkbox checkbox-success" />
                            <label htmlFor="">Autorizo el tratamiento de mis datos personales conforme a la Ley 1581 de 2012</label>
                        </div>
                        <button type="submit" className="btn bg-senaGreen text-white font-bold px-16 rounded-lg">Enviar PQRS</button>
                    </form>
                </div>
            </div>

        </div>
    );
}