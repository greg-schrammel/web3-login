import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'lib/session'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req
  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']).status(405).end(`Method ${method} Not Allowed`)
    return
  }
  res.send({ address: req.session.siwe?.address })
}

export default withIronSessionApiRoute(handler, sessionOptions)
