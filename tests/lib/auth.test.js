import { validateLoginInput } from "@/lib/auth";

describe("validateLoginInput", () => {
  const valid = { email: "marie@example.com", password: "S3cret!" };

  it("accepts a complete, well-formed submission", () => {
    const result = validateLoginInput(valid);
    expect(result.valid).toBe(true);
    expect(result.data).toEqual(valid);
  });

  it("trims surrounding whitespace on the email", () => {
    const result = validateLoginInput({
      email: "  marie@example.com  ",
      password: "S3cret!",
    });
    expect(result.data.email).toBe("marie@example.com");
  });

  it.each(["email", "password"])("rejects when %s is missing", (field) => {
    const result = validateLoginInput({ ...valid, [field]: "" });
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Tous les champs sont requis.");
  });

  it.each([
    "not-an-email",
    "missing@tld",
    "@no-local.com",
    "spaces in@email.com",
  ])("rejects an invalid email: %s", (email) => {
    const result = validateLoginInput({ ...valid, email });
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Adresse email invalide.");
  });

  it("does not throw on null/undefined body", () => {
    expect(validateLoginInput(null).valid).toBe(false);
    expect(validateLoginInput(undefined).valid).toBe(false);
  });
});
