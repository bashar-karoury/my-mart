import styles from "./page.module.css";
import Link from "next/link";
import SignoutButton from "@/components/signoutButton";

export default function Home() {
  return (
    <div className={styles.page}>
      <Link href="/signup">Signup</Link>
      <Link href="/login">Login</Link>
      <SignoutButton />
    </div>
  );
}
