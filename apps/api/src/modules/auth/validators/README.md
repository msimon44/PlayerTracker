# Password Validators

## Common Passwords List

### Source

- **List:** Top 1,000 most common passwords
- **Source:** [SecLists](https://github.com/danielmiessler/SecLists) - 10k-most-common.txt
- **Last Updated:** 2025-01-07
- **File:** `common-passwords.json`

### Update Frequency

**Recommended:** Once per year

The list of common passwords evolves slowly, based on:

- Historical password breaches
- Security research databases
- Major data leaks

### How to Update

```bash
# Navigate to validators directory
cd apps/api/src/modules/auth/validators

# Download latest top 1000 passwords
curl -s "https://raw.githubusercontent.com/danielmiessler/SecLists/master/Passwords/Common-Credentials/10k-most-common.txt" \
  | head -1000 \
  | jq -R -s 'split("\n") | map(select(length > 0))' \
  > common-passwords.json

# Verify count
cat common-passwords.json | jq '. | length'
# Should output: 1000

# Test compilation
pnpm --filter @playertracker/api build
```

### When to Update

✅ **Update when:**

- Annual security review
- Major password breach announced (e.g., RockYou2024)
- Security audit recommendation

❌ **Don't update for:**

- Minor leaks
- Every month (overkill)

### Alternative Sources

If SecLists is unavailable, use:

- [NCSC Password List](https://www.ncsc.gov.uk/blog-post/passwords-passwords-everywhere)
- [Have I Been Pwned](https://haveibeenpwned.com/Passwords)
- [CrackStation Wordlist](https://crackstation.net/crackstation-wordlist-password-cracking-dictionary.htm)

### Implementation

The validator checks passwords against this list in `password-strength.validator.ts`:

```typescript
if (COMMON_PASSWORDS.includes(password.toLowerCase())) return false;
```

- **Performance:** O(1) lookup (array includes)
- **Memory:** ~15KB for 1000 passwords
- **Case-insensitive:** Passwords converted to lowercase before check

### Maintenance Checklist

- [ ] Update list annually (January recommended)
- [ ] Update "Last updated" comment in `password-strength.validator.ts`
- [ ] Run tests: `pnpm --filter @playertracker/api test`
- [ ] Verify compilation: `pnpm --filter @playertracker/api build`
- [ ] Document update in CHANGELOG

---

**Note:** This approach balances security (1000 passwords) with performance (fast lookup, small file size).
