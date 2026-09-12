import { useState } from 'react'
import Grid from '@mui/material/Grid'
import FormLabel from '@mui/material/FormLabel'
import InputAdornment from '@mui/material/InputAdornment'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled } from '@mui/material/styles'

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}))

const formatNumber = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')
const formatExpiry = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 4)
  return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
}
const brandOf = (num) => {
  const n = num.replace(/\D/g, '')
  if (/^4/.test(n)) return 'VISA'
  if (/^(5[1-5]|2[2-7])/.test(n)) return 'MC'
  if (/^3[47]/.test(n)) return 'AMEX'
  return ''
}

export default function PaymentForm({ t, payment, setPayment }) {
  const [focused, setFocused] = useState('')
  const brand = brandOf(payment.number)

  return (
    <Grid container spacing={3}>
      <FormGrid size={{ xs: 12, md: 6 }}>
        <FormLabel htmlFor="card-name" required>
          {t.checkout.cardName}
        </FormLabel>
        <OutlinedInput
          id="card-name"
          autoComplete="cc-name"
          value={payment.name}
          onChange={(e) => setPayment({ ...payment, name: e.target.value })}
          onFocus={() => setFocused('name')}
          onBlur={() => setFocused('')}
          size="small"
          required
          sx={{
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'divider',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main', borderWidth: 2 },
          }}
        />
      </FormGrid>
      <FormGrid size={{ xs: 12, md: 6 }}>
        <FormLabel htmlFor="card-number" required>
          {t.checkout.cardNumber}
        </FormLabel>
        <OutlinedInput
          id="card-number"
          autoComplete="cc-number"
          inputMode="numeric"
          placeholder="4242 4242 4242 4242"
          value={payment.number}
          onChange={(e) => setPayment({ ...payment, number: formatNumber(e.target.value) })}
          onFocus={() => setFocused('number')}
          onBlur={() => setFocused('')}
          size="small"
          required
          endAdornment={
            brand ? (
              <InputAdornment position="end">
                <span
                  style={{
                    fontSize: '10px', fontWeight: 800, letterSpacing: '1px',
                    color: '#10B981', border: '1px solid rgba(16,185,129,0.35)',
                    borderRadius: '3px', padding: '2px 6px',
                  }}
                >{brand}</span>
              </InputAdornment>
            ) : null
          }
          sx={{
            '& .MuiOutlinedInput-notchedOutline': { borderColor: focused === 'number' ? 'primary.main' : 'divider' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
          }}
        />
      </FormGrid>
      <FormGrid size={{ xs: 6, md: 6 }}>
        <FormLabel htmlFor="exp-date" required>
          {t.checkout.expDate}
        </FormLabel>
        <OutlinedInput
          id="exp-date"
          autoComplete="cc-exp"
          inputMode="numeric"
          value={payment.expiry}
          onChange={(e) => setPayment({ ...payment, expiry: formatExpiry(e.target.value) })}
          onFocus={() => setFocused('exp')}
          onBlur={() => setFocused('')}
          size="small"
          required
          placeholder="MM/YY"
          sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: focused === 'exp' ? 'primary.main' : 'divider' } }}
        />
      </FormGrid>
      <FormGrid size={{ xs: 6, md: 6 }}>
        <FormLabel htmlFor="cvc" required>
          {t.checkout.cvc}
        </FormLabel>
        <OutlinedInput
          id="cvc"
          autoComplete="cc-csc"
          inputMode="numeric"
          value={payment.cvc}
          onChange={(e) => setPayment({ ...payment, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })}
          onFocus={() => setFocused('cvc')}
          onBlur={() => setFocused('')}
          size="small"
          required
          inputProps={{ inputMode: 'numeric', maxLength: 4 }}
          sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: focused === 'cvc' ? 'primary.main' : 'divider' } }}
        />
      </FormGrid>
    </Grid>
  )
}