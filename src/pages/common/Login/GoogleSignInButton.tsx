"use client";

import { GoogleLogin } from "@react-oauth/google";

export default function GoogleButton() {
    return (
        <GoogleLogin
            onSuccess={async (credentialResponse:any) => {
                const idToken = credentialResponse.credential;
                if (!idToken) return;

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/social-login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ idToken }),
                }); 
                const data = await res.json();

                if (data.success) {
                    localStorage.setItem("token", data.data.token);
                    window.location.href = "/";
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
