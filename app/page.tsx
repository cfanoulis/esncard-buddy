"use client";
import { verifyCard } from "@/app/actions";
import { useActionState } from "react";

export default function Home() {
  const [verificationResult, verifyCardAction, pending] = useActionState(
    verifyCard,
    { status: "idle", message: "" },
  );

  return (
    <main>
      <form action={verifyCardAction} method="POST">
        <label htmlFor="cardid">ESNcard number:</label>
        <input type="text" id="cardid" name="cardid" />
        <button disabled={pending} type="submit">
          Check &gt;
        </button>
      </form>
      {verificationResult.status !== "idle" && (
        <div>{JSON.stringify(verificationResult)}</div>
      )}
    </main>
  );
}
