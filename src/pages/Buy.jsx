import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import Typography from '@mui/material/Typography'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import createAppTheme from '../theme/muiTheme'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { PRODUCTS } from '../data/services.jsx'
import Info from '../components/checkout/Info'
import InfoMobile from '../components/checkout/InfoMobile'
import DetailsForm from '../components/checkout/DetailsForm'
import PaymentForm from '../components/checkout/PaymentForm'
import Review from '../components/checkout/Review'

export default function Buy() {
  const { lang, t } = useLanguage()
  const { user } = useAuth()
  const { theme: siteTheme } = useTheme()
  const { plan: routePlan } = useParams()
  const p = (path) => `/${lang}${path}`
  const muiTheme = createAppTheme(siteTheme)

  const product = PRODUCTS.find((pr) => pr.slug === routePlan)
  const validRoute = !!product
  const plan = product ? routePlan : 'servermode'
  const planDef = PRODUCTS.find((pr) => pr.slug === plan)
  const planName = planDef?.name || ''
  const planPeriod = t.checkout.once
  const base = Number(planDef?.price) || 0
  const currency = t.checkout.currency
  const money = (n) => (t.checkout.currencyBefore ? `${currency}${n}` : `${n}${currency}`)
  const fmt = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(2))

  const steps = [t.checkout.stepDetails, t.checkout.stepPayment, t.checkout.stepReview]

  const [activeStep, setActiveStep] = useState(0)
  const [promoInput, setPromoInput] = useState('')
  const [promoStatus, setPromoStatus] = useState('idle')
  const [promoInfo, setPromoInfo] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', note: '' })
  const [payment, setPayment] = useState({ name: '', number: '', expiry: '', cvc: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const discountPct = promoInfo?.discount_percent || 0
  const discountAmount = Math.round(base * (discountPct / 100) * 100) / 100
  const total = Math.round((base - discountAmount) * 100) / 100

  const chipBg = siteTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'

  const onPromoChange = (value) => {
    setPromoInput(value)
    if (promoStatus !== 'idle') setPromoStatus('idle')
  }

  const applyPromo = async () => {
    const code = promoInput.trim().toUpperCase()
    if (!code) return
    setPromoStatus('checking')
    if (!isSupabaseConfigured()) {
      setPromoStatus('invalid')
      return
    }
    const { data, error: err } = await supabase
      .from('promo_codes')
      .select('code, discount_percent, enabled, max_uses, times_used, expires_at')
      .eq('code', code)
      .maybeSingle()
    const valid = !err && data && data.enabled
      && (data.max_uses == null || data.times_used < data.max_uses)
      && (!data.expires_at || new Date(data.expires_at) > new Date())
    if (valid) {
      setPromoInfo({ code: data.code, discount_percent: data.discount_percent })
      setPromoStatus('valid')
    } else {
      setPromoInfo(null)
      setPromoStatus('invalid')
    }
  }

  const clearPromo = () => {
    setPromoInput('')
    setPromoInfo(null)
    setPromoStatus('idle')
  }

  const nextStep = () => {
    if (activeStep === 0 && (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email.trim()))) {
      setError(t.checkout.required)
      return
    }
    setError('')
    setActiveStep((a) => a + 1)
  }

  const placeOrder = async () => {
    if (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      setError(t.checkout.required)
      setActiveStep(0)
      return
    }
    setError('')
    setSubmitting(true)
    try {
      if (isSupabaseConfigured()) {
        if (promoInfo) {
          await supabase.rpc('increment_promo_use', { code_text: promoInfo.code })
        }
        await supabase.from('purchases').insert({
          user_id: user?.id || null,
          plan,
          full_name: form.name.trim(),
          email: form.email.trim(),
          note: form.note.trim() || null,
          promo_code: promoInfo?.code || null,
          discount_percent: discountPct,
          base_price: base,
          total,
        })
      }
      setDone(true)
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <MuiThemeProvider theme={muiTheme}>
        <Box sx={{ minHeight: '100vh', pt: '120px', px: 2, pb: 8, display: 'flex', justifyContent: 'center' }}>
          <Card
            elevation={0}
            sx={{ maxWidth: 640, width: '100%', textAlign: 'center', p: { xs: 4, md: 6 }, border: '1px solid', borderColor: 'divider', borderRadius: 0 }}
          >
            <CheckCircleRoundedIcon sx={{ color: '#10B981', fontSize: 64, mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.5px', mb: 1.5 }}>
              {t.checkout.successTitle}
            </Typography>
            <Typography sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 3 }}>
              {t.checkout.successText.replace('{name}', form.name.trim()).replace('{plan}', planName).replace('{email}', form.email.trim())}
            </Typography>
            <Box
              sx={{
                p: 2,
                borderRadius: 0,
                backgroundColor: chipBg,
                border: '1px solid',
                borderColor: 'divider',
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.5,
                flexWrap: 'wrap',
              }}
            >
              <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                {planName} — {planPeriod}:
              </Typography>
              <Typography sx={{ fontSize: 18, fontWeight: 800 }}>{money(fmt(total))}</Typography>
            </Box>
            <Button component={Link} to={p('/')} variant="contained" sx={{ px: 4, py: 1.25 }}>
              {t.checkout.backHome}
            </Button>
          </Card>
        </Box>
      </MuiThemeProvider>
    )
  }

  if (!validRoute) {
    return (
      <MuiThemeProvider theme={muiTheme}>
        <Box sx={{ minHeight: '100vh', pt: '120px', px: 2, pb: 8, display: 'flex', justifyContent: 'center' }}>
          <Card
            elevation={0}
            sx={{ maxWidth: 640, width: '100%', textAlign: 'center', p: { xs: 4, md: 6 }, border: '1px solid', borderColor: 'divider', borderRadius: 0 }}
          >
            <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.5px', mb: 1.5 }}>
              {t.checkout.notFoundTitle}
            </Typography>
            <Typography sx={{ color: 'text.secondary', mb: 4 }}>{t.checkout.notFoundText}</Typography>
            <Button component={Link} to={p('/services')} variant="contained" sx={{ px: 4, py: 1.25 }}>
              {t.services.title}
            </Button>
          </Card>
        </Box>
      </MuiThemeProvider>
    )
  }

  return (
    <MuiThemeProvider theme={muiTheme}>
      <Box sx={{ minHeight: '100vh', pt: '110px', px: { xs: 2, md: 4 }, pb: 8 }}>
        <Grid container spacing={4} sx={{ maxWidth: 1200, mx: 'auto', alignItems: 'flex-start' }}>
          <Grid size={{ xs: 12, md: 5, lg: 4 }} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Card
              elevation={0}
              sx={{ p: 4, border: '1px solid', borderColor: 'divider', position: 'sticky', top: '110px' }}
            >
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
              <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                <Button component={Link} to={p('/services')} variant="text" sx={{ px: 0 }}>
                  {t.checkout.changePlan}
                </Button>
              </Box>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 7, lg: 8 }}>
            <Card
              elevation={0}
              sx={{ display: { xs: 'flex', md: 'none' }, mb: 3, p: 2, border: '1px solid', borderColor: 'divider' }}
            >
              <CardContent sx={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', py: 1, '&:last-child': { pb: 1 } }}>
                <Box>
                  <Typography variant="subtitle2">{planName}</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>{money(fmt(base))}</Typography>
                </Box>
                <InfoMobile
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
              </CardContent>
            </Card>

            <Stack spacing={2}>
              <Stepper activeStep={activeStep} sx={{ mb: 1 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Card
                elevation={0}
                sx={{ p: { xs: 2.5, sm: 4 }, border: '1px solid', borderColor: 'divider' }}
              >
                {activeStep === 0 && <DetailsForm t={t} form={form} setForm={setForm} />}
                {activeStep === 1 && <PaymentForm t={t} payment={payment} setPayment={setPayment} />}
                {activeStep === 2 && (
                  <Review
                    t={t}
                    planName={planName}
                    planPeriod={planPeriod}
                    base={base}
                    discountPct={discountPct}
                    discountAmount={discountAmount}
                    total={total}
                    money={money}
                    fmt={fmt}
                    promoInput={promoInput}
                    onPromoChange={onPromoChange}
                    promoStatus={promoStatus}
                    promoInfo={promoInfo}
                    applyPromo={applyPromo}
                    clearPromo={clearPromo}
                    details={form}
                    payment={payment}
                  />
                )}
                {error && (
                  <Typography sx={{ mt: 2, color: 'error.main', fontWeight: 600 }} variant="body2">
                    {error}
                  </Typography>
                )}
              </Card>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column-reverse', sm: 'row' },
                  alignItems: { xs: 'stretch', sm: 'center' },
                  justifyContent: 'space-between',
                  gap: 1,
                  pb: { xs: 12, sm: 0 },
                }}
              >
                {activeStep !== 0 ? (
                  <Button startIcon={<ChevronLeftRoundedIcon />} onClick={() => setActiveStep((a) => a - 1)} variant="text">
                    {t.checkout.back}
                  </Button>
                ) : (
                  <Box />
                )}
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    endIcon={<ChevronRightRoundedIcon />}
                    onClick={placeOrder}
                    disabled={submitting}
                    sx={{ width: { xs: '100%', sm: 'fit-content' } }}
                  >
                    {submitting ? '...' : t.checkout.payBtn}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    endIcon={<ChevronRightRoundedIcon />}
                    onClick={nextStep}
                    sx={{ width: { xs: '100%', sm: 'fit-content' } }}
                  >
                    {t.checkout.next}
                  </Button>
                )}
              </Box>

              <Divider />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button component={Link} to={p('/services')} variant="text">
                  {t.checkout.changePlan}
                </Button>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </MuiThemeProvider>
  )
}
