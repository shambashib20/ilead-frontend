import { useQuery } from "@tanstack/react-query";
import { wapmonkeyService } from "../services/Wapmonkey.service";

export function useWapmonkeyCredit(apiKey: string | undefined) {
    return useQuery({
        queryKey: ["wapmonkey-credit", apiKey],
        queryFn: () => {
            if (!apiKey) return null;
            return wapmonkeyService.getWapmonkeyApiCount(apiKey);
        },
        enabled: !!apiKey, 
    });
}
