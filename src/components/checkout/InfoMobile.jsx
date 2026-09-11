import { useState } from 'react'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import Info from './Info'

export default function InfoMobile({ t, planName, planPeriod, base, discountPct, discountAmount, total, money, fmt }) {
  const [open, setOpen] = useState(false)
  const toggleDrawer = (newOpen) => () => setOpen(newOpen)

  return (
    <div>
      <Button
        variant="text"
        endIcon={<ExpandMoreRoundedIcon />}
        onClick={toggleDrawer(true)}
        sx={{ p: 0 }}
      >
        {t.checkout.viewDetails}
      </Button>
      <Drawer
        open={open}
        anchor="top"
        onClose={toggleDrawer(false)}
        slotProps={{
          paper: {
            sx: { backgroundImage: 'none', backgroundColor: 'background.paper', p: 3, pt: 8, mx: 'auto', maxWidth: 520 },
          },
        }}
      >
        <IconButton onClick={toggleDrawer(false)} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
        <Info
          t={t}
          planName={planName}
          planPeriod={planPeriod}
          base={base}
          discountPct={discountPct}
          discountAmount={discountAmount}
          total={total}
          money={money}
          fmt={fmt}
        />
      </Drawer>
    </div>
  )
}