import bcrypt from "bcryptjs";

// One-off CLI helper: `npx tsx scripts/hash-password.ts <password>`
// Prints a bcrypt hash to paste into ADMIN_PASSWORD_HASH in .env.
// The plaintext password is never stored — only the hash is kept.
async function main() {
  const password = process.argv[2];

  if (!password) {
    console.error("Usage: npx tsx scripts/hash-password.ts <password>");
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 10);

  // Next.js expands unescaped $NAME patterns in .env values, which silently
  // corrupts a bcrypt hash (it's full of literal $ characters). Escaping
  // them here means the printed value can be pasted straight into .env.
  const escapedForEnvFile = hash.replace(/\$/g, "\\$");
  console.log(escapedForEnvFile);
}

main();
