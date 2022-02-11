import { Container } from '@chakra-ui/react'
import React from 'react'
import { Head, MetaProps } from './Meta'

interface LayoutProps {
  children: React.ReactNode
  customMeta?: MetaProps
}

export const Layout = ({ children, customMeta }: LayoutProps): JSX.Element => {
  return (
    <>
      <main>
        <Container maxWidth="container.xl">{children}</Container>
      </main>
    </>
  )
}
