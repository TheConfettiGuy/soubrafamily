import { readFile } from "node:fs/promises";
import path from "node:path";
import NavbarClient from "./navbar-client";

async function getNavbar() {
  const p = path.join(process.cwd(), "src", "data", "navbar.json");
  const raw = await readFile(p, "utf-8");
  return JSON.parse(raw);
}

export default async function Navbar() {
  const data = await getNavbar();
  return <NavbarClient data={data} />;
}
