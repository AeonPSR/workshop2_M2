import { validateContactInput } from '@/lib/contact'

describe('validateContactInput', () => {
  const valid = {
    name: 'Marie Dupont',
    email: 'marie@example.com',
    subject: 'Partenariat',
    message: 'Bonjour, je souhaite en savoir plus.',
  }

  it('accepts a complete, well-formed submission', () => {
    const result = validateContactInput(valid)
    expect(result.valid).toBe(true)
    expect(result.data).toEqual(valid)
  })

  it('trims surrounding whitespace on all fields', () => {
    const result = validateContactInput({
      name: '  Marie  ',
      email: '  marie@example.com  ',
      subject: '  Sujet  ',
      message: '  Message  ',
    })
    expect(result.data).toEqual({
      name: 'Marie',
      email: 'marie@example.com',
      subject: 'Sujet',
      message: 'Message',
    })
  })

  it.each(['name', 'email', 'subject', 'message'])(
    'rejects when %s is missing',
    (field) => {
      const result = validateContactInput({ ...valid, [field]: '' })
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Tous les champs sont requis.')
    },
  )

  it('rejects a whitespace-only field', () => {
    const result = validateContactInput({ ...valid, message: '   ' })
    expect(result.valid).toBe(false)
  })

  it.each(['not-an-email', 'missing@tld', '@no-local.com', 'spaces in@email.com'])(
    'rejects an invalid email: %s',
    (email) => {
      const result = validateContactInput({ ...valid, email })
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Adresse email invalide.')
    },
  )

  it('does not throw on null/undefined body', () => {
    expect(validateContactInput(null).valid).toBe(false)
    expect(validateContactInput(undefined).valid).toBe(false)
  })
})
