import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'

export default function Info({ t, planName, planPeriod, base, discountPct, discountAmount, total, money, fmt }) {
  return (
    <>
      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
        {t.checkout.total}
      </Typography>
      <Typography variant="h4" gutterBottom sx={{ fontSize: '34px', fontWeight: 900, letterSpacing: '-1px' }}>
        {money(fmt(total))}
      </Typography>
      <List disablePadding>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText sx={{ mr: 2 }} primary={planName} secondary={planPeriod} />
          <Typography variant="body1" sx={{ fontWeight: 700 }}>
            {money(fmt(base))}
          </Typography>
        </ListItem>
        {discountPct > 0 && (
          <ListItem sx={{ py: 1, px: 0 }}>
            <ListItemText sx={{ mr: 2 }} primary={`${t.checkout.discount} (${discountPct}%)`} />
            <Typography variant="body1" sx={{ fontWeight: 700, color: '#10B981' }}>
              -{money(fmt(discountAmount))}
            </Typography>
          </ListItem>
        )}
      </List>
    </>
  )
}