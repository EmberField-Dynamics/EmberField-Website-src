import Grid from '@mui/material/Grid'
import FormLabel from '@mui/material/FormLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled } from '@mui/material/styles'

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}))

export default function DetailsForm({ t, form, setForm }) {
  return (
    <Grid container spacing={3}>
      <FormGrid size={{ xs: 12 }}>
        <FormLabel htmlFor="name" required>
          {t.checkout.name}
        </FormLabel>
        <OutlinedInput
          id="name"
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          size="small"
          required
        />
      </FormGrid>
      <FormGrid size={{ xs: 12 }}>
        <FormLabel htmlFor="email" required>
          {t.checkout.email}
        </FormLabel>
        <OutlinedInput
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          size="small"
          required
        />
      </FormGrid>
      <FormGrid size={{ xs: 12 }}>
        <FormLabel htmlFor="note">
          {t.checkout.note}
        </FormLabel>
        <OutlinedInput
          id="note"
          multiline
          minRows={3}
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          size="small"
        />
      </FormGrid>
    </Grid>
  )
}