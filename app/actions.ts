"use server";

import { esncard } from "esncard";

export const verifyCard = async (
  _initialState: unknown,
  formData: FormData,
) => {
  const cardId = formData.get("cardid") as string;
  const apiResponse = await esncard(cardId).catch((e) => {
    return {
      status: "fail",
      message: e instanceof Error ? e.message : "Unknown error",
    };
  });

  return apiResponse;
};
