import { Container } from '@chakra-ui/react'
import React from 'react'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout = ({ children }: LayoutProps): JSX.Element => {
  return (
    <>
      <main>
        <Container maxWidth="container.xl">{children}</Container>
      </main>
    </>
  )
}
