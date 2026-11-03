import { authClient } from "@/lib/auth-client";

export const getTokenFromClient = async () => {
    const { data } = await authClient.token();
    return data?.token;
};
