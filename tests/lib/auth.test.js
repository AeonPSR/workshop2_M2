import { validateLoginInput, validateSignupInput } from "@/lib/auth";

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

describe("validateSignupInput", () => {
  const valid = {
    name: "Marie Dupont",
    email: "marie@example.com",
    password: "S3cret!",
  };

  it("accepts a complete, well-formed submission", () => {
    const result = validateSignupInput(valid);
    expect(result.valid).toBe(true);
    expect(result.data).toEqual(valid);
  });

  it("trims name and email but not the password", () => {
    const result = validateSignupInput({
      name: "  Marie  ",
      email: "  marie@example.com  ",
      password: "  S3cret!  ",
    });
    expect(result.data.name).toBe("Marie");
    expect(result.data.email).toBe("marie@example.com");
    expect(result.data.password).toBe("  S3cret!  ");
  });

  it.each(["name", "email", "password"])(
    "rejects when %s is missing",
    (field) => {
      const result = validateSignupInput({ ...valid, [field]: "" });
      expect(result.valid).toBe(false);
      expect(result.error).toBe("Tous les champs sont requis.");
    },
  );

  it("rejects an invalid email", () => {
    const result = validateSignupInput({ ...valid, email: "not-an-email" });
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Adresse email invalide.");
  });

  it("rejects a password shorter than 6 characters", () => {
    const result = validateSignupInput({ ...valid, password: "12345" });
    expect(result.valid).toBe(false);
    expect(result.error).toBe(
      "Le mot de passe doit contenir au moins 6 caractères.",
    );
  });

  it("accepts a password of exactly 6 characters", () => {
    expect(validateSignupInput({ ...valid, password: "123456" }).valid).toBe(
      true,
    );
  });

  it("does not throw on null/undefined body", () => {
    expect(validateSignupInput(null).valid).toBe(false);
    expect(validateSignupInput(undefined).valid).toBe(false);
  });
});
