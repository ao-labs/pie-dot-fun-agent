export async function listAllBaskets() {
  const response = await fetch(
    "https://api.internal-pie.fun/v1/basketTokens?filter=state=LISTED",
  );
  const data = await response.json();
  return data;
}
