import React from "react";
import { cookies } from "next/headers";
import { getUserFromSession } from "@/utils/sessions";

const TestingPage: React.FC = async () => {
  const user = await getUserFromSession();
  // const session_id = cookieStore.get("session_id")?.value;
  console.log("user from session", user);
  return (
    <div>
      <h1>Hello</h1>
    </div>
  );
};

export default TestingPage;
