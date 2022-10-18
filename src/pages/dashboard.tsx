import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'


export default function Dashboard(){
  return(
    <h1>Dashboard</h1>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['next-firebase.token']: token } = parseCookies(ctx)

  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

 return {
  props: {}
 }
}