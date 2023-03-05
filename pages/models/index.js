import { getCookies } from "cookies-next";
import db from "../../mongo/interact";
import { decrypt } from "../../helpers/decrypt";
import dynamic from "next/dynamic";
import webData from "../../data.json";
import { useState } from "react";
import Link from "next/link";
import AOS from 'aos';
import "aos/dist/aos.css";

const Navbar = dynamic(() => import("../../components/Navbar"));

const Module = ({ session, avatar }) => {
    return (
        <div className="min-h-screen h-fit w-full" style={{ background: `linear-gradient(120deg, rgba(2,0,36,1) 0%, rgba(29,0,15,1) 100%)` }}>
            <div className="w-full h-fit sticky top-0 bg-purple-dark">
                <Navbar webSession={session} avatarCode={avatar} webData={webData} transparent={true} />
            </div>

            <div className="h-fit w-full">
            </div>
        </div>
    )
}

export async function getServerSideProps({ req, res }) {
    try {
        const { uuid, token, key } = getCookies({ req, res });
        if (!(uuid || token || key)) return { redirect: {destination: process.env.UNSIGNED_REDIRECT} };
    
        const query = await db.findOne({ uuid }, "PublicModelLibrary", "users");
        if (!query) return { redirect: { destination: process.env.UNSIGNED_REDIRECT }};
        const decryptedToken = decrypt(token, key);
    
        if (query?.admin === "true") return {
            redirect: {
                destination: process.env.ADMIN_REDIRECT
            }
        }
    
        if (!(query || decrypt(query.token, process.env.ENCRYPTION_KEY) === decryptedToken)) return {
            redirect: {
                destination: process.env.UNSIGNED_REDIRECT
            }
        };
    
        if (query?.waitlist) return {
            redirect: {
                destination: "/waitlist"
            }
        };
    
        return {
            props: {
                avatar: query?.avatar,
                session: true
            }
        }
    } catch (err) {
        return {
            redirect: {
                destination: process.env.UNSIGNED_REDIRECT
            }
        }
    }
}

export default Module;