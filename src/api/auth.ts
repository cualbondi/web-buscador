import axios from 'axios'
import { API_URL } from '@/config'

const api = {
  getUserFB: (FBToken: string) => axios({
    headers: {
      authorization: `Bearer facebook ${FBToken}`,
    },
    method: 'get',
    url: `${API_URL}/me/`,
  }).catch(e => {
    alert('error obteniendo user')
    console.log(e)
  }).then((r: any) =>
    r.data,
  ),
}

export default api
