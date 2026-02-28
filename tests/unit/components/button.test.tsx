// @vitest-environment jsdom
import { render } from '@testing-library/react'
import { Button } from '~/components/ui/button'

it('renders primary button', () => {
  const { getByRole } = render(<Button>Invest</Button>)
  expect(getByRole('button', { name: 'Invest' })).toBeDefined()
})

it('renders disabled button', () => {
  const { getByRole } = render(<Button disabled>Submit</Button>)
  expect(getByRole('button', { name: 'Submit' })).toBeDefined()
})
