import { useQuery } from "@tanstack/react-query";
import { wapmonkeyService } from "../services/Wapmonkey.service";

export function useWapmonkeyDevices(apiKey: string | undefined) {
  return useQuery({
    queryKey: ["wapmonkey-devices", apiKey],
    queryFn: () => wapmonkeyService.getWpamonkeyDevices(apiKey!),
    enabled: !!apiKey,
    staleTime: 60 * 1000,
  });
}
