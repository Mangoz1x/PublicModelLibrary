import { decrypt } from "../../helpers/decrypt";
import { getCookies } from "cookies-next";
import db from "../../mongo/interact";
import dynamic from "next/dynamic";
import webData from "../../data.json";
import Link from "next/link";

const Navbar = dynamic(() => import("../../components/Navbar"));

const Module = ({ session, avatar, email, name, nickname }) => {
    return (
        <div className="min-h-screen h-fit w-full" style={{ background: `linear-gradient(120deg, rgba(2,0,36,1) 0%, rgba(29,0,15,1) 100%)` }}>
            <div className="w-full h-fit sticky top-0 bg-purple-dark">
                <Navbar avatarCode={avatar} webSession={session} webData={webData} transparent={true} />
            </div>

            <div className="w-full h-fit p-5">
                <div className="w-full h-fit p-5" tab="1">
                    <h2 className="text-4xl text-white font-bold">Profile</h2>

                    <div className="w-fit h-fit bg-purple-dark rounded-md mt-4 overflow-hidden">
                        <div className="p-5 w-full h-fit bg-velvet">
                            <img
                                className="h-16 w-16 rounded-full"
                                src={`data:image/svg+xml;utf8,${avatar}`}
                                alt=""
                            />
                        </div>
                        <div className="p-5 w-fit h-fit flex gap-5">
                            <div className="flex flex-col">
                                <label>Email</label>
                                <input type="text" placeholder="Email" value={email} className="input input-bordered w-full max-w-xs" disabled />
                            </div>
                            <div className="flex flex-col">
                                <label>Nickname</label>
                                <input type="text" placeholder="Nickname" value={nickname || "none"} className="input input-bordered w-full max-w-xs" disabled />
                            </div>
                            {
                                name ? (
                                    <div className="flex flex-col">
                                        <label>Name</label>
                                        <input type="text" placeholder="Email" value={email} className="input input-bordered w-full max-w-xs" disabled />
                                    </div>
                                ) : (
                                    <div className="flex flex-col">
                                        <label style={{ opacity: 0 }}>Add name</label>
                                        <button className="btn btn-primary">Add name</button>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export async function getServerSideProps({ req, res }) {
    const { uuid, token, key } = getCookies({ req, res });
    if (!(uuid || token || key)) return {
        redirect: {
            destination: process.env.UNSIGNED_REDIRECT
        }
    };

    const query = await db.findOne({ uuid }, "PublicModelLibrary", "users");
    if (!query) return { redirect: { destination: process.env.UNSIGNED_REDIRECT } };
    const decryptedToken = decrypt(token, key);

    if (!query || decrypt(query.token, process.env.ENCRYPTION_KEY) !== decryptedToken) return {
        redirect: {
            destination: process.env.UNSIGNED_REDIRECT
        }
    };

    if (query.admin === "true") return {
        redirect: {
            destination: process.env.ADMIN_REDIRECT
        }
    }

    return {
        props: {
            session: true,
            avatar: query?.avatar,
            email: query.email,
            name: query?.name || null,
            nickname: query?.nickname || null
        }
    }
}

export default Module;