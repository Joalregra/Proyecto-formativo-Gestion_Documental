export default function Navbar() {
    return (
        <nav className="navbar bg-white shadow-sm px-4 h-20">
        <div className="flex-1">
            <a href="/"><img src="/gedocs-logo.svg" alt="gedocs logo"/></a>
        </div>
        <div className="flex gap-2">
            <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost py-8 rounded-md gap-3">
                    <img className="w-14 rounded-full"
                        alt="profile pic"
                        src="/images/girl-pic.jpg"/>
                    <div className="flex flex-col justify-end text-end">
                        <div className="font-bold text-lg">Lily Martinez</div>
                        <div className="font-light text-gray-500">lily_martinez@soy.sena.edu.co</div>
                    </div>
                </div>
                <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                    <li>
                        <a className="justify-between">
                            Profile
                            <span className="badge">New</span>
                        </a>
                    </li>
                    <li><a>Settings</a></li>
                    <li><a>Logout</a></li>
                </ul>
            </div>
        </div>
    </nav>)
}