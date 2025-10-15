import {
  leadsServoceModule,
  type GetRepcortsResponse,
  type GetReports,
} from "@/features/leads/services/LeadsModule.service";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

export function useGetStatusReports(
  options?: UseMutationOptions<GetRepcortsResponse, unknown, GetReports>
) {
  return useMutation<GetRepcortsResponse, unknown, GetReports>({
    mutationKey: ["lead", "statistics-by-status-agent"],
    mutationFn: async (payload) => {
      const response = await leadsServoceModule.getStatusReports(payload);
      return response.data;
    },
    ...options,
  });
}

// ok see you do one thing

// make me a mutaion hook

// using react query

// for post

// create a api
//  then use that api in the use mutation

// /lead/statistics-by-source-agent
// this is the route
// and this is the post route

// this is the params

// {
//     "sourceTitle": "Facebook"
// }

// make a api function using axios
