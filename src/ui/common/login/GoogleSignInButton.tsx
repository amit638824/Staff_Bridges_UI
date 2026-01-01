"use client";

import { socialLoginService } from "@/services/AuthServices";
import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { login } from "@/redux/slice/authSlice";
import { useRouter } from "next/navigation";
import { setUserDetails } from "@/redux/slice/userDetailSlice";

export default function GoogleButton() {
    const dispatch = useDispatch();
    const router = useRouter();

    return (
        <GoogleLogin
            onSuccess={async (credentialResponse: any) => {
                const idToken = credentialResponse?.credential;
                if (!idToken) return;

                try {
                    const data = await socialLoginService(idToken);

                    if (data.success) {
                        const { token, user }: any = data.data;

                        // Save token
                        localStorage.setItem("token", token); 
                        // Update redux store
                        dispatch(login({ user, token }));
                        switch (user.roletbl_roleName) {
                            case "SUPER_ADMIN":
                                router.push("/super-admin");
                                break;
                            case "OPERATIONS_ADMIN":
                                router.push("/operations-admin");
                                break;
                            case "FINANCE_ADMIN":
                                router.push("/finance-admin");
                                break;
                            case "SUPPORT_ADMIN":
                                router.push("/support-admin");
                                break;
                            case "RECRUITER":
                                router.push("/recruiter");
                                break;
                            default:
                                router.push("/");
                        }
                    } else {
                        alert(data.message);
                    }
                } catch (error) {
                    console.error("Social Login Error:", error);
                }
            }}
            onError={() => console.log("Google Login Failed")}
            theme="outline"
            size="large"
            width="100%"
        />
    );
}
