"use client";

import { showAlert } from "@/utils/swalFire";
import { GoogleLogin } from "@react-oauth/google";

export default function GoogleButton() {
    return (
        <GoogleLogin
            onSuccess={async (credentialResponse: any) => {
                const idToken = credentialResponse.credential;
                if (!idToken) return;

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/social-login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ idToken }),
                });

                const data = await res.json(); 
                if (data.success) {
                    const { token, user } = data.data;
                    localStorage.setItem("token", token);

                    // Role-based redirect
                    switch (user.roletbl_roleName) {
                        case "ADMIN":
                            window.location.href = "/admin";
                            break;
                        case "MANAGER":
                            window.location.href = "/manager";
                            break;
                        case "RECRUITER":
                            window.location.href = "/recruiter";
                            break;
                        default:
                            window.location.href = "/";
                    }
                } else {
                    alert(data.message);
                }

            }}
            onError={() => {
                console.log("Login Failed");
            }}
            theme="outline"
            size="large"
            width="100%"
        />
    );
}
