import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import OutlinedInput from '@mui/material/OutlinedInput'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

export default function Review({
  t,
  planName,
  planPeriod,
  base,
  discountPct,
  discountAmount,
  total,
  money,
  fmt,
  promoInput,
  onPromoChange,
  promoStatus,
  promoInfo,
  applyPromo,
  clearPromo,
  details,
  payment,
}) {
  const maskedNumber = payment.number ? payment.number.replace(/.(?=.{4})/g, '\u2022') : null

  return (
    <Stack spacing={2}>
      <List disablePadding>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary={planName} secondary={planPeriod} />
          <Typography variant="body2">{money(fmt(base))}</Typography>
        </ListItem>
        {discountPct > 0 && (
          <ListItem sx={{ py: 1, px: 0 }}>
            <ListItemText primary={`${t.checkout.discount} (${discountPct}%)`} />
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#10B981' }}>
              -{money(fmt(discountAmount))}
            </Typography>
          </ListItem>
        )}
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary={t.checkout.total} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {money(fmt(total))}
          </Typography>
        </ListItem>
      </List>

      <Stack direction="row" spacing={1} alignItems="center" useFlexGap>
        <Box sx={{ flexGrow: 1 }}>
          <OutlinedInput
            value={promoInput}
            onChange={(e) => onPromoChange(e.target.value)}
            placeholder={t.checkout.promoPlaceholder}
            size="small"
            fullWidth
            sx={{ textTransform: 'uppercase' }}
          />
        </Box>
        {promoInfo ? (
          <Button variant="outlined" onClick={clearPromo} sx={{ whiteSpace: 'nowrap' }}>
            {t.checkout.promoRemove}
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={applyPromo}
            disabled={promoStatus === 'checking' || !promoInput.trim()}
            sx={{ whiteSpace: 'nowrap' }}
          >
            {promoStatus === 'checking' ? '...' : t.checkout.promoApply}
          </Button>
        )}
      </Stack>
      {promoStatus === 'valid' && promoInfo && (
        <Typography variant="body2" sx={{ color: '#10B981', fontWeight: 700 }}>
          {t.checkout.promoApplied} — {promoInfo.discount_percent}%
        </Typography>
      )}
      {promoStatus === 'invalid' && (
        <Typography variant="body2" sx={{ color: 'error.main', fontWeight: 600 }}>
          {t.checkout.promoInvalid}
        </Typography>
      )}

      <Divider />

      <Stack direction="column" divider={<Divider flexItem />} spacing={2} sx={{ my: 2 }}>
        <div>
          <Typography variant="subtitle2" gutterBottom>
            {t.checkout.detailsTitle}
          </Typography>
          <Typography gutterBottom>{details.name}</Typography>
          <Typography gutterBottom sx={{ color: 'text.secondary' }}>
            {details.email}
          </Typography>
          {details.note && (
            <Typography gutterBottom sx={{ color: 'text.secondary' }}>
              {details.note}
            </Typography>
          )}
        </div>
        {(payment.name || payment.number || payment.expiry) && (
          <div>
            <Typography variant="subtitle2" gutterBottom>
              {t.checkout.stepPayment}
            </Typography>
            <Grid container>
              {payment.name && <PaymentRow label={`${t.checkout.cardName}:`} detail={payment.name} />}
              {payment.number && <PaymentRow label={`${t.checkout.cardNumber}:`} detail={maskedNumber} />}
              {payment.expiry && <PaymentRow label={`${t.checkout.expDate}:`} detail={payment.expiry} />}
            </Grid>
          </div>
        )}
      </Stack>
    </Stack>
  )
}

function PaymentRow({ label, detail }) {
  return (
    <Grid size={{ xs: 12 }}>
      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          {label}
        </Typography>
        <Typography variant="body2">{detail}</Typography>
      </Stack>
    </Grid>
  )
}