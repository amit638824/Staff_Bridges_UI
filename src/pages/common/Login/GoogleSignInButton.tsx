"use client"; 
import { socialLoginService } from "@/services/AuthServices";
import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { login } from "@/redux/slice/authSlice";

export default function GoogleButton() {
    const dispatch = useDispatch(); 
    return (
        <GoogleLogin
            onSuccess={async (credentialResponse: any) => {
                const idToken = credentialResponse.credential;
                if (!idToken) return; 
                try {
                    const data = await socialLoginService(idToken);

                    if (data.success) { 
                        const { token, user } = data.data; 
                        localStorage.setItem("token", token); 
                        dispatch(login({ user, token })); 
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
                } catch (err) {
                    console.log("Social Login Error:", err);
                }
            }}
            onError={() => console.log("Login Failed")}
            theme="outline"
            size="large"
            width="100%"
        />
    );
}
