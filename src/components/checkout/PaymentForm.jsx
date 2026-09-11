import Grid from '@mui/material/Grid'
import FormLabel from '@mui/material/FormLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled } from '@mui/material/styles'

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}))

export default function PaymentForm({ t, payment, setPayment }) {
  return (
    <Grid container spacing={3}>
      <FormGrid size={{ xs: 12, md: 6 }}>
        <FormLabel htmlFor="card-name" required>
          {t.checkout.cardName}
        </FormLabel>
        <OutlinedInput
          id="card-name"
          value={payment.name}
          onChange={(e) => setPayment({ ...payment, name: e.target.value })}
          size="small"
          required
        />
      </FormGrid>
      <FormGrid size={{ xs: 12, md: 6 }}>
        <FormLabel htmlFor="card-number" required>
          {t.checkout.cardNumber}
        </FormLabel>
        <OutlinedInput
          id="card-number"
          value={payment.number}
          onChange={(e) => setPayment({ ...payment, number: e.target.value })}
          size="small"
          required
          inputProps={{ inputMode: 'numeric', maxLength: 19 }}
        />
      </FormGrid>
      <FormGrid size={{ xs: 6, md: 6 }}>
        <FormLabel htmlFor="exp-date" required>
          {t.checkout.expDate}
        </FormLabel>
        <OutlinedInput
          id="exp-date"
          value={payment.expiry}
          onChange={(e) => setPayment({ ...payment, expiry: e.target.value })}
          size="small"
          required
          placeholder="MM/YY"
        />
      </FormGrid>
      <FormGrid size={{ xs: 6, md: 6 }}>
        <FormLabel htmlFor="cvc" required>
          {t.checkout.cvc}
        </FormLabel>
        <OutlinedInput
          id="cvc"
          value={payment.cvc}
          onChange={(e) => setPayment({ ...payment, cvc: e.target.value })}
          size="small"
          required
          inputProps={{ inputMode: 'numeric', maxLength: 4 }}
        />
      </FormGrid>
    </Grid>
  )
}