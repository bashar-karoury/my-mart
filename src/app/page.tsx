import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.page}>
      <Link href="/signup">Signup</Link>
      <Link href="/login">Login</Link>
    </div>
  );
}
