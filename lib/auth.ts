const enc = new TextEncoder()

async function getKey() {
  return crypto.subtle.importKey(
    "raw",
    enc.encode(process.env.SESSION_SECRET!),
    {
      name: "HMAC",
      hash: "SHA-256",
    },
    false,
    ["sign"]
  )
}

export async function sign(value: string) {
  const key = await getKey()

  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode(value)
  )

  const hex = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")

  return `${value}.${hex}`
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false

  let result = 0

  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }

  return result === 0
}

export async function verify(token: string) {
  try {
    const parts = token.split(".")

    if (parts.length !== 2) return false

    const [value, sig] = parts

    if (!value || !sig) return false

    const expected = await sign(value)

    const expectedSig = expected.split(".")[1]

    return timingSafeEqual(expectedSig, sig)
  } catch {
    return false
  }
}