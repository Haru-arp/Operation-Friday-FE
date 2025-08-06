import { modifyName } from "@/api/settings";
import { useMutation } from "@tanstack/react-query";

export const useModifyName = () => {
  return useMutation({
      mutationFn: modifyName,
  });
};
